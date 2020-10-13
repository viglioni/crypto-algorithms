import { equals, forEach, zip } from 'ramda'
import { vectorSum, dotProduct } from '../ring'

const testInputs = [
  {
    v1: [1, 2, 3, 4, 5],
    v2: [6, 7, 8, 9, 10],
    mod: 10,
  },
  {
    v1: [34, 3, 0, 6, 34, 56, 3, 22],
    v2: [66, 4, 2, 66, 0, 76, 4, 0],
    mod: 97,
  },
  { v1: [0, 0, 0], v2: [5, 5, 5], mod: 5 },
]

describe('Vector sum', () => {
  const expectedResults = [
    [7, 9, 1, 3, 5],
    [3, 7, 2, 72, 34, 35, 7, 22],
    [0, 0, 0],
  ]
  it('should sum vectors correcty', () => {
    forEach(([{ v1, v2, mod }, expected]) => {
      expect(equals(vectorSum(mod)(v1)(v2), expected)).toBe(true)
    }, zip(testInputs, expectedResults))
  })
})

describe('Dot product', () => {
  const expectedResults = [0, 33, 0]

  it('should calculate dot product correcty', () => {
    forEach(([{ v1, v2, mod }, expected]) => {
      expect(equals(dotProduct(mod)(v1)(v2), expected)).toBe(true)
    }, zip(testInputs, expectedResults))
  })
})
