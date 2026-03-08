# Implementation Plan: Backend Deep Learning Integration

## Overview

This plan implements a production-ready FastAPI backend that integrates two deep learning audit modules (Autoencoder Drift Detector and FGSM Adversarial Robustness Tester) into the TrustLens platform. The implementation follows a common audit module interface pattern, uses async endpoints with Pydantic v2 validation, and aggregates results into a unified trust score. All components are deployment-ready with environment-based configuration.

## Tasks

- [x] 1. Set up project structure and dependencies
  - Create directory structure: src/, src/api/, src/audit/, src/utils/, docs/, models/, data/
  - Create requirements.txt with pinned versions (fastapi==0.104.1, uvicorn==0.24.0, pydantic==2.5.0, python-dotenv==1.0.0, torch==2.1.0, numpy==1.26.2, matplotlib==3.8.2)
  - Create .env.example with all environment variables documented
  - Create .gitignore for Python projects (exclude venv, __pycache__, .env, models/, data/)
  - _Requirements: 1.6, 8.1, 8.2, 8.3_

- [x] 2. Implement configuration management
  - [x] 2.1 Create src/config.py with Config class
    - Load environment variables using python-dotenv
    - Define server configuration (HOST, PORT, RELOAD)
    - Define path configuration using pathlib.Path (MODEL_ROOT, DATA_ROOT)
    - Define drift detection defaults (DRIFT_THRESHOLD, DRIFT_EPOCHS, DRIFT_LEARNING_RATE, DRIFT_HIDDEN_DIM)
    - Define robustness testing defaults (ROBUSTNESS_EPSILON_VALUES, ROBUSTNESS_LOSS_FUNCTION)
    - Define trust score default weights (WEIGHT_EXPLAINABILITY, WEIGHT_FAIRNESS, WEIGHT_CALIBRATION, WEIGHT_DRIFT, WEIGHT_ROBUSTNESS)
    - _Requirements: 1.4, 1.5, 8.1, 8.2, 8.4, 8.5_

- [x] 3. Implement base audit module interface
  - [x] 3.1 Create src/audit/base.py with AuditModule and AuditResult
    - Define AuditResult dataclass with score (float) and metadata (dict) fields
    - Define AuditModule abstract base class with async run method
    - Add type hints for model (Any), data (dict), config (dict) parameters
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 4. Implement Pydantic models for API
  - [x] 4.1 Create src/api/models.py with request/response schemas
    - Define APIResponse base model with status, message, data fields
    - Define DriftDetectionConfig with threshold, epochs, learning_rate, hidden_dim
    - Define DriftDetectionRequest with reference_data, test_data, config
    - Define DriftDetectionResult with score, is_drift_detected, metadata
    - Define RobustnessTestingConfig with epsilon_values, loss_function
    - Define RobustnessTestingRequest with model_path, test_data, test_labels, config
    - Define RobustnessTestingResult with score, metadata
    - Define TrustScoreRequest with scores dict and optional weights dict
    - Define TrustScoreResult with trust_score and metadata
    - _Requirements: 1.2, 1.3, 2.1, 2.2, 2.3_

- [x] 5. Implement visualization utilities
  - [x] 5.1 Create src/utils/visualization.py with matplotlib plotting functions
    - Implement generate_training_loss_plot(losses: list[float]) -> str returning base64 image
    - Implement generate_error_histogram(errors: np.ndarray) -> str returning base64 image
    - Implement generate_accuracy_plot(accuracy_dict: dict[str, float]) -> str returning base64 image
    - Use matplotlib to create plots and convert to base64 PNG format with "data:image/png;base64," prefix
    - _Requirements: 4.6, 4.7, 5.6_

