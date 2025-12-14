# API Документация Dubai Cons AI Suite

## 📚 Обзор API

Dubai Cons AI Suite предоставляет RESTful API для интеграции с внешними системами и клиентскими приложениями. API построен на основе OpenAPI 3.0 спецификации и поддерживает асинхронные запросы.

## 🔗 Базовые URL

- **Production**: `https://api.dubaicons.ai/v1`
- **Staging**: `https://staging-api.dubaicons.ai/v1`
- **Development**: `http://localhost:8000/v1`

## 🔐 Аутентификация

### Bearer Token
Все API запросы требуют аутентификации через Bearer Token:

```http
Authorization: Bearer <your_access_token>
```

### Получение токена
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_here"
}
```

## 🎨 Design AI Service API

### Генерация концепций дизайна

```http
POST /design/generate-concepts
Content-Type: application/json
Authorization: Bearer <token>

{
  "client_preferences": {
    "style": ["modern", "minimalist"],
    "colors": ["neutral", "white", "gray"],
    "materials": ["wood", "marble", "glass"],
    "budget_range": {
      "min": 100000,
      "max": 500000
    }
  },
  "space_constraints": {
    "area": 120,
    "rooms": ["living_room", "kitchen", "bedroom"],
    "ceiling_height": 3.2,
    "windows": 4
  },
  "budget_constraints": {
    "total_budget": 300000,
    "materials_budget": 150000,
    "labor_budget": 100000,
    "furniture_budget": 50000
  },
  "style_preferences": ["modern", "luxury", "minimalist"]
}
```

**Ответ:**
```json
{
  "concepts": [
    {
      "id": "concept_001",
      "name": "Modern Minimalist Luxury",
      "description": "Современный минималистичный дизайн с элементами роскоши",
      "style_tags": ["modern", "minimalist", "luxury"],
      "color_palette": {
        "primary": "#FFFFFF",
        "secondary": "#F5F5F5",
        "accent": "#2C3E50"
      },
      "materials": [
        {
          "name": "Carrara Marble",
          "category": "stone",
          "usage": "kitchen_counter",
          "cost_per_sqm": 150
        }
      ],
      "layout": {
        "rooms": [
          {
            "name": "living_room",
            "area": 45,
            "furniture": ["sofa", "coffee_table", "tv_unit"],
            "lighting": ["pendant", "floor_lamp"]
          }
        ]
      },
      "cost_estimate": 285000,
      "confidence_score": 0.92
    }
  ],
  "recommendations": {
    "best_concept": "concept_001",
    "alternative_materials": [
      {
        "original": "Carrara Marble",
        "alternative": "Quartz",
        "savings": 25000
      }
    ],
    "optimization_suggestions": [
      "Использование LED освещения для экономии энергии",
      "Выбор местных поставщиков для снижения логистических расходов"
    ]
  },
  "confidence_scores": {
    "concept_001": 0.92,
    "concept_002": 0.87,
    "concept_003": 0.83
  }
}
```

### Персонализация концепции

```http
POST /design/personalize/{concept_id}
Content-Type: application/json
Authorization: Bearer <token>

{
  "personalization_data": {
    "family_size": 4,
    "lifestyle": "active",
    "work_from_home": true,
    "entertainment_needs": true,
    "pets": false,
    "accessibility_requirements": false
  },
  "specific_requests": [
    "Больше места для хранения",
    "Отдельный кабинет для работы",
    "Детская игровая зона"
  ]
}
```

**Ответ:**
```json
{
  "personalized_concept": {
    "id": "concept_001_personalized",
    "base_concept_id": "concept_001",
    "modifications": [
      {
        "room": "living_room",
        "change": "added_storage_wall",
        "description": "Добавлена стена с встроенными шкафами"
      },
      {
        "room": "bedroom_2",
        "change": "converted_to_home_office",
        "description": "Преобразование в домашний офис"
      }
    ],
    "updated_cost_estimate": 295000,
    "personalization_score": 0.95
  }
}
```

## 🖼️ Visualization Service API

### Создание 3D модели

```http
POST /visualization/create-3d-model
Content-Type: application/json
Authorization: Bearer <token>

