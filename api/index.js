const { ethers } = require("ethers");

const { encodeCallData, enableCrossOrigin } = require("./utils.js");
const { relay } = require("./biconomy.js");
const {
  MULTISEND_ADDRESS,
  MULTISEND_ABI,
  PROXY_FACTORY_ADDRESS,
  FEE_RECIPIENT,
  FEE,
} = require("./constants");

module.exports = async (req, res) => {
  try {
    enableCrossOrigin(res);

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    const body = req.body;
    const { to, transactions, params } = body;

    // verify destination address
    if (to !== PROXY_FACTORY_ADDRESS) {
      throw new Error("Cannot relay to that address");
    }

    // get call data
    const execParamLength = 11;
    const data = params.length === execParamLength ? params[3] : params[5];

    // verify call data
    const multiSend = new ethers.Contract(MULTISEND_ADDRESS, MULTISEND_ABI);
    const encodedCallData = encodeCallData(multiSend, transactions);

    if (encodedCallData !== data) {
      throw new Error("Transaction data does not match signed data", data);
    }

    // verify fee
    //   const feeTx = transactions.find(
    //     ({ to, data, value, operation }) =>
    //       to === FEE_RECIPIENT && data === "0x" && value === FEE && operation === 0
    //   );
    //   if (!feeTx) {
    //     throw new Error("No fee transaction found");
    //   }

    // remove raw transcations
    delete body.transactions;

    // relay transaction
    const response = await relay(body);

    // return tx hash
    res.json(response);
  } catch (e) {
    res.status(403);
    res.json({ error: e.message });
  }
};
