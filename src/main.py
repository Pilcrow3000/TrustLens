"""
TrustLens Backend - FastAPI Application Entry Point.

This module creates the FastAPI application instance and configures
the main entry point for running the server with uvicorn.
"""

from fastapi import FastAPI
from src.config import Config
from src.api.routes import router


# Create FastAPI application instance
app = FastAPI(
    title="TrustLens Backend",
    description="ML Model Auditing Platform - Automated evaluation of machine learning models across multiple dimensions: explainability, fairness, calibration, distribution drift, and adversarial robustness.",
    version="1.0.0"
)

# Include audit endpoints router
app.include_router(router)


if __name__ == "__main__":
    import uvicorn
    
    # Run the application using configuration from environment variables
    uvicorn.run(
        "src.main:app",
        host=Config.HOST,
        port=Config.PORT,
        reload=Config.RELOAD
    )
