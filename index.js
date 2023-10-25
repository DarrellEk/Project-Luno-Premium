/*
COUNTRY_CURRENCY_API = "lGHdeV8KjpkpraDC2kAof04MhJSM82aL"
COUNTRY_CURRENCY_URL = "https://api.apilayer.com/fixer/convert?to=myr&from=usd&amount=1"
LUNO_API_KEY = "Ww2eWhQa7sYD1GFz27BbEXCqePBltSClxJPh7aunv10"
LUNO_API_LINK = "kb3tjhkutmwvn"
BINANCE_API_SECRET = "FQX00oPFrRUnA2qPzce53RktZdwjrm36OXevuypahdskjjl5QOMYj9mRzlyUqjTw"
BINANCE_API_KEY = "geD4ItFUAQ0SZxtXHWkCTX4J1DgVbiyPLeLtaI6yZCMhj9lOwlK9KNExl7jZukI2"
*/



require('dotenv').config()

// to fetch BTCMYR price on Luno
async function fetchBTCMYR(){
    const lunoBTCMYR = process.env.LUNO_BTCMYR_URL
    try {
        const response = await fetch(lunoBTCMYR)
        const data = await response.json()
        // console.log(data.last_trade)
        return +data.last_trade
    } catch(error){
        console.error("error", error)
    }
}

// to fetch currency conversion from USD to MYR
async function currencyCountry(){
    const currencyCountryAPI = process.env.CURRENCY_API
    const currencyCountryURL = process.env.CURRENCY_URL
    try {
        const response = await fetch(currencyCountryURL, {
            method: "GET", 
            headers: {
                "apikey": currencyCountryAPI
            }
        })
        if (response.ok){
            const data = await response.json()
            const rate = data.result
            // console.log(rate)
            return +rate
        }
    } catch (error){
        console.error("error", error)
    }
}

// to calculate BTCUSD in luno
async function calculateUSDLuno(){
    try {
        const BTCMYRvalue = await fetchBTCMYR() 
        const currencyUSDMYR = await currencyCountry() 
        const result = BTCMYRvalue * currencyUSDMYR
        // console.log(result) // number 
        return +result
    } catch(error){
        console.error("error", error)
    }
}

// to get BTCUSD in binance (this) 
const Binance = require('node-binance-api')

async function getBTCBUSD() {
  try {
    const binance = new Binance(); //not the same as the fetch function
    const ticker = await binance.prices();
    // console.log(ticker.BTCBUSD)
    return +ticker.BTCBUSD;
  } catch (err) {
    return NaN;
  }
}

// to get price difference between BTCUSD in binance and luno 
async function priceDifference(){
    try {
        const priceLunoBTC = await calculateUSDLuno()
        const priceBinanceBTC = await getBTCBUSD()
        const difference = priceLunoBTC - priceBinanceBTC 
        // console.log(difference)
        return +difference
    } catch(error){
        console.error("error", error)
    }
}

// Luno premium charges
async function lunoPremium(){
    try {
        const difference = await priceDifference()
        const BTCluno = await calculateUSDLuno()
        const percentage = (difference / BTCluno) * 100
        // console.log(percentage)
        return +percentage
    } catch(error){
        console.error(error, "error")
    }
}

// to print menu out

async function printmenu(){
    try {
        const lunoBTCMYR = await fetchBTCMYR() 
        const currency = await currencyCountry()
        const lunoBTCUSD = await calculateUSDLuno()
        const binanceBTCUSD = await getBTCBUSD()
        const difference = await priceDifference()
        const premium = await lunoPremium()
        console.log(`BTCMYR price on LUNO:          MYR ${lunoBTCMYR}`)
        console.log(`USDMYR:                            ${currency}`)
        console.log(`BTCUSD price on LUNO:          USD ${lunoBTCUSD}`)
        console.log(`BTCUSD price on Binance:       USD ${binanceBTCUSD}`)
        console.log(`Price Difference:              USD ${difference}`)
        console.log(`Luno Premium:                      ${premium}%`)
    } catch (error){
        console.error("error", error)
    }
}

printmenu()
