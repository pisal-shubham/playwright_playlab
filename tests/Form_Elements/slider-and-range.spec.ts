import { expect, test } from "@playwright/test";
import { beforeEach, describe } from "node:test";

describe("Slider and Range tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Test volume increase", async ({ page }) => {
    const volumeSlider = page.getByTestId("slider-volume");
    const volumeValue = page.getByTestId("volume-value");

    const v1 = Number(await volumeValue.textContent());

    await volumeSlider.focus();

    await page.keyboard.press("ArrowRight");

    const v2 = Number(await volumeValue.textContent());

    expect(v2).toBeGreaterThan(v1);
  });

  test("Test volume decrease", async ({ page }) => {
    const volumeSlider = page.getByTestId("slider-volume");
    const volumeValue = page.getByTestId("volume-value");

    const v1 = Number(await volumeValue.textContent());

    await volumeSlider.focus();

    await page.keyboard.press("ArrowLeft");

    const v2 = Number(await volumeValue.textContent());

    expect(v2).toBeLessThan(v1);
  });

  test("Color picker", async ({ page }) => {
    // Taken from AI
    const targetColor = "#ef4444"; // Bright Red

    // 2. Locate the color picker input via its data-testid
    const colorPicker = page.getByTestId("color-picker");

    // 3. Inject the value directly into the DOM and trigger the UI update events
    await colorPicker.evaluate((node, color) => {
      (node as HTMLInputElement).value = color;

      // Dispatch input and change events so the UI updates live
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.dispatchEvent(new Event("change", { bubbles: true }));
    }, targetColor);

    // 4. Verify that your application's text label successfully updated
    await expect(page.getByTestId("color-display")).toHaveText(targetColor);
  });
});
