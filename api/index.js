const app = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const { encodeCallData, getRelayer } = require('./utils.js')
const { relay } = require('./relay.js')
const { PROXY_FACTORY_ADDRESS, FEE, XDAI_TO_DAI_TOKEN_BRIDGE_ADDRESS } = require('./constants')

app.use(cors())
app.use(bodyParser.json())

app.post('/', async (req, res) => {
  try {
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

    // check for withdraw tx
    const withdrawSighash = '0x5d1e9307'
    const withdrawTx = transactions.find(
      ({ to, data, operation }) =>
        to === XDAI_TO_DAI_TOKEN_BRIDGE_ADDRESS && data.startsWith(withdrawSighash) && operation === 0,
    )
    const isWithdrawTx = withdrawTx && transactions.length === 1

    // fee must be paid unless it is a withdraw tx
    if (!feeTx && !isWithdrawTx) {
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
})

app.get('/info', async (req, res) => {
  try {
    const { address } = getRelayer()
    res.json({ address, fee: FEE })
  } catch (e) {
    console.log(e.message)
    res.status(400)
    res.json({ error: e.message })
  }
})

module.exports = app
