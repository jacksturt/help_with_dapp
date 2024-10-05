#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("af8eLLpViTTUY7K72b9j12MzaFHHDkyDz42i4VQmMkZ");

#[program]
pub mod test_dapp {
    use super::*;

  pub fn close(_ctx: Context<CloseTestDapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.test_dapp.count = ctx.accounts.test_dapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.test_dapp.count = ctx.accounts.test_dapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeTestDapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.test_dapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeTestDapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + TestDapp::INIT_SPACE,
  payer = payer
  )]
  pub test_dapp: Account<'info, TestDapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseTestDapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub test_dapp: Account<'info, TestDapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub test_dapp: Account<'info, TestDapp>,
}

#[account]
#[derive(InitSpace)]
pub struct TestDapp {
  count: u8,
}
