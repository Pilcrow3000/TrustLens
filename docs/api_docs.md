# TrustLens Backend API Documentation

## Overview

The TrustLens Backend provides REST API endpoints for automated ML model auditing. This API enables distribution drift detection, adversarial robustness testing, and trust score aggregation across multiple audit dimensions.

**Base URL:** `http://localhost:8000`

**API Prefix:** `/audit`

All endpoints return responses in a consistent format with `status`, `message`, and `data` fields.

---

## Common Response Format

All API endpoints return responses following this structure:

```json
{
  "status": "success" | "error",
  "message": "Human-readable description",
  "data": {
    // Endpoint-specific response data
  }
}
```

### Response Fields

- **status** (string): Either `"success"` or `"error"`
- **message** (string): Human-readable description of the result
- **data** (object | null): Response payload containing endpoint-specific data. `null` for error responses.

### HTTP Status Codes

- **200 OK**: Successful request
- **400 Bad Request**: Invalid request payload or parameters
- **404 Not Found**: Resource not found (e.g., model file)
- **422 Unprocessable Entity**: Request validation failed
- **500 Internal Server Error**: Server-side processing error

---

## Endpoints

### 1. POST /audit/drift

Detects distribution drift using autoencoder reconstruction error.

This endpoint trains a PyTorch autoencoder on reference (baseline) data and evaluates reconstruction errors on test data to identify distribution shifts. Higher reconstruction errors indicate the test data distribution differs from the reference distribution.

#### HTTP Method and Path

```
POST /audit/drift
```

#### Request Schema

```json
{
  "reference_data": [[float]],
  "test_data": [[float]],
  "config": {
    "threshold": float,
    "epochs": int,
    "learning_rate": float,
    "hidden_dim": int
  }
}
```

#### Request Fields

- **reference_data** (array of arrays): Training/baseline data for autoencoder. Each inner array represents a feature vector.
  - Type: `list[list[float]]`
  - Required: Yes
  - Example: `[[1.2, 3.4, 5.6], [2.1, 4.3, 6.5]]`

- **test_data** (array of arrays): Data to evaluate for drift. Same shape as reference_data.
  - Type: `list[list[float]]`
  - Required: Yes
  - Example: `[[1.5, 3.2, 5.8], [2.3, 4.1, 6.7]]`

- **config** (object): Configuration parameters (all optional with defaults)
  - **threshold** (float): Drift detection threshold (0.0-1.0). Default: `0.7`
  - **epochs** (int): Number of training epochs for autoencoder. Default: `50`
  - **learning_rate** (float): Optimizer learning rate. Default: `0.001`
  - **hidden_dim** (int): Hidden dimension size for autoencoder. Default: `32`

#### Response Schema

```json
{
  "status": "success",
  "message": "Drift detection completed",
  "data": {
    "score": float,
    "is_drift_detected": boolean,
    "mean_reconstruction_error": float,
    "std_reconstruction_error": float,
    "training_loss_plot": string,
    "error_histogram": string
  }
}
```

#### Response Fields

- **score** (float): Normalized drift score (0.0-1.0). Higher values indicate greater drift.
- **is_drift_detected** (boolean): `true` if drift score exceeds threshold, `false` otherwise
- **mean_reconstruction_error** (float): Mean reconstruction error on test data
- **std_reconstruction_error** (float): Standard deviation of reconstruction errors
- **training_loss_plot** (string): Base64-encoded PNG image of training loss curve (format: `data:image/png;base64,...`)
- **error_histogram** (string): Base64-encoded PNG image of reconstruction error distribution (format: `data:image/png;base64,...`)

#### Example Request

```bash
curl -X POST http://localhost:8000/audit/drift \
  -H "Content-Type: application/json" \
  -d '{
    "reference_data": [
      [1.0, 2.0, 3.0],
      [1.1, 2.1, 3.1],
      [0.9, 1.9, 2.9]
    ],
    "test_data": [
      [1.2, 2.2, 3.2],
      [5.0, 6.0, 7.0]
    ],
    "config": {
      "threshold": 0.7,
      "epochs": 50,
      "learning_rate": 0.001,
      "hidden_dim": 32
    }
  }'
```

#### Example Response

