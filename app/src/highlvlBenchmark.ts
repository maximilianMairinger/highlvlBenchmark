import timoi from "timoi"



const speedAdjectives = {
  0: "slightly",
  5: "considerably",
  50: "hugely"
}

export function benchmarkSuite(iterations = 1000000) {
  // Todo print cpu and mem information
  

  return function benchmark(...fs: (() => ((i: number) => void))[]) {
    console.log("Starting benchmark")

    const timings = []
    for (let i = 0; i < fs.length; i++) {
      const time = timoi()
      const call = fs[i]()
      for (let i = 0; i < iterations; i++) {
        call(i)
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
          let desc: string
          for (const speed of Object.keys(speedAdjectives).reverse()) {
            if (percent < 100 + (+speed)) {
              desc = speedAdjectives[speed]
              break
            }
          }
          fastDesc = desc + " faster"
        }
        else if (percent > 100) {
          let desc: string
          for (const speed of Object.keys(speedAdjectives).reverse()) {
            if (percent > 100 - (+speed)) {
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
