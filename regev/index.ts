import { exponential } from 'random'
import { rndExp, rndUni } from './prob'
import { regev } from './regev'

const r = regev(5, 37, rndUni(2))
const keys = r.keys()
const enc0 = r.encryptBit(keys.publicKey)(0)
const enc1 = r.encryptBit(keys.publicKey)(1)
console.log(
  '\n',
   keys.publicKey, '\n',
  'dec bit 0',
  '\n',
  r.decryptBit(keys.privateKey)(enc0),
  '\n',
  'dec bit 1\n',
  r.decryptBit(keys.privateKey)(enc1),
  '\n',
)