{
  "design_data": {
    "concept_id": "concept_001",
    "rooms": [
      {
        "name": "living_room",
        "dimensions": {"width": 6, "length": 8, "height": 3.2},
        "furniture": [
          {
            "type": "sofa",
            "position": {"x": 2, "y": 1, "z": 0},
            "rotation": 0,
            "material": "leather_black"
          }
        ]
      }
    ]
  },
  "materials_data": {
    "floor": "oak_parquet",
    "walls": "white_paint",
    "ceiling": "white_paint"
  },
  "quality_settings": {
    "resolution": "4K",
    "lighting": "photorealistic",
    "textures": "high",
    "render_engine": "cycles"
  }
}
```

**Ответ:**
```json
{
  "task_id": "viz_task_001",
  "status": "processing",
  "estimated_completion": "2024-10-15T14:30:00Z",
  "progress": 0,
  "message": "3D модель создается..."
}
```

### Получение статуса задачи

```http
GET /visualization/task/{task_id}/status
Authorization: Bearer <token>
```

**Ответ:**
```json
{
  "task_id": "viz_task_001",
  "status": "completed",
  "progress": 100,
  "result": {
    "model_url": "https://storage.dubaicons.ai/models/viz_task_001.glb",
    "preview_images": [
      "https://storage.dubaicons.ai/previews/viz_task_001_1.jpg",
      "https://storage.dubaicons.ai/previews/viz_task_001_2.jpg"
    ],
    "metadata": {
      "file_size": "25.6MB",
      "polygon_count": 125000,
      "texture_resolution": "4096x4096"
    }
  },
  "created_at": "2024-10-15T14:00:00Z",
  "completed_at": "2024-10-15T14:28:00Z"
}
```

### Создание VR тура

```http
POST /visualization/create-vr-tour
Content-Type: application/json
Authorization: Bearer <token>

{
  "model_id": "viz_task_001",
  "tour_settings": {
    "starting_position": {"x": 0, "y": 0, "z": 0},
    "hotspots": [
      {
        "position": {"x": 2, "y": 1, "z": 0},
        "type": "info",
        "content": "Диван из итальянской кожи"
      }
    ],
    "lighting": "dynamic",
    "audio": true
  }
}
```

**Ответ:**
```json
{
  "tour_id": "vr_tour_001",
  "tour_url": "https://vr.dubaicons.ai/tour/vr_tour_001",
  "qr_code": "https://storage.dubaicons.ai/qr/vr_tour_001.png",
  "compatible_devices": ["oculus", "htc_vive", "webxr"],
  "estimated_size": "45MB"
}
```

## 📄 Documentation Service API

### Генерация проектной документации

```http
POST /documentation/generate-project-docs
Content-Type: application/json
Authorization: Bearer <token>

{
  "project_data": {
    "concept_id": "concept_001",
    "client_id": "client_123",
    "project_type": "residential_renovation",
    "area": 120,
    "rooms": ["living_room", "kitchen", "bedroom"]
  },
  "client_requirements": {
    "timeline": "90_days",
    "budget": 300000,
    "special_requirements": [
      "Энергоэффективность",
      "Умный дом",
      "Доступность для инвалидов"
    ]
  },
  "compliance_standards": [
    "Dubai_Municipality_Universal_Design_Code",
    "Dubai_2040_Sustainability_Standards",
    "Fire_Safety_Code"
  ]
}
```

**Ответ:**
```json
{
  "technical_specification": {
    "document_id": "tech_spec_001",
    "sections": [
      {
        "title": "Общие требования",
        "content": "Детальное описание проекта...",
        "compliance_check": "passed"
      },
      {
        "title": "Материалы и отделка",
        "content": "Спецификация материалов...",
        "compliance_check": "passed"
      }
    ],
    "compliance_status": "compliant",
    "generated_at": "2024-10-15T15:00:00Z"
  },
  "drawings": [
    {
      "type": "floor_plan",
      "url": "https://storage.dubaicons.ai/drawings/floor_plan_001.pdf",
      "scale": "1:100",
      "layers": ["walls", "doors", "windows", "furniture"]
    },
    {
      "type": "elevation",
      "url": "https://storage.dubaicons.ai/drawings/elevation_001.pdf",
      "views": ["front", "side", "rear"]
    }
  ],
  "specifications": {
    "materials": [
      {
        "item": "Flooring - Oak Parquet",
        "specification": "Engineered oak, 15mm thickness",
        "quantity": "120 sqm",
        "unit_price": 85,
        "total_price": 10200
      }
    ],
    "labor": [
      {
        "item": "Floor Installation",
        "specification": "Professional installation with underlay",
        "quantity": "120 sqm",
        "unit_price": 25,
        "total_price": 3000
      }
    ]
  },
  "compliance_check": {
    "overall_status": "compliant",
    "checks": [
      {
        "standard": "Dubai_Municipality_Universal_Design_Code",
        "status": "passed",
        "issues": []
      },
      {
        "standard": "Fire_Safety_Code",
        "status": "passed",
        "issues": []
      }
    ]
  }
}
```

## 💰 Estimation Service API

### Расчет сметы

```http
POST /estimation/calculate
Content-Type: application/json
Authorization: Bearer <token>

