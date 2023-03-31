import { Transaction } from '../wallet/Transaction';
import { AddressType, BalanceType } from '../wallet/types';

export class Stake {
  constructor(
    private addresses: AddressType[] = [],
    private balance: BalanceType = {}
  ) {}

  initialize(address: AddressType) {
    if (this.balance[address] == undefined) {
      this.balance[address] = 0;
      this.addresses.push(address);
    }
  }

  addStake(from: AddressType, amount: number) {
    this.initialize(from);
    this.balance[from] += amount;
  }

  getStake(address: AddressType) {
    this.initialize(address);
    return this.balance[address];
  }

  // The getMax function returns the node’s address that has the maximum staked coins.a
  getMax(addresses: AddressType[]) {
    let balance = -1;
    let leader = undefined;

    addresses.forEach((address) => {
      if (this.balance[address] > balance) {
        leader = address;
      }
    });
    return leader;
  }

  update(transaction: Transaction) {
    if (transaction.output && transaction.input) {
      let amount = transaction.output.amount;
      let from = transaction.input.from;
      this.addStake(from, amount);
      return;
    }
    console.error(
      'IllegalStateException: Stake::update transaction.output or transaction.input null'
    );
  }
}
