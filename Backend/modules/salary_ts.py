from modules.ts import time_series
from modules.utils.tax import income_after_tax

class salary_timeseries(time_series):
    def __init__(self, base_salary, state_obj, distribution_function,inflation, province):
        super().__init__()
        self.base_salary = base_salary  # Initial gross salary
        self.state_obj = state_obj  # State object for custom parameters
        self.distribution_function = distribution_function  # Salary growth function
        self.province = province  # Province for tax calculation
        self.pre_tax_salary = base_salary
        self.inflation = inflation

    def update(self, year, **kwargs):
        """
        Update the gross and net salary for the year.
        """
        if year == 0:
            gross_salary = self.base_salary
        else:
            gross_salary = self.distribution_function(self.pre_tax_salary, self.inflation)
            self.pre_tax_salary = gross_salary

        # Calculate net salary after taxes
        net_salary = income_after_tax(gross_salary, self.province)

        # Store net salary in the time series
        self.TS[year] = net_salary
