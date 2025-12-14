# Dubai Cons AI Suite MVP

## 🎯 Описание

Профессиональный ИИ-инструмент для архитектурного дизайна и строительства в Дубае. MVP версия включает базовый функционал для генерации дизайн-концепций с использованием AI.

## 🚀 Быстрый старт

### Предварительные требования

- Python 3.10+
- pip (менеджер пакетов Python)

### Установка

1. **Клонируйте репозиторий** (если еще не склонировали):
```bash
cd "/Users/apple/Cursor Projects/Dubai Cons"
```

2. **Создайте виртуальное окружение**:
```bash
python3.10 -m venv venv
```

3. **Активируйте виртуальное окружение**:
```bash
source venv/bin/activate
```

4. **Установите зависимости**:
```bash
pip install -r requirements.txt
```

5. **Создайте файл `.env`**:
```bash
cp env.example .env
# Отредактируйте .env и добавьте ваши ключи ProxyAPI
```

6. **Инициализируйте базу данных**:
```bash
cd src && PYTHONPATH=/Users/apple/Cursor\ Projects/Dubai\ Cons/src:$PYTHONPATH python database/init_db.py
```

### Запуск приложения

```bash
cd "/Users/apple/Cursor Projects/Dubai Cons"
source venv/bin/activate
cd src
PYTHONPATH=/Users/apple/Cursor\ Projects/Dubai\ Cons/src:$PYTHONPATH python main.py
```

Сервер запустится на `http://localhost:8000`

### Альтернативный запуск

```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload --app-dir src
```

## 📚 API Документация

После запуска приложения откройте в браузере:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔌 API Endpoints

### Health Check

```bash
GET http://localhost:8000/health
```

### Проекты

**Получить все проекты:**
```bash
GET http://localhost:8000/api/v1/projects/
```

**Создать проект:**
```bash
POST http://localhost:8000/api/v1/projects/
Content-Type: application/json

{
  "title": "Luxury Villa Interior",
  "description": "Modern villa design in Palm Jumeirah",
  "property_type": "villa",
  "area": 500.0,
  "location": "Palm Jumeirah, Dubai",
  "budget": 500000.0
}
```

**Получить проект по ID:**
```bash
GET http://localhost:8000/api/v1/projects/{project_id}
```

### Клиенты

**Получить всех клиентов:**
```bash
GET http://localhost:8000/api/v1/clients/
```

**Создать клиента:**
```bash
POST http://localhost:8000/api/v1/clients/
Content-Type: application/json

{
  "name": "Ahmed Al Maktoum",
  "email": "ahmed@example.com",
  "phone": "+971501234567",
  "segment": "luxury",
  "budget_range": "500k-1M AED"
}
```

### Дизайн (AI Generation)

**Сгенерировать дизайн-концепцию:**
```bash
POST http://localhost:8000/api/v1/design/generate
Content-Type: application/json

{
  "client_preferences": "Luxury modern style, prefer marble and gold accents, open space design",
  "project_details": "500 sqm villa, 4 bedrooms, located in Palm Jumeirah",
  "project_id": 1
}
```

**Получить концепцию по ID:**
```bash
GET http://localhost:8000/api/v1/design/concept/{concept_id}
```

## 🧪 Тестирование API

### Используя curl

```bash
# Проверка здоровья
curl http://localhost:8000/health

# Получение проектов
curl http://localhost:8000/api/v1/projects/

# Создание проекта
curl -X POST http://localhost:8000/api/v1/projects/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Project", "description": "Test"}'
```

### Используя Python

```python
import requests

base_url = "http://localhost:8000"

# Создать клиента
client_data = {
    "name": "Test Client",
    "email": "test@example.com",
    "segment": "luxury"
}
response = requests.post(f"{base_url}/api/v1/clients/", json=client_data)
client = response.json()
print(client)

# Создать проект
project_data = {
    "title": "Luxury Villa",
    "description": "Modern design",
    "property_type": "villa",
    "area": 500.0
}
response = requests.post(f"{base_url}/api/v1/projects/", json=project_data)
project = response.json()
print(project)

# Сгенерировать дизайн
design_request = {
    "client_preferences": "Luxury modern style, marble and gold",
    "project_details": "500 sqm villa, 4 bedrooms",
    "project_id": project["id"]
}
response = requests.post(f"{base_url}/api/v1/design/generate", json=design_request)
concept = response.json()
print(concept)
```

