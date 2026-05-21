import { useState } from "react";
import { ethers } from "ethers";
import * as bip39 from "bip39";
import { Buffer } from "buffer";

window.Buffer = Buffer;

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState([]);

  const provider = new ethers.JsonRpcProvider(
    "https://ethereum-rpc.publicnode.com",
  );

  // 1. Generate Seed Phrase
  const generateSeed = () => {
    const seed = bip39.generateMnemonic();
    setMnemonic(seed);
    setWallets([]);
  };

  // 2. Create Wallet
  const addWallet = async () => {
    const index = wallets.length;

    const hdNode = ethers.HDNodeWallet.fromPhrase(
      mnemonic,
      undefined,
      `m/44'/60'/0'/0/${index}`,
    );

    const wallet = new ethers.Wallet(hdNode.privateKey, provider);

    const balanceWei = await provider.getBalance(wallet.address);
    const balanceEth = ethers.formatEther(balanceWei);

    const newWallet = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      balance: balanceEth,
    };

    setWallets([...wallets, newWallet]);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-blue-700 text-center">
        Ethereum Wallet Generator
      </h1>

      {/* Generate Seed Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={generateSeed}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow"
        >
          Generate Seed Phrase
        </button>
      </div>

      {/* Seed Phrase */}
      {mnemonic && (
        <div className="mt-6 bg-white p-4 rounded shadow max-w-3xl mx-auto">
          <p className="text-sm text-gray-500">Seed Phrase</p>
          <p className="break-all text-gray-800">{mnemonic}</p>
        </div>
      )}

      {/* Add Wallet Button (ONLY AFTER SEED) */}
      {mnemonic && (
        <div className="flex justify-center mt-6">
          <button
            onClick={addWallet}
            className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded shadow"
          >
            Add Wallet
          </button>
        </div>
      )}

      {/* Wallet Cards (FLEXBOX SIDE BY SIDE) */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        {wallets.map((wallet, i) => (
          <div key={i} className="bg-white shadow-md rounded-lg p-4 w-72">
            <h2 className="text-blue-600 font-bold">Wallet {i}</h2>

            {/* Address */}
            <p className="text-xs text-gray-500 mt-2">Address</p>
            <p className="text-sm break-all text-gray-800">{wallet.address}</p>

            {/* Private Key (BLACK FONT) */}
            <p className="text-xs text-gray-500 mt-3">Private Key</p>
            <p className="text-xs break-all text-gray-900 font-mono">
              {wallet.privateKey}
            </p>

            {/* Balance */}
            <p className="text-xs text-gray-500 mt-3">Balance</p>
            <p className="text-lg font-bold text-blue-700">
              {Number(wallet.balance).toFixed(4)} ETH
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
