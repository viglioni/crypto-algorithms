import {
  compose,
  equals,
  gt,
  gte,
  ifElse,
  lt,
  map,
  nth,
  or,
  range,
  reduce,
  repeat,
  sum,
} from 'ramda'
import { Bit, emptyArr, zeroArr } from './helpers'
import {
  uniform,
  genErrors,
  rndArr,
  rndChooseSubset,
  RndDist,
} from './prob'
import { round, ln, modulus, vectorSum, dotProduct } from './ring'

export type PrivateKey = number[]

export type PublicKey = {
  a: number[][]
  b: number[]
}

export type EncryptedBit = {
  a: number[]
  b: number
}

type Mod = (n: number) => number

export const getM = (n: number, p: number) =>
  round((1 + uniform() / 4) * (n + 1) * ln(p))

const _privateKey = (p: number, n: number): (() => PrivateKey) =>
  rndArr(p, n)

export const _publicKey = (
  p: number,
  n: number,
  m: number,
  qui: RndDist,
) => (priK: PrivateKey): PublicKey => {
  const vectors = map(rndArr(p, n), emptyArr(m))
  const errors = genErrors(p, m, qui)
  const b = compose(
    vectorSum(p)(errors),
    map(dotProduct(p)(priK)),
  )(vectors)
  return { a: vectors, b }
}

const _encryptBit = (p: number, m: number, modP: Mod) => (
  pubK: PublicKey,
) => (bit: Bit): EncryptedBit => {
  const S = rndChooseSubset(range(0, m))
  const filteredVectors = map(
    (idx) => nth(idx, pubK.a),
    S,
  ) as number[][]
  const filteredB = map((idx) => nth(idx, pubK.b), S) as number[]
  const vector = reduce(
    (acc, val) => vectorSum(p)(acc)(val),
    zeroArr(m),
    filteredVectors,
  )
  const b = modP(sum(filteredB))
  const addToB = ifElse(
    equals(0),
    () => 0,
    () => round(p / 2),
  )(bit)
  return { a: vector, b: b + addToB }
}

const _decryptBit = (p: number, modP: Mod) => (priK: PrivateKey) => (
  encrypted: EncryptedBit,
): Bit => {
  const { a, b } = encrypted
  const result = modP(b - dotProduct(p)(a)(priK))
  return ifElse(
    gt(round(p / 2)),
    () => 0,
    () => 1,
  )(result)
}

export const regev = (n: number, p: number, qui: RndDist) => {
  const m = getM(n, p)
  const modP = modulus(p)
  const privateKey = _privateKey(p, n)
  const publicKey = _publicKey(p, n, m, qui)

  const keys = () => {
    const priK = privateKey()
    const pubK = publicKey(priK)
    return { publicKey: pubK, privateKey: priK }
  }

  const encryptBit = _encryptBit(p, m, modP)
  const decryptBit = _decryptBit(p, modP)

  return { privateKey, publicKey, keys, encryptBit, decryptBit }
}
