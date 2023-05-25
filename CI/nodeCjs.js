const benchmarkSuite = require("highlvl-benchmark")

const fastList = require("fast-list")
const yallist = require("yallist")
const fastLinkedList = require("fast-linked-list")

const itr = 100000
const benchmark = benchmarkSuite(itr)


benchmark(
  function Yallist() {
    const list = yallist.create()

    return (j) => {
      if (j % 2) list.push(j)
      else list.unshift(j)
    }
  },
  function FastLinkedList() {
    const list = new fastLinkedList()

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
  },
  function Array() {
    const list = []
    
    return (j) => {
      if (j % 2) list.push(j)
      else list.unshift(j)
    }
  }
)