```json
{
  "status": "success",
  "message": "Drift detection completed",
  "data": {
    "score": 0.65,
    "is_drift_detected": false,
    "mean_reconstruction_error": 0.042,
    "std_reconstruction_error": 0.018,
    "training_loss_plot": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "error_histogram": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

---

### 2. POST /audit/robustness

Evaluates adversarial robustness using FGSM (Fast Gradient Sign Method) attacks.

This endpoint generates adversarial examples using FGSM across multiple perturbation magnitudes (epsilon values) and evaluates model accuracy to assess robustness against adversarial attacks.

#### HTTP Method and Path

```
POST /audit/robustness
```

#### Request Schema

```json
{
  "model_path": string,
  "test_data": [[float]],
  "test_labels": [int],
  "config": {
    "epsilon_values": [float],
    "loss_function": "cross_entropy" | "mse"
  }
}
```

#### Request Fields

- **model_path** (string): Path to PyTorch model file (.pth or .pt)
  - Type: `string`
  - Required: Yes
  - Example: `"./models/classifier.pth"`

- **test_data** (array of arrays): Test samples for evaluation. Each inner array is a feature vector.
  - Type: `list[list[float]]`
  - Required: Yes
  - Example: `[[1.2, 3.4, 5.6], [2.1, 4.3, 6.5]]`

- **test_labels** (array): True labels for test samples (integer class indices)
  - Type: `list[int]`
  - Required: Yes
  - Example: `[0, 1, 2]`

- **config** (object): Configuration parameters (all optional with defaults)
  - **epsilon_values** (array of floats): Perturbation magnitudes to test. Default: `[0.0, 0.01, 0.05, 0.1, 0.2, 0.3]`
  - **loss_function** (string): Loss function for gradient computation. Options: `"cross_entropy"`, `"mse"`. Default: `"cross_entropy"`

#### Response Schema

```json
{
  "status": "success",
  "message": "Robustness testing completed",
  "data": {
    "score": float,
    "clean_accuracy": float,
    "accuracy_per_epsilon": {
      "0.0": float,
      "0.01": float,
      "0.05": float,
      ...
    },
    "accuracy_plot": string
  }
}
```

#### Response Fields

- **score** (float): Normalized robustness score (0.0-1.0). Computed as mean accuracy across all epsilon values.
- **clean_accuracy** (float): Model accuracy on unperturbed data (epsilon=0.0)
- **accuracy_per_epsilon** (object): Dictionary mapping epsilon values (as strings) to accuracy values
- **accuracy_plot** (string): Base64-encoded PNG image of accuracy vs epsilon plot (format: `data:image/png;base64,...`)

#### Example Request

```bash
curl -X POST http://localhost:8000/audit/robustness \
  -H "Content-Type: application/json" \
  -d '{
    "model_path": "./models/classifier.pth",
    "test_data": [
      [1.0, 2.0, 3.0, 4.0],
      [1.5, 2.5, 3.5, 4.5],
      [2.0, 3.0, 4.0, 5.0]
    ],
    "test_labels": [0, 1, 0],
    "config": {
      "epsilon_values": [0.0, 0.01, 0.05, 0.1, 0.2, 0.3],
      "loss_function": "cross_entropy"
    }
  }'
