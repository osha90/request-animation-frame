import { expect } from 'chai'
import { orderBy, random, times } from 'lodash'

import MinHeap from '../min-heap'

describe('./min-heap', () => {
  describe('MinHeap', () => {
    let minHeap: MinHeap<number, number>
    const randomNumbers = times(100, index => ({ key: random(0, 100), value: index }))
    const sortedNumbers = orderBy(randomNumbers, ['key', 'value'])

    beforeEach(() => {
      minHeap = new MinHeap()
      randomNumbers.map(n => minHeap.insert(n))
    })

    it('maintains the min-heap invariant', async () => {
      minHeap.deleteMin()
      minHeap.deleteMin()

      const array = minHeap.debug()

      array.forEach((min, index) => {
        const leftChildIndex = (2 * index) + 1
        const rightChildIndex = (2 * index) + 2

        if (array[leftChildIndex] !== undefined)
          expect(min.key).not.to.be.greaterThan(array[leftChildIndex].key)

        if (array[rightChildIndex] !== undefined)
          expect(min.key).not.to.be.greaterThan(array[rightChildIndex].key)
      })
    })

    describe('isEmpty', () => {
      it('returns true when min-heap is empty', async () => {
        minHeap.clear()

        const actual = minHeap.isEmpty()

        expect(actual).to.equal(true)
      })

      it('returns false when min-heap contains at least one element', async () => {
        const actual = minHeap.isEmpty()

        expect(actual).to.equal(false)
      })
    })

    describe('size', () => {
      it('returns the size of the min-heap', async () => {
        const actual = minHeap.size()

        expect(actual).to.equal(randomNumbers.length)
      })
    })

    describe('peak', () => {
      it('returns the minimum element', () => {
        const expected = sortedNumbers[0]

        const actual = minHeap.peak()

        expect(actual).to.deep.equal(expected)
      })

      it('returns null when the min-heap is empty', async () => {
        minHeap.clear()

        const actual = minHeap.peak()

        expect(actual).to.equal(null)
      })
    })

    describe('deleteMin', () => {
      it('returns the min element', async () => {
        const actual = Array(100).fill(0).map(x => minHeap.deleteMin())

        expect(actual).to.deep.equal(sortedNumbers)
      })

      it('decreases the size of the min-heap', async () => {
        minHeap.deleteMin()

        const actual = minHeap.size()

        expect(actual).to.deep.equal(99)
      })
    })

    describe('insert', () => {
      it('adds a node to the min-heap', async () => {
        const expected = sortedNumbers[0]

        const actual = minHeap.peak()

        expect(actual).to.deep.equal(expected)
      })

      it('increases the size of the min-heap', async () => {
        minHeap.insert({ key: -1, value: 0 })

        const actual = minHeap.size()

        expect(actual).to.equal(101)
      })
    })

    describe('clear', () => {
      it('empties the min-heap ', async () => {
        minHeap.clear()

        const actual = minHeap.size()

        expect(actual).to.equal(0)
      })
    })
  })
})
