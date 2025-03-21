from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2AuthorizationCodeBearer
from authlib.integrations.starlette_client import OAuth
from fastapi.middleware.cors import CORSMiddleware
from API import api_call 
from pydantic import BaseModel
from typing import List
import requests
import os

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

# 🔹 Authentik OAuth2 Configuration
AUTHENTIK_DOMAIN = "http://host.docker.internal:9000"
AUTHENTIK_CLIENT_ID = os.getenv("AUTHENTIK_CLIENT_ID")
AUTHENTIK_CLIENT_SECRET = os.getenv("AUTHENTIK_CLIENT_SECRET")

print(AUTHENTIK_CLIENT_ID)
print(AUTHENTIK_CLIENT_SECRET)

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f"{AUTHENTIK_DOMAIN}/application/o/authorize/",
    tokenUrl=f"{AUTHENTIK_DOMAIN}/application/o/token/"
)

oauth = OAuth()
oauth.register(
    name="authentik",
    client_id=AUTHENTIK_CLIENT_ID,
    client_secret=AUTHENTIK_CLIENT_SECRET,
    authorize_url=f"{AUTHENTIK_DOMAIN}/application/o/authorize/",
    access_token_url=f"{AUTHENTIK_DOMAIN}/application/o/token/",
    client_kwargs={"scope": "openid profile email"},
)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    print("===>  ", token)
    user_info = requests.get(
        f"{AUTHENTIK_DOMAIN}/application/o/userinfo/",  # FIXED!
        headers={"Authorization": f"Bearer {token}"}
    )
    if user_info.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid authentication")

    return user_info.json()

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

# # 🔹 OAuth2 Dependency for Protected Routes
# async def get_current_user(token: str = Depends(oauth2_scheme)):
#     print("===>  ",token)
#     user_info = requests.get(
#         f"{AUTHENTIK_DOMAIN}/application/o/userinfo/", 
#         headers={"Authorization": f"Bearer {token}"}
#     )
#     #print(token)
#     print("user_info ===>   ",user_info)
#     if user_info.status_code != 200:
#         raise HTTPException(status_code=401, detail="Invalid authentication")
    
#     return user_info.json()

# async def get_current_user(token: str = Depends(oauth2_scheme)):
#     print(f"===> Received token: {token}")  # Debugging
#     user_info = requests.get(
#         f"{AUTHENTIK_DOMAIN}/application/o/portfolio/userinfo/",
#         headers={"Authorization": f"Bearer {token}"}
#     )
#     print(f"===> Authentik response status: {user_info.status_code}")  # Debugging
#     #print(f"===> Authentik response body: {user_info.text}")  # Debugging

#     if user_info.status_code != 200:
#         raise HTTPException(status_code=401, detail="Invalid authentication")

#     return user_info.json()


# 🔹 Protected API Route
@app.get("/protected-data")
async def protected_route(user: dict = Depends(get_current_user)):
    return {"message": f"Hello, {user['preferred_username']}!"}

    # Call the financial_planner function with the appropriate arguments
    # return financial_planner(
    #     INITIAL_SAVINGS=data.INITIAL_SAVINGS,
    #     SALARY_INCREASE_RATE=data.SALARY_INCREASE_RATE,
    #     RECURRING_COST_INCREASE_RATE=data.RECURRING_COST_INCREASE_RATE,
    #     LOANS=data.LOANS 
    # )