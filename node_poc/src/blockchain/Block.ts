import { ChainUtil } from './chainUtil';
import { Wallet } from './wallet/Wallet';

type TimeStampType = string | number;
type HashType = string;
export type BlockDataType = {};

export class Block {
  constructor(
    private timestamp: TimeStampType,
    public lastHash: HashType,
    public hash: HashType,
    private data: BlockDataType,
    private validator?: string,
    private signature?: string
  ) {}

  static genesis() {
    return new this(`genesis time`, '----', 'genesis-hash', []);
  }

  static hash(
    timestamp: TimeStampType,
    lastHash: HashType,
    data: BlockDataType
  ) {
    return ChainUtil.hash(`${timestamp}${lastHash}${data}`).toString();
  }

  static createBlock(lastBlock: Block, data: BlockDataType, wallet: Wallet) {
    let hash;
    let timestamp = Date.now();
    const lastHash = lastBlock.hash;
    hash = Block.hash(timestamp, lastHash, data);

    // get the validators public key
    let validator = wallet.getPublicKey();

    // Sign the block
    let signature = Block.signBlockHash(hash, wallet);
    return new this(
      timestamp,
      lastHash,
      hash,
      data,
      validator,
      signature.toHex()
    );
  }

  static blockHash(block: Block) {
    //destructuring
    const { timestamp, lastHash, data } = block;
    return Block.hash(timestamp, lastHash, data);
  }

  static signBlockHash(hash: string, wallet: Wallet) {
    return wallet.sign(hash);
  }

  toString() {
    return `Block - 
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash}
        Hash      : ${this.hash}
        Data      : ${this.data}
        Validator : ${this.validator}
        Signature : ${this.signature}`;
  }
}
