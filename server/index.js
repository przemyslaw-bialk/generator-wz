const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/scrape", async (req, res) => {
  const { user_login, user_password, order_number } = req.body;

  const order_number_provided = order_number;

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
      await page.waitForNavigation({ waitUntil: "networkidle2" });
      await popup.click();
    } else {
      console.log("nie bylo popupa, ide dalej");
    }

    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // if order number is not provided then click the last order
    if (!order_number_provided) {
      await page.goto("https://ego2.pl/wp-admin/admin.php?page=wc-orders");
      await page.waitForSelector("tbody > tr > td > a.order-view");
      await page.click("tbody > tr > td > a.order-view");
    } else {
      await page.goto(
        `https://ego2.pl/wp-admin/admin.php?page=wc-orders&action=edit&id=${order_number_provided}`
      );
    }

    const result = [];

    // getting address
    const address_id = await page.$("div.address > p");
    const address_html = await address_id.evaluate((el) => el.innerHTML);
    // changing </br> to n\ to correct display
    const address = address_html.replace(/<br ?\/?>/g, "\n").trim();

    // getting order data
    const order_date_id = await page.$("input.date-picker");
    const order_date = await order_date_id.evaluate((el) =>
      el.getAttribute("value")
    );

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

    res.json({ result: result, address: address, order_date: order_date });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server działa na http://localhost:5000"));
