import { Schema } from "../../amplify/data/resource";

// account info from user_profile table
export type UserProfile = {
    id: string,
    name: string,
    email: string,
    phone?: string,
    myself: string,
    trader: string,
    interest: string[],
    watchlist: string[],
    status: boolean,
    ntoken: string,
    picture?: string,
}

// comes from cognito
export type UserAttribute = {
    aud: string, //709aci6kf266pekbf54u1b5icm
    auth_time: number,
    "cognito:username": string, //"44ef7696-6ee0-4519-9133-1ec9fd869305",
    email: string, //alexander.peter@capiwise.com,
    email_verified: boolean,
    name?: string,
    event_id: string, //01c7f6f0-c855-45e7-ab9a-18d9a06388f6,
    exp: number, //1718089437,
    family_name: string, //S,
    given_name: string, //Alex,
    iat: number, //1718003037,
    iss: string, //https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_QukrjlcsL,
    jti: string, //4c146c2a-5a2d-4f6c-bd19-80c5a40b9ad9,
    origin_jti: string, //4948010e-bbb7-4b8b-a37d-fa8465657f7a,
    phone_number: string, //+15555215554,
    phone_number_verified: boolean,
    sub: string, //44ef7696-6ee0-4519-9133-1ec9fd869305,
    token_use: string, //id,
    website: string, //https://capiwise.com
    picture?: string,
}

export type Stock = {
    average_volume: string,//"485776019",
    change: number,//"0.03980",
    close: number,//"120.92780",
    currency: string,//"USD",
    datetime: string,//"2024-06-10",
    exchange: string,//"NASDAQ",
    fifty_two_week: {
        high: number,
        high_change: number,//"-4.65919",
        high_change_percent: number,//"-3.70993",
        low: number,//"38.61800",
        low_change: number,//"82.30980",
        low_change_percent: number,//"213.13844",
        range: string,//"38.618000 - 125.586998"
    },
    high: number,//"121.25000",
    isWatchlisted: boolean,//false,
    is_market_open: boolean,//true,
    logo: string,//"https://api.twelvedata.com/logo/nvidia.com",
    low: number,//"117.01000",
    mic_code: string,//"XNGS",
    name: string,//"NVIDIA Corp",
    open: number,//"120.38000",
    percent_change: number,//"0.03293",
    previous_close: number,//"120.88800",
    symbol: string,//"NVDA",
    timestamp: number,//1718030700,
    volume: number,//"111583681"
}

export type Watchlist = {
    average_volume: number,//"56269681",
    change: number,//"-3.75999",
    close: number,//"193.13000",
    currency: string,//"USD",
    datetime: string,//"2024-06-10",
    exchange: string,//"NASDAQ",
    fifty_two_week: any,//[Object
    high: number,//"197.28169",
    isGained: boolean,//false,
    isLost: boolean,//true,
    isTrending: boolean,//false,
    is_market_open: boolean,//false,
    logo: string,//"https://api.twelvedata.com/logo/apple.com",
    low: number,//"192.14999",
    mic_code: string,//"XNGS",
    name: string,//"Apple Inc",
    open: number,//"197.20000",
    percent_change: number,//"-1.90969",
    previous_close: number,//"196.89000",
    symbol: string,//"AAPL",
    timestamp: number,//1718049568,
    type: string,//"Common Stock",
    volume: number,//"86307311"
};

export type NewsData = any;
// {
//     uuid: string,
//     title: string,
//     description: string,
//     keywords: string,
//     snippet: string,
//     url: string,
//     image_url: string,
//     language: string,
//     published_at: string,
//     source: string,
//     relevance_score: null,
//     entities: any[],
//     similar: any[]
// } & any;

export type StockSummary = {
    date: string,
    day1Range: {
        averageVolume: number,
        change: number,
        close: number,
        high: number,
        low: number,
        mid: number,
        open: number,
        percentChange: number,
        previousClose: number,
        volume: number,
    },
    earnings: {
        earningsHisCurrYr: any[],
        earningsRetainedCurrYr: number,
        earningsRetainedPastYr: number,
        eps: number,
        epsGrowthQrt: number,
        epsGrowthTTM: number,
        peRatio: number,
        pegRatio: number
    },
    events: {
        divPast: {
            amount: number,
            exdivDate: string,
            payDate: string,
            recordDate: string
        },
        earningsPast: {
            date: string,
            eps: null,
            quarter: string
        },
        earningsUpcoming: {
            date: string,
            eps: number,
            quarter: string
        }
    },
    isAnalysisEnabled: boolean,
    isDividendEnabled: boolean,
    isFinHealthEnabled: boolean,
    isMarketOpen: boolean,
    performance: any,
    profile: {
        CEO: string,
        biography: string,
        country: string,
        currency: string,
        exchange: string,
        headquarter: string,
        industry: string,
        logo: string,
        mic_code: string,
        name: string,
        sector: string,
        symbol: string,
        website: string,
    },
    statistics: any,
    time: number,
    weeks52Range: any,
    dividends?: any,
    isWatchlisted?: any
}

