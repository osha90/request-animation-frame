import { performance } from 'perf_hooks'

import MinHeap from './min-heap'

const minHeap = new MinHeap<number, requestAnimationCallback>()
let counter = 0

export default function requestAnimationFrame(fn: requestAnimationCallback, delay = 0) {
  if (counter === 0)
    process.nextTick(executeRequestAnimationFrame)

  minHeap.insert({ key: counter + delay, value: fn })
}

function executeRequestAnimationFrame() {
  incrementCounter()
  let min = minHeap.peak()
  const domHighResTimeStamp = performance.now()
  while (min !== null && min.key < counter) {
    min.value(domHighResTimeStamp)
    minHeap.deleteMin()
    min = minHeap.peak()
  }

  minHeap.isEmpty() ? resetCounter() : process.nextTick(executeRequestAnimationFrame)
}

function resetCounter() {
  counter = 0
}

function incrementCounter() {
  counter = counter + 1
}

type requestAnimationCallback = (DOMHighResTimeStamp: number) => void
