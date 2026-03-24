//___________________________________________Initial_________________________________________________________________

document.addEventListener("DOMContentLoaded", init);
const Models = [];
async function init() {
  try {
    const models = await loadModels();
    Models.splice(0, Models.length, ...models);
    await loadData();
  } catch (err) {
    console.error("Initialization failed:", err);
  }
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
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/global?x_cg_api_key=${key}`,
    );
    const data = await res.json();
    console.log("Global Data loaded :", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch CoinGecko data:", err);
  }
}
async function fetchTrending() {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/search/trending?x_cg_api_key=${key}`,
    );
    const data = await res.json();
    const trending = data.coins.slice(0, 10);
    console.log("trending Data loaded :", trending);
    return trending;
  } catch (err) {
    console.error("Failed to fetch CoinGecko data:", err);
  }
}
async function fetchGainersLosers() {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=250&page=1&price_change_percentage=24h&x_cg_api_key=${key}`,
    );
    const data = await res.json();
    const valid = data.filter((c) => c.price_change_percentage_24h !== null);
    const gainers = [...valid]
      .sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
      )
      .slice(0, 11);

    const losers = [...valid]
      .sort(
        (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h,
      )
      .slice(0, 11);
    console.log("Top Gainers:", gainers);
    console.log("Top Losers:", losers);
    return { gainers, losers };
  } catch (err) {
    console.error("Failed to fetch CoinGecko data:", err);
  }
}
const coins = [
  "aave",
  "binancecoin",
  "bitcoin",
  "cardano",
  "chainlink",
  "cosmos",
  "crypto-com-chain",
  "dogecoin",
  "eos",
  "ethereum",
  "iota",
  "litecoin",
  "monero",
  "nem",
  "polkadot",
  "solana",
  "stellar",
  "tether",
  "tron",
  "uniswap",
  "usd-coin",
  "wrapped-bitcoin",
  "ripple",
];
async function fetchList(id = coins) {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${id}&x_cg_api_key=${key}`,
    );
    const data = await res.json();
    data.sort((a, b) => a.name.localeCompare(b.name));
    console.log("Coins data :", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch CoinGecko data:", err);
  }
}
async function fetchOHLC(id) {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/ohlc?vs_currency=inr&days=30&x_cg_api_key=${key}`,
    );
    const data = await res.json();
    const daily = [];
    for (let i = 0; i < data.length; i += 6) {
      const chunk = data.slice(i, i + 6);

      const open = chunk[0][1];
      const close = chunk[chunk.length - 1][4];
      const high = Math.max(...chunk.map((x) => x[2]));
      const low = Math.min(...chunk.map((x) => x[3]));

      daily.push([open, high, low, close]);
    }

    console.log("OHLC data :", daily);
    return daily;
  } catch (err) {
    console.error("Failed to fetch CoinGecko data:", err);
  }
}

async function loadData() {
  try {
    const [global, trending, gainersLosers, coins] = await Promise.all([
      fetchglobal(),
      fetchTrending(),
      fetchGainersLosers(),
      fetchList(),
    ]);
    const { gainers, losers } = gainersLosers;
    renderGlobal(global);
    renderTrending(trending);
    renderGainersLosers(gainers, losers);
    renderList(coins);
  } catch (err) {
    console.error("Failed to fetch CoinGecko data:", err);
  }
}

// //___________________________________________Render_________________________________________________________________
function setColor(el, value) {
  if (value > 0) {
    el.style.color = "var(--green)";
  } else if (value < 0) {
    el.style.color = "var(--red)";
  } else {
    el.style.color = "gray";
  }
}
function renderGlobal(global) {
  document.getElementById("hero2-market").querySelector("p").textContent =
    global.data.total_market_cap.inr.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  document.getElementById("hero2-volume").querySelector("p").textContent =
    global.data.total_volume.inr.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  document.getElementById("hero2-dominance").querySelector("p").textContent =
    global.data.market_cap_percentage.btc.toFixed(2) + "% BTC";
  document.getElementById("hero2-active").querySelector("p").textContent =
    global.data.active_cryptocurrencies;

  const el1 = document.getElementById("hero2-market").querySelector("span");
  const el2 = document.getElementById("hero2-volume").querySelector("span");
  const value1 = global.data.market_cap_change_percentage_24h_usd;
  const value2 = global.data.volume_change_percentage_24h_usd;
  el1.textContent = (value1 > 0 ? "+" : "") + value1.toFixed(2) + "%";
  el2.textContent = (value2 > 0 ? "+" : "") + value2.toFixed(2) + "%";
  setColor(el1, value1);
  setColor(el2, value2);
}
function renderTrending(trending) {
  const listEl = document.getElementById("hero3-list1");
  listEl.innerHTML = "";
  trending.forEach((coin, i) => {
    const el = document.createElement("li");
    el.innerHTML = `${i + 1}. ${coin.item.name} <span>₹${coin.item.data.price.toFixed(2)}</span>`;
    listEl.appendChild(el);
  });
}
function renderGainersLosers(gainers, losers) {
  const listEl1 = document.getElementById("hero3-list2");
  listEl1.innerHTML = "";
  gainers.forEach((coin, i) => {
    const el = document.createElement("li");
    el.innerHTML = `${i + 1}. ${coin.name} <span>+${coin.price_change_percentage_24h.toFixed(2)}%</span>`;
    listEl1.appendChild(el);
  });
  const listEl2 = document.getElementById("hero3-list3");
  listEl2.innerHTML = "";
  losers.forEach((coin, i) => {
    const el = document.createElement("li");
    el.innerHTML = `${i + 1}. ${coin.name} <span>${coin.price_change_percentage_24h.toFixed(2)}%</span>`;
    listEl2.appendChild(el);
  });
  // listEl1.querySelectorAll("span").forEach(el => setColor(el, 1));
  // listEl2.querySelectorAll("span").forEach(el => setColor(el, -1));
}
function renderList(coins) {
  const listEl = document.getElementById("list-list");
  listEl.innerHTML = `<li id="list-el" class="list-el">
                    <h4>Coin</h4>
                    <p>Price</p>
                    <p>24h%</p>
                    <p>High 24h</p>
                    <p>Low 24h</p>
                    <p>Prediction</p>
                    <p>Confidence</p>
                </li>`;

  coins.forEach((coin, i) => {
    const el = document.createElement("li");
    el.classList.add("list-el");
    el.innerHTML = `<h4><img src="${coin.image}" alt="hell">${coin.name}</h4>
                    <p>${coin.current_price.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</p>
                    <p>${(coin.price_change_percentage_24h > 0 ? "+" : "") + coin.price_change_percentage_24h.toFixed(2) + "%"}</p>
                    <p>${coin.high_24h.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</p>
                    <p>${coin.low_24h.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</p>
                    <p><i class="fa-solid fa-magnifying-glass-chart"></i></p>
                    <p></p>`;
    listEl.appendChild(el);
    el.querySelectorAll("p")[4].addEventListener("click", () => {
      fetchOHLC(coin.id).then((ohlc) => {
        const model = Models[i];
        const features = [
          ohlc[0][0],
          ohlc[0][1],
          ohlc[0][2],
          ohlc[0][3],
          coin.total_volume,
        ];
        console.log("clicked on coin , features:",ohlc);
        const [prediction, confidence] = predict(features,ohlc, model);
        el.querySelectorAll("p")[4].textContent = prediction;
        el.querySelectorAll("p")[5].textContent = confidence;
      });
    });
    const listEls = document.querySelectorAll(".list-el");
    listEls.forEach((el, i) => {
      if (i > 0) {
        setColor(
          el.querySelectorAll("p")[1],
          parseFloat(el.querySelectorAll("p")[1].textContent),
        );
      }
    });
  });
}

//___________________________________________ML_________________________________________________________________
async function loadModels() {
  const modelFiles = [
    "ml_model/weights/coin_Aave.json",
    "ml_model/weights/coin_BinanceCoin.json",
    "ml_model/weights/coin_Bitcoin.json",
    "ml_model/weights/coin_Cardano.json",
    "ml_model/weights/coin_ChainLink.json",
    "ml_model/weights/coin_Cosmos.json",
    "ml_model/weights/coin_CryptocomCoin.json",
    "ml_model/weights/coin_Dogecoin.json",
    "ml_model/weights/coin_EOS.json",
    "ml_model/weights/coin_Ethereum.json",
    "ml_model/weights/coin_Iota.json",
    "ml_model/weights/coin_Litecoin.json",
    "ml_model/weights/coin_Monero.json",
    "ml_model/weights/coin_NEM.json",
    "ml_model/weights/coin_Polkadot.json",
    "ml_model/weights/coin_Solana.json",
    "ml_model/weights/coin_Stellar.json",
    "ml_model/weights/coin_Tether.json",
    "ml_model/weights/coin_Tron.json",
    "ml_model/weights/coin_Uniswap.json",
    "ml_model/weights/coin_USDCoin.json",
    "ml_model/weights/coin_WrappedBitcoin.json",
    "ml_model/weights/coin_XRP.json",
  ];
  const models = [];

  for (const file of modelFiles) {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Model file failed: ${file} (${response.status})`);
    }
    const model = await response.json();
    models.push(model);
  }
  console.log("ML Models loaded:", models);
  return models;
}
function predict(features, data, model) {
  const engineeredFeatures = computeFeatures(data);
  const allFeatures = [...features, ...engineeredFeatures];
  const safeFeature = (value) => (Number.isFinite(value) ? value : 0);
  let result = Number.isFinite(model.bias) ? model.bias : 0;

  for (let i = 0; i < model.weights.length; i++) {
    const featureValue = safeFeature(allFeatures[i]);
    const weightValue = safeFeature(model.weights[i]);
    result += featureValue * weightValue;
  }

  const prob = 1 / (1 + Math.exp(-result));
  return [prob > 0.5 ? "UP" : "DOWN", prob.toFixed(4)];
}

function computeFeatures(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return [0, 0, 0, 0];
  }

  const safeNumber = (value) => (Number.isFinite(value) ? value : 0);
  const lastIndex = data.length - 1;
  const [, high, low, close] = data[lastIndex];
  const prevClose = lastIndex > 0 ? data[lastIndex - 1][3] : close;

  const ret = prevClose ? (close - prevClose) / prevClose : 0;

  let ma7 = close;
  if (data.length >= 7) {
    let sum = 0;
    for (let i = data.length - 7; i < data.length; i++) {
      sum += data[i][3];
    }
    ma7 = sum / 7;
  }

  let volatility7 = 0;
  if (data.length >= 7) {
    const returns = [];
    for (let i = data.length - 7; i < data.length; i++) {
      if (i > 0) {
        const prev = data[i - 1][3];
        const curr = data[i][3];
        if (prev) {
          returns.push((curr - prev) / prev);
        }
      }
    }
    if (returns.length) {
      const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
      const variance =
        returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
      volatility7 = Math.sqrt(variance);
    }
  }

  const hlRange = high - low;

  return [
    safeNumber(ret),
    safeNumber(ma7),
    safeNumber(volatility7),
    safeNumber(hlRange),
  ];
}
