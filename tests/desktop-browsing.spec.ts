import { expect, test } from "@playwright/test"
import { mockPokeApi } from "./pokeapi-fixtures"

test.describe("desktop browsing UX", () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test.beforeEach(async ({ page }) => {
    await mockPokeApi(page)
    await page.addInitScript(() => window.localStorage.clear())
  })

  test("sticky filters and scroll-to-top support long browsing", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(page.getByTestId("pokemon-search-filter-bar")).toBeVisible()
    await expect(page.getByTestId("pokemon-search-input")).toBeVisible()
    await expect(page.getByTestId("pokemon-type-filter")).toBeVisible()
    await expect(page.getByTestId("scroll-to-top-button")).toBeHidden()
    await expect(page.getByTestId("pokemon-card")).toHaveCount(20)

    await page.getByTestId("load-more-pokemon").scrollIntoViewIfNeeded()
    await expect(page.getByTestId("pokemon-search-filter-bar")).toBeVisible()
    await expect(page.getByTestId("scroll-to-top-button")).toBeVisible()

    const headerBox = await page.getByTestId("app-header").boundingBox()
    const filterBarBox = await page
      .getByTestId("pokemon-search-filter-bar")
      .boundingBox()

    if (!headerBox || !filterBarBox) {
      throw new Error("Header and search/filter bar should be visible")
    }

    expect(filterBarBox.y).toBeGreaterThanOrEqual(headerBox.height - 1)

    await page.getByTestId("load-more-pokemon").click()
    await expect(page.getByTestId("pokemon-card")).toHaveCount(30)
    await expect(page.getByTestId("pokemon-search-filter-bar")).toBeVisible()

    await page.getByTestId("scroll-to-top-button").click()
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeLessThan(80)
    await expect(page.getByTestId("scroll-to-top-button")).toBeHidden()
  })
})

test.describe("mobile browsing UX", () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test.beforeEach(async ({ page }) => {
    await mockPokeApi(page)
    await page.addInitScript(() => window.localStorage.clear())
  })

  test("mobile keeps bottom nav primary and hides desktop scroll control", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(page.getByTestId("mobile-bottom-nav")).toBeVisible()
    await page.evaluate(() => window.scrollTo(0, 900))
    await expect(page.getByTestId("mobile-search-filter-bar")).toBeVisible()
    await expect(page.getByTestId("scroll-to-top-button")).toBeHidden()
  })
})
