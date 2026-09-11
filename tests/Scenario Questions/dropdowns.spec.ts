import { expect, test } from "@playwright/test";

test.describe("Dropdown handling", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Custom dropdown", async ({ page }) => {
    const dropdownCard = page.getByTestId("custom-dropdown-card");
    const dropDownButton = page.getByTestId("custom-dropdown-trigger");
    await dropDownButton.click();
    // textContent()     → Returns DOM text content of a single element.
    // innerText()       → Returns visible text of a single element.
    // allTextContents() → Returns DOM text content of all matching elements.
    // allInnerTexts()   → Returns visible text of all matching elements.
    const priorities = await page
      .getByTestId("custom-dropdown-menu")
      .getByRole("listitem")
      .allTextContents();

    console.log(priorities);
    await dropDownButton.click();

    await expect(
      dropdownCard.getByRole("heading", { name: "Custom Dropdown" }),
    ).toBeVisible();

    await dropdownCard.scrollIntoViewIfNeeded();

    for (let priority of priorities) {
      await dropDownButton.click();
      await dropdownCard
        .getByRole("listitem")
        .filter({ hasText: priority })
        .click();
      await expect(page.getByText(`Selected: ${priority}`)).toBeVisible();
    }
  });

  test("Searchable dropdown", async ({ page }) => {
    const dropdownCard = page.getByTestId("searchable-dropdown-card");
    const dropDownInput = dropdownCard.getByPlaceholder(
      "Type to filter cities",
    );

    await expect(dropdownCard).toBeVisible();
    await dropdownCard.scrollIntoViewIfNeeded();

    await dropDownInput.click();
    const cities = await dropdownCard.getByRole("listitem").all();
    await dropDownInput.click();
    for (const option of cities) {
      await dropDownInput.clear();
      const city = await option.innerText();
      const value = await option.getAttribute("data-value");
      await dropDownInput.fill(city);

      await dropdownCard
        .getByRole("listitem")
        .filter({ hasText: city })
        .click();

      await expect(dropdownCard.getByText(`Selected: ${value}`)).toBeVisible();
    }
  });

  test("Grouped Options", async ({ page }) => {
    const dropdownCard = page.getByTestId("grouped-dropdown-card");
    const dropdown = dropdownCard.getByLabel("Select a Vehicle");

    await expect(dropdownCard).toBeVisible();
    await dropdownCard.scrollIntoViewIfNeeded();

    const vehicleOptions = await dropdown
      .getByRole("option")
      .filter({ hasNotText: "Choose vehicle..." })
      .all();

    for (const vehicle of vehicleOptions) {
      const name = (await vehicle.textContent())?.trim();
      const type = await vehicle.locator("..").getAttribute("label");
      await dropdown.selectOption({ label: name });

      await expect(
        dropdownCard.getByText(`Selected: ${name} (${type})`),
      ).toBeVisible();
    }
  });

  test("Cascading dropdowns", async ({ page }) => {
    const dropdownCard = page.getByTestId("cascading-dropdown-card");
    const continentDropdown = dropdownCard.getByLabel("Continent");
    const countryDropdown = dropdownCard.getByLabel("Country");
    const citytDropdown = dropdownCard.getByLabel("City");

    await expect(dropdownCard).toBeVisible();
    await dropdownCard.scrollIntoViewIfNeeded();

    await continentDropdown.selectOption({ index: 1 });

    await countryDropdown.selectOption({ index: 1 });

    await citytDropdown.selectOption({ index: 1 });

    const continent = await continentDropdown
      .locator("option:checked")
      .textContent();

    const country = await countryDropdown
      .locator("option:checked")
      .textContent();

    const city = await citytDropdown.locator("option:checked").textContent();

    const cascadeResult = dropdownCard.getByTestId("cascade-result");

    await expect(cascadeResult).toHaveText(
      `Selected: ${continent} → ${country} → ${city}`,
    );
  });

  test("Multi-Select Checkboxes", async ({ page }) => {
    const dropdownCard = page.getByTestId("checkbox-dropdown-card");
    const dropDown = page.getByTestId("checkbox-dropdown");

    await expect(dropdownCard).toBeVisible();
    // await dropdownCard.scrollIntoViewIfNeeded()

    await dropDown.click();
    await dropDown.getByRole("checkbox", { name: "Cheese" }).check();
    await dropDown.click();
    await expect(dropdownCard.getByText("Selected: cheese")).toBeVisible();
    await dropDown.click();
    await dropDown.getByRole("checkbox", { name: "Onions" }).check();
    await dropDown.click();
    await expect(
      dropdownCard.getByText("Selected: cheese, onions"),
    ).toBeVisible();

    await dropDown.click();
    await dropDown.getByRole("checkbox", { name: "Cheese" }).uncheck();
    await dropDown.click();

    await expect(dropdownCard.getByText("Selected: onions")).toBeVisible();
  });

  test("Delayed Checkboxes", async ({ page }) => {
    const dropdownCard = page.getByTestId("delayed-dropdown-card");
    const dropDown = dropdownCard.getByTestId("delayed-select");

    await expect(dropdownCard).toBeVisible();
    await expect(dropDown).toBeDisabled();

    await dropdownCard.getByRole('button',{name:'Load Options'}).click()

    await expect(dropDown).toBeEnabled();

    let category='Electronics'
    await dropDown.selectOption(category)
    // await dropdownCard.scrollIntoViewIfNeeded()

    await expect(page.getByTestId('delayed-dropdown-result')).toHaveText(`Selected: ${category}`)

  });
});
