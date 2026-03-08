"""
FGSM Adversarial Robustness Tester.

This module implements adversarial robustness testing using the Fast Gradient Sign Method (FGSM)
attack. It evaluates model resilience to adversarial perturbations across multiple epsilon values.
"""

import torch
import torch.nn.functional as F
import numpy as np
from pathlib import Path
from typing import Any

from src.audit.base import AuditModule, AuditResult
from src.utils.visualization import generate_accuracy_plot


class FGSMRobustnessTester(AuditModule):
    """
    Evaluates adversarial robustness using FGSM attacks.
    
    This module implements the Fast Gradient Sign Method (FGSM) attack using PyTorch autograd
    to generate adversarial examples. It computes model accuracy across multiple perturbation
    magnitudes (epsilon values) and calculates a robustness score.
    """
    
    async def run(
        self,
        model: Any,
        data: dict[str, Any],
        config: dict[str, Any]
    ) -> AuditResult:
        """
        Evaluate model robustness against FGSM attacks.
        
        Args:
            model: PyTorch model to evaluate (can be path string or nn.Module)
            data: Dict with 'test_data' and 'test_labels' keys
            config: Dict with 'epsilon_values' and 'loss_function'
            
        Returns:
            AuditResult with robustness score and accuracy plot
        """
        # Load model if path is provided
        if isinstance(model, (str, Path)):
            model = torch.load(model, map_location='cpu')
        
        # Extract data and config
        test_data = torch.tensor(data['test_data'], dtype=torch.float32)
        test_labels = torch.tensor(data['test_labels'], dtype=torch.long)
        
        epsilon_values = config.get(
            'epsilon_values',
            [0.0, 0.01, 0.05, 0.1, 0.2, 0.3]
        )
        
        model.eval()
        accuracy_per_epsilon = {}
        
        for epsilon in epsilon_values:
            if epsilon == 0.0:
                # Clean accuracy (no perturbation)
                with torch.no_grad():
                    outputs = model(test_data)
                    predictions = torch.argmax(outputs, dim=1)
                    accuracy = (predictions == test_labels).float().mean().item()
            else:
                # Generate FGSM adversarial examples
                test_data_copy = test_data.clone().detach()
                test_data_copy.requires_grad = True
                
                outputs = model(test_data_copy)
                loss = F.cross_entropy(outputs, test_labels)
                
                model.zero_grad()
                loss.backward()
                
                # FGSM attack: x_adv = x + epsilon * sign(gradient)
                data_grad = test_data_copy.grad.data
                perturbed_data = test_data_copy + epsilon * data_grad.sign()
                
                # Evaluate on perturbed data
                with torch.no_grad():
                    perturbed_outputs = model(perturbed_data)
                    predictions = torch.argmax(perturbed_outputs, dim=1)
                    accuracy = (predictions == test_labels).float().mean().item()
            
            accuracy_per_epsilon[str(epsilon)] = accuracy
        
        # Calculate robustness score as mean of all accuracy values
        clean_accuracy = accuracy_per_epsilon['0.0']
        robustness_score = np.mean(list(accuracy_per_epsilon.values()))
        
        # Generate visualization
        accuracy_plot = generate_accuracy_plot(accuracy_per_epsilon)
        
        return AuditResult(
            score=robustness_score,
            metadata={
                'clean_accuracy': clean_accuracy,
                'accuracy_per_epsilon': accuracy_per_epsilon,
                'accuracy_plot': accuracy_plot
            }
        )