{
  "project_data": {
    "concept_id": "concept_001",
    "area": 120,
    "complexity": "medium",
    "location": "Dubai_Marina"
  },
  "materials_data": {
    "flooring": "oak_parquet",
    "walls": "paint_premium",
    "kitchen": "custom_cabinets",
    "bathroom": "marble_tiles"
  },
  "labor_rates": {
    "general_labor": 45,
    "specialized_labor": 75,
    "supervision": 100
  },
  "location": "Dubai"
}
```

**Ответ:**
```json
{
  "materials_cost": 150000,
  "labor_cost": 100000,
  "overhead_cost": 25000,
  "total_cost": 275000,
  "breakdown": {
    "by_category": [
      {
        "category": "Flooring",
        "cost": 25000,
        "percentage": 9.1
      },
      {
        "category": "Kitchen",
        "cost": 45000,
        "percentage": 16.4
      },
      {
        "category": "Bathroom",
        "cost": 35000,
        "percentage": 12.7
      }
    ],
    "by_room": [
      {
        "room": "Living Room",
        "cost": 85000,
        "percentage": 30.9
      },
      {
        "room": "Kitchen",
        "cost": 65000,
        "percentage": 23.6
      }
    ]
  },
  "suppliers": [
    {
      "id": "supplier_001",
      "name": "Dubai Marble Co.",
      "rating": 4.8,
      "delivery_time": "7_days",
      "materials": ["marble", "granite"],
      "total_cost": 35000
    }
  ],
  "payment_schedule": [
    {
      "milestone": "Design Approval",
      "percentage": 20,
      "amount": 55000,
      "due_date": "2024-10-20"
    },
    {
      "milestone": "Materials Delivery",
      "percentage": 30,
      "amount": 82500,
      "due_date": "2024-11-15"
    }
  ],
  "validity_period": "30_days",
  "generated_at": "2024-10-15T16:00:00Z"
}
```

### Оптимизация бюджета

```http
POST /estimation/optimize-budget
Content-Type: application/json
Authorization: Bearer <token>

{
  "budget_constraint": 200000,
  "project_requirements": {
    "must_have": [
      "kitchen_renovation",
      "bathroom_renovation",
      "flooring_replacement"
    ],
    "nice_to_have": [
      "smart_home_system",
      "premium_lighting",
      "custom_furniture"
    ],
    "flexible": [
      "material_grade",
      "finish_level",
      "brand_preferences"
    ]
  }
}
```

**Ответ:**
```json
{
  "alternatives": [
    {
      "option": "Budget Optimized",
      "total_cost": 195000,
      "savings": 80000,
      "changes": [
        {
          "item": "Kitchen Countertop",
          "original": "Carrara Marble",
          "alternative": "Quartz",
          "savings": 15000
        },
        {
          "item": "Flooring",
          "original": "Solid Oak",
          "alternative": "Engineered Oak",
          "savings": 12000
        }
      ],
      "impact": "minimal_visual_difference"
    }
  ],
  "savings": {
    "total_savings": 80000,
    "savings_percentage": 29.1,
    "areas_of_savings": [
      {
        "category": "Materials",
        "savings": 45000,
        "percentage": 56.3
      },
      {
        "category": "Labor",
        "savings": 20000,
        "percentage": 25.0
      }
    ]
  },
  "recommendations": [
    "Использовать местных поставщиков для снижения логистических расходов",
    "Рассмотреть поэтапную реализацию для распределения затрат",
    "Использовать стандартные размеры для снижения стоимости изготовления"
  ]
}
```

## 🛒 Sourcing Service API

### Поиск материалов

```http
POST /sourcing/find-materials
Content-Type: application/json
Authorization: Bearer <token>

