const { ethers, BigNumber } = require('ethers')
const fetch = require('node-fetch')
const { GAS_PRICE, GAS_LIMIT } = require('./constants')

const estimateGasPrice = async () => {
  const response = await fetch('https://blockscout.com/xdai/mainnet/api/v1/gas-price-oracle')
  if (response.status === 200) {
    const json = await response.json()
    const gasPrice = ethers.utils.parseUnits(String(json.average), 'gwei').toString()
    return gasPrice
  } else {
    return GAS_PRICE
  }
}

const estimateFee = async () => {
  const gasPrice = await estimateGasPrice()
  const fee = BigNumber.from(GAS_LIMIT).mul(gasPrice).toString()
  return { fee, options: { gasPrice, gasLimit: GAS_LIMIT } }
}

module.exports = {
  estimateGasPrice,
  estimateFee,
}
