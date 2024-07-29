pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use instructions::*;
use state::*;

declare_id!("Dz3w8ACAL52nmQz19p8a6bdoKSJ6aEf275h7jmJ249VT");

pub const OAPP_SEED: &[u8] = b"OApp";

#[program]
pub mod endpoint {
    use super::*;

    pub fn register_oapp(mut ctx: Context<RegisterOApp>, params: RegisterOAppParams) -> Result<()> {
        RegisterOApp::apply(&mut ctx, &params)
    }
}
