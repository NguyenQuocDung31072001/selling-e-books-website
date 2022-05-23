const { default: mongoose } = require('mongoose')
const fetch = require('node-fetch')

const convertCurrency = async () => {
  const response = await fetch(
    'https://free.currconv.com/api/v7/convert?q=VND_USD&compact=ultra&apiKey=6426789aa17a2b67eedb'
  )
  const data = await response.json()
  return data.VND_USD
}

module.exports = convertCurrency
