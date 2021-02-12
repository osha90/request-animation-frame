import { expect } from 'chai'

import requestAnimationFrame from '../index'

async function sleep(delay: number) {
  return new Promise(resolve => {
    setTimeout(() => resolve(0), delay)
  })
}

describe('./index', () => {
  describe('requestAnimationFrame', () => {
    it('callbacks with the same delay get the same timestamp', async () => {
      let domHighResTimeStamp1 = null
      let domHighResTimeStamp2 = null

      requestAnimationFrame(x => { domHighResTimeStamp1 = x })
      requestAnimationFrame(x => { domHighResTimeStamp2 = x })
      await sleep(1)

      expect(domHighResTimeStamp1).not.to.equal(null)
      expect(domHighResTimeStamp1).to.equal(domHighResTimeStamp2)
    })

    it('callbacks with smaller delay get called first', async () => {
      let domHighResTimeStamp1 = 0
      let domHighResTimeStamp2 = 0

      requestAnimationFrame(x => { domHighResTimeStamp1 = x })
      requestAnimationFrame(x => { domHighResTimeStamp2 = x }, 100)
      await sleep(1)

      expect(domHighResTimeStamp1).to.be.lessThan(domHighResTimeStamp2)
    })

    it('callbacks should create request additional animation frames and obey the delay', async () => {
      let domHighResTimeStamp1 = 0
      let domHighResTimeStamp2 = 0
      let domHighResTimeStamp3 = 0

      requestAnimationFrame(x => { domHighResTimeStamp1 = x })
      requestAnimationFrame(x => { domHighResTimeStamp2 = x }, 100)
      requestAnimationFrame(_ => {
        requestAnimationFrame(x => {
          domHighResTimeStamp3 = x
        })
      })
      await sleep(1)

      expect(domHighResTimeStamp1).to.be.lessThan(domHighResTimeStamp2)
      expect(domHighResTimeStamp3).to.be.lessThan(domHighResTimeStamp2)
    })
  })
})
