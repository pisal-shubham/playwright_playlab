import { expect, Locator, Page } from "@playwright/test";
import { Skill } from "../data/registration-form.data";

type Gender = "Male" | "Female" | "Other";
// type Skill = "JavaScript" | "C#" | "Java" | "Python";

export class RegistrationForm {
    private readonly form: Locator;
    private readonly fullNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly phoneInput: Locator;
    private readonly dobInput: Locator;
    private readonly country: Locator;
    private readonly gender: Locator;
    private readonly skills: Locator;
    private readonly bio: Locator;
    private readonly termsCheckbox: Locator;
    private readonly termsAndConditionLink: Locator;

    constructor(private page: Page) {
        this.form = page.getByTestId("registration-form");
        this.fullNameInput = this.form.getByLabel("Full Name *");
        this.emailInput = this.form.getByLabel("Email Address *");
        this.passwordInput = this.form.getByLabel("Password *");
        this.phoneInput = this.form.getByLabel("Phone Number");
        this.country = this.form.getByLabel("Country");
        this.dobInput = this.form.getByLabel("Date of Birth");
        this.gender = this.form.getByTestId("radio-gender");
        this.skills = this.form.getByTestId("checkbox-skills");
        this.bio = this.form.getByLabel("Bio");
        this.termsCheckbox = this.form.getByLabel(
            "I agree to the Terms & Conditions"
        );
        this.termsAndConditionLink = this.form.getByRole("link", {
            name: "Terms & Conditions",
        });
    }

    async isVisible() {
        await expect(this.form).toBeVisible();
    }

    async enterFullName(fullName: string) {
        await this.fullNameInput.fill(fullName);
    }

    async enterEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async enterPhone(phone: string) {
        await this.phoneInput.fill(phone);
    }

    async enterBio(bio: string) {
        await this.bio.fill(bio);
    }

    async selectGender(gender: Gender) {
        await this.gender.getByLabel(gender,{exact:true}).check();
    }

    getGender(gender: Gender) {
        return this.gender.getByLabel(gender,{exact:true});
    }

    async checkTermsAndConditions() {
        await this.termsCheckbox.check();
    }

    async uncheckTermsAndConditions() {
        await this.termsCheckbox.uncheck();
    }

    async isTermsAndConditionsChecked() {
        return this.termsCheckbox.isChecked();
    }

    // Date of Birth
    async enterDateOfBirth(dob:string) {
        await this.dobInput.fill(dob)
    }

    async clearDateOfBirth() {}

    // Country
    async selectCountry(country:string) {
        await this.country.selectOption({label:country})
    }

    // Skills
    async selectSkill(skill: Skill) {
        // await this.page.pause()
        // console.log(await this.skills.getByLabel(skill,{exact:true}).count())
        await this.skills.getByTestId(`check-${skill}`).check()
    }

    async unselectSkill(skill: Skill) {
        await this.skills.getByTestId(`check-${skill}`).uncheck()
    }

    getSkill(skill: Skill) {
        return this.skills.getByTestId(`check-${skill}`)
    }

    // Terms & Conditions link
    async openTermsAndConditions() {
        await this.termsAndConditionLink.click()
    }

    // Form
    async submit() {
        await this.form.getByRole('button',{name:'Register'}).click()
    }

    async reset() {
        await this.form.getByRole('button',{name:'Reset'}).click()
    }

    getSuccessMessage(){
        return this.page.getByText("Registration successful! Welcome aboard.");
    }
}