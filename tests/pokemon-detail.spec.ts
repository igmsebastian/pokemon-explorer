import { expect, test } from "@playwright/test"
import { mockPokeApi } from "./pokeapi-fixtures"

test.beforeEach(async ({ page }) => {
  await mockPokeApi(page)
  await page.addInitScript(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })
})

test("desktop Pokemon detail shows a polished profile", async ({ page }) => {
  await page.goto("/pokemon/venusaur")

  await expect(page.getByTestId("pokemon-detail-page")).toBeVisible()
  await expect(page.getByTestId("pokemon-detail-title")).toHaveText("Venusaur")
  await expect(page.getByText("#0003")).toBeVisible()
  await expect(page.getByText("Grass")).toBeVisible()
  await expect(page.getByText("Poison")).toBeVisible()
  await expect(page.getByTestId("pokemon-metrics")).toBeVisible()
  await expect(page.getByTestId("pokemon-metric-height")).toBeVisible()
  await expect(page.getByTestId("pokemon-metric-weight")).toBeVisible()
  await expect(page.getByTestId("pokemon-metric-base-xp")).toBeVisible()
  await expect(page.getByTestId("pokemon-stats-section")).toBeVisible()
  await expect(page.getByTestId("pokemon-abilities-section")).toBeVisible()
  await expect(page.getByTestId("pokemon-moves-section")).toBeVisible()
  await expect(page.getByTestId("pokemon-moves-section")).toContainText(
    "Tackle",
  )
  await expect(page.getByTestId("pokemon-evolution-section")).toBeVisible()
  await expect(page.getByTestId("pokemon-evolution-current")).toContainText(
    "Venusaur",
  )
  await expect(page.getByTestId("pokemon-evolution-current")).not.toContainText(
    "Current",
  )
  const currentEvolutionStyle = await page
    .getByTestId("pokemon-evolution-current")
    .evaluate((element) => {
      const styles = getComputedStyle(element)

      return {
        alignItems: styles.alignItems,
        backgroundColor: styles.backgroundColor,
        justifyContent: styles.justifyContent,
        textAlign: styles.textAlign,
      }
    })
  expect(currentEvolutionStyle.alignItems).toBe("center")
  expect(currentEvolutionStyle.justifyContent).toBe("center")
  expect(currentEvolutionStyle.textAlign).toBe("center")
  expect(currentEvolutionStyle.backgroundColor).not.toBe("rgba(0, 0, 0, 0)")
})

test("Back to Explorer preserves loaded list and scroll position", async ({
  page,
}) => {
  await page.goto("/")

  await expect(page.getByTestId("pokemon-card")).toHaveCount(20)
  await page.getByTestId("load-more-pokemon").scrollIntoViewIfNeeded()
  await page.getByTestId("load-more-pokemon").click()
  await expect(page.getByTestId("pokemon-card")).toHaveCount(30)

  await page
    .getByRole("link", { name: /Open Crabominable detail page/i })
    .scrollIntoViewIfNeeded()
  await expect(page.getByRole("heading", { name: "Crabominable" })).toBeVisible()
  await page.getByRole("link", { name: /Open Crabominable detail page/i }).click()
  await expect(page).toHaveURL(/\/pokemon\/crabominable/)

  await page.getByTestId("back-to-explorer").click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByTestId("pokemon-card")).toHaveCount(30)
  await expect(page.getByRole("heading", { name: "Crabominable" })).toBeVisible()
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(200)
})

test("Back to Explorer preserves search state", async ({ page }) => {
  await page.goto("/")

  await page.getByTestId("pokemon-search-input").fill("char")
  await expect(page.getByRole("heading", { name: "Charizard" })).toBeVisible()
  await page.getByRole("link", { name: /Open Charizard detail page/i }).click()
  await expect(page).toHaveURL(/\/pokemon\/charizard/)

  await page.getByTestId("back-to-explorer").click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByTestId("pokemon-search-input")).toHaveValue("char")
  await expect(page.getByRole("heading", { name: "Charizard" })).toBeVisible()
})

test.describe("mobile Pokemon detail", () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test("is readable with metric chips and accordion sections", async ({
    page,
  }) => {
    await page.goto("/pokemon/venusaur")

    await expect(page.getByTestId("pokemon-detail-page")).toBeVisible()
    await expect(page.getByTestId("pokemon-detail-title")).toHaveText("Venusaur")
    await expect(page.getByTestId("pokemon-metrics")).toBeVisible()
    await expect(page.getByTestId("pokemon-metric-height")).toBeVisible()
    await expect(page.getByTestId("pokemon-metric-weight")).toBeVisible()
    await expect(page.getByTestId("pokemon-metric-base-xp")).toBeVisible()
    await expect(page.getByTestId("add-to-team-button")).toBeVisible()
    await expect(page.getByRole("button", { name: "Base Stats" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Abilities" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Top Moves" })).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Evolution Chain" }),
    ).toBeVisible()
    await expect(page.getByTestId("pokemon-stats-section")).toBeVisible()

    await page.getByRole("button", { name: "Abilities" }).click()
    await expect(page.getByTestId("pokemon-abilities-section")).toBeVisible()
    await page.getByRole("button", { name: "Top Moves" }).click()
    await expect(page.getByTestId("pokemon-moves-section")).toBeVisible()
    await page.getByRole("button", { name: "Evolution Chain" }).click()
    await expect(page.getByTestId("pokemon-evolution-current")).toContainText(
      "Venusaur",
    )
    await expect(page.getByTestId("mobile-bottom-nav")).toBeVisible()

    const metricBox = await page.getByTestId("pokemon-metrics").boundingBox()
    const heightBox = await page
      .getByTestId("pokemon-metric-height")
      .boundingBox()
    if (!metricBox || !heightBox) {
      throw new Error("Mobile metrics should be visible")
    }
    expect(heightBox.width).toBeGreaterThan(80)

    const pageWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    )
    const viewportWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    )
    expect(pageWidth).toBeLessThanOrEqual(viewportWidth + 2)
  })

  test("long Pokemon detail titles wrap on mobile", async ({ page }) => {
    await page.goto("/pokemon/crabominable")

    const title = page.getByTestId("pokemon-detail-title")

    await expect(title).toHaveText("Crabominable")
    const titleStyle = await title.evaluate((element) => {
      const styles = getComputedStyle(element)

      return {
        textOverflow: styles.textOverflow,
        whiteSpace: styles.whiteSpace,
      }
    })
    expect(titleStyle.textOverflow).not.toBe("ellipsis")
    expect(titleStyle.whiteSpace).not.toBe("nowrap")
  })
})
