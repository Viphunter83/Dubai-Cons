"""
Database models for Dubai Cons AI Suite MVP
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

from database.connection import Base


class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    projects = relationship("Project", back_populates="owner")


class Client(Base):
    """Client model"""
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    segment = Column(String, nullable=True)  # luxury, commercial, renovation
    preferences = Column(Text, nullable=True)  # JSON string of preferences
    budget_range = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=True)
    
    # Relationships
    projects = relationship("Project", back_populates="client")


class Project(Base):
    """Project model"""
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    
    # Client info
    client_id = Column(Integer, ForeignKey("clients.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Project details
    property_type = Column(String, nullable=True)  # villa, apartment, office, etc.
    area = Column(Float, nullable=True)  # in sq meters
    location = Column(String, nullable=True)
    
    # Status
    status = Column(String, default="draft", nullable=True)  # draft, in_progress, completed
    budget = Column(Float, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    client = relationship("Client", back_populates="projects")
    owner = relationship("User", back_populates="projects")
    design_concepts = relationship("DesignConcept", back_populates="project")


class DesignConcept(Base):
    """Design concept model"""
    __tablename__ = "design_concepts"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    
    # Generated content
    description = Column(Text)  # AI-generated text description
    style = Column(String)
    color_scheme = Column(String)
    
    # Visualization
    image_url = Column(String)  # URL to generated image
    render_url = Column(String)  # URL to 3D render
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="design_concepts")


class Material(Base):
    """Material catalog"""
    __tablename__ = "materials"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String)  # flooring, wall, ceiling, etc.
    supplier = Column(String)
    price_per_unit = Column(Float)
    unit = Column(String)  # sqm, meter, piece, etc.
    availability = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Estimation(Base):
    """Cost estimation for projects"""
    __tablename__ = "estimations"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    
    # Cost breakdown
    materials_cost = Column(Float, default=0.0)
    labor_cost = Column(Float, default=0.0)
    additional_cost = Column(Float, default=0.0)
    total_cost = Column(Float, nullable=False)
    
    # Categories
    flooring_cost = Column(Float, default=0.0)
    wall_cost = Column(Float, default=0.0)
    ceiling_cost = Column(Float, default=0.0)
    electrical_cost = Column(Float, default=0.0)
    plumbing_cost = Column(Float, default=0.0)
    hvac_cost = Column(Float, default=0.0)
    furniture_cost = Column(Float, default=0.0)
    lighting_cost = Column(Float, default=0.0)
    decoration_cost = Column(Float, default=0.0)
    
    # Details
    breakdown = Column(Text)  # JSON string of detailed breakdown
    assumptions = Column(Text)  # Assumptions and notes
    valid_until = Column(DateTime(timezone=True))
    
    # Status
    status = Column(String, default="draft")  # draft, approved, rejected
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project")
