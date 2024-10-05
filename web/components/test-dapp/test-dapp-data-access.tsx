'use client';
import { randomBytes } from 'crypto';

import {
  getGovernanceProgram,
  getStakingProgram,
  getTestDappProgram,
  getTestDappProgramId,
} from '@test-dapp/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';
import { BN } from '@coral-xyz/anchor';
const SYSVAR_ID = new PublicKey('Sysvar1nstructions1111111111111111111111111');

export function useTestDappProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getTestDappProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getTestDappProgram(provider);
  const governance_program = getGovernanceProgram(provider);
  const staking_program = getStakingProgram(provider);

  // const accounts = useQuery({
  //   queryKey: ['test-dapp', 'all', { cluster }],
  //   queryFn: () => program.account.testDapp.all(),
  // });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['test-dapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) => {
      const dao_seed = new BN(randomBytes(8));
      const proposal_fee_bounty = new BN(1e6);
      const proposal_fee_executable = new BN(1e6);
      const proposal_fee_vote = new BN(1e6);
      const proposal_fee_vote_multiple = new BN(1e6);
      const min_quorum = 1;
      const min_threshold = new BN(1);
      //1 Hour in slots
      const max_expiry = new BN(2160000);
      const proposal_analysis_period = new BN(0);
      const threshold_create_proposal = new BN(1);
      const sub_dao_fee = new BN(1e6);
      const n_quorum_epoch = 0;
      const mint_dao = new Keypair();
      const config = PublicKey.findProgramAddressSync(
        [Buffer.from('config'), dao_seed.toArrayLike(Buffer, 'le', 8)],
        program.programId
      )[0];
      const proposal_config = PublicKey.findProgramAddressSync(
        [Buffer.from('proposalcfg'), config.toBuffer()],
        governance_program.programId
      )[0];

      const treasury = PublicKey.findProgramAddressSync(
        [Buffer.from('treasury'), config.toBuffer()],
        program.programId
      )[0];
      const circulating_supply = new BN(100000000);
      const accounts = {
        initializer: keypair.publicKey,
        treasuryTeam: keypair.publicKey,
        treasury,
        config,
        proposalConfig: proposal_config,
        governanceProgram: governance_program.programId,
        stakingProgram: staking_program.programId,
        instructions: SYSVAR_ID,
        systemProgram: SystemProgram.programId,
      };
      console.log(Object.values(accounts).map((value) => value.toBase58()));
      return program.methods
        .initialize(
          dao_seed,
          proposal_fee_bounty,
          proposal_fee_executable,
          proposal_fee_vote,
          proposal_fee_vote_multiple,
          max_expiry,
          min_threshold,
          min_quorum,
          proposal_analysis_period,
          n_quorum_epoch,
          threshold_create_proposal,
          mint_dao,
          mint_dao,
          circulating_supply,
          true, //ALLOW-SUB_DAO
          dao_seed,
          sub_dao_fee,
          keypair.publicKey
        )
        .accounts(accounts)
        .signers([keypair])
        .rpc();
    },

    onSuccess: (signature) => {
      transactionToast(signature);
      // return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts: [],
    getProgramAccount,
    initialize,
  };
}

// export function useTestDappProgramAccount({ account }: { account: PublicKey }) {
//   const { cluster } = useCluster();
//   const transactionToast = useTransactionToast();
//   const { program, accounts } = useTestDappProgram();

//   // const accountQuery = useQuery({
//   //   queryKey: ['test-dapp', 'fetch', { cluster, account }],
//   //   queryFn: () => program.account.testDapp.fetch(account),
//   // });

//   const closeMutation = useMutation({
//     mutationKey: ['test-dapp', 'close', { cluster, account }],
//     mutationFn: () =>
//       program.methods.close().accounts({ testDapp: account }).rpc(),
//     onSuccess: (tx) => {
//       transactionToast(tx);
//       return accounts.refetch();
//     },
//   });

//   const decrementMutation = useMutation({
//     mutationKey: ['test-dapp', 'decrement', { cluster, account }],
//     mutationFn: () =>
//       program.methods.decrement().accounts({ testDapp: account }).rpc(),
//     onSuccess: (tx) => {
//       transactionToast(tx);
//       return accountQuery.refetch();
//     },
//   });

//   const incrementMutation = useMutation({
//     mutationKey: ['test-dapp', 'increment', { cluster, account }],
//     mutationFn: () =>
//       program.methods.increment().accounts({ testDapp: account }).rpc(),
//     onSuccess: (tx) => {
//       transactionToast(tx);
//       return accountQuery.refetch();
//     },
//   });

//   const setMutation = useMutation({
//     mutationKey: ['test-dapp', 'set', { cluster, account }],
//     mutationFn: (value: number) =>
//       program.methods.set(value).accounts({ testDapp: account }).rpc(),
//     onSuccess: (tx) => {
//       transactionToast(tx);
//       return accountQuery.refetch();
//     },
//   });

//   return {
//     accountQuery,
//     closeMutation,
//     decrementMutation,
//     incrementMutation,
//     setMutation,
//   };
// }
