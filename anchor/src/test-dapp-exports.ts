// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import TestDappIDL from '../target/idl/test_dapp.json';
import GovernanceIDL from '../target/idl/governance.json';
import StakingIDL from '../target/idl/staking.json';
import type { DAOProgram } from '../target/types/test_dapp';
import type { GovernanceProgram } from '../target/types/governanceProgram';
import type { StakingProgram } from '../target/types/stakingProgram';

// Re-export the generated IDL and type
export { DAOProgram, TestDappIDL };

// The programId is imported from the program IDL.
export const TEST_DAPP_PROGRAM_ID = new PublicKey(TestDappIDL.address);

// This is a helper function to get the TestDapp Anchor program.
export function getTestDappProgram(provider: AnchorProvider) {
  return new Program(TestDappIDL as DAOProgram, provider);
}

export function getGovernanceProgram(provider: AnchorProvider) {
  return new Program(GovernanceIDL as GovernanceProgram, provider);
}

export function getStakingProgram(provider: AnchorProvider) {
  return new Program(StakingIDL as StakingProgram, provider);
}

// This is a helper function to get the program ID for the TestDapp program depending on the cluster.
export function getTestDappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return TEST_DAPP_PROGRAM_ID;
  }
}
