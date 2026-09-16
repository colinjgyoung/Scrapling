const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const fileUrl = pathToFileURL(path.resolve(__dirname, "../index.html")).href;
  await page.goto(fileUrl);

  assert.equal(await page.locator(".search-card").count(), 12);

  await page.locator("#author").fill("Example prospect");
  await page.locator("#role-company").fill("Head of Learning and Development, international technology company");
  await page.locator("#candidate-location").fill("Barcelona");
  await page.locator("#published-date").fill(new Date().toISOString().slice(0, 10));
  await page.locator("#post-text").fill("We are looking for a communication training partner. Our global managers are struggling with difficult conversations and feedback in English. Can anyone recommend a practical workshop provider?");
  await page.locator("#candidate-form button[type=submit]").click();

  await page.locator("#analysis-result").getByText("Strong buyer signal").waitFor();
  await page.locator("#save-result").click();
  assert.equal(await page.locator("#shortlist-body tr").count(), 1);
  assert.match(await page.locator("#shortlist-count").textContent(), /1 saved signal/);

  await page.screenshot({ path: "/tmp/communication-signal-finder.png", fullPage: true });
  await browser.close();
  console.log("UI smoke test passed.");
})();
