CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS design_concepts (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    description TEXT,
    image_url TEXT,
    style VARCHAR(100),
    color_scheme VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
