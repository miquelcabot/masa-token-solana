use anchor_lang::prelude::*;

declare_id!("5Yr3fF55yWB4gQmNTBJt6AAMG2ASRqof6sZqqVR3x9Hz");

#[program]
pub mod masa_token_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
