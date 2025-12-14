"""
Security middleware for Dubai Cons AI Suite
"""

from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import time


security = HTTPBearer()


async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verify JWT token
    TODO: Implement actual token verification
    """
    token = credentials.credentials
    # Placeholder for token verification
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token


# Rate limiting middleware
class RateLimiter:
    """
    Simple rate limiter for API endpoints
    """
    
    def __init__(self, requests_per_second: int = 10):
        self.requests = {}
        self.requests_per_second = requests_per_second
    
    async def check_rate_limit(self, request: Request, client_ip: str):
        """
        Check if client exceeded rate limit
        """
        current_time = time.time()
        
        # Clean old entries
        if client_ip in self.requests:
            self.requests[client_ip] = [
                timestamp
                for timestamp in self.requests[client_ip]
                if current_time - timestamp < 1
            ]
        else:
            self.requests[client_ip] = []
        
        # Check limit
        if len(self.requests[client_ip]) >= self.requests_per_second:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later."
            )
        
        # Add current request
        self.requests[client_ip].append(current_time)


# Global rate limiter instance
rate_limiter = RateLimiter(requests_per_second=10)
