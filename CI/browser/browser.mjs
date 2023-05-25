import puppeteer from "puppeteer"

/** 
 * @param port_address {number | string}
 * @param headless {boolean}
 */
export default async function go(port_address, headless = !!process.env.CI) {
  const browser = await puppeteer.launch({headless: headless ? "new" : false})
  const page = await browser.newPage()
  page.on("console", (consoleObj) => console.log(consoleObj.text()))
  
  const address = typeof port_address === "number" ? `http://127.0.0.1:${port_address}/` : port_address

  console.log("address", address)
  await page.goto(address, {waitUntil: "networkidle0"})

  return { browser, page }
}
