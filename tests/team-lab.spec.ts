import { expect, test, type Page } from "@playwright/test"
import { mockPokeApi } from "./pokeapi-fixtures"

test.beforeEach(async ({ page }) => {
  await mockPokeApi(page)
})

async function addFirstScannerPokemon(page: Page) {
  const scanner = page.getByTestId("team-lab-scanner-grid")
  const firstCard = scanner.getByTestId("pokemon-card").first()
  const firstAddButton = scanner.getByTestId("add-to-team-button").first()

  await expect(scanner).toBeVisible()
  await expect(firstCard).toBeVisible()
  await expect(firstAddButton).toBeVisible()
  await firstAddButton.click()
}

test("empty Team Lab starts with an intuitive party state", async ({ page }) => {
  await page.goto("/team-lab")

  await expect(page.getByTestId("team-lab-page")).toBeVisible()
  await expect(page.getByTestId("team-count")).toHaveText("0 / 6")
  await expect(page.getByTestId("squad-readiness-score")).toHaveText("0")
  await expect(page.getByTestId("squad-readiness-label")).toHaveText(
    "No Party Yet",
  )
  await expect(page.getByTestId("battle-party")).toBeVisible()
  await expect(page.getByTestId("battle-party-empty")).toContainText(
    "No Pokemon in your party yet.",
  )
  await expect(page.getByTestId("party-matchup-snapshot")).toHaveCount(0)
})

test("Team Lab allows duplicates, enforces max size, releases, and persists", async ({
  page,
}) => {
  await page.goto("/team-lab")

  await addFirstScannerPokemon(page)
  await expect(page.getByTestId("team-count")).toHaveText("1 / 6")
  await expect(page.getByRole("button", { name: "Add" }).first()).toBeEnabled()
  await expect(page.getByText("In Party x1").first()).toBeVisible()
  await expect(page.getByTestId("squad-readiness-score")).not.toHaveText("0")
  await expect(page.getByTestId("battle-party")).toContainText("Bulbasaur")
  await expect(page.getByTestId("release-pokemon-button")).toBeVisible()

  await addFirstScannerPokemon(page)
  await expect(page.getByTestId("team-count")).toHaveText("2 / 6")
  await expect(
    page.getByTestId("battle-party").getByText("Bulbasaur"),
  ).toHaveCount(2)
  await expect(page.getByText("In Party x2").first()).toBeVisible()

  for (let index = 0; index < 4; index += 1) {
    await addFirstScannerPokemon(page)
  }

  await expect(page.getByTestId("team-count")).toHaveText("6 / 6")
  await expect(page.getByRole("button", { name: "Party Full" }).first()).toBeDisabled()

  await page.getByTestId("release-pokemon-button").first().click()
  await expect(page.getByTestId("release-confirm-dialog")).toBeVisible()
  await page.getByTestId("release-confirm-action").click()
  await expect(page.getByTestId("team-count")).toHaveText("5 / 6")

  await page.reload()
  await expect(page.getByTestId("team-count")).toHaveText("5 / 6")
})

test("Release and Reset Party controls update the local battle party", async ({
  page,
}) => {
  await page.goto("/team-lab")

  await addFirstScannerPokemon(page)
  await expect(page.getByTestId("team-count")).toHaveText("1 / 6")
  await addFirstScannerPokemon(page)
  await expect(page.getByTestId("team-count")).toHaveText("2 / 6")

  await page.getByTestId("release-pokemon-button").first().click()
  await expect(page.getByTestId("release-confirm-dialog")).toBeVisible()
  await page.getByRole("button", { name: "Keep" }).click()
  await expect(page.getByTestId("team-count")).toHaveText("2 / 6")

  await page.getByTestId("release-pokemon-button").first().click()
  await expect(page.getByTestId("release-confirm-dialog")).toBeVisible()
  await page.getByTestId("release-confirm-action").click()
  await expect(page.getByTestId("team-count")).toHaveText("1 / 6")
  await expect(
    page.getByTestId("battle-party").getByText("Bulbasaur"),
  ).toHaveCount(1)

  await page.getByTestId("release-pokemon-button").click()
  await expect(page.getByTestId("release-confirm-dialog")).toBeVisible()
  await page.getByTestId("release-confirm-action").click()
  await expect(page.getByTestId("team-count")).toHaveText("0 / 6")
  await expect(page.getByTestId("battle-party-empty")).toBeVisible()

  await addFirstScannerPokemon(page)
  await addFirstScannerPokemon(page)
  await expect(page.getByTestId("team-count")).toHaveText("2 / 6")

  await page.getByTestId("reset-party-button").click()
  await expect(page.getByTestId("reset-party-confirm-dialog")).toBeVisible()
  await page.getByRole("button", { name: "Keep Party" }).click()
  await expect(page.getByTestId("team-count")).toHaveText("2 / 6")

  await page.getByTestId("reset-party-button").click()
  await expect(page.getByTestId("reset-party-confirm-dialog")).toBeVisible()
  await page.getByTestId("reset-party-confirm-action").click()
  await expect(page.getByTestId("team-count")).toHaveText("0 / 6")
  await expect(page.getByTestId("squad-readiness-label")).toHaveText(
    "No Party Yet",
  )
})

test("duplicate Pokemon are allowed but reduce Squad Readiness", async ({
  page,
}) => {
  await page.goto("/team-lab")

  await addFirstScannerPokemon(page)
  const firstScore = Number(
    await page.getByTestId("squad-readiness-score").textContent(),
  )

  await addFirstScannerPokemon(page)
  const duplicateScore = Number(
    await page.getByTestId("squad-readiness-score").textContent(),
  )

  expect(duplicateScore).toBeLessThan(firstScore)
  await expect(page.getByTestId("team-count")).toHaveText("2 / 6")
  await expect(page.getByRole("button", { name: "Add" }).first()).toBeEnabled()
  await expect(page.getByTestId("type-effectiveness")).toContainText("Grass x1")
  await page.getByRole("button", { name: "Strategy Notes" }).click()
  await expect(page.getByTestId("strategy-notes")).toBeVisible()
  await expect(page.getByTestId("strategy-notes")).toContainText(
    "Multiple Grass-type leads are in the party.",
  )
})

