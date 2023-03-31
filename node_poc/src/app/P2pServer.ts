import WebSocket from 'ws';
import { Block } from 'blockchain/Block';
import { Wallet } from 'blockchain/wallet/Wallet';
import { Blockchain } from 'blockchain/Blockchain';
import { Transaction } from 'blockchain/wallet/Transaction';
import { TransactionPool } from 'blockchain/wallet/TransactionPool';

//declare the peer to peer server port
const P2P_PORT = Number(process.env.P2P_PORT) || 5001;

//list of address to connect to
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

enum MesageType {
  CHAIN = 'CHAIN',
  TRANSACTION = 'TRANSACTION',
}

type ChainMsgDataType = {
  type: MesageType.CHAIN;
  chain: Block[];
};
type TransactionMsgDataType = {
  type: MesageType.TRANSACTION;
  transaction: Transaction;
};

type MsgHandlerDataType = ChainMsgDataType | TransactionMsgDataType;

export class P2pServer {
  constructor(
    private blockchain: Blockchain,
    private transactionPool: TransactionPool,
    private wallet: Wallet,
    private sockets: WebSocket[] = []
  ) {}

  // create a new p2p server and connections

  listen() {
    // create the p2p server with port as argument
    const server = new WebSocket.Server({ port: P2P_PORT });

    // event listener and a callback function for any new connection
    // on any new connection the current instance will send the current chain
    // to the newly connected peer
    server.on('connection', (socket) => this.connectSocket(socket));

    // to connect to the peers that we have specified
    this.connectToPeers();

    console.log(`Listening for peer to peer connection on port : ${P2P_PORT}`);
  }

  // after making connection to a socket
  connectSocket(socket: WebSocket) {
    // push the socket too the socket array
    this.sockets.push(socket);
    console.log('Socket connected');
    // register a message event listener to the socket
    this.messageHandler(socket);
    this.sendChain(socket);
  }

  connectToPeers() {
    //connect to each peer
    peers.forEach((peer) => {
      // create a socket for each peer
      const socket = new WebSocket(peer);

      // open event listner is emitted when a connection is established
      // saving the socket in the array
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  messageHandler(socket: WebSocket) {
    //on recieving a message execute a callback function
    socket.on('message', (message) => {
      const data: MsgHandlerDataType = JSON.parse(message.toString());
      console.log('Recieved data from peer:', data);

      switch (data.type) {
        case MesageType.CHAIN:
          this.blockchain.replaceChain(data.chain);
          break;

        case MesageType.TRANSACTION:
          if (!this.transactionPool.transactionExists(data.transaction)) {
            // check if pool is filled
            let thresholdReached = this.transactionPool.addTransaction(
              data.transaction
            );
            this.broadcastTransaction(data.transaction);
            if (thresholdReached) {
              if (this.blockchain.getLeader() === this.wallet.getPublicKey()) {
                console.log('I am the leader');
              }
            }
            this.broadcastTransaction(data.transaction);
          }
          break;
      }
    });
  }

  /**
   * helper function to send the chain instance
   */
  sendChain(socket: WebSocket) {
    socket.send(
      JSON.stringify({
        type: MesageType.CHAIN,
        chain: this.blockchain.chain,
      })
    );
  }

  /**
   * utility function to sync the chain
   * whenever a new block is added to
   * the blockchain
   */
  syncChain() {
    this.sockets.forEach((socket) => {
      this.sendChain(socket);
    });
  }

  broadcastTransaction(transaction: Transaction) {
    this.sockets.forEach((socket) => {
      this.sendTransaction(socket, transaction);
    });
  }

  sendTransaction(socket: WebSocket, transaction: Transaction) {
    socket.send(
      JSON.stringify({
        type: MesageType.TRANSACTION,
        transaction: transaction,
      })
    );
  }
}
