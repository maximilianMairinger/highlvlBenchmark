import timoi from "timoi"
import delay from "delay"
import getSpecs from "cross-platform-specs"
import { deepEqual } from "fast-equals"
import { SingleBar, MultiBar, Presets } from "cli-progress"
import is from "platform-detect"




const orderedSpeedAdjectiveFac = [2, 1.35, 1]
const speedAdjectives = {
  1: "slightly",
  1.35: "considerably",
  2: "much"
}


export function benchmarkSuite(iterations = 1000000, { warmupIterations, cliProgressBar, compareResults, printSpecs } = { warmupIterations: Math.ceil(iterations / 1000), cliProgressBar: is.terminal, compareResults: true, printSpecs: true }) {
  if (printSpecs) console.log(getSpecs())



  return async function benchmark(...fs: (() => ((i: number) => void))[]) {

    let multiProgressBar: MultiBar

    if (cliProgressBar) {
      multiProgressBar = new MultiBar({
        clearOnComplete: false,
        hideCursor: true,
        format: "{name} | {bar} | {percentage}% | {eta_formatted}"
      }, Presets.legacy)
    }

    if (warmupIterations) {
      let bar: SingleBar
      if (cliProgressBar) bar = multiProgressBar.create(fs.length * warmupIterations, 0, { name: "Warmup" })
      else console.log("Warming up")

      for (let i = 0; i < fs.length; i++) {
        await delay(100)
        const call = fs[i]()
        const oldValue = call(0)
        if (cliProgressBar) bar.increment()
        for (let j = 1; j < warmupIterations; j++) {
          const newValue = call(j)
          if (compareResults && !deepEqual(oldValue, newValue)) throw new Error("Results must be always the equal.")
          if (cliProgressBar) bar.increment()
        }
      }

    }
    


    
    let bar: SingleBar
    if (cliProgressBar) bar = multiProgressBar.create(fs.length * warmupIterations, 0, { name: "Benchmark" })
    else console.log("Benchmarking")


    
    


    const timings = [] as number[]
    for (let i = 0; i < fs.length; i++) {
      await delay(100)
      const time = timoi()
      const call = fs[i]()
      const oldValue = call(0)
      if (cliProgressBar) bar.increment()
      for (let j = 1; j < iterations; j++) {
        call(j)
        if (compareResults && !deepEqual(oldValue, call(j))) throw new Error("Results must be always the equal.")
        if (cliProgressBar) bar.increment()
      }
      timings.push(time.time())
      console.log(`${fs[i].name ? fs[i].name : ((i + 1) + ". run")} took ${time.str()}`)
    }

    if (fs.length > 1) {
      console.log("------------------------")
      console.log(`Using ${fs[0].name ? fs[0].name : "first"} run as comparison base.`)
      const base = timings[0]
      for (let i = 1; i < timings.length; i++) {
        const fac = timings[i] / base
        let percent = Math.round(fac * 100)
        let fastDesc: string
        if (percent < 100) {
          let desc: string = ""
          for (const speed of orderedSpeedAdjectiveFac) {
            if (percent < 100 / (+speed)) {
              desc = speedAdjectives[speed]
              break
            }
          }
          fastDesc = desc + " faster"
        }
        else if (percent > 100) {
          let desc: string = ""
          for (const speed of orderedSpeedAdjectiveFac) {
            if (percent > 100 * (+speed)) {
              desc = speedAdjectives[speed]
              break
            }
          }
          fastDesc = desc + " slower"
        }
        else {
          let itr = 1
          const maxDigs = fac.toString().split(".")[1].length - 2
          fastDesc = "about equally fast"
          percent = Math.round(fac * Math.pow(10, itr + 2)) / Math.pow(10, itr)
          while (!percent.toString().endsWith("0") && itr < maxDigs) {
            itr++
            percent = Math.round(fac * Math.pow(10, itr + 2)) / Math.pow(10, itr)
          }
        }
        console.log(`${fs[i].name ? fs[i].name : ((i + 1) + "run")} is ${fastDesc} with ${percent}%.`)
      }
    }
  }
}


export default benchmarkSuite
