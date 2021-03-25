const { ethers } = require('ethers')
const { PK, PROVIDER_URL, MULTISEND_ADDRESS, MULTISEND_ABI } = require('./constants')

const joinHexData = (hexData) => {
  return `0x${hexData
    .map((hex) => {
      const stripped = hex.replace(/^0x/, '')
      return stripped.length % 2 === 0 ? stripped : '0' + stripped
    })
    .join('')}`
}

const abiEncodePacked = (...params) => {
  return joinHexData(
    params.map(({ type, value }) => {
      const encoded = ethers.utils.defaultAbiCoder.encode([type], [value])
      if (type === 'bytes' || type === 'string') {
        const bytesLength = parseInt(encoded.slice(66, 130), 16)
        return encoded.slice(130, 130 + 2 * bytesLength)
      }
      let typeMatch = type.match(/^(?:u?int\d*|bytes\d+|address)\[\]$/)
      if (typeMatch) {
        return encoded.slice(130)
      }
      if (type.startsWith('bytes')) {
        const bytesLength = parseInt(type.slice(5))
        return encoded.slice(2, 2 + 2 * bytesLength)
      }
      typeMatch = type.match(/^u?int(\d*)$/)
      if (typeMatch) {
        if (typeMatch[1] !== '') {
          const bytesLength = parseInt(typeMatch[1]) / 8
          return encoded.slice(-2 * bytesLength)
        }
        return encoded.slice(-64)
      }
      if (type === 'address') {
        return encoded.slice(-40)
      }
      throw new Error(`unsupported type ${type}`)
    }),
  )
}

const getHexDataLength = (hexData) => {
  return Math.ceil((hexData.startsWith('0x') ? hexData.length - 2 : hexData.length) / 2)
}

const encodeCallData = (transactions) => {
  const multiSend = new ethers.Contract(MULTISEND_ADDRESS, MULTISEND_ABI)
  return multiSend.interface.encodeFunctionData('multiSend', [
    joinHexData(
      transactions.map((tx) =>
        abiEncodePacked(
          { type: 'uint8', value: tx.operation },
          { type: 'address', value: tx.to },
          { type: 'uint256', value: tx.value },
          { type: 'uint256', value: getHexDataLength(tx.data) },
          { type: 'bytes', value: tx.data },
        ),
      ),
    ),
  ])
}

const getRelayer = () => {
  // setup signer/provider
  const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
  return new ethers.Wallet(PK, provider)
}

module.exports = {
  getRelayer,
  encodeCallData,
}
