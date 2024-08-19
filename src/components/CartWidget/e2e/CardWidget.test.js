import puppeteer from "puppeteer";

describe("card validate form", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    page = await browser.newPage();
  });

  beforeEach(async () => {
    await page.goto("http://localhost:6363");
    await page.waitForSelector("form.card-validator");
  });

  test("Form should render on page start", async () => {
    const form = await page.$("form.card-validator");
    expect(form).toBeTruthy();
  });

  test("Should highlight Maestro when entering a Maestro card number", async () => {
    await page.type('input[data-type="card-number"]', "5067929858074128");
    const activeIcon = await page.$(
      '.card-validator__pay-type-item.active[data-type-card="maestro"]',
    );
    expect(activeIcon).toBeTruthy();
  });

  test("Should validate a correct card number", async () => {
    await page.type('input[data-type="card-number"]', "4111111111111111");
    await page.click('button[type="submit"]');
    const isValid = await page.$eval(
      'input[data-type="card-number"]',
      (el) => el.dataset.cardIsValid,
    );
    expect(isValid).toBe("yes");
  });

  test("Should invalidate an incorrect card number", async () => {
    await page.type('input[data-type="card-number"]', "1234567890123456");
    await page.click('button[type="submit"]');
    const isValid = await page.$eval(
      'input[data-type="card-number"]',
      (el) => el.dataset.cardIsValid,
    );
    expect(isValid).toBe("no");
  });

  afterAll(async () => {
    await browser.close();
  });
});