{
  "material_specifications": {
    "marble": {
      "type": "Carrara",
      "thickness": "2cm",
      "finish": "polished",
      "quantity": "25 sqm"
    },
    "wood": {
      "type": "Oak",
      "grade": "A",
      "thickness": "18mm",
      "quantity": "120 sqm"
    }
  },
  "budget_constraints": {
    "marble_budget": 15000,
    "wood_budget": 10000,
    "total_budget": 25000
  },
  "timeline_constraints": {
    "delivery_date": "2024-11-15",
    "flexibility": "7_days"
  },
  "location": "Dubai"
}
```

**Ответ:**
```json
{
  "suppliers": [
    {
      "id": "supplier_001",
      "name": "Dubai Marble Co.",
      "contact": {
        "phone": "+971 4 123 4567",
        "email": "info@dubaimarble.ae",
        "website": "www.dubaimarble.ae"
      },
      "location": "Dubai Industrial City",
      "rating": 4.8,
      "specialties": ["marble", "granite", "quartz"],
      "materials": [
        {
          "specification": "marble",
          "price": 600,
          "availability": "in_stock",
          "delivery_time": "3_days",
          "minimum_order": "10 sqm"
        }
      ],
      "total_cost": 15000,
      "delivery_cost": 500
    }
  ],
  "price_comparison": {
    "marble": [
      {
        "supplier": "Dubai Marble Co.",
        "price": 600,
        "rating": 4.8,
        "delivery_time": "3_days"
      },
      {
        "supplier": "Emirates Stone",
        "price": 650,
        "rating": 4.6,
        "delivery_time": "5_days"
      }
    ]
  },
  "availability": {
    "marble": "in_stock",
    "wood": "2_weeks_lead_time"
  },
  "recommendations": [
    {
      "supplier": "Dubai Marble Co.",
      "reason": "Best price-quality ratio",
      "confidence": 0.92
    }
  ]
}
```

## 📊 Project Management Service API

### Создание плана проекта

```http
POST /project/create-plan
Content-Type: application/json
Authorization: Bearer <token>

{
  "project_data": {
    "name": "Luxury Apartment Renovation",
    "client_id": "client_123",
    "concept_id": "concept_001",
    "area": 120,
    "complexity": "high",
    "timeline": "90_days"
  },
  "resources": {
    "designers": 2,
    "project_managers": 1,
    "contractors": 3,
    "specialists": 2
  },
  "constraints": {
    "budget": 300000,
    "deadline": "2024-12-31",
    "working_hours": "8am-6pm",
    "noise_restrictions": "weekends_only"
  }
}
```

**Ответ:**
```json
{
  "schedule": {
    "phases": [
      {
        "phase": "Design & Planning",
        "duration": "14_days",
        "start_date": "2024-10-15",
        "end_date": "2024-10-29",
        "tasks": [
          {
            "id": "task_001",
            "name": "Final Design Approval",
            "duration": "3_days",
            "dependencies": [],
            "assigned_to": "designer_001"
          }
        ]
      },
      {
        "phase": "Procurement",
        "duration": "21_days",
        "start_date": "2024-10-20",
        "end_date": "2024-11-10",
        "tasks": [
          {
            "id": "task_002",
            "name": "Material Ordering",
            "duration": "5_days",
            "dependencies": ["task_001"],
            "assigned_to": "procurement_manager"
          }
        ]
      }
    ],
    "critical_path": ["task_001", "task_002", "task_005", "task_008"],
    "total_duration": "85_days"
  },
  "resource_allocation": {
    "designers": [
      {
        "name": "Designer 1",
        "allocation": "100%",
        "tasks": ["task_001", "task_003"]
      }
    ],
    "contractors": [
      {
        "name": "Main Contractor",
        "allocation": "80%",
        "tasks": ["task_005", "task_006", "task_007"]
      }
    ]
  },
  "risk_assessment": {
    "high_risks": [
      {
        "risk": "Material delivery delay",
        "probability": "medium",
        "impact": "high",
        "mitigation": "Order materials early, have backup suppliers"
      }
    ],
    "medium_risks": [
      {
        "risk": "Weather delays",
        "probability": "low",
        "impact": "medium",
        "mitigation": "Indoor work scheduling"
      }
    ]
  },
  "milestones": [
    {
      "name": "Design Approval",
      "date": "2024-10-29",
      "deliverables": ["Final Design", "Material Selection"]
    },
    {
      "name": "Construction Start",
      "date": "2024-11-15",
      "deliverables": ["Permits", "Materials on Site"]
    }
  ]
}
```

### Мониторинг прогресса

```http
POST /project/monitor-progress
Content-Type: application/json
Authorization: Bearer <token>

