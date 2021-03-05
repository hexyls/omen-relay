const { encodeCallData, enableCrossOrigin, getRelayer } = require('./utils.js')
const { relay } = require('./relay.js')
const { PROXY_FACTORY_ADDRESS, FEE } = require('./constants')

module.exports = async (req, res) => {
  try {
    enableCrossOrigin(res)

    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    if (req.method === 'GET') {
      return res.status(200).end()
    }

    if (req.method !== 'POST') {
      throw new Error('Method not supported')
    }

    const { to, transactions, params, method } = req.body

    // verify destination address
    if (to !== PROXY_FACTORY_ADDRESS) {
      throw new Error('Cannot relay to that address')
    }

    // get call data
    const execParamLength = 11
    const data = params.length === execParamLength ? params[3] : params[5]

    // verify call data
    const encodedCallData = encodeCallData(transactions)
    if (encodedCallData !== data) {
      throw new Error('Transactions do not match call data')
    }

    // verify fee
    const relayer = getRelayer()
    const feeTx = transactions.find(
      ({ to, data, value, operation }) => to === relayer.address && data === '0x' && value === FEE && operation === 0,
    )
    if (!feeTx) {
      throw new Error('Fee payment not found')
    }

    // relay transaction
    const response = await relay(method, params)

    // return transaction details
    res.json(response)
  } catch (e) {
    console.log(e.message)
    res.status(400)
    res.json({ error: e.message })
  }
}
