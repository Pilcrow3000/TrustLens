"""Base audit module interface and result structure.

This module defines the common interface that all audit modules must implement,
ensuring consistent integration across the TrustLens platform.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any


@dataclass
class AuditResult:
    """Standardized result from any audit module.
    
    Attributes:
        score: Normalized score between 0 and 1 indicating audit outcome
        metadata: Module-specific outputs (visualizations, metrics, flags, etc.)
    """
    score: float
    metadata: dict[str, Any]


class AuditModule(ABC):
    """Base interface for all audit modules.
    
    All audit modules (drift detection, robustness testing, fairness, etc.)
    must inherit from this class and implement the run method.
    """
    
    @abstractmethod
    async def run(
        self,
        model: Any,
        data: dict[str, Any],
        config: dict[str, Any]
    ) -> AuditResult:
        """Execute audit module.
        
        Args:
            model: Model to audit (format depends on module implementation)
            data: Input data for auditing (structure varies by module)
            config: Module-specific configuration parameters
            
        Returns:
            AuditResult with normalized score (0-1) and metadata
        """
        pass
