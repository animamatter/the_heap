import { Stake } from './stake/Stake';
import { Wallet } from './wallet/Wallet';
import { Account } from './wallet/Account';
import { Block, BlockDataType } from './Block';
import { Validators } from './stake/Validators';
import { Transaction } from './wallet/Transaction';

const SECRET = 'I am the first leader';

export class Blockchain {
  constructor(
    public chain: Block[] = [Block.genesis()],
    private account: Account = new Account(),
    private stakes: Stake = new Stake(),
    private validators: Validators = new Validators()
  ) {}

  addBlock(data: BlockDataType) {
    const block = Block.createBlock(
      this.chain[this.chain.length - 1],
      data,
      new Wallet(SECRET)
    );
    this.chain.push(block);

    return block;
  }

  isValidChain(chain: Block[]) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];
      if (
        block.lastHash !== lastBlock.hash ||
        block.hash !== Block.blockHash(block)
      )
        return false;
    }

    return true;
  }

  replaceChain(newChain: Block[]) {
    if (newChain.length <= this.chain.length) {
      console.log('Recieved chain is not longer than the current chain');
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log('Recieved chain is invalid');
      return;
    }

    console.log('Replacing the current chain with new chain');
    this.chain = newChain;
  }

  getBalance(publicKey: string) {
    return this.account.getBalance(publicKey);
  }

  getLeader() {
    return this.stakes.getMax(this.validators.list);
  }

  createBlock(transactions: Transaction, wallet: Wallet) {
    const block = Block.createBlock(
      this.chain[this.chain.length - 1],
      transactions,
      wallet
    );
    return block;
  }
}
