import { TRANSACTION_THRESHOLD } from 'config';

import { Transaction } from './Transaction';

export class TransactionPool {
  constructor(public transactions: Transaction[] = []) {}

  addTransaction(transaction: Transaction) {
    this.transactions.push(transaction);
    if (this.transactions.length >= TRANSACTION_THRESHOLD) {
      return true;
    }
    return false;
  }

  validTransactions() {
    return this.transactions.filter((transaction) => {
      if (!Transaction.verifyTransaction(transaction)) {
        console.log(
          `Invalid signature from transaction ID ${
            transaction.id
          } ${JSON.stringify(transaction)}`
        );
        return;
      }
      return transaction;
    });
  }

  // transaction-pool.js
  transactionExists(transaction: Transaction) {
    let exists = this.transactions.find((t) => t.id === transaction.id);
    return exists;
  }
}
