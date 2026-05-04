import { expect, test } from "@playwright/test"
import { mockPokeApi } from "./pokeapi-fixtures"

test.describe("theme switcher", () => {
  test.beforeEach(async ({ page }) => {
    await mockPokeApi(page)
  })

  test("desktop switches between dark, light, and system themes", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(page.getByTestId("theme-switcher")).toBeVisible()
    await expect(page.locator("html")).toHaveClass(/dark/)
    await expect(page.getByTestId("app-header")).toBeVisible()
    await expect(page.getByTestId("pokemon-card").first()).toBeVisible()

    await page.getByTestId("theme-switcher").click()
    await page.getByTestId("theme-option-light").click()
    await expect(page.locator("html")).not.toHaveClass(/dark/)
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
    await expect(page.getByTestId("app-header")).toBeVisible()
    await expect(page.getByTestId("pokemon-card").first()).toBeVisible()
    await expect(page.getByRole("heading", { name: "Bulbasaur" })).toBeVisible()
    await expect(page.getByTestId("pokemon-search-input")).toBeVisible()
    await expect(page.getByTestId("add-to-team-button").first()).toBeVisible()

    const pokemonNameColor = await page
      .getByRole("heading", { name: "Bulbasaur" })
      .evaluate((element) => getComputedStyle(element).color)
    expect(pokemonNameColor).not.toBe("rgb(255, 255, 255)")

    const addButtonBackground = await page
      .getByTestId("add-to-team-button")
      .first()
      .evaluate((element) => getComputedStyle(element).backgroundColor)
    expect(addButtonBackground).not.toBe("rgb(255, 203, 5)")

    await page.getByRole("link", { name: /Open Bulbasaur detail page/i }).click()
    await expect(page.getByTestId("pokemon-detail-title")).toBeVisible()

    await page.goto("/team-lab")
    await expect(page.getByTestId("team-lab-page")).toBeVisible()
    await expect(
      page.getByRole("heading", { name: /Build a six-slot squad/i }),
    ).toBeVisible()

    await page.reload()
    await expect(page.locator("html")).not.toHaveClass(/dark/)
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light")

    await page.getByTestId("theme-switcher").click()
    await page.getByTestId("theme-option-dark").click()
    await expect(page.locator("html")).toHaveClass(/dark/)
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")

    await page.getByTestId("theme-switcher").click()
    await page.getByTestId("theme-option-system").click()
    await expect(page.locator("html")).toHaveAttribute("data-theme", "system")

    await page.reload()
    await expect(page.locator("html")).toHaveAttribute("data-theme", "system")
  })
})

test.describe("mobile theme switcher", () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test.beforeEach(async ({ page }) => {
    await mockPokeApi(page)
  })

  test("mobile header and bottom navigation survive theme changes", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(page.getByTestId("theme-switcher")).toBeVisible()
    await expect(page.getByTestId("mobile-header")).toBeVisible()
    await expect(page.getByTestId("mobile-bottom-nav")).toBeVisible()

    await page.getByTestId("theme-switcher").click()
    await page.getByTestId("theme-option-light").click()

    await expect(page.locator("html")).not.toHaveClass(/dark/)
    await expect(page.getByTestId("mobile-header")).toBeVisible()
    await expect(page.getByTestId("pokemon-card").first()).toBeVisible()
    await expect(page.getByTestId("mobile-bottom-nav")).toBeVisible()
  })
})
