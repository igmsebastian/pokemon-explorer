import { expect, test } from "@playwright/test"
import { mockPokeApi } from "./pokeapi-fixtures"

test.describe("mobile responsive UX", () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test.beforeEach(async ({ page }) => {
    await mockPokeApi(page)
    await page.addInitScript(() => window.localStorage.clear())
  })

  test("mobile homepage supports navigation, filters, and card taps", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(page.getByTestId("app-header")).toBeVisible()
    await expect(page.getByTestId("mobile-header")).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Open navigation menu" }),
    ).toHaveCount(0)
    await expect(page.getByTestId("pokemon-search-input")).toBeVisible()
    await expect(page.getByTestId("mobile-filter-button")).toBeVisible()
    await expect(page.getByTestId("mobile-search-filter-bar")).toBeVisible()
    await expect(page.getByTestId("pokemon-card").first()).toBeVisible()

    const searchBox = await page.getByTestId("pokemon-search-input").boundingBox()
    const filterButtonBox = await page
      .getByTestId("mobile-filter-button")
      .boundingBox()
    if (!searchBox || !filterButtonBox) {
      throw new Error("Mobile search and filter controls should be visible")
    }
    expect(filterButtonBox.width).toBeLessThanOrEqual(56)
    expect(filterButtonBox.height).toBeLessThanOrEqual(56)
    expect(Math.abs(searchBox.y - filterButtonBox.y)).toBeLessThan(12)

    const filterBackground = await page
      .getByTestId("mobile-filter-button")
      .evaluate((element) => getComputedStyle(element).backgroundColor)
    expect(filterBackground).not.toContain("255, 203, 5")

    await page.evaluate(() => window.scrollTo(0, 900))
    const headerBox = await page.getByTestId("app-header").boundingBox()
    if (!headerBox) {
      throw new Error("Mobile header should remain sticky while scrolling")
    }
    expect(headerBox.y).toBeLessThanOrEqual(1)
    await expect(page.getByTestId("mobile-header")).toBeVisible()
    await expect(page.getByTestId("mobile-search-filter-bar")).toBeVisible()
    await expect(page.getByTestId("mobile-bottom-nav")).toBeVisible()

    await page.getByTestId("mobile-filter-button").click()
    await expect(page.getByRole("heading", { name: "Pokemon Filters" })).toBeVisible()
    await expect(page.getByTestId("mobile-filter-sheet")).toBeVisible()
    await expect(page.getByTestId("pokemon-type-filter").last()).toBeVisible()
    await expect(page.getByTestId("pokemon-filter-reset")).toBeVisible()
    await page.getByRole("button", { name: "Close filters" }).click()
    await expect(page.getByRole("heading", { name: "Pokemon Filters" })).toBeHidden()

    await page.evaluate(() => window.scrollTo(0, 0))
    await page.getByRole("link", { name: /Open Bulbasaur detail page/i }).click()
    await expect(page).toHaveURL(/\/pokemon\/bulbasaur/)
    await expect(page.getByTestId("pokemon-detail-title")).toBeVisible()
    await expect(page.getByRole("button", { name: "Base Stats" })).toBeVisible()
  })

  test("mobile Team Lab is usable and exposes team count", async ({ page }) => {
    await page.goto("/team-lab")

    await expect(page.getByTestId("team-lab-page")).toBeVisible()
    await expect(page.getByTestId("team-mobile-summary")).toBeVisible()
    await expect(page.getByTestId("team-lab-scanner-grid")).toBeHidden()
    await expect(page.getByTestId("pokemon-search-input")).toHaveCount(0)
    await expect(page.getByTestId("mobile-filter-button")).toHaveCount(0)
    await expect(page.getByTestId("squad-readiness-score")).toBeVisible()
    await expect(page.getByTestId("battle-party")).toBeVisible()
    await expect(page.getByTestId("type-effectiveness")).toBeVisible()
    await expect(page.getByTestId("explore-pokemon-cta")).toBeVisible()
    await expect(page.getByTestId("mobile-bottom-nav")).toBeVisible()
    await expect(page.getByTestId("mobile-nav-team")).toHaveAttribute(
      "aria-current",
      "page",
    )
  })

  test("mobile Load more keeps filters and bottom nav accessible", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(page.getByTestId("pokemon-card")).toHaveCount(20)
    await page.getByTestId("load-more-pokemon").scrollIntoViewIfNeeded()
    await expect(page.getByTestId("mobile-search-filter-bar")).toBeVisible()
    await expect(page.getByTestId("mobile-filter-button")).toBeVisible()
    await expect(page.getByTestId("mobile-bottom-nav")).toBeVisible()

    await page.getByTestId("load-more-pokemon").click()
    await expect(page.getByTestId("pokemon-card")).toHaveCount(30)
    await page.getByRole("button", { name: "Add" }).first().click()
    await expect(page.getByText("In Party x1").first()).toBeVisible()
    await expect(page.getByRole("button", { name: "Add" }).first()).toBeEnabled()
    await expect(page.getByTestId("mobile-filter-button")).toBeVisible()
    await expect(page.getByTestId("mobile-bottom-nav")).toBeVisible()

    await page.getByTestId("mobile-filter-button").click()
    await expect(page.getByRole("heading", { name: "Pokemon Filters" })).toBeVisible()
  })
})

test.describe("tablet responsive UX", () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test.beforeEach(async ({ page }) => {
    await mockPokeApi(page)
    await page.addInitScript(() => window.localStorage.clear())
  })

  test("tablet homepage keeps the scanner readable", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByTestId("pokemon-search-input")).toBeVisible()
    await expect(page.getByTestId("pokemon-type-filter")).toBeVisible()
    await expect(page.getByTestId("mobile-filter-button")).toBeHidden()
    await expect(page.getByTestId("mobile-bottom-nav")).toBeHidden()
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible()
    await expect(page.getByTestId("pokemon-card").first()).toBeVisible()
    await expect(page.getByRole("heading", { name: "Bulbasaur" })).toBeVisible()
  })

  test("tablet Team Lab keeps the scanner available", async ({ page }) => {
    await page.goto("/team-lab")

    await expect(page.getByTestId("team-lab-scanner-grid")).toBeVisible()
    await expect(page.getByTestId("pokemon-search-input")).toBeVisible()
    await expect(page.getByTestId("pokemon-type-filter")).toBeVisible()
    await expect(page.getByTestId("pokemon-card").first()).toBeVisible()
  })
})
