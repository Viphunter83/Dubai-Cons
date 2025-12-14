"""
Estimation Service - Cost estimation for Dubai Cons AI Suite
"""

from typing import Dict, Any, Optional


class EstimationService:
    """
    Service for calculating project cost estimation
    Based on area, property type, design complexity
    """
    
    def __init__(self):
        self.materials_db = self._load_materials_db()

    def _load_materials_db(self) -> Dict[str, Any]:
        import json
        import os
        try:
            # Adjust path relative to this file or project root
            # Assuming src/services/estimation_service.py -> src/data/materials_db.json
            base_path = os.path.dirname(os.path.dirname(__file__))
            db_path = os.path.join(base_path, "data", "materials_db.json")
            with open(db_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading materials DB: {e}. Using fallback.")
            return {}

    def calculate_estimation(
        self,
        project: Any,
        design_concept: Optional[Any] = None
    ) -> Dict[str, Any]:
        """
        Calculate cost estimation for a project using Material DB
        """
        area = project.area or 100.0
        
        # Determine Tier
        tier = "standard"
        segment = project.client.segment if project.client else "commercial"
        style = design_concept.style.lower() if design_concept and design_concept.style else ""
        
        if segment == "luxury" or "luxury" in style or "royal" in style:
            tier = "luxury"
        elif segment == "premium" or "modern" in style or "contemporary" in style:
            tier = "premium"
            
        # Fallback if DB missing
        if not self.materials_db:
             # ... existing simple fallback logic could go here or just defaults ...
             pass
             
        db = self.materials_db
        
        # Calculate Category Costs properly
        # Flooring
        flooring_item = db.get("flooring", {}).get(tier, {"cost_per_sqm": 150})
        flooring_cost = area * flooring_item["cost_per_sqm"]
        
        # Wall (Assuming wall area is roughly 3x floor area for estimation)
        wall_area = area * 3.0
        wall_item = db.get("wall", {}).get(tier, {"cost_per_sqm": 50})
        wall_cost = wall_area * wall_item["cost_per_sqm"]
        
        # Ceiling
        ceiling_item = db.get("ceiling", {}).get(tier, {"cost_per_sqm": 120})
        ceiling_cost = area * ceiling_item["cost_per_sqm"]
        
        # Labor
        labor_item = db.get("labor", {}).get(tier, {"cost_per_sqm": 400})
        labor_cost = area * labor_item["cost_per_sqm"]
        
        # MEP (Mechanical, Electrical, Plumbing)
        mep_item = db.get("mep", {}).get(tier, {"cost_per_sqm": 400})
        mep_total = area * mep_item["cost_per_sqm"]
        
        # Distribute MEP roughly
        electrical_cost = mep_total * 0.4
        plumbing_cost = mep_total * 0.3
        hvac_cost = mep_total * 0.3
        
        # Furniture & Decoration (Percentage of construction cost)
        # Luxury needs higher % for furniture
        furniture_factor = 0.4 if tier == "luxury" else 0.25
        construction_subtotal = flooring_cost + wall_cost + ceiling_cost + labor_cost + mep_total
        
        furniture_cost = construction_subtotal * furniture_factor
        lighting_cost = construction_subtotal * 0.05
        decoration_cost = construction_subtotal * 0.08
        
        materials_cost = flooring_cost + wall_cost + ceiling_cost + mep_total + lighting_cost + decoration_cost + furniture_cost
        
        additional_cost = construction_subtotal * 0.15 # 15% for preliminaries, transport etc
        
        total_cost = materials_cost + labor_cost + additional_cost

        breakdown = {
            "materials": {
                "flooring": flooring_cost,
                "wall": wall_cost,
                "ceiling": ceiling_cost,
                "electrical": electrical_cost,
                "plumbing": plumbing_cost,
                "hvac": hvac_cost,
                "furniture": furniture_cost,
                "lighting": lighting_cost,
                "decoration": decoration_cost,
            },
            "labor": {
                "fitout_team": labor_cost
            },
            "additional": {
                "preliminaries": additional_cost
            }
        }
        
        assumptions = [
            f"Estimation Tier: {tier.upper()}",
            f"Based on {project.property_type or 'General'} property",
            f"Area: {area} sqm",
            f"Flooring: {flooring_item.get('name', 'Standard')}",
            f"Walls: {wall_item.get('name', 'Standard')}",
            f"Ceiling: {ceiling_item.get('name', 'Standard')}",
            "Includes Supply & Installation"
        ]

        return {
            "project_id": project.id,
            "materials_cost": round(materials_cost, 2),
            "labor_cost": round(labor_cost, 2),
            "additional_cost": round(additional_cost, 2),
            "total_cost": round(total_cost, 2),
            "flooring_cost": round(flooring_cost, 2),
            "wall_cost": round(wall_cost, 2),
            "ceiling_cost": round(ceiling_cost, 2),
            "electrical_cost": round(electrical_cost, 2),
            "plumbing_cost": round(plumbing_cost, 2),
            "hvac_cost": round(hvac_cost, 2),
            "furniture_cost": round(furniture_cost, 2),
            "lighting_cost": round(lighting_cost, 2),
            "decoration_cost": round(decoration_cost, 2),
            "breakdown": breakdown,
            "assumptions": assumptions,
            "area": area,
            "property_type": project.property_type or "commercial",
            "segment": segment,
            "tier": tier
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