{
  "project_id": "project_123",
  "real_time_data": {
    "current_date": "2024-10-20",
    "completed_tasks": ["task_001", "task_002"],
    "in_progress_tasks": ["task_003"],
    "delayed_tasks": [],
    "resource_utilization": {
      "designers": "90%",
      "contractors": "75%"
    },
    "budget_consumed": 45000,
    "quality_metrics": {
      "defect_rate": "2%",
      "client_satisfaction": "4.8/5"
    }
  }
}
```

**Ответ:**
```json
{
  "current_status": {
    "overall_progress": "25%",
    "schedule_status": "on_track",
    "budget_status": "within_budget",
    "quality_status": "excellent"
  },
  "forecast": {
    "estimated_completion": "2024-12-28",
    "confidence": 0.85,
    "budget_forecast": 285000,
    "risk_level": "low"
  },
  "deviations": [],
  "recommendations": [
    "Продолжить текущий темп работы",
    "Рассмотреть ускорение закупок для следующей фазы",
    "Подготовить дополнительные ресурсы для пиковой нагрузки"
  ],
  "alerts": [
    {
      "type": "info",
      "message": "Все задачи выполняются по графику",
      "priority": "low"
    }
  ]
}
```

## 👥 Client Service API

### Анализ профиля клиента

```http
POST /client/analyze-profile
Content-Type: application/json
Authorization: Bearer <token>

{
  "client_data": {
    "name": "Ahmed Al-Rashid",
    "email": "ahmed@example.com",
    "phone": "+971 50 123 4567",
    "location": "Dubai_Marina",
    "property_type": "apartment",
    "property_value": 2500000,
    "annual_income": 500000
  },
  "interaction_history": {
    "previous_projects": 0,
    "website_visits": 15,
    "email_opens": 8,
    "preferred_communication": "whatsapp",
    "response_time": "2_hours",
    "budget_flexibility": "high"
  }
}
```

**Ответ:**
```json
{
  "segment": "luxury_private",
  "preferences": {
    "style": ["modern", "luxury", "minimalist"],
    "colors": ["neutral", "white", "gold"],
    "materials": ["marble", "wood", "metal"],
    "technology": "smart_home_advanced",
    "communication": "personal_consultant"
  },
  "budget_estimation": {
    "estimated_budget": 400000,
    "budget_range": {
      "min": 300000,
      "max": 600000
    },
    "flexibility": "high",
    "payment_preference": "installments"
  },
  "approach": {
    "recommended_approach": "premium_personalized",
    "key_messages": [
      "Персонализация через ИИ",
      "Эксклюзивные материалы",
      "Технологические инновации"
    ],
    "communication_style": "professional_personal",
    "presentation_format": "vr_demo"
  },
  "next_steps": [
    "Персональная встреча с дизайнером",
    "Демонстрация VR-тура",
    "Представление эксклюзивных материалов"
  ]
}
```

## 📊 Общие ответы и ошибки

### Успешные ответы
- **200 OK**: Успешный запрос
- **201 Created**: Ресурс создан
- **202 Accepted**: Запрос принят к обработке

### Ошибки клиента
- **400 Bad Request**: Неверный запрос
- **401 Unauthorized**: Не авторизован
- **403 Forbidden**: Доступ запрещен
- **404 Not Found**: Ресурс не найден
- **422 Unprocessable Entity**: Ошибка валидации

### Ошибки сервера
- **500 Internal Server Error**: Внутренняя ошибка сервера
- **502 Bad Gateway**: Ошибка шлюза
- **503 Service Unavailable**: Сервис недоступен
- **504 Gateway Timeout**: Таймаут шлюза

### Формат ошибки
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Неверные данные запроса",
    "details": [
      {
        "field": "budget_constraints.total_budget",
        "message": "Бюджет должен быть положительным числом"
      }
    ],
    "request_id": "req_123456789"
  }
}
```

## 🔄 Пагинация

Для эндпоинтов, возвращающих списки, используется пагинация:

```http
GET /design/concepts?page=1&limit=20&sort=created_at&order=desc
```

**Ответ:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

## 📝 Rate Limiting

API имеет ограничения на количество запросов:

- **Free tier**: 100 запросов/час
- **Professional**: 1,000 запросов/час
- **Enterprise**: 10,000 запросов/час

Заголовки ответа:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 🔗 Webhooks

Для получения уведомлений о событиях можно настроить webhooks:

```http
POST /webhooks/subscribe
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["design.completed", "project.milestone_reached"],
  "secret": "your_webhook_secret"
}
```

---

*Документ создан: Октябрь 2024*  
*Версия: 1.0*  
*Статус: Утверждено*
