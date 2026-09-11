import { expect, test } from "@playwright/test";
import { HomePage } from "../../src/pages/HomePage.page";
import { RegistrationForm } from "../../src/components/RegistrationForm.component";
import { getRegistrationData } from "../../src/data/registration-form.data";

test("Submit user details and verify user registered successfully", async ({ page }) => {
    const data = getRegistrationData();

    const homePage = new HomePage(page);
    const form = new RegistrationForm(page);

    await homePage.goto();
    await homePage.navbar.selectmenu("Forms");

    // Fill form
    await form.enterFullName(data.fullName);
    await form.enterEmail(data.email);
    await form.enterPassword(data.password);
    await form.enterPhone(data.phone);
    await form.enterDateOfBirth(data.dateOfBirth);
    await form.selectCountry(data.country);

    await form.selectGender(data.gender);

    for (const skill of data.skills) {
        await form.selectSkill(skill);
    }

    await form.enterBio(data.bio);
    await form.checkTermsAndConditions();

    // Assert entered data
    await expect(page.getByLabel("Full Name *")).toHaveValue(data.fullName);
    await expect(page.getByLabel("Email Address *")).toHaveValue(data.email);
    await expect(page.getByLabel("Password *")).toHaveValue(data.password);
    await expect(page.getByLabel("Phone Number")).toHaveValue(data.phone);
    await expect(page.getByLabel("Date of Birth")).toHaveValue(data.dateOfBirth);

    await expect(form.getGender(data.gender)).toBeChecked();

    for (const skill of data.skills) {
        await expect(form.getSkill(skill)).toBeChecked();
    }

    await expect(page.getByLabel("Bio")).toHaveValue(data.bio);
    await expect(form.isTermsAndConditionsChecked()).resolves.toBe(true);

    // const tcPagePromise=page.waitForEvent('popup')
    // await form.openTermsAndConditions()

    // const tcPage=await tcPagePromise;

    // await expect(tcPage.getByRole('heading',{name:"Terms of Service"})).toBeVisible()



    // Submit
    await form.submit();

    await expect(form.getSuccessMessage()).toBeVisible()

    // Verify registration success
    // Add your success assertion here
});