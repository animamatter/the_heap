import { ServerApp } from './ServerApp';
import { P2pServer } from './P2pServer';

import { Wallet } from 'blockchain/wallet/Wallet';
import { Blockchain } from 'blockchain/Blockchain';
import { TransactionPool } from 'blockchain/wallet/TransactionPool';

import { HomeCtrl } from './controllers/HomeCtrl';
import { BlockchainCtrl } from './controllers/BlockchainCtrl';

const HTTP_PORT = Number(process.env.HTTP_PORT) || 3001;

const blockchain = new Blockchain();

// Date.now() is used create a random string for secret
const wallet = new Wallet(Date.now().toString());
// create a new transaction pool which will be later
// decentralized and synchronized using the peer to peer server
const transactionPool = new TransactionPool();

const p2pserver = new P2pServer(blockchain, transactionPool, wallet);

const bcObj = {
  blockchain,
  transactionPool,
  // create a new wallet
  wallet,
  p2pserver, // a bit cyclic but needed...
};

new ServerApp()
  .withController(new HomeCtrl())
  .withController(new BlockchainCtrl(bcObj))
  .build(HTTP_PORT);

p2pserver.listen();
