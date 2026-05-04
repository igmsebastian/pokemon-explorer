import { expect, test } from "@playwright/test"
import { mockPokeApi } from "./pokeapi-fixtures"

test.describe("desktop battle party popover", () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test.beforeEach(async ({ page }) => {
    await mockPokeApi(page)
    await page.addInitScript(() => window.localStorage.clear())
  })

  test("opens from header, manages releases, reset, and Team Lab navigation", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(page.getByTestId("team-count-trigger")).toBeVisible()
    await expect(page.getByTestId("team-count-trigger")).toContainText("0 / 6")
    await page.getByTestId("team-count-trigger").click()
    await expect(page.getByTestId("team-party-popover")).toBeVisible()
    await expect(page.getByText("My Battle Party")).toBeVisible()
    await expect(page.getByTestId("team-party-empty")).toContainText(
      "No Pokemon in your party yet.",
    )

    await page.keyboard.press("Escape")
    await page.getByRole("button", { name: "Add" }).first().click()
    await expect(page.getByTestId("team-count-trigger")).toContainText("1 / 6")

    await page.getByTestId("team-count-trigger").click()
    await expect(page.getByTestId("team-party-item")).toHaveCount(1)
    await expect(page.getByTestId("team-party-popover")).toContainText(
      "Bulbasaur",
    )

    await page.getByTestId("quick-release-button").click()
    await expect(page.getByTestId("release-confirm-dialog")).toBeVisible()
    await page.getByRole("button", { name: "Keep" }).click()
    await expect(page.getByTestId("team-party-item")).toHaveCount(1)

    await page.getByTestId("quick-release-button").click()
    await expect(page.getByTestId("release-confirm-dialog")).toBeVisible()
    await page.getByTestId("release-confirm-action").click()
    await expect(page.getByTestId("team-count-trigger")).toContainText("0 / 6")
    await expect(page.getByTestId("team-party-empty")).toBeVisible()

    await page.keyboard.press("Escape")
    await page.getByRole("button", { name: "Add" }).first().click()
    await page.getByRole("button", { name: "Add" }).nth(1).click()
    await expect(page.getByTestId("team-count-trigger")).toContainText("2 / 6")

    await page.getByTestId("team-count-trigger").click()
    await page.getByTestId("reset-party-button").click()
    await expect(page.getByTestId("reset-party-confirm-dialog")).toBeVisible()
    await page.getByTestId("reset-party-confirm-action").click()
    await expect(page.getByTestId("team-count-trigger")).toContainText("0 / 6")

    await page.getByRole("button", { name: "Add" }).first().click()
    await page.getByTestId("team-count-trigger").click()
    await page.getByRole("link", { name: "Open Team Lab" }).click()
    await expect(page).toHaveURL(/\/team-lab/)
    await expect(page.getByTestId("team-lab-page")).toBeVisible()
  })
})
