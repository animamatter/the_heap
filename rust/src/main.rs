use blockchainlib::{now, Block, Blockchain};

fn main() {
    println!("Hello, blockchain!");

    let difficulty = 0x000ffffffffffffffffffffffffffff;
    let gen_payload = "Genesis block".to_owned();
    let gen_hash = vec![0, 32];
    let mut genesis_block = Block::new(0, now(), gen_hash, 0, gen_payload, difficulty);
    genesis_block.mine();
    println!("Mined genesis block: {:?}", &genesis_block);

    let mut last_hash = genesis_block.hash.clone();

    let mut blockchain = Blockchain {
        blocks: vec![genesis_block],
    };

    println!("Verify: {} ", &blockchain.verify());

    for i in 1..=10 {
        let payload = "Another block".to_owned();
        let mut block = Block::new(i, now(), last_hash, 0, payload, difficulty);
        block.mine();
        println!("Mined block: {:?}", &block);

        last_hash = block.hash.clone();
        blockchain.blocks.push(block);

        println!("Verify: {} ", &blockchain.verify());
    }

    // blockchain.blocks[3].index = 4;
    // blockchain.blocks[3].hash[8] += 1;
    // blockchain.blocks[3].payload = "nope".to_owned();
    // blockchain.blocks[3].prev_block_hash[16] = 8;
    // blockchain.blocks[3].difficulty = 0x00fffffffffffffffffffffffffffff;
    // blockchain.blocks[3].difficulty = 0x0000fffffffffffffffffffffffffff;
    println!("Verify: {} ", &blockchain.verify());
}
