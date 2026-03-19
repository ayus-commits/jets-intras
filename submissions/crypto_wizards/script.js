//___________________________________________API_________________________________________________________________

const key = "CG-zBNS7Y2qU3cHf5twpN9CJ3pg";

async function getData(id) {
  try {
    const res = await fetch(
    //trending:
    //   `https://api.coingecko.com/api/v3/search/trending?x_cg_api_key=${key}`,
    //price:
    //   `https://api.coingecko.com/api/v3/simple/price?vs_currencies=inr&ids=${id}&x_cg_api_key=${key}`,
    // //market data :
    //   `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${id}&x_cg_api_key=${key}`,
    //historical data on date:
    //   `https://api.coingecko.com/api/v3/coins/${id}/history?date=01-01-2026&x_cg_api_key=${key}`,
    //detailed data :
    //   `https://api.coingecko.com/api/v3/coins/${id}?vs_currencies=inr&x_cg_api_key=${key}`,
    //market chart data for 7 days:
    //   `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=inr&days=7&x_cg_api_key=${key}`,
    //top 20 coins by market cap:
    //   `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=20&page=1&x_cg_api_key=${key}`,
    //global data:
      `https://api.coingecko.com/api/v3/global?x_cg_api_key=${key}`
    );
    const data = await res.json();
    console.log("Crypto Market data loaded", data);
  } catch (err) {
    console.error("Failed to fetch CoinGecko data:", err);
  }
}
getData("bitcoin");
