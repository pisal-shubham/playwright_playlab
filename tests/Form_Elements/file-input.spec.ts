import { expect, test } from "@playwright/test";
import { describe } from "node:test";
import path from "path";

const testdatapath = "./testdata/";
const pdfFilename = "sample.pdf";
const imgFilename = "sample.png";
describe("File Input field tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Upload single file", async ({ page }) => {
    const uploaCard = page.getByTestId("upload-card");
    const fileInput = page.getByTestId("file-input");
    const fileList = page.getByTestId("file-list");

    await fileInput.setInputFiles(testdatapath + pdfFilename);

    await expect(uploaCard).toBeVisible();

    await expect(fileInput).toHaveValue(/sample\.pdf/);

    await expect(
      fileList.getByTestId(`file-item-${pdfFilename}`),
    ).toBeVisible();
  });

  test("Upload multiple file", async ({ page }) => {
    const uploaCard = page.getByTestId("upload-card");
    const fileInput = page.getByTestId("file-input");
    const fileList = page.getByTestId("file-list");
    const files = [pdfFilename, imgFilename];

    await expect(uploaCard).toBeVisible();

    await fileInput.setInputFiles([
      testdatapath + pdfFilename,
      testdatapath + imgFilename,
    ]);

    const fileNames = await fileInput.evaluate((input) =>
      Array.from((input as HTMLInputElement).files ?? []).map(
        (file) => file.name,
      ),
    );

    expect(fileNames).toEqual(files);

    await expect(
      fileList.getByTestId(`file-item-${pdfFilename}`),
    ).toBeVisible();
    await expect(
      fileList.getByTestId(`file-item-${imgFilename}`),
    ).toBeVisible();
  });

  test("Browse file", async ({ page }) => {
    const uploaCard = page.getByTestId("upload-card");
    const fileInput = page.getByTestId("file-input");
    const fileList = page.getByTestId("file-list");
    const files = [pdfFilename, imgFilename];

    await expect(uploaCard).toBeVisible();

    const fileChooserPromise = page.waitForEvent("filechooser");
    await uploaCard.getByText("browse", { exact: true }).click();

    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles([
      path.join(testdatapath + pdfFilename),
      path.join(testdatapath + imgFilename),
    ]);

    const fileNames = await fileInput.evaluate((input) =>
      Array.from((input as HTMLInputElement).files ?? []).map(
        (file) => file.name,
      ),
    );

    expect(fileNames).toEqual(files);

    await expect(
      fileList.getByTestId(`file-item-${pdfFilename}`),
    ).toBeVisible();
    await expect(
      fileList.getByTestId(`file-item-${imgFilename}`),
    ).toBeVisible();
  });


test("Clear uploaded file", async ({ page }) => {
    const uploaCard = page.getByTestId("upload-card");
    const fileInput = page.getByTestId("file-input");
    const fileList = page.getByTestId("file-list");

    await fileInput.setInputFiles(testdatapath + pdfFilename);

    await expect(uploaCard).toBeVisible();

    await expect(fileInput).toHaveValue(/sample\.pdf/);

    await expect(
      fileList.getByTestId(`file-item-${pdfFilename}`),
    ).toBeVisible();

    await fileInput.setInputFiles([]);

    await expect(fileInput).not.toHaveValue(/sample\.pdf/);

    await page.getByTestId(`remove-${pdfFilename}`).click()
    await expect(
      fileList.getByTestId(`file-item-${pdfFilename}`),
    ).toBeHidden();

  });





});

/*
1. Upload file
2. Drag drop
3. Browse file
4. Repeat 2 and 3 for 2 files


*/
