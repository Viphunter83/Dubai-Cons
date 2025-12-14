# Схема базы данных Dubai Cons AI Suite

## 🗄️ Обзор базы данных

Dubai Cons AI Suite использует PostgreSQL как основную реляционную базу данных с дополнительными специализированными хранилищами для различных типов данных.

## 🏗️ Архитектура данных

### Основные компоненты
- **PostgreSQL 14+**: Основная реляционная база данных
- **Redis 7+**: Кэширование и сессии
- **Pinecone/Weaviate**: Векторная база для ИИ
- **AWS S3/MinIO**: Объектное хранилище для файлов

## 📊 Основные таблицы

### 👥 Клиенты и пользователи

```sql
-- Таблица клиентов
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    client_type VARCHAR(50) NOT NULL CHECK (client_type IN ('luxury_private', 'commercial_b2b', 'renovation')),
    budget_range JSONB,
    preferences JSONB,
    location VARCHAR(100),
    property_type VARCHAR(50),
    property_value DECIMAL(15,2),
    annual_income DECIMAL(15,2),
    communication_preferences JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Таблица пользователей системы
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'designer', 'project_manager', 'sales', 'client')),
    department VARCHAR(50),
    permissions JSONB,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Связь клиентов с пользователями
CREATE TABLE client_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- owner, contact, decision_maker
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(client_id, user_id)
);
```

### 🏗️ Проекты и концепции

```sql
-- Таблица проектов
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(50) NOT NULL CHECK (project_type IN ('residential', 'commercial', 'renovation', 'hospitality')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'design', 'approval', 'execution', 'completed', 'cancelled')),
    budget DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    timeline JSONB, -- {start_date, end_date, milestones}
    requirements JSONB,
    constraints JSONB,
    location VARCHAR(100),
    area DECIMAL(10,2),
    complexity VARCHAR(20) CHECK (complexity IN ('low', 'medium', 'high')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Таблица дизайн-концепций
CREATE TABLE design_concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    concept_data JSONB NOT NULL, -- Основные данные концепции
    style_tags TEXT[],
    color_palette JSONB,
    materials JSONB,
    layout JSONB,
    cost_estimate DECIMAL(15,2),
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    is_approved BOOLEAN DEFAULT false,
    is_final BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Версии концепций
CREATE TABLE concept_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id UUID REFERENCES design_concepts(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    changes JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(concept_id, version_number)
);
```

### 🎨 Материалы и поставщики

```sql
-- Таблица поставщиков
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_info JSONB, -- {phone, email, address, website}
    specialties TEXT[], -- ['marble', 'wood', 'lighting']
    location VARCHAR(100),
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    delivery_time_days INTEGER,
    minimum_order DECIMAL(10,2),
    payment_terms VARCHAR(100),
    certifications TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица материалов
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- flooring, wall, ceiling, furniture
    subcategory VARCHAR(100),
    specifications JSONB, -- {color, finish, thickness, dimensions}
    supplier_id UUID REFERENCES suppliers(id),
    price_per_unit DECIMAL(10,2),
    unit VARCHAR(20), -- sqm, piece, meter
    availability VARCHAR(50) CHECK (availability IN ('in_stock', '2_weeks', '1_month', 'custom_order')),
    location VARCHAR(100),
    images TEXT[],
    technical_data JSONB,
    sustainability_info JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Цены материалов по времени
CREATE TABLE material_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'AED',
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 📄 Документация

```sql
-- Таблица проектной документации
CREATE TABLE project_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('technical_spec', 'drawings', 'specifications', 'permits', 'contracts')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    version VARCHAR(20),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'rejected')),
    compliance_status VARCHAR(50),
    generated_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Чертежи
CREATE TABLE drawings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    drawing_type VARCHAR(50) NOT NULL CHECK (drawing_type IN ('floor_plan', 'elevation', 'section', 'detail', '3d_model')),
    title VARCHAR(255) NOT NULL,
    scale VARCHAR(20),
    layers TEXT[],
    file_path VARCHAR(500),
    thumbnail_path VARCHAR(500),
    metadata JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 💰 Сметы и финансы

