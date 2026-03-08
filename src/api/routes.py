"""
FastAPI routes for TrustLens audit endpoints.

This module defines all REST API endpoints for the TrustLens backend, including
drift detection, robustness testing, and trust score aggregation.
"""

from fastapi import APIRouter, HTTPException
from src.api.models import (
    APIResponse,
    DriftDetectionRequest,
    RobustnessTestingRequest,
    TrustScoreRequest
)
from src.audit.drift_detector import AutoencoderDriftDetector
from src.audit.robustness_tester import FGSMRobustnessTester
from src.audit.aggregator import TrustScoreAggregator


router = APIRouter(prefix="/audit", tags=["audit"])


@router.post("/drift", response_model=APIResponse)
async def detect_drift(request: DriftDetectionRequest):
    """Detect distribution drift using autoencoder reconstruction error.
    
    This endpoint trains an autoencoder on reference data and evaluates
    reconstruction errors on test data to identify distribution shifts.
    
    Args:
        request: DriftDetectionRequest containing reference_data, test_data, and config
        
    Returns:
        APIResponse with status="success" and drift detection results including:
            - score: Normalized drift score (0-1)
            - is_drift_detected: Boolean flag
            - mean_reconstruction_error: Mean error on test data
            - std_reconstruction_error: Standard deviation of errors
            - training_loss_plot: Base64-encoded training curve
            - error_histogram: Base64-encoded error distribution
            
    Raises:
        HTTPException: 500 error if drift detection fails
    """
    try:
        detector = AutoencoderDriftDetector()
        
        # Prepare data dict for audit module
        data = {
            'reference_data': request.reference_data,
            'test_data': request.test_data
        }
        
        # Prepare config dict
        config = {
            'threshold': request.config.threshold,
            'epochs': request.config.epochs,
            'learning_rate': request.config.learning_rate,
            'hidden_dim': request.config.hidden_dim
        }
        
        # Run drift detection
        result = await detector.run(model=None, data=data, config=config)
        
        # Format response
        return APIResponse(
            status="success",
            message="Drift detection completed",
            data={
                'score': result.score,
                **result.metadata
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Drift detection failed: {str(e)}"
        )


@router.post("/robustness", response_model=APIResponse)
async def test_robustness(request: RobustnessTestingRequest):
    """Evaluate adversarial robustness using FGSM attacks.
    
    This endpoint generates FGSM adversarial examples across multiple epsilon
    values and evaluates model accuracy to assess robustness.
    
    Args:
        request: RobustnessTestingRequest containing model_path, test_data,
                 test_labels, and config
        
    Returns:
        APIResponse with status="success" and robustness testing results including:
            - score: Normalized robustness score (0-1)
            - clean_accuracy: Accuracy on unperturbed data
            - accuracy_per_epsilon: Dict mapping epsilon values to accuracies
            - accuracy_plot: Base64-encoded accuracy vs epsilon plot
            
    Raises:
        HTTPException: 500 error if robustness testing fails
    """
    try:
        tester = FGSMRobustnessTester()
        
        # Prepare data dict for audit module
        data = {
            'test_data': request.test_data,
            'test_labels': request.test_labels
        }
        
        # Prepare config dict
        config = {
            'epsilon_values': request.config.epsilon_values,
            'loss_function': request.config.loss_function
        }
        
        # Run robustness testing (model_path passed as model parameter)
        result = await tester.run(
            model=request.model_path,
            data=data,
            config=config
        )
        
        # Format response
        return APIResponse(
            status="success",
            message="Robustness testing completed",
            data={
                'score': result.score,
                **result.metadata
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Robustness testing failed: {str(e)}"
        )


@router.post("/aggregate", response_model=APIResponse)
async def aggregate_scores(request: TrustScoreRequest):
    """Compute unified trust score from multiple audit dimensions.
    
    This endpoint aggregates scores from different audit dimensions
    (explainability, fairness, calibration, drift, robustness) into
    a single trust score using weighted averaging.
    
    Args:
        request: TrustScoreRequest containing scores dict and optional weights dict
        
    Returns:
        APIResponse with status="success" and aggregation results including:
            - trust_score: Weighted average of all provided scores (0-1)
            - weights_used: Normalized weights applied to each dimension
            - contributing_scores: Original scores for each dimension
            
    Raises:
        HTTPException: 500 error if aggregation fails
    """
    try:
        aggregator = TrustScoreAggregator()
        
        # Aggregate scores
        result = aggregator.aggregate(
            scores=request.scores,
            weights=request.weights
        )
        
        # Format response
        return APIResponse(
            status="success",
            message="Trust score aggregation completed",
            data=result
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Trust score aggregation failed: {str(e)}"
        )
