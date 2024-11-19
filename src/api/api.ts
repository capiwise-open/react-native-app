import config from '../../app.config';
const env = "dev";
const apiKey = 'IYRP8hE4678HXt5WcePBr8DJEDgTMLVr4ugQsQMs'

export default class Api {
  static async getExchangeRateList(symbols: string[], outputsize = 1) {
    try {
      const data = await fetch(config.TWELVE_API + `/time_series?symbol=${symbols.join(',')}&interval=1day&outputsize=${outputsize}`, {
        headers: {
          Authorization: `apikey ${config.TWELVE_API_KEY}`
        }
      });
      return await data.json();
    } catch (e) {
      console.log("getExchangeRateList", e);
      return null;
    }
  }

  static async getNotifications(email: string) {
    try {
      const data = await fetch(config["dev"].API_URL + `/notification?email=${email}`, {
      });
      return await data.json();
    } catch (e) {
      console.log("getExchangeRateList", e);
      return null;
    }
  }

  static async getCurrencyConversion({ symbol, amount }: { symbol: string, amount: string | number }) {
    try {
      const data = await fetch(config.TWELVE_API + `/currency_conversion?symbol=${symbol}&amount=${amount}`, {
        headers: {
          Authorization: `apikey ${config.TWELVE_API_KEY}`
        }
      });
      return await data.json();
    } catch (e) {
      console.log("getCurrencyConversion", e);
      return null;
    }
  }

  static async getLogo(symbol: string) {
    try {
      const data = await fetch(config.TWELVE_API + `/logo?symbol=${symbol}`, {
        headers: {
          Authorization: `apikey ${config.TWELVE_API_KEY}`
        }
      });
      return await data.json();
    } catch (e) {
      console.log("getExchangeRateList", e);
      return null;
    }
  }

  static async getFearGreed() {
    try {
      const data = await fetch(config.FEAR_GREED_RAPID_API, {
        headers: {
          "x-rapidapi-key": config.X_RAPIDAPI_KEY,
          "x-rapidapi-host": config.X_RAPIDAPI_HOST
        }
      });
      return data.json();
    } catch (e) {
      console.log("getExchangeRateList", e);
      return null;
    }
  }

  // static async getStockSummary(symbol: string, token = "", mail: string) {
  //   return await fetchData(`stocks/summary?ticker=${symbol}&email=${mail}`, token);
  // }

  static async getStockHistoricalData(ticker: string, period: string, token = "") {
    return await fetchData(`stocks/historical-data?ticker=${ticker}&period=${period}`, token);
  }

  static async getTrendingStockData(token = "", mail: string) {
    return await fetchData(`stocks/trending-market-exchangelist?email=${mail}`, token);
  }

  // static async getETFStocks(ticker: string, token = "", mail: string) {
  //   return await fetchData(`stocks/etf-stocks?ticker=${ticker}&email=${mail}`, token);
  // }

  static async getStockSearch(ticker: string, limit: string | number, token = "", mail: string) {
    console.log(`stocks/stock-search?ticker=${ticker}&limit=${limit}&email=${mail}`, token);
    return await fetchData(`stocks/stock-search?ticker=${ticker}&limit=${limit}&email=${mail}`, token);
  }

  static async getNewsByCategory(category: string, token = "") {
    return await fetchData(`news?category=${category}`, token);
  }

  static async getNewsBySymbol(symbol: string, token = "") {
    return await fetchData(`news?symbol=${symbol}`, token);
  }

  static async getTopEarningStocks(token = "", mail: string, category: string) {
    return await fetchData(`stocks/top-earning?email=${mail}&category=${category}`, token);
  }

  // static async getMyWatchList(token = "", mail: string) {
  //   return await fetchData(`stocks/watchlist?email=${mail}`, token);
  // }

  // static async getWatchListBySymbol(token = "", mail: string, symbol: string) {
  //   return await fetchData(`stocks/watchlist?email=${mail}&watchlist=${symbol}`, token);
  // }

  static async getTopGainerStocks(token = "", mail: string, date: string) {
    return await fetchData(`stocks/top-gainer?email=${mail}&date=${date}`, token)
  }

  // ////////////////
  // static async signUp(data) {
  //   return await putDataWithoutToken(`search/stock-service-dev-signup`, data);
  // }

  // static async signIn(data) {
  //   return await putDataWithoutToken(`auth/signin`, data);
  // }

  // static async getProfile(email, token) {
  //   return await fetchData(`user?email=${email}`, token);
  // }

  // static async updateProfile(data) {
  //   return await putDataWithoutToken('user', data);
  // }

  // static async signConfirm(data) {
  //   return await putDataWithoutToken(`search/stock-service-dev-confirmsignup`, data);
  // }

  // static async profileFirst(url, data) {
  //   return await putDataWithoutToken(`${url}`, data);
  // }

  // static async googleSign(data) {
  //   return await putDataWithoutToken(`auth/signin-google`, data);
  // }

  // static async forgotPassword(data) {
  //   return await putDataWithoutToken(`search/stock-service-dev-sendforgotpassword`, data);
  // }

  static async closeAccount(data: any) {
    return await putDataWithoutToken(`search/stock-service-dev-closeaccount`, data);
  }

  // static async confirmPassword(data) {
  //   return await putDataWithoutToken(`search/stock-service-dev-confirmforgotpassword`, data);
  // }

  static async sendMail(data: any) {
    return await putDataWithXApiKey(`mail`, data);
  }

  static async updateAttributes(data: any) {
    return await putDataWithoutToken(`search/stock-service-dev-updateattributes`, data);
  }

  static async getPresignedURI(data: any) {
    return await putDataWithoutToken(`search/stock-service-dev-getsigneduri`, data);
  }

  // static async changePassword(data) {
  //   return await putDataWithoutToken(`search/stock-service-dev-changepassword`, data);
  // }

}

const putDataWithXApiKey = (url: string, params: any) => {
  let baseURL = config[env].API_URL;
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(params)
    };

    fetch(baseURL + url, requestOptions)
      .then((response) => {
        resolve(response.json());
      });
  })
}

const putDataWithoutToken = (url: string, params: any) => {
  let baseURL = config[env].API_URL;
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    };

    fetch(baseURL + url, requestOptions)
      .then((response) => {
        resolve(response.json());
      });
  })
}

const putData = (url: string, token: string, params: any) => {
  let baseURL = config[env].API_URL;
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer  ${token}`
      },
      body: JSON.stringify(params)
    };

    fetch(baseURL + url, requestOptions)
      .then((response) => {
        resolve(response.json());
      });
  })
}

const fetchData = (url: string, token: string) => {
  let baseURL = config[env].API_URL + "/";
  return new Promise((resolve, reject) => {
    console.log(baseURL + url);
    fetch(baseURL + url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(async (response) => {
      try {
        if (response.status == 200)
          resolve(await response.json());
        else
          reject("Network error")
      } catch (e) {
        reject(e);
      }
    })
  });
};