## 📁 Структура проекта

```
Dubai Cons/
├── src/
│   ├── main.py                 # Главное FastAPI приложение
│   ├── config/                 # Конфигурация
│   ├── api/                    # API маршруты
│   │   └── routes/
│   │       ├── projects.py     # Проекты API
│   │       ├── clients.py      # Клиенты API
│   │       └── design.py       # Дизайн API
│   ├── database/               # База данных
│   │   ├── models.py          # SQLAlchemy модели
│   │   ├── connection.py       # Подключение к БД
│   │   └── init_db.py         # Инициализация
│   ├── ai_modules/             # AI модули
│   │   ├── proxyapi_client.py # ProxyAPI клиент
│   │   └── prompts.py         # AI промпты
│   ├── services/               # Сервисы
│   │   └── design_service.py  # Сервис генерации дизайна
│   └── middleware/             # Middleware
│       └── security.py         # Безопасность
├── docs/                       # Документация
├── storage/                    # Файлы (БД, uploads)
├── venv/                       # Виртуальное окружение
├── requirements.txt            # Зависимости
├── .env                        # Переменные окружения
└── MVP_README.md              # Этот файл
```

## ⚙️ Конфигурация

Создайте файл `.env` в корне проекта:

```env
# ProxyAPI Configuration
PROXYAPI_KEY=your_proxyapi_key
PROXYAPI_BASE_URL=https://api.proxyapi.ru

# OpenAI via ProxyAPI
OPENAI_BASE_URL=https://api.proxyapi.ru/openai/v1
OPENAI_API_KEY=your_openai_key

# Database
DATABASE_URL=sqlite:///storage/dubai_cons.db

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Environment
ENV=development
DEBUG=True
```

## 🛠️ Разработка

### Добавление нового функционала

1. Создайте модель в `src/database/models.py`
2. Добавьте маршруты в `src/api/routes/`
3. Добавьте сервис в `src/services/` при необходимости
4. Подключите роутер в `src/main.py`

### Тестирование

```bash
# Запустите тесты (будут добавлены)
pytest
```

## 📊 База данных

### Просмотр данных

```bash
# Используйте SQLite Browser или командную строку
sqlite3 storage/dubai_cons.db

# Просмотр таблиц
.tables

# Просмотр данных
SELECT * FROM projects;
SELECT * FROM clients;
SELECT * FROM design_concepts;
```

### Очистка БД

```bash
rm storage/dubai_cons.db
python src/database/init_db.py
```

## 🐛 Решение проблем

### Порт 8000 занят

```bash
lsof -ti:8000 | xargs kill -9
```

### Ошибки импорта

Убедитесь что устанавливаете через:
```bash
PYTHONPATH=/Users/apple/Cursor\ Projects/Dubai\ Cons/src:$PYTHONPATH
```

### Ошибки базы данных

Пересоздайте базу данных:
```bash
rm storage/dubai_cons.db
python src/database/init_db.py
```

## 🚧 TODO (В разработке)

- [ ] Аутентификация пользователей
- [ ] Тесты
- [ ] 3D визуализация
- [ ] Модуль оценки стоимости
- [ ] Управление проектами с задачами
- [ ] Интеграция с поставщиками
- [ ] Фронтенд интерфейс

## 📞 Поддержка

Для вопросов и проблем обращайтесь к разработчикам проекта.

## 📄 Лицензия

Проект разрабатывается для Dubai Cons - архитектурная компания в Дубае.

---

**Версия**: 0.1.0 MVP  
**Дата**: Октябрь 2025  
**Статус**: В активной разработке 🚀
