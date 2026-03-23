//___________________________________________Initial_________________________________________________________________

document.addEventListener("DOMContentLoaded", init);
function init() {
    loadData();
}

//___________________________________________API_________________________________________________________________

const key = "CG-zBNS7Y2qU3cHf5twpN9CJ3pg";

// async function fetchData(id) {
//   try {
//     const res = await fetch(
//     // trending:
//     //   `https://api.coingecko.com/api/v3/search/trending?x_cg_api_key=${key}`,
//     // price:
//     //   `https://api.coingecko.com/api/v3/simple/price?vs_currencies=inr&ids=${id}&x_cg_api_key=${key}`,
//     // market data :
//     //   `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${id}&x_cg_api_key=${key}`,
//     // historical data on date:
//     //   `https://api.coingecko.com/api/v3/coins/${id}/history?date=01-01-2026&x_cg_api_key=${key}`,
//     // detailed data :
//     //   `https://api.coingecko.com/api/v3/coins/${id}?vs_currencies=inr&x_cg_api_key=${key}`,
//     // market chart data for 7 days:
//     //   `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=inr&days=7&x_cg_api_key=${key}`,
//     // top 20 coins by market cap:
//     //   `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=20&page=1&x_cg_api_key=${key}`,
//     // global data:
//       `https://api.coingecko.com/api/v3/global?x_cg_api_key=${key}`
//     );
//     const data = await res.json();
//     console.log("Crypto Market data loaded", data);
//   } catch (err) {
//     console.error("Failed to fetch CoinGecko data:", err);
//   }
// }
// fetchData("bitcoin");

async function fetchglobal() {
    try{
        const res = await fetch(`https://api.coingecko.com/api/v3/global?x_cg_api_key=${key}`);
        const data = await res.json();
        console.log("Global Data loaded :",data);
        return data;
    }catch(err){
        console.error("Failed to fetch CoinGecko data:", err);
    }
}
async function fetchTrending() {
    try{
        const res = await fetch(`https://api.coingecko.com/api/v3/search/trending?x_cg_api_key=${key}`);
        const data = await res.json();
        const trending = data.coins.slice(0, 10);
        console.log("trending Data loaded :",trending);
        return trending;
    }catch(err){
        console.error("Failed to fetch CoinGecko data:", err);
    }
}
async function fetchGainersLosers() {
    try{
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=250&page=1&price_change_percentage=24h&x_cg_api_key=${key}`);
        const data = await res.json();
        const valid = data.filter(c => c.price_change_percentage_24h !== null);
        const gainers = [...valid]
            .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
            .slice(0, 11);

        const losers = [...valid]
            .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
            .slice(0, 11);
        console.log("Top Gainers:", gainers);
        console.log("Top Losers:", losers);
        return {gainers,losers};
    }catch(err){
        console.error("Failed to fetch CoinGecko data:", err);
    }
}
async function fetchCoins(id="bitcoin") {
    try{
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${id}&x_cg_api_key=${key}`);
        const data = await res.json();
        console.log("Coins data :",data);
        return data;
    }catch(err){
        console.error("Failed to fetch CoinGecko data:", err);
    }
}

async function loadData() {
  try {
    const [global, trending,gainersLosers, coins] = await Promise.all([
      fetchglobal(),
      fetchTrending(),
      fetchGainersLosers(),
      fetchCoins()
    ]);
    const { gainers, losers } = gainersLosers;
    renderGlobal(global);
    renderTrending(trending);
    renderGainersLosers(gainers,losers);
    renderCoins(coins);
  } catch (err) {
    console.error("Failed to fetch CoinGecko data:", err);
  }
}

// //___________________________________________Render_________________________________________________________________
function setColor(el, value) {
    if (value > 0) {
    el.style.color = "green";
    } else if (value < 0) {
    el.style.color = "red";
    } else {
    el.style.color = "gray";
    }
}
function renderGlobal(global) {
    document.getElementById("hero2-market").querySelector("p").textContent = global.data.total_market_cap.inr.toLocaleString("en-IN", { style: "currency", currency: "INR" });
    document.getElementById("hero2-volume").querySelector("p").textContent = global.data.total_volume.inr.toLocaleString("en-IN", { style: "currency", currency: "INR" });
    document.getElementById("hero2-dominance").querySelector("p").textContent = global.data.market_cap_percentage.btc.toFixed(2) + "% BTC";
    document.getElementById("hero2-active").querySelector("p").textContent = global.data.active_cryptocurrencies;

    const el1 = document.getElementById("hero2-market").querySelector("span");
    const el2 = document.getElementById("hero2-volume").querySelector("span");
    value1 = global.data.market_cap_change_percentage_24h_usd;
    value2 = global.data.volume_change_percentage_24h_usd;
    if (value1 > 0) {
        el1.textContent = "+" + value1.toFixed(2) + "%";
    }
    else{
        el1.textContent = value1.toFixed(2) + "%";
    }
    if (value2 > 0) {
        el2.textContent = "+" + value2.toFixed(2) + "%";
    }
    else{
        el2.textContent = value2.toFixed(2) + "%";
    }
    setColor(el1, value1);
    setColor(el2, value2);
}
function renderTrending(trending){
    const listEl = document.getElementById("hero3-list1");
    listEl.innerHTML = "";
    trending.forEach((coin,i) => {
        const el = document.createElement("li");
        el.innerHTML = `${i+1}. ${coin.item.name} <span>₹${coin.item.data.price.toFixed(2)}</span>`;
        listEl.appendChild(el);
    });
}
function renderGainersLosers(gainers,losers){
    const listEl1 = document.getElementById("hero3-list2");
    listEl1.innerHTML = "";
    gainers.forEach((coin,i) => {
        const el = document.createElement("li");
        el.innerHTML = `${i+1}. ${coin.name} <span>+${coin.price_change_percentage_24h.toFixed(2)}%</span>`;
        listEl1.appendChild(el);
    });
    const listEl2 = document.getElementById("hero3-list3");
    listEl2.innerHTML = "";
    losers.forEach((coin,i) => {
        const el = document.createElement("li");
        el.innerHTML = `${i+1}. ${coin.name} <span>${coin.price_change_percentage_24h.toFixed(2)}%</span>`;
        listEl2.appendChild(el);
    });
    // listEl1.querySelectorAll("span").forEach(el => setColor(el, 1));
    // listEl2.querySelectorAll("span").forEach(el => setColor(el, -1));
}
function renderCoins(coins) {
}