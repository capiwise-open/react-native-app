import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { UserAttribute, UserProfile } from './types'
import { RootState } from '../store'

const slice = createSlice({
    name: 'currency',
    initialState: {
        topFiatCurrencies: [
            "USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNY", "HKD", "NZD",
            "SEK", "KRW", "SGD", "NOK", "MXN", "INR", "RUB", "ZAR", "TRY", "BRL",
            "TWD", "DKK", "PLN", "THB", "IDR", "HUF", "CZK", "ILS", "CLP", "PHP",
            "AED", "COP", "SAR", "MYR", "RON", "EGP", "QAR", "KWD", "PKR", "IQD",
            "HUF", "BGN", "PEN", "KZT", "ARS", "UAH", "LBP", "OMR", "JOD", "NGN"
        ],
        topCryptocurrencies: [
            "BTC", "ETH", "USDT", "BNB", "SOL", "USDC", "XRP", "TON", "DOGE", "ADA",
            "TRX", "AVAX", "SHIB", "DOT", "LINK", "BCH", "DAI", "LEO", "NEAR", "UNI",
            "MATIC", "LTC", "KAS", "PEPE", "ICP", "FET", "ETC", "XMR", "APT", "RNDR",
            "XLM", "HBAR", "CRO", "OKB", "ATOM", "MNT", "STX", "FIL", "ARB", "MKR",
            "IMX", "FDUSD", "VET", "WIF", "INJ", "GRT", "SUI", "BONK", "TAO", "OP"
        ],
        topCommodities: [
            "XAU", // Gold
            "XAG", // Silver
            "XG",  // Copper
            "URALS", // Urals Crude Oil Spot
            "XPT",  // Platinum
            "XPD",  // Palladium
        ]
    },
    reducers: {
    },
})

export default slice.reducer

export const selectFiatCurrencies = (state: RootState) => state.currency.topFiatCurrencies;
export const selectCommodities = (state: RootState) => state.currency.topCommodities;
export const selectCryptoCurrencies = (state: RootState) => state.currency.topCryptocurrencies;