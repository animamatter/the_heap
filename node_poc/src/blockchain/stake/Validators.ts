import { Transaction } from '../wallet/Transaction';

export class Validators {
  constructor(public list: string[] = []) {}

  update(transaction: Transaction) {
    if (
      transaction.input &&
      transaction.output &&
      transaction.output.amount == 30 &&
      transaction.output.to == '0'
    ) {
      this.list.push(transaction.input.from);
      return true;
    }
    return false;
  }
}