```

#### Example Response

```json
{
  "status": "success",
  "message": "Robustness testing completed",
  "data": {
    "score": 0.78,
    "clean_accuracy": 0.95,
    "accuracy_per_epsilon": {
      "0.0": 0.95,
      "0.01": 0.92,
      "0.05": 0.85,
      "0.1": 0.72,
      "0.2": 0.58,
      "0.3": 0.45
    },
    "accuracy_plot": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

---

### 3. POST /audit/aggregate

Computes unified trust score from multiple audit dimensions.

This endpoint aggregates scores from different audit dimensions (explainability, fairness, calibration, drift, robustness) into a single trust score using weighted averaging. It supports custom weights and automatically handles missing dimensions by renormalizing weights.

#### HTTP Method and Path

```
POST /audit/aggregate
```

#### Request Schema

```json
{
  "scores": {
    "explainability": float,
    "fairness": float,
    "calibration": float,
    "drift": float,
    "robustness": float
  },
  "weights": {
    "explainability": float,
    "fairness": float,
    "calibration": float,
    "drift": float,
    "robustness": float
  }
}
```

#### Request Fields

- **scores** (object): Dictionary mapping dimension names to scores (0.0-1.0 range)
  - Type: `dict[str, float]`
  - Required: Yes
  - Supported dimensions: `explainability`, `fairness`, `calibration`, `drift`, `robustness`
  - Note: Not all dimensions are required. Missing dimensions are excluded from aggregation.
  - Example: `{"drift": 0.65, "robustness": 0.78}`

- **weights** (object): Optional custom weights for each dimension
  - Type: `dict[str, float] | null`
  - Required: No
  - Default: Equal weights of 0.2 for all five dimensions
  - Note: Weights are automatically renormalized to sum to 1.0
  - Example: `{"drift": 0.3, "robustness": 0.7}`

#### Response Schema

```json
{
  "status": "success",
  "message": "Trust score aggregation completed",
  "data": {
    "trust_score": float,
    "metadata": {
      "weights_used": {
        "dimension_name": float,
        ...
      },
      "contributing_scores": {
        "dimension_name": float,
        ...
      }
    }
  }
}
```

#### Response Fields

- **trust_score** (float): Weighted average of all provided scores (0.0-1.0 range)
- **metadata** (object): Additional information about the aggregation
  - **weights_used** (object): Normalized weights applied to each dimension (sum to 1.0)
  - **contributing_scores** (object): Original scores for each dimension

#### Example Request

```bash
curl -X POST http://localhost:8000/audit/aggregate \
  -H "Content-Type: application/json" \
  -d '{
    "scores": {
      "explainability": 0.82,
      "fairness": 0.75,
      "calibration": 0.88,
      "drift": 0.65,
      "robustness": 0.78
    },
    "weights": {
      "explainability": 0.2,
      "fairness": 0.2,
      "calibration": 0.2,
      "drift": 0.2,
      "robustness": 0.2
    }
  }'
```

#### Example Response

```json
{
  "status": "success",
  "message": "Trust score aggregation completed",
  "data": {
    "trust_score": 0.776,
    "metadata": {
      "weights_used": {
        "explainability": 0.2,
        "fairness": 0.2,
        "calibration": 0.2,
        "drift": 0.2,
        "robustness": 0.2
      },
      "contributing_scores": {
        "explainability": 0.82,
        "fairness": 0.75,
        "calibration": 0.88,
        "drift": 0.65,
        "robustness": 0.78
      }
    }
  }
}
```

#### Example with Missing Dimensions

```bash
curl -X POST http://localhost:8000/audit/aggregate \
  -H "Content-Type: application/json" \
  -d '{
    "scores": {
      "drift": 0.65,
      "robustness": 0.78
    }
  }'
```

Response (weights automatically renormalized):

```json
{
  "status": "success",
  "message": "Trust score aggregation completed",
  "data": {
    "trust_score": 0.715,
    "metadata": {
      "weights_used": {
        "drift": 0.5,
        "robustness": 0.5
      },
      "contributing_scores": {
        "drift": 0.65,
        "robustness": 0.78
      }
    }
  }
}
```

---

## Audit Modules

### AutoencoderDriftDetector

Detects distribution drift using autoencoder reconstruction error.

#### Input Parameters

The `AutoencoderDriftDetector` accepts the following parameters through the `/audit/drift` endpoint:

**Data Parameters:**
- **reference_data** (list[list[float]]): Training/baseline data for autoencoder training
  - Shape: `(n_samples, n_features)`
  - Example: 100 samples with 10 features each

- **test_data** (list[list[float]]): Data to evaluate for drift
  - Shape: `(m_samples, n_features)` where `n_features` must match reference_data
  - Example: 50 samples with 10 features each

**Configuration Parameters:**
- **threshold** (float, default=0.7): Drift detection threshold (0.0-1.0)
  - Drift is detected when score > threshold
  
- **epochs** (int, default=50): Number of training epochs for autoencoder
  - More epochs may improve reconstruction but increase computation time
  
- **learning_rate** (float, default=0.001): Optimizer learning rate
  - Controls step size during gradient descent
  
- **hidden_dim** (int, default=32): Hidden dimension size for autoencoder
  - Smaller values create more compression, potentially more sensitive to drift

#### Output Structure

The module returns an `AuditResult` with the following structure:

```python
{
  "score": float,  # Drift score (0.0-1.0)
  "metadata": {
    "is_drift_detected": bool,
    "mean_reconstruction_error": float,
    "std_reconstruction_error": float,
    "training_loss_plot": str,  # Base64-encoded PNG
    "error_histogram": str      # Base64-encoded PNG
  }
}
```

**Output Fields:**
- **score**: Normalized drift score calculated as `mean_error / (mean_error + std_error + epsilon)`
- **is_drift_detected**: Boolean flag set to `true` when score > threshold
- **mean_reconstruction_error**: Average reconstruction error across test samples
- **std_reconstruction_error**: Standard deviation of reconstruction errors
- **training_loss_plot**: Visualization of autoencoder training loss over epochs
- **error_histogram**: Distribution of reconstruction errors on test data

#### Algorithm

1. Train PyTorch autoencoder on reference_data using MSE loss
2. Compute reconstruction errors for each sample in test_data
3. Calculate drift score from error statistics (normalized to 0-1)
4. Compare score against threshold to set drift flag
5. Generate training loss curve and error histogram visualizations

---

### FGSMRobustnessTester

Evaluates adversarial robustness using FGSM (Fast Gradient Sign Method) attacks.

#### Input Parameters

The `FGSMRobustnessTester` accepts the following parameters through the `/audit/robustness` endpoint:

**Model Parameter:**
- **model_path** (string): Path to PyTorch model file
  - Supported formats: `.pth`, `.pt`
  - Model is loaded with `torch.load()`

**Data Parameters:**
- **test_data** (list[list[float]]): Test samples for evaluation
  - Shape: `(n_samples, n_features)`
  - Example: 100 samples with input dimension matching model

- **test_labels** (list[int]): True labels for test samples
  - Shape: `(n_samples,)`
  - Values: Integer class indices (0 to num_classes-1)

**Configuration Parameters:**
- **epsilon_values** (list[float], default=[0.0, 0.01, 0.05, 0.1, 0.2, 0.3]): Perturbation magnitudes to test
  - Each value represents the maximum perturbation magnitude
  - epsilon=0.0 computes clean accuracy (no perturbation)
  
- **loss_function** (string, default="cross_entropy"): Loss function for gradient computation
  - Options: `"cross_entropy"`, `"mse"`
  - Used to compute gradients for FGSM attack

#### Output Structure

The module returns an `AuditResult` with the following structure:

```python
{
  "score": float,  # Robustness score (0.0-1.0)
  "metadata": {
    "clean_accuracy": float,
    "accuracy_per_epsilon": {
      "0.0": float,
      "0.01": float,
      ...
    },
    "accuracy_plot": str  # Base64-encoded PNG
  }
}
```

**Output Fields:**
- **score**: Robustness score calculated as mean accuracy across all epsilon values
- **clean_accuracy**: Model accuracy on unperturbed data (epsilon=0.0)
- **accuracy_per_epsilon**: Dictionary mapping epsilon values (as strings) to accuracy values
- **accuracy_plot**: Visualization of accuracy degradation across epsilon values

#### Algorithm

1. Load PyTorch model from model_path
2. For epsilon=0.0: Compute clean accuracy on unperturbed test_data
3. For each epsilon > 0.0:
   - Compute model output and loss on test_data
   - Compute gradients with respect to input using backpropagation
   - Generate adversarial examples: `x_adv = x + epsilon * sign(gradient)`
   - Evaluate model accuracy on adversarial examples
4. Calculate robustness score as mean of all accuracy values
5. Generate accuracy vs epsilon plot

**FGSM Attack Formula:**
```
x_adversarial = x + epsilon * sign(∇_x Loss(model(x), y))
```

Where:
- `x`: Original input
- `epsilon`: Perturbation magnitude
- `∇_x Loss`: Gradient of loss with respect to input
- `sign()`: Sign function (-1, 0, or +1)

---

### TrustScoreAggregator

Aggregates scores from multiple audit dimensions into a unified trust score.

#### Input Parameters

The `TrustScoreAggregator` accepts the following parameters through the `/audit/aggregate` endpoint:

**Scores Parameter:**
- **scores** (dict[str, float]): Dictionary mapping dimension names to scores
  - Keys: Dimension names (e.g., `"drift"`, `"robustness"`, `"fairness"`)
  - Values: Scores in range 0.0-1.0
  - Supported dimensions: `explainability`, `fairness`, `calibration`, `drift`, `robustness`
  - Not all dimensions are required
  - Example: `{"drift": 0.65, "robustness": 0.78}`

**Weights Parameter (Optional):**
- **weights** (dict[str, float] | null): Custom weights for each dimension
  - Keys: Dimension names matching those in scores
  - Values: Weight values (will be renormalized to sum to 1.0)
  - Default: Equal weights of 0.2 for all five dimensions
  - Example: `{"drift": 0.3, "robustness": 0.7}`

#### Output Structure

The aggregator returns a dictionary with the following structure:

```python
{
  "trust_score": float,  # Aggregated score (0.0-1.0)
  "metadata": {
    "weights_used": dict[str, float],
    "contributing_scores": dict[str, float]
  }
}
```

**Output Fields:**
- **trust_score**: Weighted average of all provided scores (0.0-1.0 range)
- **weights_used**: Normalized weights applied to each dimension (sum to 1.0)
- **contributing_scores**: Original scores for each dimension

#### Algorithm

1. Use default weights if custom weights not provided
2. Filter weights to only dimensions present in scores
3. Renormalize weights to sum to 1.0:
   ```
   normalized_weight[dim] = weight[dim] / sum(all_weights)
   ```
4. Compute weighted average:
   ```
   trust_score = Σ(score[dim] * normalized_weight[dim]) for all dimensions
   ```
5. Return trust_score with metadata

#### Default Weights

```python
{
  "explainability": 0.2,
  "fairness": 0.2,
  "calibration": 0.2,
  "drift": 0.2,
  "robustness": 0.2
}
```

#### Weight Renormalization

When only a subset of dimensions are provided, weights are automatically renormalized:

**Example:**
- Input scores: `{"drift": 0.65, "robustness": 0.78}`
- Default weights: `{"drift": 0.2, "robustness": 0.2, ...}`
- Active weights: `{"drift": 0.2, "robustness": 0.2}`
- Total weight: `0.4`
- Normalized weights: `{"drift": 0.5, "robustness": 0.5}`
- Trust score: `0.65 * 0.5 + 0.78 * 0.5 = 0.715`

---

## Error Responses

### Validation Error (422)

Returned when request payload fails Pydantic validation.

```json
{
  "detail": [
    {
      "loc": ["body", "reference_data"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### Client Error (400)

Returned for invalid parameters or data issues.

```json
{
  "status": "error",
  "message": "Data arrays cannot be empty",
  "data": null
}
```

### Server Error (500)

Returned when module execution fails.

```json
{
  "status": "error",
  "message": "Drift detection failed: Autoencoder training failed to converge",
  "data": null
}
```

---

## Data Formats

### Base64 Image Format

All visualizations are returned as base64-encoded PNG images with the following format:

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
```

This format can be directly used in HTML `<img>` tags:

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." alt="Visualization" />
```

Or decoded to binary:

```python
import base64

# Remove prefix
base64_data = image_string.split(',')[1]

# Decode to bytes
image_bytes = base64.b64decode(base64_data)

# Save to file
with open('plot.png', 'wb') as f:
    f.write(image_bytes)
```

---

## Configuration

### Environment Variables

The backend can be configured using environment variables. See `.env.example` for all available options:

```bash
# Server Configuration
FASTAPI_HOST=0.0.0.0
FASTAPI_PORT=8000
FASTAPI_RELOAD=false

# Paths
MODEL_ROOT_DIR=./models
DATA_ROOT_DIR=./data

# Drift Detection Defaults
DRIFT_THRESHOLD=0.7
DRIFT_EPOCHS=50
DRIFT_LEARNING_RATE=0.001
DRIFT_HIDDEN_DIM=32

# Robustness Testing Defaults
ROBUSTNESS_EPSILON_VALUES=0.0,0.01,0.05,0.1,0.2,0.3
ROBUSTNESS_LOSS_FUNCTION=cross_entropy

# Trust Score Weights
WEIGHT_EXPLAINABILITY=0.2
WEIGHT_FAIRNESS=0.2
WEIGHT_CALIBRATION=0.2
WEIGHT_DRIFT=0.2
WEIGHT_ROBUSTNESS=0.2
```

---

## Running the Server

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python -m src.main
```

The server will start at `http://localhost:8000`.

### Interactive API Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

These interfaces allow you to explore and test all endpoints directly from your browser.

---

## Version

**API Version:** 1.0.0

**Last Updated:** 2024
