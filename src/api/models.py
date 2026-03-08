"""
Pydantic models for API request/response validation.

This module defines all request and response schemas for the TrustLens backend API,
ensuring type safety and validation at API boundaries.
"""

from pydantic import BaseModel, Field
from typing import Any, Literal


class APIResponse(BaseModel):
    """Standard response format for all endpoints.
    
    Attributes:
        status: Either "success" or "error"
        message: Human-readable description of the result
        data: Response payload (None for errors)
    """
    status: Literal["success", "error"]
    message: str
    data: dict[str, Any] | None = None


class DriftDetectionConfig(BaseModel):
    """Configuration for drift detection.
    
    Attributes:
        threshold: Drift detection threshold (0.0-1.0)
        epochs: Number of training epochs for autoencoder
        learning_rate: Optimizer learning rate
        hidden_dim: Hidden dimension size for autoencoder
    """
    threshold: float = Field(default=0.7, ge=0.0, le=1.0)
    epochs: int = Field(default=50, ge=1)
    learning_rate: float = Field(default=0.001, gt=0.0)
    hidden_dim: int = Field(default=32, ge=1)


class DriftDetectionRequest(BaseModel):
    """Request payload for drift detection endpoint.
    
    Attributes:
        reference_data: Training/baseline data for autoencoder
        test_data: Data to evaluate for drift
        config: Configuration parameters
    """
    reference_data: list[list[float]]
    test_data: list[list[float]]
    config: DriftDetectionConfig = Field(default_factory=DriftDetectionConfig)


class DriftDetectionResult(BaseModel):
    """Result from drift detection module.
    
    Attributes:
        score: Normalized drift score (0.0-1.0)
        is_drift_detected: Whether drift exceeds threshold
        metadata: Module-specific outputs including visualizations
    """
    score: float = Field(ge=0.0, le=1.0)
    is_drift_detected: bool
    metadata: dict[str, Any]


class RobustnessTestingConfig(BaseModel):
    """Configuration for adversarial robustness testing.
    
    Attributes:
        epsilon_values: List of perturbation magnitudes to test
        loss_function: Loss function for gradient computation
    """
    epsilon_values: list[float] = Field(
        default=[0.0, 0.01, 0.05, 0.1, 0.2, 0.3]
    )
    loss_function: Literal["cross_entropy", "mse"] = "cross_entropy"


class RobustnessTestingRequest(BaseModel):
    """Request payload for robustness testing endpoint.
    
    Attributes:
        model_path: Path to PyTorch model file
        test_data: Test samples for evaluation
        test_labels: True labels for test samples
        config: Configuration parameters
    """
    model_path: str
    test_data: list[list[float]]
    test_labels: list[int]
    config: RobustnessTestingConfig = Field(
        default_factory=RobustnessTestingConfig
    )


class RobustnessTestingResult(BaseModel):
    """Result from robustness testing module.
    
    Attributes:
        score: Normalized robustness score (0.0-1.0)
        metadata: Module-specific outputs including accuracy metrics
    """
    score: float = Field(ge=0.0, le=1.0)
    metadata: dict[str, Any]


class TrustScoreRequest(BaseModel):
    """Request payload for trust score aggregation.
    
    Attributes:
        scores: Dictionary mapping dimension names to scores
        weights: Optional custom weights for dimensions
    """
    scores: dict[str, float]
    weights: dict[str, float] | None = None


class TrustScoreResult(BaseModel):
    """Result from trust score aggregation.
    
    Attributes:
        trust_score: Aggregated trust score (0.0-1.0)
        metadata: Weights used and contributing scores
    """
    trust_score: float = Field(ge=0.0, le=1.0)
    metadata: dict[str, Any]
