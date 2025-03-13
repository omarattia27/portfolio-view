from modules.ts import time_series

class living_cost_timeseries(time_series):
    def __init__(self, monthly_cost, recurrent_cost_increase_distribution, inflation):
        super().__init__()
        self.monthly_cost = monthly_cost
        self.recurrent_cost_increase_distribution = recurrent_cost_increase_distribution
        self.inflation = inflation

    def update(self, year, **kwargs):
        """
        Fixed annual recurrent cost.
        """
        self.TS[year] = self.monthly_cost * 12
        self.monthly_cost = self.recurrent_cost_increase_distribution(self.monthly_cost, self.inflation)
