const { default: mongoose } = require('mongoose')
const fetch = require('node-fetch')
const { Headers } = require('node-fetch')
const convertCurrency = async () => {
  try {
    var myHeaders = new Headers()
    myHeaders.append('apikey', process.env.CURRENCY_API_KEY)

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    }

    const response = await fetch(
      'https://api.apilayer.com/exchangerates_data/convert?to=USD&from=VND&amount=1',
      requestOptions
    )
    const data = await response.json()
    return data.result
  } catch (error) {
    console.log(error)
    return 1 / 23182
  }
}

module.exports = convertCurrency
