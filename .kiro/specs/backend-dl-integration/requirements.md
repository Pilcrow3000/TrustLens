# Requirements Document

## Introduction

TrustLens is an automated ML model auditing platform that evaluates machine learning models across multiple dimensions: explainability, fairness, calibration, distribution drift, and adversarial robustness. This document specifies requirements for a production-ready FastAPI backend that integrates two deep learning audit modules (Autoencoder Drift Detector and FGSM Adversarial Robustness Tester) and aggregates results into a unified trust score.

## Glossary

- **TrustLens_Backend**: The FastAPI application that exposes audit endpoints and orchestrates audit modules
- **Audit_Module**: A component that evaluates a specific aspect of model trustworthiness (drift, robustness, fairness, etc.)
- **Autoencoder_Drift_Detector**: An audit module that detects distribution drift using reconstruction error from a PyTorch autoencoder
- **FGSM_Robustness_Tester**: An audit module that evaluates adversarial robustness using Fast Gradient Sign Method attacks
- **Trust_Score_Aggregator**: A component that combines individual audit scores into a single trust score
- **Audit_Result**: A structured output containing scores, flags, visualizations, and metadata from an audit module
- **Drift_Score**: A normalized value (0-1) indicating the degree of distribution drift detected
- **Robustness_Score**: A normalized value (0-1) indicating model resilience to adversarial perturbations
- **Trust_Score**: A weighted aggregate score (0-1) representing overall model trustworthiness
- **Reference_Data**: Training or baseline data used to establish expected distributions
- **Test_Data**: New data being evaluated for drift or model performance
- **FGSM**: Fast Gradient Sign Method, an adversarial attack technique using gradient information
- **Epsilon**: Perturbation magnitude parameter for adversarial attacks
- **Base64_Image**: A visualization encoded as a base64 string for JSON transmission

## Requirements

### Requirement 1: FastAPI Backend Foundation

**User Story:** As a platform operator, I want a production-ready FastAPI backend, so that I can deploy TrustLens reliably in production environments.

#### Acceptance Criteria

1. THE TrustLens_Backend SHALL implement all endpoints using async functions
2. THE TrustLens_Backend SHALL validate all request payloads using Pydantic v2 models
3. THE TrustLens_Backend SHALL validate all response payloads using Pydantic v2 models
4. THE TrustLens_Backend SHALL load all configuration values from environment variables using python-dotenv
5. THE TrustLens_Backend SHALL construct all file paths using pathlib.Path
6. THE TrustLens_Backend SHALL provide a requirements.txt file with all dependencies pinned to specific versions

### Requirement 2: Consistent API Response Format

**User Story:** As an API consumer, I want consistent response structures, so that I can reliably parse responses from all endpoints.

#### Acceptance Criteria

1. THE TrustLens_Backend SHALL return responses with a status field containing success or error values
2. THE TrustLens_Backend SHALL return responses with a data field containing the response payload
3. THE TrustLens_Backend SHALL return responses with a message field containing a human-readable description
4. WHEN an endpoint succeeds, THE TrustLens_Backend SHALL set status to success
5. IF an error occurs, THEN THE TrustLens_Backend SHALL set status to error and include error details in the message field

### Requirement 3: Common Audit Module Interface

**User Story:** As a backend developer, I want all audit modules to follow a common interface, so that I can integrate new modules without modifying orchestration logic.

#### Acceptance Criteria

1. THE Audit_Module SHALL implement a base interface with a run method
2. THE Audit_Module SHALL accept a model parameter in the run method
3. THE Audit_Module SHALL accept a data parameter in the run method
4. THE Audit_Module SHALL accept a config parameter in the run method
5. WHEN the run method completes, THE Audit_Module SHALL return an Audit_Result object
6. THE Audit_Result SHALL contain a score field with a normalized value between 0 and 1
7. THE Audit_Result SHALL contain a metadata field with module-specific outputs

### Requirement 4: Autoencoder Drift Detection

**User Story:** As a data scientist, I want to detect distribution drift using autoencoder reconstruction error, so that I can identify when model inputs deviate from training distributions.

#### Acceptance Criteria