```sql
-- Таблица смет
CREATE TABLE estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    concept_id UUID REFERENCES design_concepts(id),
    estimate_type VARCHAR(50) DEFAULT 'detailed' CHECK (estimate_type IN ('preliminary', 'detailed', 'final')),
    materials_cost DECIMAL(15,2),
    labor_cost DECIMAL(15,2),
    overhead_cost DECIMAL(15,2),
    total_cost DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'AED',
    breakdown JSONB,
    assumptions TEXT[],
    validity_period INTEGER DEFAULT 30, -- дни
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'expired')),
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Позиции сметы
CREATE TABLE estimate_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- materials, labor, equipment
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity DECIMAL(10,3),
    unit VARCHAR(20),
    unit_price DECIMAL(10,2),
    total_price DECIMAL(15,2),
    material_id UUID REFERENCES materials(id),
    supplier_id UUID REFERENCES suppliers(id),
    sort_order INTEGER
);

-- Платежи
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'AED',
    payment_type VARCHAR(50) CHECK (payment_type IN ('advance', 'milestone', 'final', 'retention')),
    milestone VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    due_date DATE,
    paid_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 📊 Управление проектами

```sql
-- Таблица задач проекта
CREATE TABLE project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) CHECK (task_type IN ('design', 'procurement', 'construction', 'inspection', 'delivery')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    estimated_duration INTEGER, -- в днях
    actual_duration INTEGER,
    estimated_start_date DATE,
    actual_start_date DATE,
    estimated_end_date DATE,
    actual_end_date DATE,
    dependencies UUID[], -- массив ID зависимых задач
    assigned_to UUID REFERENCES users(id),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Вехи проекта
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_date DATE NOT NULL,
    actual_date DATE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
    deliverables TEXT[],
    dependencies UUID[], -- массив ID зависимых задач
    created_at TIMESTAMP DEFAULT NOW()
);

-- Время работы
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES project_tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hours_worked DECIMAL(4,2) NOT NULL,
    description TEXT,
    billable BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 🖼️ Визуализация и медиа

```sql
-- Таблица визуализаций
CREATE TABLE visualizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    concept_id UUID REFERENCES design_concepts(id),
    visualization_type VARCHAR(50) NOT NULL CHECK (visualization_type IN ('3d_model', 'vr_tour', 'rendering', 'animation', 'walkthrough')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    thumbnail_path VARCHAR(500),
    file_size BIGINT,
    resolution VARCHAR(20), -- 4K, HD, etc.
    quality_settings JSONB,
    status VARCHAR(50) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    task_id VARCHAR(100), -- ID задачи в системе рендеринга
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Медиа файлы
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    file_type VARCHAR(50) CHECK (file_type IN ('image', 'video', 'audio', 'document', '3d_model')),
    category VARCHAR(100),
    tags TEXT[],
    metadata JSONB,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 📈 Аналитика и метрики

```sql
-- Таблица метрик проекта
CREATE TABLE project_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_unit VARCHAR(20),
    metric_type VARCHAR(50) CHECK (metric_type IN ('cost', 'time', 'quality', 'satisfaction')),
    measured_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Клиентская аналитика
CREATE TABLE client_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    session_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Отзывы клиентов
CREATE TABLE client_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    categories TEXT[], -- ['design', 'communication', 'timeline', 'quality']
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔍 Индексы для оптимизации

```sql
-- Основные индексы
CREATE INDEX idx_clients_type ON clients(client_type);
CREATE INDEX idx_clients_location ON clients(location);
CREATE INDEX idx_clients_created_at ON clients(created_at);

CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_type ON projects(project_type);
CREATE INDEX idx_projects_created_at ON projects(created_at);

CREATE INDEX idx_concepts_project ON design_concepts(project_id);
CREATE INDEX idx_concepts_status ON design_concepts(is_approved, is_final);
CREATE INDEX idx_concepts_created_at ON design_concepts(created_at);

CREATE INDEX idx_materials_category ON materials(category);
CREATE INDEX idx_materials_supplier ON materials(supplier_id);
CREATE INDEX idx_materials_active ON materials(is_active);

CREATE INDEX idx_suppliers_location ON suppliers(location);
CREATE INDEX idx_suppliers_rating ON suppliers(rating);
CREATE INDEX idx_suppliers_active ON suppliers(is_active);

CREATE INDEX idx_tasks_project ON project_tasks(project_id);
CREATE INDEX idx_tasks_status ON project_tasks(status);
CREATE INDEX idx_tasks_assigned ON project_tasks(assigned_to);
CREATE INDEX idx_tasks_dates ON project_tasks(estimated_start_date, estimated_end_date);

CREATE INDEX idx_estimates_project ON estimates(project_id);
CREATE INDEX idx_estimates_status ON estimates(status);
CREATE INDEX idx_estimates_created_at ON estimates(created_at);

-- Составные индексы
CREATE INDEX idx_projects_client_status ON projects(client_id, status);
CREATE INDEX idx_concepts_project_approved ON design_concepts(project_id, is_approved);
CREATE INDEX idx_tasks_project_status ON project_tasks(project_id, status);

-- Полнотекстовый поиск
CREATE INDEX idx_materials_search ON materials USING gin(to_tsvector('english', name || ' ' || COALESCE(specifications::text, '')));
CREATE INDEX idx_suppliers_search ON suppliers USING gin(to_tsvector('english', name || ' ' || COALESCE(contact_info::text, '')));
CREATE INDEX idx_projects_search ON projects USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
```

