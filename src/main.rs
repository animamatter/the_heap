use blockchainlib::{now, Block, Hashable};

fn main() {
    println!("Hello, blockchain!");

    let difficulty = 0x0000ffffffffffffffffffffffffffff;

    let mut genesis_block = Block::new(
        0,
        now(),
        vec![0, 32],
        0,
        "Genesis block".to_owned(),
        difficulty,
    );

    genesis_block.hash = genesis_block.hash();

    println!("{:?}", &genesis_block);

    genesis_block.mine();

    println!("{:?}", &genesis_block);
}
