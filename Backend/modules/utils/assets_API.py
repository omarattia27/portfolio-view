import yfinance as yf
import pandas as pd
import openpyxl

def fetch_historical_data(tickers, start_date, end_date):
    """
    Fetch historical adjusted close prices for a list of tickers.
    """
    '''start=start_date, end=end_date,''' 
    data = yf.download(tickers, period="max")['Close']
    #data = yf.download(tickers, period='1y')['Adj Close']

    return data

def calculate_portfolio_growth(tickers):#, allocations, initial_investment, start_date, end_date):
    """
    Calculate portfolio growth based on user-defined allocations.
    
    :param tickers: List of asset tickers.
    :param allocations: List of allocations corresponding to tickers (percentages summing to 1).
    :param initial_investment: Total initial investment amount.
    :param start_date: Start date for the historical data.
    :param end_date: End date for the historical data.
    :return: Portfolio growth DataFrame.
    """
    # Fetch historical data
    average_return_per_asset = {}

    for ticker in tickers:
        prices = fetch_historical_data([ticker], start_date, end_date)
        time_delta = prices.index[-1] - prices.index[0]
        growth_factor = float(prices.iloc[-1]/prices.iloc[0])
        years = time_delta.days/365
        rate = growth_factor**(1/years)
        average_return_per_asset[ticker]=rate
    
    return average_return_per_asset

    # # Normalize prices to start at 1 (initial value)
    # normalized_prices = prices / prices.iloc[0]

    # # Calculate weighted portfolio values
    # weights = pd.Series(allocations, index=tickers)
    # portfolio_values = normalized_prices.dot(weights)

    # # Scale to initial investment
    # portfolio_growth = portfolio_values * initial_investment

    # return float(portfolio_growth.values[-1])

# Example Usage
tickers = ['SPY', 'VNQ']  # Example tickers (S&P 500 ETF and Vanguard REIT ETF)
allocations = [0.6, 0.4]  # 60% in SPY, 40% in VNQ
initial_investment = 10000  # Initial investment of $10,000
start_date = '2020-01-01'
end_date = '2023-12-31'

final_value = calculate_portfolio_growth(tickers)#, allocations, initial_investment, start_date, end_date)
print("investment value after applied period: ",final_value)

# # Display the result
# portfolio_growth_df = portfolio_growth.to_frame(name="Portfolio Value")
# portfolio_growth_df.index.name = "Date"


# # Save to Excel if needed
# portfolio_growth_df.to_excel("portfolio_growth.xlsx")
