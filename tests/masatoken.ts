import * as anchor from '@coral-xyz/anchor'
import { TOKEN_PROGRAM_ID, createInitializeMintInstruction, getMintLen } from '@solana/spl-token'
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { assert } from 'chai'

import { OftTools } from '@layerzerolabs/lz-solana-sdk-v2'

import oftIdl from '../target/idl/masatoken.json'
import endpointIdl from '../target/idl/endpoint.json'

const OFT_SEED = 'Oft'
const SOLANA_OFT_TOKEN_DECIMALS = 8
const OFT_SHARE_DECIMALS = 6

describe('masatoken', () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.local(undefined, {
        commitment: 'confirmed',
        preflightCommitment: 'confirmed',
    })
    const wallet = provider.wallet as anchor.Wallet
    const OFT_PROGRAM_ID = new PublicKey(oftIdl.metadata.address)
    console.log('OFT_PROGRAM_ID', OFT_PROGRAM_ID.toBase58())
    const ENDPOINT_PROGRAM_ID = new PublicKey(endpointIdl.metadata.address)
    console.log('ENDPOINT_PROGRAM_ID', ENDPOINT_PROGRAM_ID.toBase58())

    it('Initialize OFT', async () => {
        const mintKp = Keypair.generate()
        console.log('mintKp', mintKp.publicKey.toBase58())
        const [oftConfigPda] = PublicKey.findProgramAddressSync(
            [Buffer.from(OFT_SEED, 'utf8'), mintKp.publicKey.toBuffer()],
            new anchor.web3.PublicKey(oftIdl.metadata.address)
        )
        console.log('oftConfigPda', oftConfigPda.toBase58())

        // step 1, create the mint token
        const createMintIxs = [
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKp.publicKey,
                space: getMintLen([]),
                lamports: await provider.connection.getMinimumBalanceForRentExemption(getMintLen([])),
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMintInstruction(mintKp.publicKey, SOLANA_OFT_TOKEN_DECIMALS, oftConfigPda, oftConfigPda),
        ]
        console.log('createMintIxs', createMintIxs)
        await provider.sendAndConfirm(new anchor.web3.Transaction().add(...createMintIxs), [wallet.payer, mintKp])

        // step 2, create the OFT token
        const initOftIx = await OftTools.createInitNativeOftIx(
            wallet.publicKey,
            wallet.publicKey,
            mintKp.publicKey,
            wallet.publicKey,
            OFT_SHARE_DECIMALS,
            TOKEN_PROGRAM_ID,
            OFT_PROGRAM_ID,
            ENDPOINT_PROGRAM_ID
        )
        console.log('initOftIx', initOftIx)

        await provider.sendAndConfirm(new anchor.web3.Transaction().add(initOftIx), [wallet.payer])

        // check status
        const delegate = await OftTools.getDelegate(provider.connection, oftConfigPda, ENDPOINT_PROGRAM_ID)
        console.log('delegate', delegate.toBase58())
        assert.equal(delegate.toBase58(), wallet.publicKey.toBase58())
    })
})
