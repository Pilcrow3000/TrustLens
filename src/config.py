"""Configuration management for TrustLens Backend.

Loads all configuration values from environment variables using python-dotenv.
Provides default values suitable for local development.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Application configuration from environment variables.
    
    All configuration values are loaded from environment variables with
    sensible defaults for local development. Uses pathlib.Path for all
    file paths to ensure cross-platform compatibility.
    """
    
    # Server Configuration
    HOST: str = os.getenv('FASTAPI_HOST', '0.0.0.0')
    PORT: int = int(os.getenv('FASTAPI_PORT', '8000'))
    RELOAD: bool = os.getenv('FASTAPI_RELOAD', 'false').lower() == 'true'
    
    # Path Configuration (using pathlib.Path)
    MODEL_ROOT: Path = Path(os.getenv('MODEL_ROOT_DIR', './models'))
    DATA_ROOT: Path = Path(os.getenv('DATA_ROOT_DIR', './data'))
    
    # Drift Detection Defaults
    DRIFT_THRESHOLD: float = float(os.getenv('DRIFT_THRESHOLD', '0.7'))
    DRIFT_EPOCHS: int = int(os.getenv('DRIFT_EPOCHS', '50'))
    DRIFT_LEARNING_RATE: float = float(os.getenv('DRIFT_LEARNING_RATE', '0.001'))
    DRIFT_HIDDEN_DIM: int = int(os.getenv('DRIFT_HIDDEN_DIM', '32'))
    
    # Robustness Testing Defaults
    ROBUSTNESS_EPSILON_VALUES: list[float] = [
        float(x.strip()) for x in os.getenv(
            'ROBUSTNESS_EPSILON_VALUES',
            '0.0,0.01,0.05,0.1,0.2,0.3'
        ).split(',')
    ]
    ROBUSTNESS_LOSS_FUNCTION: str = os.getenv('ROBUSTNESS_LOSS_FUNCTION', 'cross_entropy')
    
    # Trust Score Default Weights
    WEIGHT_EXPLAINABILITY: float = float(os.getenv('WEIGHT_EXPLAINABILITY', '0.2'))
    WEIGHT_FAIRNESS: float = float(os.getenv('WEIGHT_FAIRNESS', '0.2'))
    WEIGHT_CALIBRATION: float = float(os.getenv('WEIGHT_CALIBRATION', '0.2'))
    WEIGHT_DRIFT: float = float(os.getenv('WEIGHT_DRIFT', '0.2'))
    WEIGHT_ROBUSTNESS: float = float(os.getenv('WEIGHT_ROBUSTNESS', '0.2'))
    
    # Aggregate default weights into a dictionary for easy access
    DEFAULT_WEIGHTS: dict[str, float] = {
        'explainability': WEIGHT_EXPLAINABILITY,
        'fairness': WEIGHT_FAIRNESS,
        'calibration': WEIGHT_CALIBRATION,
        'drift': WEIGHT_DRIFT,
        'robustness': WEIGHT_ROBUSTNESS
    }
