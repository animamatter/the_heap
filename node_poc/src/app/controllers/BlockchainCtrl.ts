import { Router, Request, Response } from 'express';

import { Wallet } from 'blockchain/wallet/Wallet';
import { Blockchain } from 'blockchain/Blockchain';
import { TransactionPool } from 'blockchain/wallet/TransactionPool';

import { P2pServer } from '../P2pServer';
import { BaseCtrl } from './BaseCtrl';

type BlockchainCtrlOpts = {
  router?: Router;
  blockchain: Blockchain;
  transactionPool: TransactionPool;
  wallet: Wallet;
  p2pserver: P2pServer;
};

export class BlockchainCtrl extends BaseCtrl {
  p2pserver: P2pServer;
  blockchain: Blockchain;
  transactionPool: TransactionPool;
  wallet: Wallet;

  constructor({
    router,
    blockchain,
    transactionPool,
    wallet,
    p2pserver,
  }: BlockchainCtrlOpts) {
    super(router);

    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pserver = p2pserver;

    // Routes
    this.router.get('/blocks', this.blocksRoute);
    this.router.post('/mine', this.mineRoute);
    this.router.get('/transactions', this.transactionsRoute);
    this.router.post('/transact', this.transactRoutePost);
  }

  blocksRoute = (req: Request, res: Response) =>
    res.json(this.blockchain.chain);

  mineRoute = (req: Request, res: Response) => {
    const block = this.blockchain.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);

    this.p2pserver.syncChain();
    res.redirect('/blocks');
  };

  transactionsRoute = (req: Request, res: Response) => {
    console.log(this.transactionPool.transactions);
    res.json(this.transactionPool.transactions);
  };

  transactRoutePost = (req: Request, res: Response) => {
    const { to, amount, type } = req.body;
    const transaction = this.wallet.createTransaction(
      to,
      amount,
      type,
      this.blockchain,
      this.transactionPool
    );
    if (transaction) {
      this.p2pserver.broadcastTransaction(transaction);
    }
    res.redirect('/transactions');
  };
}
