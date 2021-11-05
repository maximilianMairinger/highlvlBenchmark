import benchmarkSuite from "../../app/src/highlvlBenchmark"

import fastList from "fast-list"
import yallist from "yallist"

const itr = 10000000

const benchmark = benchmarkSuite(itr)

console.log("shift3")

// const random = []
// for (let i = 0; i < itr; i++) {
//   random.push(Math.round(Math.random() * (itr - i)))
// }





benchmark(
  function Array() {
    const list = []
    
    return (j) => {
      if (j % 2) list.push(j)
      else list.unshift(j)
    }
  },
  function Yallist() {
    const list = yallist.create()

    return (j) => {
      if (j % 2) list.push(j)
      else list.unshift(j)
    }
  },
  function FastList() {

    const list = new fastList()

    return (j) => {
      if (j % 2) list.push(j)
      else list.unshift(j)
    }
  }
)