## 🔐 Безопасность и аудит

```sql
-- Таблица аудита
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Триггеры для аудита
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, new_values, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), NEW.updated_by);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), NEW.updated_by);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, changed_by)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), OLD.updated_by);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Применение триггеров к критическим таблицам
CREATE TRIGGER clients_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON clients
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER projects_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON projects
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER estimates_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON estimates
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

## 📊 Представления (Views)

```sql
-- Представление для активных проектов
CREATE VIEW active_projects AS
SELECT 
    p.id,
    p.name,
    p.status,
    p.budget,
    p.area,
    c.name as client_name,
    c.client_type,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    ROUND(COUNT(CASE WHEN t.status = 'completed' THEN 1 END) * 100.0 / COUNT(t.id), 2) as progress_percentage
FROM projects p
JOIN clients c ON p.client_id = c.id
LEFT JOIN project_tasks t ON p.id = t.project_id
WHERE p.status NOT IN ('completed', 'cancelled')
GROUP BY p.id, p.name, p.status, p.budget, p.area, c.name, c.client_type;

-- Представление для финансовой отчетности
CREATE VIEW financial_summary AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    p.budget as planned_budget,
    COALESCE(SUM(e.total_cost), 0) as estimated_cost,
    COALESCE(SUM(pay.amount), 0) as paid_amount,
    COALESCE(SUM(pay.amount), 0) - COALESCE(SUM(e.total_cost), 0) as variance,
    c.name as client_name
FROM projects p
LEFT JOIN estimates e ON p.id = e.project_id AND e.status = 'approved'
LEFT JOIN payments pay ON p.id = pay.project_id AND pay.status = 'completed'
JOIN clients c ON p.client_id = c.id
GROUP BY p.id, p.name, p.budget, c.name;

-- Представление для поставщиков с рейтингами
CREATE VIEW supplier_ratings AS
SELECT 
    s.id,
    s.name,
    s.location,
    s.rating,
    COUNT(m.id) as materials_count,
    AVG(mp.price) as avg_price,
    COUNT(CASE WHEN m.availability = 'in_stock' THEN 1 END) as in_stock_count
FROM suppliers s
LEFT JOIN materials m ON s.id = m.supplier_id
LEFT JOIN material_prices mp ON m.id = mp.material_id
WHERE s.is_active = true
GROUP BY s.id, s.name, s.location, s.rating;
```

## 🔄 Миграции и версионирование

```sql
-- Таблица версий схемы
CREATE TABLE schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT NOW(),
    description TEXT
);

-- Функция для применения миграций
CREATE OR REPLACE FUNCTION apply_migration(version VARCHAR(50), description TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO schema_migrations (version, description) 
    VALUES (version, description);
END;
$$ LANGUAGE plpgsql;

-- Пример миграции
-- SELECT apply_migration('001_initial_schema', 'Initial database schema');
```

## 📈 Производительность

### Партиционирование
```sql
-- Партиционирование таблицы аудита по месяцам
CREATE TABLE audit_log_partitioned (
    LIKE audit_log INCLUDING ALL
) PARTITION BY RANGE (changed_at);

-- Создание партиций
CREATE TABLE audit_log_2024_10 PARTITION OF audit_log_partitioned
    FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');

CREATE TABLE audit_log_2024_11 PARTITION OF audit_log_partitioned
    FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');
```

### Материализованные представления
```sql
-- Материализованное представление для аналитики
CREATE MATERIALIZED VIEW project_analytics AS
SELECT 
    DATE_TRUNC('month', p.created_at) as month,
    c.client_type,
    COUNT(*) as project_count,
    AVG(p.budget) as avg_budget,
    AVG(EXTRACT(DAYS FROM (p.completed_at - p.created_at))) as avg_duration
FROM projects p
JOIN clients c ON p.client_id = c.id
WHERE p.status = 'completed'
GROUP BY DATE_TRUNC('month', p.created_at), c.client_type;

-- Обновление материализованного представления
CREATE OR REPLACE FUNCTION refresh_project_analytics()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY project_analytics;
END;
$$ LANGUAGE plpgsql;
```

---

*Документ создан: Октябрь 2024*  
*Версия: 1.0*  
*Статус: Утверждено*
