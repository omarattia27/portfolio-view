from modules.ts import time_series

class loan_timeseries(time_series):
    def __init__(self, loan_amount, interest_rate, years):
        super().__init__()
        self.remaining_balance = loan_amount
        self.interest_rate = interest_rate
        self.years = years

    def update(self, year, net_credit, **kwargs):
        """
        Update the remaining balance and payments dynamically.
        """
        if year >= self.years or self.remaining_balance <= 0:
            self.TS[year] = 0
            return 0

        # Add interest
        interest = self.remaining_balance * self.interest_rate

        # Deduct payment from net credit
        payment = min(net_credit, self.remaining_balance + interest)

        # Update remaining balance
        self.remaining_balance += interest - payment

        # Store remaining balance in the time series
        self.TS[year] = self.remaining_balance

        return payment
