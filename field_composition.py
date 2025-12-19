"""
π Field Composition System
Fields combine to create movement meaning
"""
import math

class πFieldCompositor:
    def __init__(self):
        self.fields = []
        self.field_types = {}
        
    def register_field_type(self, field_type, calculator):
        """Register a field type with its force calculator"""
        self.field_types[field_type] = calculator
    
    def add_field(self, field_config):
        """Add a field to the world"""
        field_type = field_config['field_type']
        if field_type not in self.field_types:
            raise ValueError(f"Unknown field type: {field_type}")
        
        self.fields.append(field_config)
    
    def calculate_force_on_body(self, body, position):
        """Calculate total force from all fields on a body at position"""
        total_force = [0.0, 0.0, 0.0]
        
        for field in self.fields:
            field_type = field['field_type']
            calculator = self.field_types[field_type]
            
            force = calculator(field['parameters'], body, position)
            
            # Add to total force
            total_force[0] += force[0]
            total_force[1] += force[1]
            total_force[2] += force[2]
        
        return total_force
    
    # Field calculators
    @staticmethod
    def calculate_wind_force(params, body, position):
        """Calculate wind force on a body"""
        direction = params['direction']
        strength = params['strength']
        
        # Simple wind force (could add turbulence, falloff, etc.)
        force = [
            direction[0] * strength,
            direction[1] * strength,
            direction[2] * strength
        ]
        
        # Scale by body's drag coefficient if available
        if 'drag_coefficient' in body:
            drag = body['drag_coefficient']
            force[0] *= drag
            force[1] *= drag
            force[2] *= drag
        
        return force
    
    @staticmethod
    def calculate_attraction_force(params, body, position):
        """Calculate attraction/repulsion force from well"""
        center = params['position']
        strength = params['strength']
        radius = params['radius']
        falloff_power = params['falloff_power']
        
        # Calculate distance to center
        dx = position[0] - center[0]
        dy = position[1] - center[1]
        dz = position[2] - center[2]
        distance = math.sqrt(dx*dx + dy*dy + dz*dz)
        
        # If outside radius, no force
        if distance > radius:
            return [0.0, 0.0, 0.0]
        
        # Calculate force magnitude (inverse power law)
        if distance < 0.01:  # Avoid division by zero
            distance = 0.01
        
        # Normalize direction (toward center for attraction)
        direction = [-dx/distance, -dy/distance, -dz/distance]
        
        # Calculate force with falloff
        normalized_distance = distance / radius
        force_magnitude = strength * (1.0 / (normalized_distance ** falloff_power))
        
        # Apply force
        force = [
            direction[0] * force_magnitude,
            direction[1] * force_magnitude,
            direction[2] * force_magnitude
        ]
        
        return force
