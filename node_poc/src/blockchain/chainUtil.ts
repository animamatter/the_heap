import { ntru } from 'ntru';
import { eddsa } from 'elliptic';
import { v1 as uuidV1 } from 'uuid';
import SHA256 from 'crypto-js/sha256';

const EDDSA = new eddsa('ed25519');

const genKeyPair = function (secret: string) {
  // return ntru.keyPair();
  return EDDSA.keyFromSecret(secret);
};
const id = () => uuidV1();

const hash = <T>(data: T) => SHA256(JSON.stringify(data)).toString();

const verifySignature = (
  publicKey: eddsa.Bytes | eddsa.KeyPair | eddsa.Point,
  signature: eddsa.Bytes | eddsa.Signature,
  dataHash: eddsa.Bytes
) => EDDSA.keyFromPublic(publicKey).verify(dataHash, signature);

export const ChainUtil = {
  genKeyPair,
  id,
  hash,
  verifySignature,
};
