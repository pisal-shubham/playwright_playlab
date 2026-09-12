import {expect, test} from "@playwright/test"
import { describe } from "node:test"


describe('Multi-select tests',()=>{
    test.beforeEach(async ({page})=>{
        await page.goto('/')
    })

    test('Select one option',async({page})=>{
        const multiselctCard=page.getByTestId('multiselect-card');
        const multiselect=page.getByTestId('multi-select');
        const result=page.getByTestId('selected-frameworks')

        const frameworks=['React','Vue.js']

        await expect(multiselctCard).toBeVisible()
        await multiselect.selectOption(frameworks[0])

        await expect(result.getByText(frameworks[0])).toBeVisible()

        await multiselect.selectOption(frameworks[1])
        await expect(result.getByText(frameworks[1])).toBeVisible()
        await expect(result.getByText(frameworks[0])).toBeHidden()

    })

    test('Select multiple option',async({page})=>{
        const multiselctCard=page.getByTestId('multiselect-card');
        const multiselect=page.getByTestId('multi-select');
        const result=page.getByTestId('selected-frameworks')

        const frameworks=['React','Vue.js']

        await expect(multiselctCard).toBeVisible()
        await multiselect.selectOption(frameworks)

        await expect(result.getByText(frameworks[0])).toBeVisible()
        await expect(result.getByText(frameworks[1])).toBeVisible()

    })

    test('Keep one selected option',async({page})=>{

        const modifierKey = process.platform === 'darwin' ? 'Meta' : 'Control';
        const multiselctCard=page.getByTestId('multiselect-card');
        const multiselect=page.getByTestId('multi-select');
        const options=page.getByTestId('multi-select').getByRole('option');
        const result=page.getByTestId('selected-frameworks')

        const frameworks=['React','Vue.js']

        await expect(multiselctCard).toBeVisible()
        await multiselect.selectOption(frameworks)

        await expect(result.getByText(frameworks[0])).toBeVisible()
        await expect(result.getByText(frameworks[1])).toBeVisible()

        await page.keyboard.down(modifierKey)
        await options.filter({hasText:frameworks[0]}).click()
        await page.keyboard.up(modifierKey)

        await expect(result.getByText(frameworks[0])).toBeHidden()
        await expect(result.getByText(frameworks[1])).toBeVisible()

    })

    test('Unselect one option',async({page})=>{

        const modifierKey = process.platform === 'darwin' ? 'Meta' : 'Control';
        const multiselctCard=page.getByTestId('multiselect-card');
        const multiselect=page.getByTestId('multi-select');
        const options=page.getByTestId('multi-select').getByRole('option');
        const result=page.getByTestId('selected-frameworks')

        const frameworks=['React','Vue.js']

        await expect(multiselctCard).toBeVisible()
        await multiselect.selectOption(frameworks)

        await expect(result.getByText(frameworks[0])).toBeVisible()
        await expect(result.getByText(frameworks[1])).toBeVisible()

        await options.filter({hasText:frameworks[0]}).click()

        await expect(result.getByText(frameworks[0])).toBeVisible()
        await expect(result.getByText(frameworks[1])).toBeHidden()

    })
})