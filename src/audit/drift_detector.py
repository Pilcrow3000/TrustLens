"""
Autoencoder-based distribution drift detection module.

This module implements drift detection using reconstruction error from a PyTorch
autoencoder. It trains on reference data and evaluates test data to identify
distribution shifts.
"""

import torch
import torch.nn as nn
import numpy as np
from typing import Any

from src.audit.base import AuditModule, AuditResult
from src.utils.visualization import generate_training_loss_plot, generate_error_histogram


class AutoencoderModel(nn.Module):
    """Simple autoencoder for drift detection.
    
    The autoencoder learns to reconstruct reference data. Higher reconstruction
    errors on test data indicate distribution drift.
    
    Attributes:
        encoder: Neural network that compresses input to hidden representation
        decoder: Neural network that reconstructs input from hidden representation
    """
    
    def __init__(self, input_dim: int, hidden_dim: int):
        """Initialize autoencoder architecture.
        
        Args:
            input_dim: Dimensionality of input features
            hidden_dim: Dimensionality of hidden/latent representation
        """
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU()
        )
        self.decoder = nn.Sequential(
            nn.Linear(hidden_dim, input_dim)
        )
    
    def forward(self, x):
        """Forward pass through autoencoder.
        
        Args:
            x: Input tensor of shape (batch_size, input_dim)
            
        Returns:
            Reconstructed tensor of shape (batch_size, input_dim)
        """
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded


class AutoencoderDriftDetector(AuditModule):
    """Detects distribution drift using autoencoder reconstruction error.
    
    This module trains an autoencoder on reference data and computes reconstruction
    errors on test data. Higher errors indicate the test data distribution differs
    from the reference distribution.
    """
    
    async def run(
        self,
        model: None,
        data: dict[str, Any],
        config: dict[str, Any]
    ) -> AuditResult:
        """Execute drift detection.
        
        Trains autoencoder on reference_data, computes reconstruction errors on
        test_data, calculates drift score, and generates visualizations.
        
        Args:
            model: Unused (trains own autoencoder)
            data: Dict with 'reference_data' and 'test_data' keys containing
                  lists of feature vectors
            config: Dict with optional keys:
                    - threshold: Drift detection threshold (default 0.7)
                    - epochs: Training epochs (default 50)
                    - learning_rate: Optimizer learning rate (default 0.001)
                    - hidden_dim: Autoencoder hidden dimension (default 32)
            
        Returns:
            AuditResult with drift score (0-1) and metadata containing:
                - is_drift_detected: Boolean flag
                - mean_reconstruction_error: Mean error on test data
                - std_reconstruction_error: Std deviation of errors
                - training_loss_plot: Base64-encoded training curve
                - error_histogram: Base64-encoded error distribution
        """
        # Extract data and config
        reference_data = torch.tensor(data['reference_data'], dtype=torch.float32)
        test_data = torch.tensor(data['test_data'], dtype=torch.float32)
        
        threshold = config.get('threshold', 0.7)
        epochs = config.get('epochs', 50)
        learning_rate = config.get('learning_rate', 0.001)
        hidden_dim = config.get('hidden_dim', 32)
        
        # Train autoencoder on reference data
        input_dim = reference_data.shape[1]
        autoencoder = AutoencoderModel(input_dim, hidden_dim)
        optimizer = torch.optim.Adam(autoencoder.parameters(), lr=learning_rate)
        criterion = nn.MSELoss()
        
        training_losses = []
        autoencoder.train()
        for epoch in range(epochs):
            optimizer.zero_grad()
            reconstructed = autoencoder(reference_data)
            loss = criterion(reconstructed, reference_data)
            loss.backward()
            optimizer.step()
            training_losses.append(loss.item())
        
        # Compute reconstruction errors on test data
        autoencoder.eval()
        with torch.no_grad():
            test_reconstructed = autoencoder(test_data)
            reconstruction_errors = torch.mean(
                (test_data - test_reconstructed) ** 2,
                dim=1
            ).numpy()
        
        # Calculate drift score
        mean_error = np.mean(reconstruction_errors)
        std_error = np.std(reconstruction_errors)
        
        # Normalize to 0-1 (higher error = higher drift score)
        # Using formula: mean / (mean + std + epsilon) to bound to [0, 1]
        drift_score = min(mean_error / (mean_error + std_error + 1e-8), 1.0)
        is_drift_detected = drift_score > threshold
        
        # Generate visualizations
        training_loss_plot = generate_training_loss_plot(training_losses)
        error_histogram = generate_error_histogram(reconstruction_errors)
        
        return AuditResult(
            score=drift_score,
            metadata={
                'is_drift_detected': is_drift_detected,
                'mean_reconstruction_error': float(mean_error),
                'std_reconstruction_error': float(std_error),
                'training_loss_plot': training_loss_plot,
                'error_histogram': error_histogram
            }
        )
