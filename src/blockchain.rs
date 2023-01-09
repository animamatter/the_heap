use super::hashable::Hashable;
use super::{check_difficulty, Block};

pub struct Blockchain {
    pub blocks: Vec<Block>,
}

impl Blockchain {
    pub fn verify(&self) -> bool {
        for (i, block) in self.blocks.iter().enumerate() {
            // Bitcoin protocol describes [19 verification processes](https://en.bitcoin.it/wiki/Protocol_rules#.22block.22_messages)

            // 1. check that indeces match (actual index === stored index)
            if block.index != i as u32 {
                println!("Index mismatch {} != {}", &block.index, &i);
                return false;
            }

            // 2. match difficulty (block's hash fits stored difficulty level)
            // TODO: insecure, but we will need a centralized difficulty management to secure it
            if &block.hash() != &block.hash || !check_difficulty(&block.hash(), block.difficulty) {
                println!("Hash/difficulty fail");
                return false;
            }

            // 4. Previous block's hash == stored prev_block_hash_value (except for genesis block)
            if i != 0 {
                // "Not genesis block"
                // 3. time always increasing
                // TODO: IRL network latency/sync demands leniency here
                let prev_block = &self.blocks[i - 1];
                if block.timestamp <= prev_block.timestamp {
                    println!("Time did not increase");
                    return false;
                }
                if block.prev_block_hash != prev_block.hash {
                    println!("Hash mismatch");
                    return false;
                }
            } else {
                // "Genesis block"
                if block.prev_block_hash != vec![0, 32] {
                    println!("Genesis block prev_block_hash invalid");
                    return false;
                }
            }
        }
        true
    }
}
