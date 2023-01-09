use blockchainlib::{now, Block, Hashable};

fn main() {
    println!("Hello, blockchain!");

    let mut block = Block::new(0, now(), vec![0, 32], 0, "Genesis block".to_owned());
    println!("{:?}", &block);

    // let hash = block.hash();

    // println!("{:?}", hash);

    // block.hash = hash;

    println!("{:?}", &block);
}
