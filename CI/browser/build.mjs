import { rollup } from "rollup"
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export default async function go() {
  const bundle = rollup({
    input: path.join(__dirname, 'testSrc', 'test.ts'),
    plugins: [
      typescript({tsconfig: "./tsconfig.dev.json", noEmitOnError: false, sourceMap: true }), 
      resolve({browser: true}),
      commonJS({
        include: 'node_modules/**'
      }),
      json()
    ]
  });
  (await bundle).write({
    file: path.join(__dirname, 'testDist', 'test.js'),
    format: 'cjs',
    sourcemap: true
  })
  
}