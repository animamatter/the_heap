# PoS Blockchain

## Stuff

Test

## RUN

`yarn dev`

`HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 yarn dev`

`HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5002,ws://localhost:5001 yarn dev`

## TODO

- [ ] Find a way to share PEERS between the network without the need for a central node
- [ ] Setup a UI where we can:
  - [ ] create new data (entries for the BlockChain)
  - [ ] verify data transactions (validate)
  - [ ] see old data in the blockchain
- [ ] Improve DX
- [ ] Setup data format for transactions
  - [ ] think about future proof
  - [ ] data encryption
  - [ ] monetization possibility
  - [ ] encryption to the future
  - [ ] node types
    - [ ] nodes can include info or be anonymous
- [ ] Setup PoC:
  - [ ] UI with
    - [ ] user login/signup
    - [ ] text reporting capability
  - [ ] Reporter and researcher nodes

## Resrouces

- [TUTORIAL creator page](https://medium.com/@kashishkhullar)
  - [TUTORIAL 2](https://medium.com/coinmonks/implementing-proof-of-stake-part-2-748156d5c85e)
  - [TUTORIAL 6](https://medium.com/coinmonks/implementing-proof-of-stake-part-6-c811ce78ab0f)
  - [TUTORIAL GH page](https://github.com/kashishkhullar/pos-blockchain/blob/master/blockchain/blockchain.js)
- [Nodemon + TS](https://blog.logrocket.com/configuring-nodemon-with-typescript/)
- [Typescript cannot find name console](https://codingbeautydev.com/blog/typescript-cannot-find-name-console/)

POST QUANTUM Crypt

- [NTRU](https://www.npmjs.com/package/ntru)
