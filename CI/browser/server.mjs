import express from 'express';
import detectPort from 'detect-port';
import waitOn from 'wait-on';
import open from "open"
import path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default function go() {
  const app = express();

  app.use(express.static(path.join(__dirname, 'testDist')));

  const port = waitOn({
    resources: ["repl/dist/crossPlatformSpecs-repl.js"]
  }).then(() => detectPort(3500))

  const server = port.then((port) => {
    return app.listen(port, () => {
      // console.log("")
      // console.log(`Listening at http://127.0.0.1:${port}`)
      // open(`http://127.0.0.1:${port}`)
    })
  })



  return { port, server, app }
}