1. WHEN Reference_Data is provided, THE Autoencoder_Drift_Detector SHALL train a PyTorch autoencoder on the Reference_Data
2. WHEN Test_Data is provided, THE Autoencoder_Drift_Detector SHALL compute reconstruction error for each sample in Test_Data
3. THE Autoencoder_Drift_Detector SHALL calculate a Drift_Score between 0 and 1 based on reconstruction error statistics
4. THE Autoencoder_Drift_Detector SHALL set an is_drift_detected flag to true when Drift_Score exceeds a configurable threshold
5. THE Autoencoder_Drift_Detector SHALL set an is_drift_detected flag to false when Drift_Score is below the threshold
6. THE Autoencoder_Drift_Detector SHALL generate a training loss curve visualization as a Base64_Image
7. THE Autoencoder_Drift_Detector SHALL generate a reconstruction error histogram as a Base64_Image
8. THE Autoencoder_Drift_Detector SHALL return Drift_Score, is_drift_detected, and visualizations in the Audit_Result

### Requirement 5: FGSM Adversarial Robustness Testing

**User Story:** As a security engineer, I want to evaluate model robustness against adversarial attacks, so that I can assess vulnerability to malicious inputs.

#### Acceptance Criteria

1. THE FGSM_Robustness_Tester SHALL implement FGSM using PyTorch autograd without external attack libraries
2. WHEN Test_Data is provided, THE FGSM_Robustness_Tester SHALL compute clean accuracy on unperturbed Test_Data
3. THE FGSM_Robustness_Tester SHALL generate adversarial examples for Epsilon values [0.0, 0.01, 0.05, 0.1, 0.2, 0.3]
4. THE FGSM_Robustness_Tester SHALL compute accuracy for each Epsilon value
5. THE FGSM_Robustness_Tester SHALL calculate a Robustness_Score between 0 and 1 based on accuracy degradation across Epsilon values
6. THE FGSM_Robustness_Tester SHALL generate an accuracy-vs-epsilon plot as a Base64_Image
7. THE FGSM_Robustness_Tester SHALL return Robustness_Score, clean_accuracy, accuracy_per_epsilon, and visualization in the Audit_Result

### Requirement 6: Trust Score Aggregation

**User Story:** As a model auditor, I want a single trust score that combines all audit dimensions, so that I can quickly assess overall model trustworthiness.

#### Acceptance Criteria

1. THE Trust_Score_Aggregator SHALL accept scores from explainability, fairness, calibration, drift, and robustness modules
2. THE Trust_Score_Aggregator SHALL compute Trust_Score as a weighted average of all provided scores
3. THE Trust_Score_Aggregator SHALL use equal weights of 0.2 for each dimension when no custom weights are provided
4. WHERE custom weights are provided in the audit request, THE Trust_Score_Aggregator SHALL use the custom weights
5. THE Trust_Score_Aggregator SHALL normalize the Trust_Score to a value between 0 and 1
6. WHEN a dimension score is missing, THE Trust_Score_Aggregator SHALL exclude that dimension and renormalize remaining weights to sum to 1.0

### Requirement 7: API Documentation

**User Story:** As an API consumer, I want comprehensive API documentation, so that I can integrate with TrustLens endpoints without inspecting source code.

#### Acceptance Criteria

1. THE TrustLens_Backend SHALL maintain a docs/api_docs.md file
2. WHEN an endpoint is implemented, THE TrustLens_Backend SHALL document the endpoint's HTTP method and path in docs/api_docs.md
3. WHEN an endpoint is implemented, THE TrustLens_Backend SHALL document the request payload schema in docs/api_docs.md
4. WHEN an endpoint is implemented, THE TrustLens_Backend SHALL document the response payload schema in docs/api_docs.md
5. WHEN an audit module is implemented, THE TrustLens_Backend SHALL document the module's input parameters in docs/api_docs.md
6. WHEN an audit module is implemented, THE TrustLens_Backend SHALL document the module's output structure in docs/api_docs.md

### Requirement 8: Deployment Readiness

**User Story:** As a DevOps engineer, I want the backend structured for containerized deployment, so that I can deploy TrustLens using Docker without code modifications.

#### Acceptance Criteria

1. THE TrustLens_Backend SHALL define all configurable values as environment variables
2. THE TrustLens_Backend SHALL provide default values for all environment variables suitable for local development
3. THE TrustLens_Backend SHALL document all required environment variables
4. THE TrustLens_Backend SHALL use relative paths based on a configurable root directory
5. THE TrustLens_Backend SHALL avoid hardcoded absolute paths in all modules

