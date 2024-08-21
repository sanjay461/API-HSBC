from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from pydantic import BaseModel, ValidationError
from typing import Optional, List
import pandas as pd

app = FastAPI()

# Load and preprocess the dataset
df = pd.read_csv('HSBC.csv')
df.columns = df.columns.str.strip().str.replace("'", "")

# JWT Configuration
class Settings(BaseModel):
    authjwt_secret_key: str = "your-secret-key"  # Change this!

@AuthJWT.load_config
def get_config():
    return Settings()

# Models
class LoginModel(BaseModel):
    username: str
    password: str

class TransactionQueryParams(BaseModel):
    category: Optional[str] = None
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    step_start: Optional[int] = None
    step_end: Optional[int] = None

# Exception handler for JWT
@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request, exc):
    return HTTPException(status_code=exc.status_code, detail=exc.message)

@app.post('/login')
def login(user: LoginModel, Authorize: AuthJWT = Depends()):
    if user.username != 'admin' or user.password != 'password':  # Replace with real authentication
        raise HTTPException(status_code=401, detail="Bad username or password")

    access_token = Authorize.create_access_token(subject=user.username)
    return {"access_token": access_token}

@app.get('/api/data')
def get_data(
    category: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    step_start: Optional[int] = None,
    step_end: Optional[int] = None,
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    filtered_df = df.copy()

    if category:
        filtered_df = filtered_df[filtered_df['category'] == f"'{category}'"]
    
    if min_amount:
        filtered_df = filtered_df[filtered_df['amount'] >= min_amount]

    if max_amount:
        filtered_df = filtered_df[filtered_df['amount'] <= max_amount]

    if step_start:
        filtered_df = filtered_df[filtered_df['step'] >= step_start]

    if step_end:
        filtered_df = filtered_df[filtered_df['step'] <= step_end]

    return filtered_df.to_dict(orient='records')

@app.get('/api/aggregate/category')
def aggregate_by_category(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    
    aggregation = df.groupby('category').agg(
        total_amount=('amount', 'sum'),
        transaction_count=('amount', 'count'),
        average_amount=('amount', 'mean')
    ).reset_index()

    return aggregation.to_dict(orient='records')

@app.get('/api/aggregate/fraud')
def fraud_analysis(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    fraud_stats = df.groupby('fraud').agg(
        total_amount=('amount', 'sum'),
        transaction_count=('amount', 'count'),
        average_amount=('amount', 'mean')
    ).reset_index()

    return fraud_stats.to_dict(orient='records')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

