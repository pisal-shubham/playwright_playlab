import { expect, test } from "@playwright/test";
import { beforeEach, describe } from "node:test";

describe("Auto-suggest tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("verify autocomplete suggestions match typed query", async ({
    page,
  }) => {
    const searchTerm = "Java";
    const input = page.getByTestId("autocomplete-input");
    const suggestions = page
      .getByTestId("autocomplete-list")
      .getByRole("option");

    // 1. Type into input
    await input.fill(searchTerm);

    const list = page.getByTestId("autocomplete-list");

    const children = list.locator(":scope > *");

    console.log("Child count:", await children.count());

    for (let i = 0; i < (await children.count()); i++) {
      console.log(
        `Child ${i}:`,
        await children.nth(i).evaluate((el) => el.outerHTML),
      );
    }

    // 2. Assert every option contains the search term using Regex
    // Playwright automatically waits for suggestions to appear and validates all elements
    await expect(suggestions).toContainText([new RegExp(searchTerm, "i")]);

    await suggestions
      .filter({ has: page.getByText(searchTerm, { exact: true }) })
      .click();

    await expect(
      page
        .getByTestId("selected-tags")
        .getByText(searchTerm)
    ).toBeVisible();
  });
});
