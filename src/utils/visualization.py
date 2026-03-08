"""
Visualization utilities for generating base64-encoded plots.

This module provides functions to generate matplotlib plots and convert them
to base64-encoded PNG images for JSON transmission in API responses.
"""

import base64
from io import BytesIO
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import numpy as np


def generate_training_loss_plot(losses: list[float]) -> str:
    """
    Generate a training loss curve plot as a base64-encoded PNG image.
    
    Args:
        losses: List of loss values per epoch
        
    Returns:
        Base64-encoded PNG image string with "data:image/png;base64," prefix
    """
    fig, ax = plt.subplots(figsize=(10, 6))
    
    epochs = list(range(1, len(losses) + 1))
    ax.plot(epochs, losses, 'b-', linewidth=2, label='Training Loss')
    
    ax.set_xlabel('Epoch', fontsize=12)
    ax.set_ylabel('Loss', fontsize=12)
    ax.set_title('Training Loss Curve', fontsize=14, fontweight='bold')
    ax.grid(True, alpha=0.3)
    ax.legend()
    
    # Convert plot to base64
    buffer = BytesIO()
    plt.tight_layout()
    plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
    plt.close(fig)
    
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    
    return f"data:image/png;base64,{image_base64}"


def generate_error_histogram(errors: np.ndarray) -> str:
    """
    Generate a histogram of reconstruction errors as a base64-encoded PNG image.
    
    Args:
        errors: Array of reconstruction error values
        
    Returns:
        Base64-encoded PNG image string with "data:image/png;base64," prefix
    """
    fig, ax = plt.subplots(figsize=(10, 6))
    
    ax.hist(errors, bins=30, color='steelblue', edgecolor='black', alpha=0.7)
    
    ax.set_xlabel('Reconstruction Error', fontsize=12)
    ax.set_ylabel('Frequency', fontsize=12)
    ax.set_title('Reconstruction Error Distribution', fontsize=14, fontweight='bold')
    ax.grid(True, alpha=0.3, axis='y')
    
    # Add statistics text
    mean_error = np.mean(errors)
    std_error = np.std(errors)
    stats_text = f'Mean: {mean_error:.4f}\nStd: {std_error:.4f}'
    ax.text(0.95, 0.95, stats_text, transform=ax.transAxes,
            verticalalignment='top', horizontalalignment='right',
            bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5),
            fontsize=10)
    
    # Convert plot to base64
    buffer = BytesIO()
    plt.tight_layout()
    plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
    plt.close(fig)
    
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    
    return f"data:image/png;base64,{image_base64}"


def generate_accuracy_plot(accuracy_dict: dict[str, float]) -> str:
    """
    Generate an accuracy vs epsilon plot as a base64-encoded PNG image.
    
    Args:
        accuracy_dict: Dictionary mapping epsilon values (as strings) to accuracy values
        
    Returns:
        Base64-encoded PNG image string with "data:image/png;base64," prefix
    """
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Sort by epsilon value for proper line plot
    epsilon_values = sorted(accuracy_dict.keys(), key=float)
    epsilons = [float(e) for e in epsilon_values]
    accuracies = [accuracy_dict[e] for e in epsilon_values]
    
    ax.plot(epsilons, accuracies, 'ro-', linewidth=2, markersize=8, label='Model Accuracy')
    
    ax.set_xlabel('Epsilon (Perturbation Magnitude)', fontsize=12)
    ax.set_ylabel('Accuracy', fontsize=12)
    ax.set_title('Model Accuracy vs Adversarial Perturbation', fontsize=14, fontweight='bold')
    ax.grid(True, alpha=0.3)
    ax.legend()
    
    # Set y-axis to [0, 1] range for accuracy
    ax.set_ylim([0, 1.05])
    
    # Convert plot to base64
    buffer = BytesIO()
    plt.tight_layout()
    plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
    plt.close(fig)
    
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    
    return f"data:image/png;base64,{image_base64}"
