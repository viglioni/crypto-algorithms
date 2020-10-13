import { includes, forEach, range, all, length, sum } from 'ramda'
import { genErrors, rndBool, rndChooseSubset, rndUni } from '../prob'
import { getM } from '../regev'
import { modulus } from '../ring'

describe('Random distributions', () => {
  it('expect uniform to be in range', () => {
    forEach((_) => {
      const randomNumber = rndUni(10)()
      expect(includes(randomNumber, range(0, 10))).toBe(true)
    }, range(0, 1000))
  })
})

describe('Random subset of a set', () => {
  const mainSet = range(0, 10)
  it('Should generate a subset of mainSet', () => {
    forEach((_) => {
      const subSet = rndChooseSubset(mainSet)
      expect(all((el) => includes(el, mainSet))(subSet)).toBe(true)
    }, range(0, 1000))
  })
})

describe('Random boolean', () => {
  it('should generate a boolean', () => {
    forEach((_) => {
      const value = rndBool()
      expect(includes(value, [true, false])).toBe(true)
    }, range(0, 1000))
  })
})

describe('Generate error vector', () => {
  const n = 80 // security level
  const p = 1621 // prime between n^2 and 2*n^2
  const m = getM(n, p)
  it('should generate error vectos such that its sum is smaller than p/4', () => {
    forEach(() => {
      const errors = genErrors(p, m, rndUni(2))
      expect(length(errors)).toBe(m)
      expect(sum(errors)).toBeLessThan(p / 2)
    }, range(0, 1000))
  })
})
