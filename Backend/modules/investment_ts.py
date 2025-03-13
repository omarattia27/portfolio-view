from modules.ts import time_series
from modules.utils.assets_API import calculate_portfolio_growth

class investment_timeseries(time_series):
    def __init__(self, investment_rate, state_obj, assets_allocation_factors, initial_savings=0):
        super().__init__()
        self.investment_rate = investment_rate  # Percentage of salary allocated to investment
        #self.distribution_function = distribution_function  # Function to calculate return rate
        self.state_obj = state_obj  # State object for the distribution function
        self.accumulated_investment = initial_savings  # Total accumulated investment so far
        self.return_rate_per_asset = calculate_portfolio_growth(list(assets_allocation_factors.keys()))
        self.assets_allocation_factors = assets_allocation_factors

    def update(self, year, contribution_value, **kwargs):
        """
        Update the investment for the year, including new investments and dynamically calculated returns.
        """
        investment_return = 0
        for asset, asset_return_rate in self.return_rate_per_asset.items():
            # Calculate returns on accumulated investment using the dynamic return rate
            investment_return += self.accumulated_investment * (asset_return_rate-1) * self.assets_allocation_factors[asset]

        # Update accumulated investment
        self.accumulated_investment += contribution_value

        # Store total investment return for the year in TS
        self.TS[year] = investment_return

        # Add the new investment to the accumulated total
        self.accumulated_investment += investment_return

