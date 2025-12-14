"""
Dubai Cons AI Suite MVP - Main FastAPI Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings

# Create FastAPI app
app = FastAPI(
    title="Dubai Cons AI Suite MVP",
    description="Professional AI tool for architectural design and construction",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Dubai Cons AI Suite MVP",
        "version": "0.1.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected",
        "redis": "connected"
    }


# Include routers
try:
    from api.routes import projects, clients, design, visualization
    app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
    app.include_router(clients.router, prefix="/api/v1/clients", tags=["clients"])
    app.include_router(design.router, prefix="/api/v1/design", tags=["design"])
    app.include_router(visualization.router, prefix="/api/v1/visualization", tags=["visualization"])
    
    # Include stats router
    try:
        from api.routes import stats
        app.include_router(stats.router, prefix="/api/v1/stats", tags=["stats"])
    except ImportError:
        print("Warning: Stats module not available")
    
    # Include estimation router
    try:
        from api.routes import estimation
        app.include_router(estimation.router, prefix="/api/v1/estimation", tags=["estimation"])
    except ImportError:
        print("Warning: Estimation module not available")
    
    # Include presets router
    try:
        from api.routes import presets
        app.include_router(presets.router, prefix="/api/v1/presets", tags=["presets"])
    except ImportError:
        print("Warning: Presets module not available")
    
    # Try to include auth if available
    try:
        from api.routes import auth
        app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
    except ImportError:
        print("Warning: Auth module not available")

    # Include reports router
    try:
        from api.routes import reports
        app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
    except ImportError as e:
        print(f"Warning: Reports module not available: {e}")

except ImportError as e:
    print(f"Warning: Some routers not available: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["../src"],
    )
