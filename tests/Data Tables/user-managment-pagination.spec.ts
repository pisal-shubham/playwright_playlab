import { expect, Page, test } from "@playwright/test";
import { describe } from "node:test";
import fs from "node:fs";

function tableInfo(page: Page) {
  return userManagementCard(page).getByTestId('table-info');
}

async function assertTableInfo(page:Page,start:number,end:number){
    await expect(tableInfo(page)).toContainText(`Showing ${start}-${end} of`)
}

function rowsDropdown(page:Page){
    return userManagementCard(page).getByTestId('rows-per-page');
}

function tableRows(page:Page){
    return userManagementCard(page).getByTestId('table-body').locator('tr');
}

function userManagementCard(page:Page){
    return page.getByTestId("table-card");
}
describe("User Management Pagination", () => {
  test.beforeEach("/", async ({ page }) => {
    const userManagmentCard = userManagementCard(page)
    const roleDropdown = page.getByTestId("table-filter");
    await page.goto("/");
    await expect(userManagmentCard).toBeVisible();
    await userManagmentCard.scrollIntoViewIfNeeded();
    await roleDropdown.selectOption("All Roles");

  });

  test("Pagination check number shows are correct", async ({ page }) => {

    let selectedRowCount=Number(await rowsDropdown(page).inputValue())
    expect(await tableRows(page).count()).toBe(selectedRowCount)
    await assertTableInfo(page,1,selectedRowCount)

    // Select count 10

    const newRowCount='10';
    await rowsDropdown(page).selectOption(newRowCount)
    selectedRowCount=Number(await rowsDropdown(page).inputValue())
    expect(await tableRows(page).count()).toBe(selectedRowCount)
    await expect(tableInfo(page)).toBeVisible()
    await assertTableInfo(page,1,selectedRowCount)
  });

  test("Pagination check next page", async ({ page }) => {

    const rows=tableRows(page);

    let pageSize=Number(await rowsDropdown(page).inputValue())
    expect(await rows.count()).toBe(pageSize)
    await assertTableInfo(page,1,pageSize)

    const firstPageIds=await rows.locator('td').nth(1).allTextContents()

    await userManagementCard(page).getByTestId('page-next').click()
    const secondPageIds=await rows.locator('td').nth(1).allTextContents()

    expect(await rows.count()).toBe(pageSize)
    await assertTableInfo(page,1+pageSize,pageSize*2)
    expect(secondPageIds).not.toEqual(firstPageIds);
  });

  test.skip("Pagination check next page screenshot learning", async ({ page }) => {
    // I know screenshot is not best choice here I am just learning
    const rows=tableRows(page);
    const card=userManagementCard(page);
    const screenshotpath='screenshot/pagination-diff-state.png'

    await card.screenshot({
        path:screenshotpath
    })

    let pageSize=Number(await rowsDropdown(page).inputValue())
    expect(await rows.count()).toBe(pageSize)
    await assertTableInfo(page,1,pageSize)

    const firstPageIds=await rows.locator('td').nth(1).allTextContents()

    await userManagementCard(page).getByTestId('page-next').click()
    const secondPageIds=await rows.locator('td').nth(1).allTextContents()

    expect(await rows.count()).toBe(pageSize)
    await assertTableInfo(page,1+pageSize,pageSize*2)
    expect(secondPageIds).not.toEqual(firstPageIds);

    const currentScreenshot = await card.screenshot();
    
    const previousScreenshot = fs.readFileSync(
    screenshotpath
  );

  expect(currentScreenshot).not.toEqual(previousScreenshot);
  });

  

  test.skip("Pagination check next page screenshot learning same state", async ({ page }) => {
    // I know screenshot is not best choice here I am just learning
    const card=userManagementCard(page);
    const screenshotpath='screenshot/pagination-same-state.png'

    await card.screenshot({
        path:screenshotpath
    })

    await page.reload();

    const currentScreenshot = await card.screenshot();
    
    const previousScreenshot = fs.readFileSync(
    screenshotpath
  );

  expect(currentScreenshot).toEqual(previousScreenshot);



  });


});
