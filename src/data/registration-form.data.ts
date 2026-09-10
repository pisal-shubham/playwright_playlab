import { faker } from "@faker-js/faker";
export const SKILLS = [
    "js",
    "csharp",
    "java",
    "python",
] as const;

export type Skill = typeof SKILLS[number];
export function getRegistrationData() {
    const countries = ["India", "United States", "Canada", "United Kingdom"];

    return {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number(),
        dateOfBirth: faker.date.birthdate({
            min: 18,
            max: 60,
            mode: "age",
        }).toISOString()
    .split("T")[0],
        country: faker.helpers.arrayElement(countries),
        gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
        skills: faker.helpers.arrayElements(SKILLS,
            { min: 1, max: 3 }
        ),
        bio: faker.lorem.sentence(),
        termsAccepted: true,
    };
}
