export const MULTISEND_ADDRESS = "0x035000FC773f4a0e39FcdeD08A46aBBDBF196fd3";
export const PROXY_FACTORY_ADDRESS =
  "0x7b9756f8A7f4208fE42FE8DE8a8CC5aA9A03f356";

export const FEE = "1000000000000000"; // 0.001 xdai

export const BICONOMY_API_KEY = "";
export const BICONOMY_URL = "https://api.biconomy.io/api/v2/meta-tx/native";

export const PK = "";
export const PROVIDER_URL = "https://rpc.xdaichain.com/";
export const GAS_LIMIT = "3000000";
export const GAS_PRICE = "1000000000"; // 1 gwei

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

export const PROXY_FACTORY_ABI = [
  {
    type: "function",
    stateMutability: "payable",
    payable: true,
    outputs: [],
    name: "createProxyAndExecTransaction",
    inputs: [
      { type: "address", name: "masterCopy", internalType: "address" },
      { type: "uint256", name: "saltNonce", internalType: "uint256" },
      { type: "address", name: "fallbackHandler", internalType: "address" },
      { type: "address", name: "to", internalType: "address" },
      { type: "uint256", name: "value", internalType: "uint256" },
      { type: "bytes", name: "data", internalType: "bytes" },
      { type: "uint8", name: "operation", internalType: "enum Enum.Operation" },
      { type: "address", name: "owner", internalType: "address" },
      { type: "bytes", name: "signatures", internalType: "bytes" },
    ],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "payable",
    payable: true,
    outputs: [
      { type: "bool", name: "execTransactionSuccess", internalType: "bool" },
    ],
    name: "execTransaction",
    inputs: [
      { type: "address", name: "proxy", internalType: "address payable" },
      { type: "address", name: "to", internalType: "address" },
      { type: "uint256", name: "value", internalType: "uint256" },
      { type: "bytes", name: "data", internalType: "bytes" },
      { type: "uint8", name: "operation", internalType: "enum Enum.Operation" },
      { type: "uint256", name: "safeTxGas", internalType: "uint256" },
      { type: "uint256", name: "baseGas", internalType: "uint256" },
      { type: "uint256", name: "gasPrice", internalType: "uint256" },
      { type: "address", name: "gasToken", internalType: "address" },
      {
        type: "address",
        name: "refundReceiver",
        internalType: "address payable",
      },
      { type: "bytes", name: "signatures", internalType: "bytes" },
    ],
    constant: false,
  },
];
