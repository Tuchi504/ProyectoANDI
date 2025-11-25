from pydantic import BaseModel
from typing import Optional


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict
