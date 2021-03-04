const { ethers } = require("ethers");

const { encodeCallData, enableCrossOrigin, getRelayer } = require("./utils.js");
const { relay } = require("./relay.js");
const {
  MULTISEND_ADDRESS,
  MULTISEND_ABI,
  PROXY_FACTORY_ADDRESS,
  FEE,
} = require("./constants");

module.exports = async (req, res) => {
  try {
    enableCrossOrigin(res);

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    const { to, transactions, params, method } = req.body;

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
      throw new Error("Transaction data does not match signed data");
    }

    // verify fee
    const relayer = getRelayer();
    const feeTx = transactions.find(
      ({ to, data, value, operation }) =>
        to === relayer.address &&
        data === "0x" &&
        value === FEE &&
        operation === 0
    );
    if (!feeTx) {
      throw new Error("No fee transaction found");
    }

    // relay transaction
    const response = await relay(method, params);

    // return transaction details
    res.json(response);
  } catch (e) {
    console.log(e.message);
    res.status(403);
    res.json({ error: e.message });
  }
};