test("Team Lab shows type effectiveness, matchup, and battle preview", async ({
  page,
}) => {
  await page.goto("/team-lab")

  await addFirstScannerPokemon(page)
  await expect(page.getByTestId("type-effectiveness")).toBeVisible()
  await expect(page.getByTestId("type-effectiveness")).toContainText("Coverage")
  await expect(page.getByTestId("type-effectiveness")).toContainText("Grass x1")
  await expect(page.getByTestId("battle-preview")).toBeVisible()
  await expect(page.getByTestId("battle-preview")).toContainText("Fastest")
  await expect(page.getByTestId("battle-preview")).toContainText("Power Lead")
  await expect(page.getByTestId("party-matchup-snapshot")).toHaveCount(0)

  await addFirstScannerPokemon(page)
  await expect(page.getByTestId("party-matchup-snapshot")).toBeVisible()
  await expect(page.getByTestId("party-matchup-snapshot")).toContainText("Edge")
  await expect(page.getByTestId("party-matchup-snapshot")).toContainText(
    "Strongest stat",
  )
})

test.describe("Team Lab desktop layout", () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test("scanner cards stay readable without horizontal clipping", async ({
    page,
  }) => {
    await page.goto("/team-lab")

    const scanner = page.getByTestId("team-lab-scanner-grid")
    const cards = scanner.getByTestId("pokemon-card")
    const firstCard = cards.first()

    await expect(scanner).toBeVisible()
    await expect(page.getByTestId("pokemon-search-input")).toBeVisible()
    await expect(firstCard).toBeVisible()
    await expect(
      firstCard.getByRole("heading", { name: "Bulbasaur" }),
    ).toBeVisible()
    await expect(firstCard.getByText("Grass").last()).toBeVisible()
    await expect(firstCard.getByText("Poison")).toBeVisible()
    await expect(page.getByTestId("add-to-team-button").first()).toBeVisible()

    const scannerBox = await scanner.boundingBox()
    if (!scannerBox) {
      throw new Error("Team Lab scanner should have a visible layout box")
    }

    for (let index = 0; index < 6; index += 1) {
      const cardBox = await cards.nth(index).boundingBox()
      if (!cardBox) {
        throw new Error(`Pokemon card ${index + 1} should be visible`)
      }

      expect(cardBox.x).toBeGreaterThanOrEqual(scannerBox.x - 1)
      expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(
        scannerBox.x + scannerBox.width + 1,
      )
    }

    const pageWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    )
    const viewportWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    )
    expect(pageWidth).toBeLessThanOrEqual(viewportWidth + 2)

    await page.getByTestId("add-to-team-button").first().click()
    await expect(page.getByTestId("team-count")).toHaveText("1 / 6")
  })

  test("scanner cards wrap long Pokemon names", async ({ page }) => {
    await page.goto("/team-lab")

    await page.getByTestId("pokemon-search-input").fill("crab")

    const card = page.getByTestId("team-lab-scanner-grid").getByTestId(
      "pokemon-card",
    ).filter({
      has: page.getByTestId("pokemon-card-name").filter({
        hasText: "Crabominable",
      }),
    })
    const name = card.getByTestId("pokemon-card-name")

    await expect(card).toBeVisible()
    await expect(name).toBeVisible()
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
  })

  test("right analysis panel scrolls internally and keeps lower sections reachable", async ({
    page,
  }) => {
    await page.goto("/team-lab")

    for (let index = 0; index < 6; index += 1) {
      await addFirstScannerPokemon(page)
    }

    const panel = page.getByTestId("team-analysis-panel")
    await expect(panel).toBeVisible()

    const panelScrollWidth = await panel.evaluate(
      (element) => element.scrollWidth,
    )
    const panelClientWidth = await panel.evaluate(
      (element) => element.clientWidth,
    )
    expect(panelScrollWidth).toBeLessThanOrEqual(panelClientWidth + 2)

    await expect(page.getByTestId("battle-party")).toBeVisible()
    await expect(page.getByTestId("battle-party-item").first()).toBeVisible()
    const firstPartyName = page.getByTestId("battle-party-pokemon-name").first()
    await expect(firstPartyName).toBeVisible()
    expect((await firstPartyName.textContent())?.trim().length ?? 0).toBeGreaterThan(
      0,
    )
    await expect(page.getByTestId("release-pokemon-button").first()).toBeVisible()
    await page.getByTestId("release-pokemon-button").first().click()
    await expect(page.getByTestId("release-confirm-dialog")).toBeVisible()
    await page.getByRole("button", { name: "Keep" }).click()

    await panel.evaluate((element) => {
      element.scrollTop = element.scrollHeight
    })

    await expect(page.getByText("Strategy Notes")).toBeVisible()
    await page.getByRole("button", { name: "Strategy Notes" }).click()
    await expect(page.getByTestId("strategy-notes")).toBeVisible()
    await expect(page.getByTestId("type-effectiveness")).toBeVisible()
    await expect(page.getByTestId("party-matchup-snapshot")).toBeVisible()
    await expect(page.getByTestId("battle-preview")).toBeVisible()

    const pageWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    )
    const viewportWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    )
    expect(pageWidth).toBeLessThanOrEqual(viewportWidth + 2)
  })
})
