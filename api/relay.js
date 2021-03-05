const { ethers } = require('ethers')

const { getRelayer } = require('./utils.js')
const { PROXY_FACTORY_ADDRESS, PROXY_FACTORY_ABI, GAS_LIMIT, GAS_PRICE } = require('./constants')

const methods = ['createProxyAndExecTransaction', 'execTransaction']

export const relay = async (method, params) => {
  if (!methods.includes(method)) {
    throw new Error('Relay: Method not allowed')
  }

  // setup proxy factory
  const relayer = getRelayer()
  const proxyFactory = new ethers.Contract(PROXY_FACTORY_ADDRESS, PROXY_FACTORY_ABI, relayer)

  // override tx options
  const options = {
    gasLimit: GAS_LIMIT,
    gasPrice: GAS_PRICE,
  }

  // never relay transactions that will fail
  try {
    const success = await proxyFactory.callStatic[method](...params, options)
    if (!success) {
      throw new Error()
    }
  } catch (e) {
    throw new Error('Relay: Transaction will fail')
  }

  // execute transaction
  return proxyFactory[method](...params, options)
}