export type EtfStockSummary = {
    "isMarketOpen": boolean,
    "asof": any,
    "overview"?: {
        "details": {
            "name": string,
            "exchange": string,
            "symbol": string,
            "currency": string,
        },
        "statistics": {
            "netAssets": any,
            "NAV": number,
            "forwardAnnualDividend": number,
            "pricePerformance52W": any,
            "netExpenseRatio": any,
            "12monthsYield": any,
            "inceptionDate": any
        },
        "day1Range": {
            "open": number,
            "high": number,
            "low": number,
            "close": number,
            "mid": number,
            "previousClose": number,
            "change": number,
            "percentChange": number,
            "volume": number,
            "averageVolume": number
        },
        "weeks52Range": {
            "weeks52High": any,
            "onHigh": any,
            "week252Low": any,
            "onLow": any,
        },
        "riskreturnValuation": {
            "self": {
                "risk": any,
                "return": any,
            },
            "index": {
                "risk": any,
                "return": any,
            },
        },
        "fundFundamentals": {
            "self": {
                "p_earningsTTM": any,
                "p_book": any,
                "p_sale": any,
                "p_cashflow": any,
                "30daysSECyield": any,
                "distributionYieldTTM": any,
            },
            "index": {
                "p_earningsTTM": any,
                "p_book": any,
                "p_sale": any,
                "p_cashflow": any,
                "30daysSECyield": any,
                "distributionYieldTTM": any,
            },
        },
        "companyProfile": {
            "biography": string,
            "topSector": any,
            "topIndustry": any,
            "sponsor": null,
            "inception": any,
            "country": any,
            "website": any,
        },
    },
    "performance"?: {
        "avgAnnualReturns": {
            "self": {
                "Returns_1Y": any,
                "Returns_3Y": any,
                "Returns_5Y": any,
                "Returns_10Y": any,
                "Returns_YTD": any,
            },
            "index": {
                "Returns_1Y": any,
                "Returns_3Y": any,
                "Returns_5Y": any,
                "Returns_10Y": any,
                "Returns_YTD": any,
            },
        },
        "riskreturnComparison": {
            "self": {
                "risk": any,
                "return": any,
            },
            "index": {
                "risk": any,
                "return": any,
            },
        },
        "hypotheticalGrowth": {
            "growth1yr": number,
            "growth3yr": any,
            "growth5yr": any,
            "growth10yr": any,
        },
    },
    "portfolio"?: {
        "top10holdings": {
            "totalCount": number,
            "weight": number,
            "asOf": any,
            "holdings": any,
        },
        "holdings": any,
        "portfolioComposition": {
            "industryExposure": any,
            "sectorExposure": any,
            "countryExposure": any,
            "regionExposure": any,
            "marketCapExposure": any,
        },
    },
    "dividends"?: {
        "dividend": {
            "dividendAmount": any,
            "payDate": any,
            "frequency": any,
        },
        "strenthDividendYield": {
            "self": any,
            "marketAverage": any,
        },
        "growthDividend": {
            "selfDividends": any,
            "indexDividends": any
        }
    },
    "fees"?: {
        "expenses": {
            "expenseRatio": any,
            "expenseRatioIndex": any,
        },
        "fees": {
            "feeself": any,
            "feeindex": any,
        }
    },
    "isPerformanceEnabled": boolean,
    "isPortfolioEnabled": boolean,
    "isDividendEnabled": boolean,
    "isFeesEnabled": boolean
}

export type ExchangeRate = {
    symbol: string,
    rate: number,
    timestamp: number,
    scale_factor: 1
}

export type Change = {
    datetime: string, // "2024-07-04",
    open: string, //"1.07890",
    high: string, // "1.08040",
    low: string, // "1.07830",
    close: string, //"1.07970"
};

export type SymbolChange = {
    meta: {
        symbol: string,
        interval: string, //"1day",
        currency_base: string,
        currency_quote: string,
        type: string
    },
    values: Change[]
}

export type Asset = {
    asset_id: string,
    url: string
}

export type AlertData = {
    id: string,
    user_id: string,
    identifier: string,
    signal: "price" | "percent",
    condition: "above" | "below",
    value: number,
    triggered_at: string,
    type: "dod" | "gtc",
    email: boolean,
    notification: boolean,
    isDeleted: boolean,
    status: boolean,
    etf?: boolean,
    createdAt?: string,
    updatedAt?: string,
} & Schema["Alert"]["type"];