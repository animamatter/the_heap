import { Transaction } from './Transaction';
import { AddressType, BalanceType } from './types';

export class Account {
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

  transfer(from: AddressType, to: AddressType, amount: number) {
    this.initialize(from);
    this.initialize(to);
    this.increment(to, amount);
    this.decrement(from, amount);
  }

  increment(to: AddressType, amount: number) {
    this.balance[to] += amount;
  }

  decrement(from: AddressType, amount: number) {
    this.balance[from] -= amount;
  }

  getBalance(address: AddressType) {
    this.initialize(address);
    return this.balance[address];
  }

  update(transaction: Transaction) {
    if (transaction.output && transaction.input) {
      let amount = transaction.output.amount;
      let from = transaction.input.from;
      let to = transaction.output.to;
      this.transfer(from, to, amount);
      return;
    }
    console.error(
      'IllegalStateException: Account::update transaction.output or transaction.input null'
    );
  }
}
