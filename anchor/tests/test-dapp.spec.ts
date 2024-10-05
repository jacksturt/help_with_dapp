import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { TestDapp } from '../target/types/test_dapp';

describe('test-dapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.TestDapp as Program<TestDapp>;

  const testDappKeypair = Keypair.generate();

  it('Initialize TestDapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        testDapp: testDappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([testDappKeypair])
      .rpc();

    const currentCount = await program.account.testDapp.fetch(
      testDappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment TestDapp', async () => {
    await program.methods
      .increment()
      .accounts({ testDapp: testDappKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.testDapp.fetch(
      testDappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment TestDapp Again', async () => {
    await program.methods
      .increment()
      .accounts({ testDapp: testDappKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.testDapp.fetch(
      testDappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement TestDapp', async () => {
    await program.methods
      .decrement()
      .accounts({ testDapp: testDappKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.testDapp.fetch(
      testDappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set testDapp value', async () => {
    await program.methods
      .set(42)
      .accounts({ testDapp: testDappKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.testDapp.fetch(
      testDappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the testDapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        testDapp: testDappKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.testDapp.fetchNullable(
      testDappKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
