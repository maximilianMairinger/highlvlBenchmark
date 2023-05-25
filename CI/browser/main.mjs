import build from './build.mjs';
import startBrowser from './browser.mjs';
import startServer from './server.mjs';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await build()
console.log("built")
// const { port: _port, server: _server } = startServer()
// console.log("started server 1")
// const port = await _port
// const server = await _server
// console.log("started server 2")
const { browser, page } = await startBrowser(`file://${path.join(path.resolve(__dirname), "index.html")}`, true)
console.log("started browser")
await page.evaluate(await fs.readFile(path.join(__dirname, 'testDist', 'test.js'), "utf8"))
console.log("evaluated, now done")
browser.close()
// server.close()


import reqPackageJson from 'req-package-json';
const packageJson = reqPackageJson()
if (packageJson.browser === undefined) throw new Error("package.json must have a browser field")



