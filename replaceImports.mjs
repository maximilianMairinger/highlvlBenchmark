#!/usr/bin/env node

import { program } from "commander"
import readDir from "recursive-readdir"
import fss, { promises as fs } from "node:fs"

/** @type {{[moduleName: string]: string}} */
const moduleIndex = {
  "cli-progress": ""
}

const moduleNameIndex = {
  // "os": "node:os"
}






program
  .name("replaceImports")
  .argument("<dir>", "Directory to search for imports")
  .action(async (dir) => {
    const files = fss.statSync(dir).isDirectory() ? await readDir(dir) : [dir]
    const proms = []
    
    for (const filePath of files) {
      proms.push(
        (async () => {
          let matches = []
          const fileContent = await fs.readFile(filePath, "utf-8")
          const newFileContent = fileContent.replace(/(?<!(\/\/|\/\*)\s*)(import\s+.*\s+from\s+["'](.*)["'])\s*;?/g, (match, g1, g2, moduleName) => {
            if (moduleName in moduleIndex) {
              matches.push(moduleName)
              return moduleIndex[moduleName]
            }
            if (moduleName in moduleNameIndex) {
              matches.push(moduleName)
              return match.substring(0, match.length - (moduleName.length + 2)) + `"${moduleNameIndex[moduleName]}"`
            }
            return match
          })

          if (matches.length > 0) {
            console.log("replacing imports for", matches, "in", filePath)
            await fs.writeFile(filePath, newFileContent)
          }
        })()
      )
    }
  })

.parse(process.argv)