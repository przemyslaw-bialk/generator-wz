const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/scrape", async (req, res) => {
  const { user_login, user_password, order_number } = req.body;

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto("https://www.ego2.pl/wp-admin");

    await page.type("#user_login", user_login);
    await page.type("#user_pass", user_password);
    await page.click("#wp-submit");
    // CHECK THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const popup = await page.$("div.admin-email__actions-secondary > a");

    if (popup) {
      await popup.click();
      await page.waitForNavigation({ waitUntil: "networkidle2" });
    } else {
      console.log("nie bylo popupa, ide dalej");
    }
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    await page.goto(
      `https://ego2.pl/wp-admin/admin.php?page=wc-orders&action=edit&id=${order_number}`
    );

    const result = [];

    // getting address
    const address_id = await page.$("div.address > p");
    const address_html = await address_id.evaluate((el) => el.innerHTML);
    // changing </br> to n\ to correct display
    const address = address_html.replace(/<br ?\/?>/g, "\n").trim();

    // getting items and quantity of items
    const rows = await page.$$("tr.item");

    for (const row of rows) {
      const item_name_id = await row.$("td.name > a");
      const item_name = await item_name_id.evaluate((el) =>
        el.textContent.trim()
      );
      const item_qtn_id = await row.$("td:nth-of-type(5) > div.view");
      const item_qtn = await item_qtn_id.evaluate((el) =>
        el.textContent.trim()
      );

      result.push({
        item_name: item_name,
        item_qtn: item_qtn,
      });
    }

    res.json({ result: result, address: address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server działa na http://localhost:5000"));
