from financial_planner import financial_planner
import random


# Salary distribution function
def salary_increase_distribution(current_value, inflation):
    salary_growth = random.uniform(0.03, 0.065)  # Random growth rate between 3% and 7%
    return current_value * (1 + salary_growth + inflation)

def recurrent_cost_increase_distribution(current_recurrent_cost, inflation):
    recurrent_cost_growth = random.uniform(0.00, 0.03)  # Random growth rate between 3% and 7%
    return current_recurrent_cost * (1 + recurrent_cost_growth + inflation)

# Investment return distribution function
# not needed anymore as the asset allocation function does the same thing with refrence to real historic data
# def investment_return_distribution(state_obj):
#     base_return_rate = state_obj.get("base_return_rate", 0.10)
#     annual_variation = random.uniform(-0.02, 0.02)  # Annual variation of -1% to +2%
#     return base_return_rate + annual_variation

request_obj = {
    "salary": {
        "base_salary": 50000,
        "province": "BC"
    },

    "investment": {
        "initial_savings": 50000,
        "investment_rate": 0.1,
        "assets_allocation_factors": {'SPY':0.6, 'QQQ':0.4}
    },

    "living_cost": {
        "monthly_cost":2000
    },

    "loans": [{
        "loan_amount":10000, 
        "interest_rate":0.05, 
        "years":10
    }],
    "inflation":0.03,

    "years": 40
}

#etfs = ["SPY", "QQQ", "VTI", "ARKK", "DIA", "XLF", "IWM"]

def api_call(request_obj):
    salaryInput = request_obj["salary"]
    investmentInput = request_obj["investment"]
    costInput = request_obj["living_cost"]
    loansInput = request_obj["loans"]
    inflationInput = request_obj["inflation"]
    yearsInput = request_obj["years"]
    initialSaving = request_obj["investment"]["initial_savings"]

    # Initialize financial planner
    planner = financial_planner(years=yearsInput, initial_savings=initialSaving)

    # Add salary with dynamic distribution function
    planner.add_salary(
        base_salary = salaryInput["base_salary"],
        province=salaryInput["province"],
        distribution_function = salary_increase_distribution, 
        inflation=inflationInput,
        state_obj={"base_salary": 50000},
    )

    # Add investment with dynamic return rate
    planner.add_investment(
        investment_rate = investmentInput["investment_rate"],
        state_obj={"base_return_rate": 0.1},
        assets_allocation_factors = investmentInput["assets_allocation_factors"], #{'SPY':0.6, 'VNQ':0.4}
        initial_savings=initialSaving
    )

    # Add living costs
    planner.add_living_costs(monthly_cost=costInput["monthly_cost"], inflation=inflationInput, recurrent_cost_increase_distribution=recurrent_cost_increase_distribution)

    # Add loan
    for loan in loansInput:
        planner.add_loan(loan_amount=loan["loan_amount"], interest_rate=loan["interest_rate"], years=loan["years"])

    # Run simulation
    planner.simulate()

    # Print results
    planner.summary()

    # Apply inflation adjustment (e.g., 3% annual inflation)
    planner.apply_inflation_adjustment(inflation_rate=inflationInput)

    # Print results
    planner.summary()

    return planner.results_to_json()

# results = api_call(request_obj)

# pass
