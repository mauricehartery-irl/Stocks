const chartOptions = (symbol) => ({
  autosize: true, symbol, interval: "D", timezone: "Etc/UTC", theme: "dark", style: "1", locale: "en",
  enable_publishing: false, hide_top_toolbar: true, hide_legend: true, save_image: false,
  backgroundColor: "#0e1522", gridColor: "rgba(130,150,180,0.08)", hide_volume: true,
  support_host: "https://www.tradingview.com"
});

function widget(container, name, config) {
  const script = document.createElement("script");
  script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${name}.js`;
  script.async = true;
  script.type = "text/javascript";
  script.innerHTML = JSON.stringify(config);
  container.appendChild(script);
}

function bootWidgets() {
  const containers = [...document.querySelectorAll(".tradingview-widget-container")];
  // TradingView inserts the widget iframe beside its script. Clear only our widget hosts on refresh.
  containers.forEach((host) => { host.querySelectorAll("iframe, script").forEach((el) => el.remove()); });
  widget(containers[0], "ticker-tape", { symbols: [
    { proName: "FOREXCOM:SPXUSD", title: "S&P 500" }, { proName: "NASDAQ:NDX", title: "NASDAQ 100" },
    { proName: "DJ:DJI", title: "DOW JONES" }, { proName: "TVC:NI225", title: "NIKKEI 225" },
    { proName: "TVC:UKX", title: "FTSE 100" }, { proName: "XETR:DAX", title: "DAX" },
    { proName: "EURONEXT:PX1", title: "CAC 40" }, { proName: "HKEX:HSI", title: "HANG SENG" },
    { proName: "SSE:000001", title: "SHANGHAI" }, { proName: "TVC:VIX", title: "VIX" },
    { proName: "TVC:GOLD", title: "GOLD" }, { proName: "TVC:USOIL", title: "WTI" }
  ], showSymbolLogo: true, colorTheme: "dark", isTransparent: true, displayMode: "adaptive", locale: "en" });
  ["FOREXCOM:SPXUSD", "NASDAQ:NDX", "DJ:DJI"].forEach((symbol, i) => widget(containers[i + 1], "advanced-chart", chartOptions(symbol)));
  const listConfig = (sort) => ({ colorTheme: "dark", dateRange: "1D", exchange: "US", showChart: true, locale: "en", isTransparent: true, showSymbolLogo: true, showFloatingTooltip: false, width: "100%", height: "100%", plotLineColorGrowing: "rgba(34,197,139,1)", plotLineColorFalling: "rgba(240,92,110,1)", gridLineColor: "rgba(130,150,180,0.08)", scaleFontColor: "#77869a", belowLineFillColorGrowing: "rgba(34,197,139,0.08)", belowLineFillColorFalling: "rgba(240,92,110,0.08)", belowLineFillColorGrowingBottom: "rgba(34,197,139,0)", belowLineFillColorFallingBottom: "rgba(240,92,110,0)", symbolActiveColor: "rgba(74,123,255,0.12)", tabs: [{ title: "S&P 500", symbols: [{ s: "AMEX:SPY", d: "S&P 500 components" }] }], sort, sortBy: sort, exchanges: [] });
  widget(containers[4], "market-movers", listConfig("change"));
  widget(containers[5], "market-movers", listConfig("change"));
  widget(containers[6], "stock-heatmap", { dataSource: "SPX500", blockSize: "market_cap_basic", blockColor: "change", grouping: "sector", locale: "en", symbolUrl: "", colorTheme: "dark", exchanges: [], hasTopBar: false, isTransparent: true, width: "100%", height: "100%" });
  widget(containers[7], "stock screener", { width: "100%", height: "100%", defaultColumn: "overview", defaultScreen: "most_capitalized", market: "america", showToolbar: true, colorTheme: "dark", locale: "en", isTransparent: true });
}

bootWidgets();
const dateLabel = document.querySelector(".eyebrow");
const sessionLabel = document.querySelector(".heading-side div");
function updateMarketClock() {
  const now = new Date();
  dateLabel.firstChild.textContent = new Intl.DateTimeFormat("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York"
  }).format(now).toUpperCase();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const minutes = Number(values.hour) * 60 + Number(values.minute);
  const weekday = !["Sat", "Sun"].includes(values.weekday);
  const open = weekday && minutes >= 570 && minutes < 960;
  sessionLabel.innerHTML = `US MARKET<small>${open ? "REGULAR SESSION" : "OUTSIDE REGULAR HOURS"}</small>`;
  document.querySelector(".heading-side .session-dot").style.background = open ? "var(--green)" : "#718096";
}
updateMarketClock();
window.setInterval(updateMarketClock, 60_000);
document.getElementById("refresh").addEventListener("click", (event) => {
  const button = event.currentTarget;
  button.classList.add("spin");
  bootWidgets();
  window.setTimeout(() => button.classList.remove("spin"), 650);
});

