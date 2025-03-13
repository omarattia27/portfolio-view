from financial_planner import financial_planner
import random
import pandas as pd


df = pd.read_csv("inputs/wages_db.csv")

df.drop(['NOC_Title_fra', 'Data_Source_E', 'Data_Source_F', 'Wage_Comment_E', 'Wage_Comment_F', 'Reference_Period', 'Quartile1_Wage_Salaire_Quartile1', 'Quartile3_Wage_Salaire_Quartile3', 'Nom_RE'], axis=1, inplace=True)

df = df[df['Annual_Wage_Flag_Salaire_annuel'].isin([1,'1'])]

df = df.dropna(subset=['Average_Wage_Salaire_Moyen'])

df.to_csv("wages_filtered.csv") 

pass

# Salary distribution function
def salary_increase_distribution(current_value):
    salary_growth = random.uniform(0.03, 0.07)  # Random growth rate between 3% and 7%
    return current_value * (1 + salary_growth )

# Investment return distribution function
def investment_return_distribution(state_obj):
    base_return_rate = state_obj.get("base_return_rate", 0.10)
    annual_variation = random.uniform(-0.02, 0.02)  # Annual variation of -1% to +2%
    return base_return_rate + annual_variation


# Initialize financial planner
planner = financial_planner(years=40, initial_savings=0)

# Add salary with dynamic distribution function
planner.add_salary(
    base_salary=50000,
    distribution_function=salary_increase_distribution,
    state_obj={"base_salary": 50000},
)

# Add investment with dynamic return rate
planner.add_investment(
    investment_rate=0.1,
    distribution_function=investment_return_distribution,
    state_obj={"base_return_rate": 0.1},
    assets_allocation_factors = {'SPY':0.6, 'VNQ':0.4}
)

# Add living costs
planner.add_living_costs(monthly_cost=2000)

# Add loan
planner.add_loan(loan_amount=10000, interest_rate=0.05, years=10)

# Run simulation
planner.simulate()

# Apply inflation adjustment (e.g., 3% annual inflation)
planner.apply_inflation_adjustment(inflation_rate=0.03)

# Print results
planner.summary()




