const Binance = require('node-binance-api')
require('dotenv').config()

// to fetch BTCMYR price on Luno
async function fetchBTCMYR(){
    const lunoBTCMYR = process.env.LUNO_BTCMYR_URL
    try {
        const response = await fetch(lunoBTCMYR)
        const data = await response.json()
        return +data.last_trade
    } catch(error){
        console.error("error", error)
    }
}

// to fetch currency conversion from USD to MYR
async function currencyCountry(){
    try {
        const response = await fetch(process.env.CURRENCY_URL, {
            method: "GET", 
            headers: {
                "apikey": process.env.CURRENCY_API
            }
        })
        if (response.ok){
            const data = await response.json()
            const rate = data.result
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
        return +result
    } catch(error){
        console.error("error", error)
    }
}

// to get BTCUSD in binance (this) 
async function getBTCBUSD() {
  try {
    const binance = new Binance(); //not the same as the fetch function
    const ticker = await binance.prices();
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
        console.log(`BTCMYR price on LUNO:`.padEnd(30)       + `MYR ${lunoBTCMYR}`)
        console.log(`USDMYR:`.padEnd(30)                     +     `${currency}`)
        console.log(`BTCUSD price on LUNO:`.padEnd(30)       + `USD ${lunoBTCUSD}`)
        console.log(`BTCUSD price on Binance:`.padEnd(30)    + `USD ${binanceBTCUSD}`)
        console.log(`Price Difference:`.padEnd(30)           + `USD ${difference}`)
        console.log(`Luno Premium:`.padEnd(30)               +      `${premium}%`)
    } catch (error){
        console.error("error", error)
    }
}

printmenu()
