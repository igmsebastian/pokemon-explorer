import { expect, test } from "@playwright/test"
import { mockPokeApi } from "./pokeapi-fixtures"

test.beforeEach(async ({ page }) => {
  await mockPokeApi(page)
  await page.addInitScript(() => window.localStorage.clear())
})

test("homepage loads Pokemon cards with search and type filter", async ({
  page,
}) => {
  await page.goto("/")

  await expect(page.getByTestId("app-header")).toBeVisible()
  await expect(
    page.getByRole("heading", { name: /Pokedex command center/i }),
  ).toBeVisible()
  await expect(page.getByTestId("pokemon-search-input")).toBeVisible()
  await expect(page.getByTestId("pokemon-type-filter")).toBeVisible()
  await expect(page.getByTestId("pokemon-card").first()).toBeVisible()
  await expect(page.getByRole("heading", { name: "Bulbasaur" })).toBeVisible()
})

test("search and type filtering narrow the Pokemon grid", async ({ page }) => {
  await page.goto("/")

  await page.getByTestId("pokemon-search-input").fill("pika")
  await expect(page.getByRole("heading", { name: "Pikachu" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Bulbasaur" })).toHaveCount(0)

  await page.getByTestId("pokemon-search-input").fill("")
  await page.getByTestId("pokemon-type-filter").click()
  await page.getByRole("option", { name: "Fire" }).click()

  await expect(page.getByRole("heading", { name: "Charmander" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Squirtle" })).toHaveCount(0)
})

test("long Pokemon names wrap cleanly inside cards", async ({ page }) => {
  await page.goto("/")

  await page.getByTestId("pokemon-search-input").fill("crab")

  const card = page.getByTestId("pokemon-card").filter({
    has: page.getByTestId("pokemon-card-name").filter({
      hasText: "Crabominable",
    }),
  })
  const name = card.getByTestId("pokemon-card-name")

  await expect(card).toBeVisible()
  await expect(name).toBeVisible()
  await expect(card.getByText("Fighting").first()).toBeVisible()
  await expect(card.getByText("Ice").first()).toBeVisible()
  await expect(card.getByTestId("add-to-team-button")).toBeVisible()

  const nameStyle = await name.evaluate((element) => {
    const styles = getComputedStyle(element)

    return {
      textOverflow: styles.textOverflow,
      whiteSpace: styles.whiteSpace,
    }
  })
  expect(nameStyle.textOverflow).not.toBe("ellipsis")
  expect(nameStyle.whiteSpace).not.toBe("nowrap")

  const pageWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  )
  const viewportWidth = await page.evaluate(
    () => document.documentElement.clientWidth,
  )
  expect(pageWidth).toBeLessThanOrEqual(viewportWidth + 2)
})
