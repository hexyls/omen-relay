export const MULTISEND_ADDRESS = "0x035000FC773f4a0e39FcdeD08A46aBBDBF196fd3";
export const MULTISEND_ABI = [
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes",
        name: "transactions",
        type: "bytes",
      },
    ],
    name: "multiSend",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const PROXY_FACTORY_ADDRESS =
  "0x7b9756f8A7f4208fE42FE8DE8a8CC5aA9A03f356";
export const FEE_RECIPIENT = "";
export const FEE = "1000000000000000"; // 0.001 xdai
export const BICONOMY_API_KEY = "";
export const BICONOMY_URL = "https://api.biconomy.io/api/v2/meta-tx/native";
