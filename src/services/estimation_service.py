"""
Estimation Service - Cost estimation for Dubai Cons AI Suite
"""

from typing import Dict, Any, Optional


class EstimationService:
    """
    Service for calculating project cost estimation
    Based on area, property type, design complexity
    """
    
    # Cost per square meter for different property types (AED)
    BASE_COSTS = {
        "villa": 2500,  # High-end villas
        "apartment": 1800,  # Standard apartments
        "penthouse": 3000,  # Luxury penthouses
        "office": 1200,  # Commercial offices
        "restaurant": 2000,  # HoReCa
        "retail": 1500,  # Retail spaces
    }
    
    # Cost multipliers based on segment
    SEGMENT_MULTIPLIERS = {
        "luxury": 1.5,  # +50% for luxury
        "commercial": 1.0,  # Standard
        "renovation": 0.7,  # -30% for renovations
    }
    
    # Category percentage distribution
    CATEGORY_PERCENTAGES = {
        "flooring": 0.15,  # 15%
        "wall": 0.12,  # 12%
        "ceiling": 0.08,  # 8%
        "electrical": 0.10,  # 10%
        "plumbing": 0.08,  # 8%
        "hvac": 0.12,  # 12%
        "furniture": 0.20,  # 20%
        "lighting": 0.05,  # 5%
        "decoration": 0.10,  # 10%
    }
    
    def calculate_estimation(
        self,
        project: Any,
        design_concept: Optional[Any] = None
    ) -> Dict[str, Any]:
        """
        Calculate cost estimation for a project
        
        Args:
            project: Project object
            design_concept: Optional design concept
            
        Returns:
            Dictionary with cost breakdown
        """
        # Base calculation
        property_type = project.property_type or "apartment"
        area = project.area or 100.0  # Default 100 sqm
        
        # Get base cost per sqm
        base_cost_per_sqm = self.BASE_COSTS.get(property_type, 1800)
        
        # Apply segment multiplier
        segment_multiplier = self.SEGMENT_MULTIPLIERS.get(
            project.client.segment if project.client else "commercial",
            1.0
        )
        
        # Calculate total base cost
        total_base_cost = area * base_cost_per_sqm * segment_multiplier
        
        # Calculate category costs
        category_costs = {}
        for category, percentage in self.CATEGORY_PERCENTAGES.items():
            category_costs[f"{category}_cost"] = total_base_cost * percentage
        
        # Additional factors
        complexity_multiplier = self._get_complexity_multiplier(project, design_concept)
        
        materials_cost = total_base_cost * 0.4 * complexity_multiplier
        labor_cost = total_base_cost * 0.35
        additional_cost = total_base_cost * 0.25
        
        # Total cost
        total_cost = materials_cost + labor_cost + additional_cost
        
        # Create detailed breakdown
        breakdown = {
            "materials": {
                "flooring": category_costs["flooring_cost"],
                "wall": category_costs["wall_cost"],
                "ceiling": category_costs["ceiling_cost"],
                "electrical": category_costs["electrical_cost"],
                "plumbing": category_costs["plumbing_cost"],
                "hvac": category_costs["hvac_cost"],
                "furniture": category_costs["furniture_cost"],
                "lighting": category_costs["lighting_cost"],
                "decoration": category_costs["decoration_cost"],
            },
            "labor": {
                "installation": labor_cost * 0.6,
                "supervision": labor_cost * 0.3,
                "finishing": labor_cost * 0.1,
            },
            "additional": {
                "transport": additional_cost * 0.2,
                "waste_disposal": additional_cost * 0.15,
                "permits": additional_cost * 0.1,
                "insurance": additional_cost * 0.05,
                "contingency": additional_cost * 0.5,
            }
        }
        
        assumptions = [
            f"Based on {property_type} property type",
            f"Area: {area} sqm",
            f"Segment: {project.client.segment if project.client else 'Standard'}",
            "Costs include materials, labor, and all project expenses",
            "Prices valid for Dubai, UAE",
            f"Complexity factor: {complexity_multiplier:.2f}x"
        ]
        
        return {
            "project_id": project.id,
            "materials_cost": round(materials_cost, 2),
            "labor_cost": round(labor_cost, 2),
            "additional_cost": round(additional_cost, 2),
            "total_cost": round(total_cost, 2),
            "flooring_cost": round(category_costs["flooring_cost"], 2),
            "wall_cost": round(category_costs["wall_cost"], 2),
            "ceiling_cost": round(category_costs["ceiling_cost"], 2),
            "electrical_cost": round(category_costs["electrical_cost"], 2),
            "plumbing_cost": round(category_costs["plumbing_cost"], 2),
            "hvac_cost": round(category_costs["hvac_cost"], 2),
            "furniture_cost": round(category_costs["furniture_cost"], 2),
            "lighting_cost": round(category_costs["lighting_cost"], 2),
            "decoration_cost": round(category_costs["decoration_cost"], 2),
            "breakdown": breakdown,
            "assumptions": assumptions,
            "area": area,
            "property_type": property_type,
            "segment": project.client.segment if project.client else "commercial",
        }
    
    def _get_complexity_multiplier(self, project: Any, design_concept: Optional[Any]) -> float:
        """
        Calculate complexity multiplier based on project details
        """
        multiplier = 1.0
        
        # Based on area
        if project.area:
            if project.area < 100:
                multiplier *= 1.2  # Small spaces are harder
            elif project.area > 500:
                multiplier *= 1.15  # Large spaces cost more
        
        # Based on segment
        if project.client and project.client.segment == "luxury":
            multiplier *= 1.3  # Luxury requires premium materials
        
        # Based on design concept
        if design_concept:
            if design_concept.style:
                if "luxury" in design_concept.style.lower():
                    multiplier *= 1.2
                if "custom" in design_concept.style.lower():
                    multiplier *= 1.15
        
        return multiplier


# Global service instance
estimation_service = EstimationService()

