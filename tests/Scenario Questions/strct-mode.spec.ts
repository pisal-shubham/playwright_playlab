import { test, expect } from "@playwright/test";

test.describe("strict-mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://playwrightlab.github.io/index.html#");
    await expect(page.locator("nav#navbar")).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page
      .locator("nav#navbar")
      .getByRole("link", { name: "Menu" })
      .click();
  });

  test.fail("Strict mode violation", async ({ page }) => {
    expect(await page.getByRole("link", { name: "Forms" }).count()).toEqual(2);
    await page.getByRole("link", { name: "Forms" }).click();
  });

  test("Strict mode no-violation using first", async ({ page }) => {
    await page.getByRole("link", { name: "Forms" }).first().click();
  });

  test("Strict mode no-violation", async ({ page }) => {
    await page
      .locator("nav#navbar")
      .getByRole("link", { name: "Forms" })
      .click();
  });

  test("Multi element operations", async ({ page }) => {
    const c = await page.getByRole("link").count();
    console.log("Number of links: " + c);
  });
});

/*

5. What is strict mode in Playwright and why is it important Document
    1. **Strict Mode** is a default behavior in Playwright where a locator must resolve to **exactly one element** when performing a single-element action (like `click()` or `fill()`) or some assertion like (`toBeVisible()`).
    2. If the locator matches multiple elements, Playwright throws a **`strict mode violation`** instead of guessing which element you intended.
        
        ```tsx
        await page.getByRole('button', { name: 'Submit' }).click();
        ```
        
    3. To resolve a strict mode violation, we can use `.first()`, `.last()`, or `.nth()` to explicitly select one element. However, these should not be used just to hide an ambiguous locator. When possible, we should prefer a more specific and unique locator that clearly identifies the intended element.
        
        ```tsx
        // ❌ Ambiguous
        await page.getByRole('link', { name: 'Forms' }).click();
        
        // ⚠️ Forces the first match
        await page.getByRole('link', { name: 'Forms' }).first().click();
        
        // ✅ Better — uniquely identify the intended element
        await page.locator('#navbar')
            .getByRole('link', { name: 'Forms' })
            .click();
        ```
        
    4. Why it is important
        1. **Prevents Flaky Tests**: It ensures that your script interacts with the specific intended element rather than a random match, preventing unpredictable behavior.
        2. **Faster Debugging**: When a violation occurs, Playwright’s error message helpfully lists all the matching elements it found, allowing you to quickly identify why your selector is too broad.
    5. In case of multi element operations playwright understand the operation and does not throw an error.
        
        **Works fine with multiple elements**
        
        ```jsx
        await page.getByRole('button').count();
        ```
*/
