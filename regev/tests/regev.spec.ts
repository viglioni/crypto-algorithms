import { repeat } from 'ramda'
import { round, ln } from '../ring'
import { _publicKey } from '../regev'

const n = 8
const p = 67
const m = round((1 + 0.01) * (n + 1) * ln(p))
const qui = jest.fn()

jest.mock('../prob', () => ({
  genErrors: jest.fn(() => 0.01),
  rndArr: jest.fn(() => () => Array(8).fill(0.01)),
}))

test('Should generate correctly a public key', () => {
  const mockedPrivateKey = repeat(round(p / 2), n)
  const pubK = _publicKey(p, n, m, qui)(mockedPrivateKey)

  // const expectedRes = {
  //   a: repeat(repeat(0.01, n), m),
  //   b:
  // }
})
