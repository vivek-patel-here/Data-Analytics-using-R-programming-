options(warn = -1)

args <- commandArgs(trailingOnly = TRUE)
stock <- args[1]

suppressPackageStartupMessages({
  library(quantmod)
  library(TTR)
  library(ggplot2)
  library(zoo)
  library(plotly)
  library(jsonlite)
})

data <- suppressWarnings(
  getSymbols(stock, src="yahoo", auto.assign = FALSE)
)

data <- na.omit(data)
data <- na.approx(data)


data$SMA20 <- SMA(Cl(data), n = 20)
data$EMA50 <- EMA(Cl(data), n = 50)
data$RSI14 <- RSI(Cl(data), n = 14)

macd <- MACD(Cl(data))
data$MACD <- macd$macd
data$Signal <- macd$signal


df <- data.frame(date = index(data), coredata(data))

colnames(df) <- c(
  "date","Open","High","Low","Close",
  "Volume","Adjusted","SMA20","EMA50",
  "RSI14","MACD","Signal"
)

df <- na.omit(df)


df$date <- as.POSIXct(df$date)


df$tradeSignal <- "HOLD"
df$tradeSignal[df$RSI14 < 30] <- "BUY"
df$tradeSignal[df$RSI14 > 70] <- "SELL"


latest <- tail(df,1)

summary <- data.frame(
  stock = stock,
  price = round(latest$Close,2),
  rsi = round(latest$RSI14,2),
  trend = ifelse(latest$SMA20 > latest$EMA50,"Bullish","Bearish"),
  signal = latest$tradeSignal
)

write.csv(summary, file.path("public","summary.csv"), row.names = FALSE)

# ---------- PLOT 1 : PRICE ----------
p1 <- ggplot(df, aes(x=date)) +
  geom_line(aes(y=Close), linewidth=0.8) +
  geom_line(aes(y=SMA20), linewidth=0.7, alpha=0.8) +
  geom_line(aes(y=EMA50), linewidth=0.7, alpha=0.8) +
  geom_point(data=subset(df, tradeSignal=="BUY"),
             aes(y=Close), shape=24, fill="green", size=3) +
  geom_point(data=subset(df, tradeSignal=="SELL"),
             aes(y=Close), shape=25, fill="red", size=3) +
  labs(
    title=paste(stock,"Price Analysis"),
    subtitle="Close Price with SMA20 & EMA50 + Signals",
    x=NULL,
    y="Price"
  ) +
  theme_minimal(base_size = 14)

p1_plotly <- suppressMessages(suppressWarnings(ggplotly(p1)))

# ---------- PLOT 2 : VOLUME ----------
p2 <- ggplot(df, aes(x=date, y=Volume)) +
  geom_col() +
  labs(title=paste(stock,"Volume Analysis"), x=NULL, y="Volume") +
  theme_minimal(base_size = 14)

p2_plotly <- suppressMessages(suppressWarnings(ggplotly(p2)))

# ---------- PLOT 3 : RSI ----------
p3 <- ggplot(df, aes(x=date, y=RSI14)) +
  geom_ribbon(aes(ymin=70, ymax=100), fill="red", alpha=0.1) +
  geom_ribbon(aes(ymin=0, ymax=30), fill="blue", alpha=0.1) +
  geom_line(linewidth=0.8) +
  geom_hline(yintercept=70, linetype="dashed") +
  geom_hline(yintercept=30, linetype="dashed") +
  labs(title=paste(stock,"RSI Indicator"), x=NULL, y="RSI") +
  theme_minimal(base_size = 14)

p3_plotly <- suppressMessages(suppressWarnings(ggplotly(p3)))

# ---------- PLOT 4 : MACD ----------
p4 <- ggplot(df, aes(x=date)) +
  geom_line(aes(y=MACD)) +
  geom_line(aes(y=Signal)) +
  labs(title=paste(stock,"MACD Indicator"), x=NULL, y="MACD") +
  theme_minimal(base_size = 14)

p4_plotly <- suppressMessages(suppressWarnings(ggplotly(p4)))



extract_plot <- function(p){
  list(
    data = p$x$data,
    layout = p$x$layout
  )
}

plots <- list(
  p1 = extract_plot(p1_plotly),
  p2 = extract_plot(p2_plotly),
  p3 = extract_plot(p3_plotly),
  p4 = extract_plot(p4_plotly)
)

writeLines(jsonlite::toJSON(plots, auto_unbox = TRUE, digits = NA))

# OHLCV yahoo finance historical data 
# Open
# High
# Low
# Close
# Volume
# Adjusted

