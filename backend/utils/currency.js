const CC = require('currency-converter-lt')

const convertCurrency = async () => {
  try {
    let currencyConverter = new CC({ from: 'USD', to: 'VND' })
    const result = await currencyConverter.rates()
    return 1 / result
  } catch (error) {
    console.log(error)
    return 1 / 23182
  }
}

module.exports = convertCurrency
