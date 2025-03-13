from BTrees.OOBTree import OOBTree
from pathlib import Path
import pandas as pd
import os

def income_after_tax(income:float, province:str):
    # Example: Constructing the path dynamically
    base_dir = Path(os.getcwd())# This will give you the user's home directory
    csv_dir = base_dir / 'inputs'  # Dynamically create a path to a 'data' folder inside 'Documents'
    csv_file = csv_dir / f'{province}_tax_brackets_2024.csv'  # Append the file name to the path

    # Read the CSV file
    df = pd.read_csv(csv_file, header=0, usecols=[0, 1])
    taxes_dict = dict(zip(list(df['2024 Taxable Income']), list(df['Other Income'])))

    # Display the first few rows of the dataframe
    #print(df.head())

    # Create a B-tree
    b_tree = OOBTree()

    # Add values to the B-tree
    for bracket_ceiling, marginal_rate in taxes_dict.items():
        b_tree[bracket_ceiling] = marginal_rate/100 

    # Querying the B-tree (find the highest value less than or equal to the key)
    tax_rate = 0

    try:
        tax_rate = b_tree[b_tree.minKey(income)]  # Finds the highest key <= income
        lower_brackets = [key for key in list(b_tree.keys()) if key < b_tree.minKey(income)]
        current_bracket = b_tree.minKey(income)
    except:
        tax_rate = b_tree[b_tree.maxKey(income)]
        lower_brackets = [key for key in list(b_tree.keys()) if key < b_tree.maxKey(income)]
        current_bracket = b_tree.maxKey(income)

    income_after_tax = 0
    for index in range(len(lower_brackets)):
        if index-1 >= 0:
            income_after_tax += (lower_brackets[index]-lower_brackets[index-1])*(1-taxes_dict[lower_brackets[index]]/100)
        else:
            income_after_tax += (lower_brackets[index])*(1-taxes_dict[lower_brackets[index]]/100)

    try:
        income_after_tax += (income-lower_brackets[-1])*(1-taxes_dict[current_bracket]/100)
    except:
        income_after_tax += (income)*(1-taxes_dict[current_bracket]/100)

    #print(f"Income: {income}, Tax Rate: {tax_rate}")
    #print(f"After Tax Income: ${income_after_tax}")

    return income_after_tax

