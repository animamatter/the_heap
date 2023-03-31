import { eddsa } from 'elliptic';
import { INITIAL_BALANCE } from 'config';

import { ChainUtil } from '../chainUtil';
import { Blockchain } from '../Blockchain';

import { TransactionPool } from './TransactionPool';
import { Transaction, TransactionTypeType } from './Transaction';

export class Wallet {
  balance: number;
  keyPair: eddsa.KeyPair;
  publicKey: string;

  constructor(secret: string) {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair(secret);
    this.publicKey = this.keyPair.getPublic('hex');
    console.log(this.keyPair.getPublic('hex'), this.keyPair.getSecret('hex'));
  }

  sign(dataHash: string) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(
    to: string,
    amount: number,
    type: TransactionTypeType,
    blockchain: Blockchain,
    transactionPool: TransactionPool
  ) {
    let transaction = Transaction.newTransaction(this, to, amount, type);
    if (transaction) {
      transactionPool.addTransaction(transaction);
      return transaction;
    }
    console.log('Wallet::createTransaction() Transaction not created');
  }

  getBalance(blockchain: Blockchain) {
    return blockchain.getBalance(this.publicKey);
  }

  getPublicKey() {
    return this.publicKey;
  }

  toString() {
    return `Wallet - 
        publicKey: ${this.publicKey.toString()}
        balance  : ${this.balance}`;
  }
}
