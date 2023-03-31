import { ChainUtil } from '../chainUtil';
import { TRANSACTION_FEE } from '../conf';
import { Wallet } from '../wallet/Wallet';

export type TransactionTypeType = null;
export type TransactionOutputType = {
  to: string;
  amount: number;
  fee: number;
} | null;

type TransactionInputType = {
  timestamp: number;
  from: string;
  signature: string; // eddsa.Signature;
} | null;

export class Transaction {
  id: string;
  type: TransactionTypeType;
  input: TransactionInputType;
  output: TransactionOutputType;

  constructor() {
    this.id = ChainUtil.id();
    this.type = null;
    this.input = null;
    this.output = null;
  }

  static newTransaction(
    senderWallet: Wallet,
    to: string,
    amount: number,
    type: TransactionTypeType
  ) {
    if (amount + TRANSACTION_FEE > senderWallet.balance) {
      console.log('Not enough balance');
      return;
    }

    return Transaction.generateTransaction(senderWallet, to, amount, type);
  }

  static generateTransaction(
    senderWallet: Wallet,
    to: string,
    amount: number,
    type: TransactionTypeType
  ) {
    const transaction = new this();
    transaction.type = type;
    transaction.output = {
      to,
      amount: amount - TRANSACTION_FEE,
      fee: TRANSACTION_FEE,
    };
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static signTransaction(transaction: Transaction, senderWallet: Wallet) {
    transaction.input = {
      timestamp: Date.now(),
      from: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.output)).toHex(),
    };
  }

  static verifyTransaction(transaction: Transaction) {
    if (transaction.input) {
      return ChainUtil.verifySignature(
        transaction.input.from,
        transaction.input.signature,
        ChainUtil.hash(transaction.output)
      );
    }
    throw new Error(
      `Transaction::verifyTransaction() illegal state. Transaction ID ${
        transaction.id
      } does not have inpput: ${JSON.stringify(transaction.input)}`
    );
  }
}
