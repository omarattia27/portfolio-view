from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from API import api_call 
from pydantic import BaseModel
from typing import List

dic_assets = {
    "Cash": "DX-Y.NYB", 
    "ETF (SPY)": "SPY", 
    "ETF (QQQ)": "QQQ", 
    "ETF (VTI)": "VTI", 
    "ETF (ARKK)": "ARKK", 
    "ETF (DIA)": "DIA", 
    "ETF (XLF)": "XLF", 
    "ETF (IWM)": "IWM",
    "REIT (PLD)": "PLD",
    "REIT (EQIX)": "EQIX", 
    "REIT (AMT)": "AMT",
    "REIT (CCI)": "CCI",
    "REIT (DLR)": "DLR", 
    "REIT (O)": "O", 
    "REIT (PSA)": "PSA",
    "REIT (SPG)": "SPG", 
    "REIT (WELL)": "WELL", 
    "REIT (AVB)": "AVB",
    "Bonds (BND)": "BND",   
    "Bonds (AGG)": "AGG",   
    "Bonds (BNDX)": "BNDX",  
    "Bonds (BSV)": "BSV",  
    "Bonds (TLT)": "TLT",   
    "Bonds (VCIT)": "VCIT",  
    "Bonds (LQD)": "LQD",   
    "Bonds (MUB)": "MUB",   
    "Bonds (BLV)": "BLV",   
    "Bonds (VCSH)": "VCSH"
}

app = FastAPI()

# Define the allowed origins (adjust as needed)
origins = [
    "http://localhost:3000",  # Allow requests from the Next.js frontend
    # Add other allowed origins here if necessary
]

# Apply CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Allow cookies and credentials
    allow_methods=["*"],     # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],     # Allow all headers
)

# Define the Loan model to represent individual loans
class Loan(BaseModel):
    id: str
    amount: float
    start_year: int
    term: int
    loan_APR: float

class Allocation(BaseModel):
    id: int
    val: float
    asset_name: str

# Define the RequestBody model to represent the request payload
class RequestBody(BaseModel):
    INFLATION: float
    END_YEAR: int
    INITIAL_SAVINGS: float
    INITIAL_SALARY: float
    INITIAL_RECURRING_COST: float
    RECURRING_COST_INCREASE_RATE: float
    PROVINCE: str
    LOANS: List[Loan]  # List of Loan objects
    ALLOCATION_INPUT_STATE: List[Allocation]

@app.post("/data")
async def read_user(data: RequestBody):
    # Access all the parameters from the request body
    loans = data.LOANS  # Access the loans list
    # print("Received Loans: ", loans)
    # print(loans)
    # print(data)

    request_obj = {
        "salary": {
            "base_salary": data.INITIAL_SALARY,
            "province": data.PROVINCE
        },

        "investment": {
            "initial_savings": data.INITIAL_SAVINGS,
            "investment_rate": 0.1,
            "assets_allocation_factors": {dic_assets[asset.asset_name]:asset.val/100 for asset in data.ALLOCATION_INPUT_STATE} #{'SPY':0.6, 'VNQ':0.4}
        },

        "living_cost": {
            "monthly_cost": data.INITIAL_RECURRING_COST/12
        },

        "loans": [{
            # "loan_amount":data.INITIAL_LOAN, 
            # "interest_rate":data.LOAN_APR, 
            # "years":data.LOAN_END_YEAR,
            "loan_amount": loan.amount,
            "interest_rate": loan.loan_APR,
            "years": loan.term
        } for loan in loans],
        "inflation":data.INFLATION,
        "years": data.END_YEAR
    }
    
    return api_call(request_obj)

    # Call the financial_planner function with the appropriate arguments
    # return financial_planner(
    #     INITIAL_SAVINGS=data.INITIAL_SAVINGS,
    #     SALARY_INCREASE_RATE=data.SALARY_INCREASE_RATE,
    #     RECURRING_COST_INCREASE_RATE=data.RECURRING_COST_INCREASE_RATE,
    #     LOANS=data.LOANS 
    # )