- [x] 6. Implement Autoencoder Drift Detector
  - [x] 6.1 Create src/audit/drift_detector.py with AutoencoderModel and AutoencoderDriftDetector
    - Define AutoencoderModel as PyTorch nn.Module with encoder and decoder
    - Implement AutoencoderDriftDetector inheriting from AuditModule
    - Implement async run method that trains autoencoder on reference_data
    - Compute reconstruction errors on test_data
    - Calculate drift_score from mean and std of reconstruction errors (normalized 0-1)
    - Set is_drift_detected flag based on threshold comparison
    - Generate training loss plot and error histogram using visualization utils
    - Return AuditResult with score and metadata (is_drift_detected, mean_reconstruction_error, std_reconstruction_error, training_loss_plot, error_histogram)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [x] 7. Implement FGSM Robustness Tester
  - [x] 7.1 Create src/audit/robustness_tester.py with FGSMRobustnessTester
    - Implement FGSMRobustnessTester inheriting from AuditModule
    - Implement async run method that loads PyTorch model from model_path
    - Compute clean accuracy at epsilon=0.0
    - For each epsilon value, generate FGSM adversarial examples using PyTorch autograd
    - FGSM formula: x_adv = x + epsilon * sign(gradient)
    - Compute accuracy for each epsilon value
    - Calculate robustness_score as mean of all accuracy values (normalized 0-1)
    - Generate accuracy-vs-epsilon plot using visualization utils
    - Return AuditResult with score and metadata (clean_accuracy, accuracy_per_epsilon, accuracy_plot)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 8. Implement Trust Score Aggregator
  - [x] 8.1 Create src/audit/aggregator.py with TrustScoreAggregator
    - Define DEFAULT_WEIGHTS dict with equal 0.2 weights for all five dimensions
    - Implement aggregate method accepting scores dict and optional weights dict
    - Use default weights if custom weights not provided
    - Filter weights to only dimensions present in scores
    - Renormalize weights to sum to 1.0
    - Compute weighted average trust_score
    - Return dict with trust_score and metadata (weights_used, contributing_scores)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 9. Implement API routes
  - [x] 9.1 Create src/api/routes.py with FastAPI router and endpoints
    - Create APIRouter with prefix="/audit" and tag="audit"
    - Implement async POST /audit/drift endpoint accepting DriftDetectionRequest
    - Instantiate AutoencoderDriftDetector and call run method
    - Return APIResponse with status="success", message, and result data
    - Implement async POST /audit/robustness endpoint accepting RobustnessTestingRequest
    - Instantiate FGSMRobustnessTester and call run method
    - Return APIResponse with status="success", message, and result data
    - Implement async POST /audit/aggregate endpoint accepting TrustScoreRequest
    - Instantiate TrustScoreAggregator and call aggregate method
    - Return APIResponse with status="success", message, and result data
    - Add error handling with HTTPException for all endpoints (status="error" on failure)
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 10. Implement FastAPI main application
  - [x] 10.1 Create src/main.py with FastAPI app and entry point
    - Create FastAPI app instance with title, description, version
    - Include router from src.api.routes
    - Add __main__ block that runs uvicorn with Config.HOST, Config.PORT, Config.RELOAD
    - _Requirements: 1.1, 1.4_

- [x] 11. Create API documentation
  - [x] 11.1 Create docs/api_docs.md with comprehensive endpoint documentation
    - Document POST /audit/drift endpoint (HTTP method, path, request schema, response schema)
    - Document POST /audit/robustness endpoint (HTTP method, path, request schema, response schema)
    - Document POST /audit/aggregate endpoint (HTTP method, path, request schema, response schema)
    - Document AutoencoderDriftDetector input parameters and output structure
    - Document FGSMRobustnessTester input parameters and output structure
    - Document TrustScoreAggregator input parameters and output structure
    - Include example requests and responses for each endpoint
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 12. Final checkpoint - Verify deployment readiness
  - Ensure all environment variables are documented in .env.example
  - Verify all file paths use pathlib.Path and relative paths
  - Confirm requirements.txt has all dependencies with pinned versions
  - Verify all endpoints are async and use Pydantic v2 validation
  - Ensure consistent APIResponse format across all endpoints
  - Ask the user if questions arise

## Notes

- All endpoints use async/await for concurrent request handling
- Pydantic v2 models enforce validation at API boundaries
- Environment-based configuration enables deployment flexibility
- Common audit module interface allows seamless integration of new modules
- Trust score aggregation supports dynamic module composition with weight renormalization
- Visualizations encoded as base64 PNG for JSON transmission
- No tests or virtual environment setup per user requirements
