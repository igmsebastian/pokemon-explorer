import { expect, test } from "@playwright/test"
import { mockPokeApi } from "./pokeapi-fixtures"

test.describe("mobile bottom navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test.beforeEach(async ({ page }) => {
    await mockPokeApi(page)
    await page.addInitScript(() => window.localStorage.clear())
  })

  test("shows Explore, Mystery Pokemon, and My Team on first visit", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(page.getByTestId("mobile-bottom-nav")).toBeVisible()
    await expect(page.getByTestId("mobile-nav-explore")).toBeVisible()
    await expect(page.getByTestId("mobile-nav-mystery-pokemon")).toBeVisible()
    await expect(page.getByTestId("mobile-nav-team")).toBeVisible()
    await expect(page.getByTestId("mystery-pokemon-icon")).toHaveAttribute(
      "src",
      "/mystery.png",
    )
    await expect(
      page.getByTestId("mobile-nav-team").getByTestId("pokeball-icon"),
    ).toBeVisible()
    await expect(page.getByText("Mystery")).toBeVisible()
  })

  test("Mystery Pokemon opens a random Kanto detail page", async ({ page }) => {
    await page.addInitScript(() => {
      Math.random = () => 3 / 151
    })
    await page.goto("/")

    await page.getByTestId("mobile-nav-mystery-pokemon").click()

    await expect(page).toHaveURL(/\/pokemon\/4/)
    await expect(page.getByTestId("pokemon-detail-title")).toBeVisible()
  })

  test("active Pokemon appears after opening a detail page", async ({ page }) => {
    await page.goto("/")

    await page.getByRole("link", { name: /Open Charmander detail page/i }).click()
    await expect(page.getByTestId("pokemon-detail-title")).toHaveText("Charmander")
    await expect(page.getByTestId("mobile-nav-active-pokemon")).toContainText(
      "Charmander",
    )

    await page.getByTestId("mobile-nav-team").click()
    await expect(page).toHaveURL(/\/team-lab/)

    await page.getByTestId("mobile-nav-active-pokemon").click()
    await expect(page).toHaveURL(/\/pokemon\/charmander/)
  })

  test("My Team navigates and shows team count badge", async ({ page }) => {
    await page.goto("/")

    await page.getByRole("button", { name: "Add" }).first().click()
    await expect(page.getByTestId("mobile-nav-team-count")).toHaveText("1/6")

    await page.getByTestId("mobile-nav-team").click()
    await expect(page).toHaveURL(/\/team-lab/)
    await expect(page.getByTestId("team-lab-page")).toBeVisible()
    await expect(page.getByTestId("mobile-bottom-nav")).toBeVisible()
  })
})

test.describe("desktop bottom navigation", () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test.beforeEach(async ({ page }) => {
    await mockPokeApi(page)
    await page.addInitScript(() => window.localStorage.clear())
  })

  test("does not show the mobile bottom nav on desktop", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByTestId("mobile-bottom-nav")).toBeHidden()
    await expect(page.getByTestId("mobile-filter-button")).toBeHidden()
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible()
  })
})
