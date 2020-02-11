const path = require('path')
const Configuration = require('nodejs-sdk/packages/api/common/configuration').Configuration
Configuration.setConfig(path.join(__dirname, '../chain-conf/config.json'))

const web3jService = require('nodejs-sdk/packages/api/web3j/web3jService')
const service = new web3jService.Web3jService()

const utils = require('nodejs-sdk/packages/api/common/utils')

const fs = require('fs')

const contractFolderPath = path.join(__dirname, '../contract')
const contractAddrPath = contractFolderPath + '/address.txt'

const abiFolderPath = contractFolderPath
const getAbi = (contractName) => {
  const abiPath = abiFolderPath + '/' + contractName + '.abi'
  return JSON.parse(fs.readFileSync(abiPath))
}
const abi = getAbi('SupplyChain')
if (!abi) {
  throw new Error('no abi file for this contract')
}

// contract address
const contractAddr = fs.readFileSync(contractAddrPath, 'utf8')
console.log('Contract Address: ' + contractAddr)

// call function in the contract
const callFunction = async (functionName, parameters) => {
  for (const item of abi) {
    if (item.name === functionName && item.type === 'function') {
      if (item.inputs.length !== parameters.length) {
        throw new Error(`wrong number of parameters for function \`${item.name}\`, expected ${item.inputs.length} but got ${parameters.length}`)
      }

      functionName = utils.spliceFunctionSignature(item)

      if (item.constant) {
        return service.call(contractAddr, functionName, parameters).then(result => {
          const status = result.result.status
          const ret = {
            status: status
          }
          const output = result.result.output
          if (output !== '0x') {
            ret.output = utils.decodeMethod(item, output)
          }
          return ret
        })
      } else {
        return service.sendRawTransaction(contractAddr, functionName, parameters).then(result => {
          const txHash = result.transactionHash
          const status = result.status
          const ret = {
            transactionHash: txHash,
            status: status
          }
          const output = result.output
          if (output !== '0x') {
            ret.output = utils.decodeMethod(item, output)
          }
          return ret
        })
      }
    }
  }

  throw new Error('no such function in the contract')
}

// add company
const addCompany = async (certified) => {
  return callFunction('addCompany', [certified])
    .then(res => res.output.id)
    .then(bigint => parseInt(bigint.toString()))
}

// add financial inst
const addFinancialInst = async (certified) => {
  return callFunction('addFinancialInst', [certified])
    .then(res => res.output.id)
    .then(bigint => parseInt(bigint.toString()))
}

// get reputation
const getReputation = async (id) => {
  return callFunction('getReputation', [id])
    .then(res => res.output.reputation)
    .then(bigint => parseInt(bigint.toString()))
}

// get money to pay
const getMoneyToPay = async (id) => {
  return callFunction('getMoneyToPay', [id])
    .then(res => res.output.moneyToPay)
    .then(bigint => parseInt(bigint.toString()))
}

// get money to receive
const getMoneyToReceive = async (id) => {
  return callFunction('getMoneyToReceive', [id])
    .then(res => res.output.moneyToReceive)
    .then(bigint => parseInt(bigint.toString()))
}

// add a new payment
const addPayment = async (fromID, toID, amount, payBackEndTime, description) => {
  return callFunction(
    'addPayment',
    [fromID, toID, amount, payBackEndTime, description]
  )
}

// transfer payment
const transferPayment = async (fromID, toID, amount, description) => {
  return callFunction(
    'transferPayment',
    [fromID, toID, amount, description]
  )
}

// fund
const fund = async (fromID, toID, amount, description) => {
  return callFunction(
    'fund',
    [fromID, toID, amount, description]
  )
}

// pay back
const payBack = async (fromID, amount, currentTime) => {
  return callFunction(
    'payBack',
    [fromID, amount, currentTime]
  )
}

module.exports = {
  addCompany,
  addFinancialInst,
  getReputation,
  getMoneyToPay,
  getMoneyToReceive,
  addPayment,
  transferPayment,
  fund,
  payBack
}
