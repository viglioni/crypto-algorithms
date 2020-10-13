import {
  add,
  compose,
  map,
  mathMod,
  multiply,
  sum,
  zipWith,
} from 'ramda'

export const { round, log: ln, floor } = Math

export const modulus = (p: number) => (n: number) => mathMod(n, p)

export const dotProduct = (mod: number) => (v1: number[]) =>
  compose(
    modulus(mod),
    sum,
    zipWith<number, number, number>(multiply, v1),
  )

export const vectorSum = (mod: number) => (v1: number[]) =>
  compose(map(modulus(mod)), zipWith<number, number, number>(add, v1))
