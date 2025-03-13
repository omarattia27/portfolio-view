from modules.cost_ts import living_cost_timeseries
from modules.investment_ts import investment_timeseries
from modules.loan_ts import loan_timeseries
from modules.total_loan_ts import totla_loan_timeseries
from modules.salary_ts import salary_timeseries
from modules.savings_ts import savings_timeseries

def dict_to_JSON_timeseiese(transaction_timeseriese, type):
    json_data = {
        "label": type,
        "data": [
            {
                "primary": f"{str(year).zfill(2)}",
                "secondary": transaction_timeseriese[year]
            }
            for year in sorted(list(transaction_timeseriese.keys()))
        ]
    }
    
    return json_data

class financial_planner:
    def __init__(self, years, initial_savings):
        self.years = years
        self.salary_ts = None
        self.investment_ts = None
        self.recurrent_cost_ts = None
        self.loans = []
        self.net_credit_ts = {}
        self.total_loan_ts = totla_loan_timeseries()
        self.savings_ts = savings_timeseries(initial_value=initial_savings)
        print("initial salary: ",self.savings_ts)
    
    def apply_inflation_adjustment(self, inflation_rate):
        """
        Apply inflation adjustment to all time series.
        :param inflation_rate: Annual inflation rate (e.g., 0.03 for 3%)
        """
        cumulative_inflation = 1.0  # Start with no inflation adjustment
        inflation_factors = {}  # Store cumulative inflation factors for each year

        for year in range(self.years):
            cumulative_inflation *= (1 + inflation_rate)  # Calculate cumulative inflation
            inflation_factors[year] = cumulative_inflation

        # Adjust each time series
        for ts_name, ts_object in [
            ("Salary", self.salary_ts),
            ("Investment", self.investment_ts),
            ("Living Costs", self.recurrent_cost_ts),
            ("Loan", self.total_loan_ts),
            ("Savings", self.savings_ts)
        ]:
            for year, value in ts_object.TS.items():
                ts_object.TS[year] = value / inflation_factors[year]

        # Adjust net credit time series
        for year, value in self.net_credit_ts.items():
            self.net_credit_ts[year] = value / inflation_factors[year]

        if self.investment_ts:
            self.investment_ts.accumulated_investment /= cumulative_inflation

    def add_salary(self, base_salary, province, distribution_function, inflation, state_obj):
        """
        Add salary with a distribution function for dynamic salary changes.
        """
        self.salary_ts = salary_timeseries(
            base_salary=base_salary,
            state_obj=state_obj,
            distribution_function=distribution_function,
            inflation=inflation,
            province=province,
        )

    def add_investment(self, investment_rate, state_obj, assets_allocation_factors, initial_savings):
        """
        Add investments with a dynamic distribution function for return rates.
        """
        self.investment_ts = investment_timeseries(
            investment_rate=investment_rate,
            #distribution_function=distribution_function,
            state_obj=state_obj,
            assets_allocation_factors=assets_allocation_factors,
            initial_savings=initial_savings
        )

    def add_living_costs(self, monthly_cost, recurrent_cost_increase_distribution, inflation):
        """
        Add recurrent living costs.
        """
        self.recurrent_cost_ts = living_cost_timeseries(monthly_cost, recurrent_cost_increase_distribution, inflation)

    def add_loan(self, loan_amount, interest_rate, years):
        """
        Add a loan with specified parameters.
        """
        self.loans.append(loan_timeseries(loan_amount, interest_rate, years))
        

    def simulate(self):
        """
        Simulate all time series updates year by year.
        """
        for year in range(self.years):
            # Update salary
            self.salary_ts.update(year)

            # Update living costs
            self.recurrent_cost_ts.update(year)

            # Calculate net credit
            salary = self.salary_ts.TS.get(year, 0)
            #investment_return = self.investment_ts.TS.get(year, 0)
            living_cost = self.recurrent_cost_ts.TS.get(year, 0)

            net_credit = salary - living_cost

            # Update loan payments
            total_payment = 0
            for loan_ts in self.loans:
                loan_payment = loan_ts.update(year, net_credit=net_credit)
                net_credit -= loan_payment
                total_payment += loan_payment
            self.total_loan_ts.update(year, total_payment)
            
            # loan_payment = self.loan_ts.update(year, net_credit=net_credit)
            # net_credit -= loan_payment

            # Reinvest remaining positive net credit
            if net_credit > 0:
                self.investment_ts.update(
                    year, contribution_value=net_credit
                )
                #print(f"Contributed {net_credit}")
                net_credit = 0  # Reset net credit after reinvestment
            else:
                self.investment_ts.update(
                    year, contribution_value=0
                )
            #print(f"For year {year}, accumelated investment value is {self.investment_ts.accumulated_investment}")

            # Store the net credit for the year
            self.net_credit_ts[year] = net_credit
            self.savings_ts.update(
                    year=year, val=self.investment_ts.accumulated_investment
            )

    def summary(self):
        """
        Print a summary of all the financial time series.
        """
        # print("Salary Time Series:", self.salary_ts.TS)
        # print("Investment Time Series (Returns):", self.investment_ts.TS)
        # print("Living Costs Time Series:", self.recurrent_cost_ts.TS)
        # print("Loan Remaining Balance Time Series:", self.loan_ts.TS)
        # print("Net Credit Time Series:", self.net_credit_ts)
        #print("Accumlated Savimgs Time Series:", self.investment_ts.accumulated_investment)
        pass

    def results_to_json(self):
        loan_JSON = dict_to_JSON_timeseiese(self.total_loan_ts.TS, "loan")
        salary_JSON = dict_to_JSON_timeseiese(self.salary_ts.TS, "salary")
        recurring_cost_JSON = dict_to_JSON_timeseiese(self.recurrent_cost_ts.TS, "Cost")
        savings_JSON = dict_to_JSON_timeseiese(self.savings_ts.TS, "Savings")
        return [loan_JSON,salary_JSON,recurring_cost_JSON,savings_JSON]
