import {
  append,
  compose,
  equals,
  ifElse,
  lt,
  map,
  multiply,
  reduce,
  repeat,
  sum,
} from 'ramda'
import { exponential } from 'random'
import { floor, modulus, round } from './ring'
import { emptyArr } from './helpers'

export type RndDist = () => number

export const { random: uniform } = Math

export const rndUni = (mod: number): RndDist =>
  compose(round, multiply(mod - 1), uniform)

export const rndExp = (lambda = 0.01) => (mod: number): RndDist =>
  compose(modulus(mod), floor, exponential(lambda))

export const rndBool = () => equals(1, rndUni(2)())

export const rndChooseSubset = reduce<number, number[]>(
  (acc, val) =>
    ifElse(
      rndBool,
      () => append(val, acc),
      () => acc,
    )(null),
  [],
)

export const rndArr = (
  mod: number,
  len: number,
  rndFunc: RndDist = rndUni(mod),
) => () => map(rndFunc, emptyArr(len))

export const genErrors = (
  mod: number,
  len: number,
  qui: RndDist,
): number[] => {
  const errors = rndArr(mod, len, qui)()
  if (lt(sum(errors), floor(mod / 2))) return errors
  else return genErrors(mod, len, qui)
}
