from modules.ts import time_series

class totla_loan_timeseries(time_series):
    def __init__(self, initial_value=0):
        super().__init__()
        self.TS[0] = initial_value

    def update(self, year, val, **kwargs):
        """
        Fixed annual recurrent cost.
        """
        self.TS[year] = val