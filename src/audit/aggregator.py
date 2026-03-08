"""Trust Score Aggregator Module

This module provides functionality to aggregate scores from multiple audit dimensions
into a unified trust score using weighted averaging.
"""

from typing import Any


class TrustScoreAggregator:
    """Aggregates scores from multiple audit dimensions into a unified trust score.
    
    The aggregator computes a weighted average of scores from different audit dimensions
    (explainability, fairness, calibration, drift, robustness). It supports custom weights
    and automatically handles missing dimensions by renormalizing weights.
    """
    
    DEFAULT_WEIGHTS = {
        'explainability': 0.2,
        'fairness': 0.2,
        'calibration': 0.2,
        'drift': 0.2,
        'robustness': 0.2
    }
    
    def aggregate(
        self,
        scores: dict[str, float],
        weights: dict[str, float] | None = None
    ) -> dict[str, Any]:
        """Compute weighted trust score from multiple audit dimensions.
        
        Args:
            scores: Dictionary mapping dimension names to scores (0-1 range).
                   Example: {'drift': 0.65, 'robustness': 0.78}
            weights: Optional custom weights for each dimension. If not provided,
                    uses DEFAULT_WEIGHTS. Weights will be renormalized to sum to 1.0.
        
        Returns:
            Dictionary containing:
                - trust_score: Weighted average of all provided scores (0-1 range)
                - metadata: Dict with 'weights_used' and 'contributing_scores'
        
        Raises:
            ValueError: If no valid weights exist for the provided scores.
        
        Example:
            >>> aggregator = TrustScoreAggregator()
            >>> result = aggregator.aggregate(
            ...     scores={'drift': 0.65, 'robustness': 0.78},
            ...     weights=None
            ... )
            >>> result['trust_score']
            0.715
        """
        # Use default weights if custom weights not provided
        if weights is None:
            weights = self.DEFAULT_WEIGHTS.copy()
        
        # Filter weights to only dimensions present in scores
        active_weights = {
            dim: weights.get(dim, 0.0)
            for dim in scores.keys()
        }
        
        # Renormalize weights to sum to 1.0
        total_weight = sum(active_weights.values())
        if total_weight == 0:
            raise ValueError("No valid weights for provided scores")
        
        normalized_weights = {
            dim: w / total_weight
            for dim, w in active_weights.items()
        }
        
        # Compute weighted average trust_score
        trust_score = sum(
            scores[dim] * normalized_weights[dim]
            for dim in scores.keys()
        )
        
        # Return dict with trust_score and metadata
        return {
            'trust_score': trust_score,
            'metadata': {
                'weights_used': normalized_weights,
                'contributing_scores': scores
            }
        }
