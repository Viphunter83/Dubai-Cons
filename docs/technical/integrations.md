# Интеграции Dubai Cons AI Suite

## 🔗 Обзор интеграций

Dubai Cons AI Suite интегрируется с множеством внешних систем и сервисов для обеспечения полного функционала платформы.

## 🤖 ИИ и ML сервисы

### OpenAI API
**Назначение**: Генерация текстовых описаний, анализ предпочтений клиентов

```python
# src/integrations/openai_client.py
import openai
from typing import Dict, List, Any
import asyncio

class OpenAIClient:
    def __init__(self, api_key: str):
        self.client = openai.AsyncOpenAI(api_key=api_key)
    
    async def generate_design_description(self, concept_data: Dict[str, Any]) -> str:
        """Генерация описания дизайн-концепции"""
        prompt = f"""
        Создай профессиональное описание дизайн-концепции на основе следующих данных:
        Стиль: {concept_data.get('style', 'современный')}
        Цвета: {concept_data.get('colors', [])}
        Материалы: {concept_data.get('materials', [])}
        Площадь: {concept_data.get('area', 'не указана')} кв.м
        
        Описание должно быть:
        - Профессиональным и убедительным
        - Подчеркивать уникальность концепции
        - Включать ключевые особенности дизайна
        - Быть длиной 150-200 слов
        """
        
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    
    async def analyze_client_preferences(self, client_data: Dict[str, Any]) -> Dict[str, Any]:
        """Анализ предпочтений клиента"""
        prompt = f"""
        Проанализируй профиль клиента и определи его предпочтения в дизайне:
        
        Профиль клиента:
        - Тип клиента: {client_data.get('client_type', 'не указан')}
        - Локация: {client_data.get('location', 'не указана')}
        - Тип недвижимости: {client_data.get('property_type', 'не указан')}
        - Бюджет: {client_data.get('budget_range', 'не указан')}
        - История взаимодействий: {client_data.get('interaction_history', {})}
        
        Определи:
        1. Стилевые предпочтения
        2. Цветовую палитру
        3. Предпочитаемые материалы
        4. Уровень технологичности
        5. Приоритеты в дизайне
        
        Ответь в формате JSON.
        """
        
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.3
        )
        
        return json.loads(response.choices[0].message.content)
```

### Stability AI API
**Назначение**: Генерация изображений для концепций дизайна

```python
# src/integrations/stability_client.py
import requests
import base64
from typing import Dict, List, Any

class StabilityAIClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.stability.ai"
    
    async def generate_concept_image(self, prompt: str, style: str = "photographic") -> str:
        """Генерация изображения концепции"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "text_prompts": [
                {
                    "text": f"{prompt}, professional interior design, high quality, detailed",
                    "weight": 1.0
                }
            ],
            "cfg_scale": 7,
            "height": 1024,
            "width": 1024,
            "samples": 1,
            "steps": 30,
            "style_preset": style
        }
        
        response = requests.post(
            f"{self.base_url}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            result = response.json()
            image_data = result["artifacts"][0]["base64"]
            return self.save_image(image_data)
        else:
            raise Exception(f"Stability AI API error: {response.text}")
    
    def save_image(self, base64_data: str) -> str:
        """Сохранение изображения"""
        image_bytes = base64.b64decode(base64_data)
        filename = f"concept_{uuid.uuid4()}.png"
        filepath = f"storage/images/{filename}"
        
        with open(filepath, "wb") as f:
            f.write(image_bytes)
        
        return filepath
```

### Hugging Face Transformers
**Назначение**: Локальные ML модели для анализа

```python
# src/integrations/huggingface_client.py
from transformers import pipeline, AutoTokenizer, AutoModel
import torch
from typing import Dict, List, Any

class HuggingFaceClient:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.load_models()
    
    def load_models(self):
        """Загрузка предобученных моделей"""
        # Модель для анализа настроений
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="cardiffnlp/twitter-roberta-base-sentiment-latest",
            device=self.device
        )
        
        # Модель для классификации текста
        self.text_classifier = pipeline(
            "text-classification",
            model="microsoft/DialoGPT-medium",
            device=self.device
        )
    
    def analyze_client_sentiment(self, text: str) -> Dict[str, Any]:
        """Анализ настроения клиента"""
        result = self.sentiment_analyzer(text)
        return {
            "sentiment": result[0]["label"],
            "confidence": result[0]["score"]
        }
    
    def classify_design_style(self, description: str) -> Dict[str, Any]:
        """Классификация стиля дизайна"""
        # Кастомная логика для классификации стилей
        styles = ["modern", "classical", "minimalist", "luxury", "industrial"]
        # Здесь будет использоваться обученная модель
        return {"style": "modern", "confidence": 0.85}
```

## 🏗️ BIM и CAD интеграции

### Autodesk Revit API
**Назначение**: Интеграция с Revit для импорта/экспорта проектов

```python
# src/integrations/revit_client.py
import requests
from typing import Dict, List, Any
import json

class RevitAPIClient:
    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.base_url = "https://developer.api.autodesk.com"
        self.access_token = None
    
    async def authenticate(self):
        """Аутентификация в Autodesk API"""
        auth_data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": "client_credentials",
            "scope": "data:read data:write"
        }
        
        response = requests.post(
            f"{self.base_url}/authentication/v1/authenticate",
            data=auth_data
        )
        
        if response.status_code == 200:
            self.access_token = response.json()["access_token"]
        else:
            raise Exception("Autodesk authentication failed")
    
    async def upload_model(self, file_path: str, project_id: str) -> str:
        """Загрузка 3D модели в Autodesk"""
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/octet-stream"
        }
        
        with open(file_path, "rb") as f:
            response = requests.post(
                f"{self.base_url}/modelderivative/v2/designdata/job",
                headers=headers,
                data=f
            )
        
        return response.json()["urn"]
    
    async def extract_geometry(self, model_urn: str) -> Dict[str, Any]:
        """Извлечение геометрии из модели"""
        headers = {
            "Authorization": f"Bearer {self.access_token}"
        }
        
        response = requests.get(
            f"{self.base_url}/modelderivative/v2/designdata/{model_urn}/manifest",
            headers=headers
        )
        
        return response.json()
```

### AutoCAD API
**Назначение**: Работа с чертежами AutoCAD

```python
# src/integrations/autocad_client.py
import requests
from typing import Dict, List, Any

class AutoCADAPIClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://developer.api.autodesk.com"
    
    async def create_drawing(self, project_data: Dict[str, Any]) -> str:
        """Создание чертежа на основе данных проекта"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        drawing_data = {
            "project_id": project_data["id"],
            "layers": ["walls", "doors", "windows", "furniture"],
            "scale": "1:100",
            "dimensions": project_data["dimensions"]
        }
        
        response = requests.post(
            f"{self.base_url}/autocad/v1/drawings",
            headers=headers,
            json=drawing_data
        )
        
        return response.json()["drawing_id"]
    
    async def export_drawing(self, drawing_id: str, format: str = "pdf") -> str:
        """Экспорт чертежа в указанном формате"""
        headers = {
            "Authorization": f"Bearer {self.api_key}"
        }
        
        response = requests.get(
            f"{self.base_url}/autocad/v1/drawings/{drawing_id}/export",
            headers=headers,
            params={"format": format}
        )
        
        return response.content
```

## 🛒 Поставщики и маркетплейсы

### Dubai Suppliers API
**Назначение**: Интеграция с местными поставщиками материалов

```python
# src/integrations/dubai_suppliers.py
import requests
from typing import Dict, List, Any
import asyncio

class DubaiSuppliersClient:
    def __init__(self):
        self.suppliers = {
            "dubai_marble": {
                "api_url": "https://api.dubaimarble.ae/v1",
                "api_key": "dm_api_key"
            },
            "emirates_wood": {
                "api_url": "https://api.emirateswood.ae/v1",
                "api_key": "ew_api_key"
            },
            "dubai_lighting": {
                "api_url": "https://api.dubailighting.ae/v1",
                "api_key": "dl_api_key"
            }
        }
    
    async def search_materials(self, specifications: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Поиск материалов у всех поставщиков"""
        results = []
        
        for supplier_name, config in self.suppliers.items():
            try:
                supplier_results = await self.search_supplier(
                    supplier_name, 
                    config, 
                    specifications
                )
                results.extend(supplier_results)
            except Exception as e:
                print(f"Error searching {supplier_name}: {e}")
        
        return self.rank_results(results)
    
    async def search_supplier(self, supplier_name: str, config: Dict[str, str], specifications: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Поиск у конкретного поставщика"""
        headers = {
            "Authorization": f"Bearer {config['api_key']}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{config['api_url']}/materials/search",
            headers=headers,
            json=specifications
        )
        
        if response.status_code == 200:
            data = response.json()
            # Добавляем информацию о поставщике
            for item in data.get("materials", []):
                item["supplier"] = supplier_name
                item["supplier_info"] = config
            
            return data.get("materials", [])
        else:
            return []
    
    def rank_results(self, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Ранжирование результатов по релевантности и цене"""
        return sorted(results, key=lambda x: (
            -x.get("relevance_score", 0),
            x.get("price", float('inf'))
        ))
```

### Amazon Business API
**Назначение**: Поиск товаров на Amazon Business

```python
# src/integrations/amazon_business.py
import requests
from typing import Dict, List, Any

class AmazonBusinessClient:
    def __init__(self, access_key: str, secret_key: str):
        self.access_key = access_key
        self.secret_key = secret_key
        self.base_url = "https://sellingpartnerapi-na.amazon.com"
    
    async def search_products(self, keywords: str, category: str = None) -> List[Dict[str, Any]]:
        """Поиск товаров на Amazon Business"""
        params = {
            "keywords": keywords,
            "marketplaceId": "A2Q3Y263D00KWC",  # UAE marketplace
            "itemCount": 20
        }
        
        if category:
            params["category"] = category
        
        headers = self.get_auth_headers()
        
        response = requests.get(
            f"{self.base_url}/catalog/2022-04-01/items",
            headers=headers,
            params=params
        )
        
        return response.json().get("items", [])
    
    def get_auth_headers(self) -> Dict[str, str]:
        """Получение заголовков аутентификации"""
        # Здесь будет логика создания подписи AWS
        return {
            "Authorization": "AWS4-HMAC-SHA256 ...",
            "Content-Type": "application/json"
        }
```

## 💳 Платежные системы

### Stripe API
**Назначение**: Обработка платежей

```python
# src/integrations/stripe_client.py
import stripe
from typing import Dict, Any
import asyncio

class StripeClient:
    def __init__(self, api_key: str):
        stripe.api_key = api_key
    
    async def create_payment_intent(self, amount: int, currency: str = "aed", metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Создание намерения платежа"""
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            metadata=metadata or {},
            automatic_payment_methods={
                'enabled': True,
            },
        )
        
        return {
            "client_secret": intent.client_secret,
            "payment_intent_id": intent.id
        }
    
    async def create_customer(self, email: str, name: str, metadata: Dict[str, Any] = None) -> str:
        """Создание клиента"""
        customer = stripe.Customer.create(
            email=email,
            name=name,
            metadata=metadata or {}
        )
        
        return customer.id
    
    async def create_subscription(self, customer_id: str, price_id: str) -> Dict[str, Any]:
        """Создание подписки"""
        subscription = stripe.Subscription.create(
            customer=customer_id,
            items=[{'price': price_id}],
            payment_behavior='default_incomplete',
            payment_settings={'save_default_payment_method': 'on_subscription'},
            expand=['latest_invoice.payment_intent'],
        )
        
        return {
            "subscription_id": subscription.id,
            "client_secret": subscription.latest_invoice.payment_intent.client_secret
        }
```

### Local Payment Gateways
**Назначение**: Интеграция с местными платежными системами ОАЭ

```python
# src/integrations/local_payments.py
import requests
from typing import Dict, Any

class LocalPaymentClient:
    def __init__(self):
        self.gateways = {
            "emirates_nbd": {
                "api_url": "https://api.emiratesnbd.com/payments/v1",
                "merchant_id": "enbd_merchant_id"
            },
            "adcb": {
                "api_url": "https://api.adcb.com/payments/v1",
                "merchant_id": "adcb_merchant_id"
            },
            "mashreq": {
                "api_url": "https://api.mashreqbank.com/payments/v1",
                "merchant_id": "mashreq_merchant_id"
            }
        }
    
    async def process_payment(self, gateway: str, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Обработка платежа через местный шлюз"""
        config = self.gateways.get(gateway)
        if not config:
            raise ValueError(f"Unknown gateway: {gateway}")
        
        headers = {
            "Authorization": f"Bearer {config['merchant_id']}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{config['api_url']}/payments",
            headers=headers,
            json=payment_data
        )
        
        return response.json()
```

## 📧 Уведомления и коммуникации

### SendGrid API
**Назначение**: Отправка email уведомлений

```python
# src/integrations/sendgrid_client.py
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content
from typing import Dict, Any

class SendGridClient:
    def __init__(self, api_key: str):
        self.sg = sendgrid.SendGridAPIClient(api_key=api_key)
    
    async def send_email(self, to_email: str, subject: str, content: str, template_id: str = None) -> bool:
        """Отправка email"""
        from_email = Email("noreply@dubaicons.ai")
        to_email = To(to_email)
        
        if template_id:
            mail = Mail(from_email, to_email, subject)
            mail.template_id = template_id
        else:
            content = Content("text/html", content)
            mail = Mail(from_email, to_email, subject, content)
        
        try:
            response = self.sg.send(mail)
            return response.status_code == 202
        except Exception as e:
            print(f"SendGrid error: {e}")
            return False
    
    async def send_project_update(self, client_email: str, project_id: str, update_data: Dict[str, Any]) -> bool:
        """Отправка обновления по проекту"""
        template_id = "d-1234567890abcdef"  # ID шаблона
        
        dynamic_template_data = {
            "project_name": update_data.get("project_name"),
            "progress_percentage": update_data.get("progress_percentage"),
            "next_milestone": update_data.get("next_milestone"),
            "project_url": f"https://app.dubaicons.ai/projects/{project_id}"
        }
        
        mail = Mail(
            from_email=Email("updates@dubaicons.ai"),
            to_emails=To(client_email)
        )
        mail.template_id = template_id
        mail.dynamic_template_data = dynamic_template_data
        
        try:
            response = self.sg.send(mail)
            return response.status_code == 202
        except Exception as e:
            print(f"SendGrid error: {e}")
            return False
```

### WhatsApp Business API
**Назначение**: Отправка уведомлений через WhatsApp

```python
# src/integrations/whatsapp_client.py
import requests
from typing import Dict, Any

class WhatsAppClient:
    def __init__(self, access_token: str, phone_number_id: str):
        self.access_token = access_token
        self.phone_number_id = phone_number_id
        self.base_url = "https://graph.facebook.com/v17.0"
    
    async def send_message(self, to_phone: str, message: str, message_type: str = "text") -> bool:
        """Отправка сообщения WhatsApp"""
        url = f"{self.base_url}/{self.phone_number_id}/messages"
        
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        data = {
            "messaging_product": "whatsapp",
            "to": to_phone,
            "type": message_type,
            "text": {"body": message} if message_type == "text" else message
        }
        
        try:
            response = requests.post(url, headers=headers, json=data)
            return response.status_code == 200
        except Exception as e:
            print(f"WhatsApp API error: {e}")
            return False
    
    async def send_template_message(self, to_phone: str, template_name: str, parameters: list) -> bool:
        """Отправка шаблонного сообщения"""
        url = f"{self.base_url}/{self.phone_number_id}/messages"
        
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        data = {
            "messaging_product": "whatsapp",
            "to": to_phone,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {"code": "en"},
                "components": [
                    {
                        "type": "body",
                        "parameters": [{"type": "text", "text": param} for param in parameters]
                    }
                ]
            }
        }
        
        try:
            response = requests.post(url, headers=headers, json=data)
            return response.status_code == 200
        except Exception as e:
            print(f"WhatsApp template error: {e}")
            return False
```

## 📊 Аналитика и мониторинг

### Google Analytics 4
**Назначение**: Отслеживание пользовательского поведения

```python
# src/integrations/google_analytics.py
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
)
from typing import Dict, Any

class GoogleAnalyticsClient:
    def __init__(self, property_id: str, credentials_path: str):
        self.property_id = property_id
        self.client = BetaAnalyticsDataClient.from_service_account_file(credentials_path)
    
    async def get_user_engagement(self, start_date: str, end_date: str) -> Dict[str, Any]:
        """Получение данных о вовлеченности пользователей"""
        request = RunReportRequest(
            property=f"properties/{self.property_id}",
            dimensions=[
                Dimension(name="eventName"),
                Dimension(name="pagePath"),
            ],
            metrics=[
                Metric(name="eventCount"),
                Metric(name="activeUsers"),
            ],
            date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        )
        
        response = self.client.run_report(request)
        
        return {
            "total_events": sum(int(row.metric_values[0].value) for row in response.rows),
            "active_users": sum(int(row.metric_values[1].value) for row in response.rows),
            "events_by_page": {
                row.dimension_values[1].value: int(row.metric_values[0].value)
                for row in response.rows
            }
        }
```

### Mixpanel
**Назначение**: Детальная аналитика событий

```python
# src/integrations/mixpanel_client.py
import requests
import json
from typing import Dict, Any

class MixpanelClient:
    def __init__(self, project_token: str):
        self.project_token = project_token
        self.base_url = "https://api.mixpanel.com"
    
    async def track_event(self, distinct_id: str, event_name: str, properties: Dict[str, Any] = None) -> bool:
        """Отслеживание события"""
        data = {
            "event": event_name,
            "properties": {
                "token": self.project_token,
                "distinct_id": distinct_id,
                **(properties or {})
            }
        }
        
        encoded_data = json.dumps(data).encode()
        
        try:
            response = requests.post(
                f"{self.base_url}/track",
                data=encoded_data
            )
            return response.status_code == 200
        except Exception as e:
            print(f"Mixpanel error: {e}")
            return False
    
    async def track_design_generation(self, user_id: str, concept_id: str, generation_time: float) -> bool:
        """Отслеживание генерации дизайна"""
        return await self.track_event(
            user_id,
            "Design Generated",
            {
                "concept_id": concept_id,
                "generation_time": generation_time,
                "platform": "web"
            }
        )
```

## 🔧 Утилиты и вспомогательные сервисы

### Redis Cache
**Назначение**: Кэширование и сессии

```python
# src/integrations/redis_client.py
import redis.asyncio as redis
from typing import Any, Optional
import json

class RedisClient:
    def __init__(self, host: str = "localhost", port: int = 6379, db: int = 0):
        self.redis = redis.Redis(host=host, port=port, db=db, decode_responses=True)
    
    async def set_cache(self, key: str, value: Any, expire: int = 3600) -> bool:
        """Сохранение в кэш"""
        try:
            serialized_value = json.dumps(value)
            await self.redis.setex(key, expire, serialized_value)
            return True
        except Exception as e:
            print(f"Redis set error: {e}")
            return False
    
    async def get_cache(self, key: str) -> Optional[Any]:
        """Получение из кэша"""
        try:
            value = await self.redis.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            print(f"Redis get error: {e}")
            return None
    
    async def invalidate_cache(self, pattern: str) -> int:
        """Инвалидация кэша по паттерну"""
        try:
            keys = await self.redis.keys(pattern)
            if keys:
                return await self.redis.delete(*keys)
            return 0
        except Exception as e:
            print(f"Redis invalidate error: {e}")
            return 0
```

### File Storage (AWS S3)
**Назначение**: Хранение файлов

```python
# src/integrations/s3_client.py
import boto3
from botocore.exceptions import ClientError
from typing import Optional
import uuid

class S3Client:
    def __init__(self, bucket_name: str, region: str = "us-east-1"):
        self.s3_client = boto3.client('s3', region_name=region)
        self.bucket_name = bucket_name
    
    async def upload_file(self, file_path: str, object_key: Optional[str] = None) -> str:
        """Загрузка файла в S3"""
        if not object_key:
            object_key = f"uploads/{uuid.uuid4()}"
        
        try:
            self.s3_client.upload_file(file_path, self.bucket_name, object_key)
            return f"https://{self.bucket_name}.s3.amazonaws.com/{object_key}"
        except ClientError as e:
            print(f"S3 upload error: {e}")
            raise
    
    async def generate_presigned_url(self, object_key: str, expiration: int = 3600) -> str:
        """Генерация предварительно подписанного URL"""
        try:
            response = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_key},
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            print(f"S3 presigned URL error: {e}")
            raise
```

## 🔄 Конфигурация интеграций

```python
# config/integrations.py
from typing import Dict, Any
import os

INTEGRATIONS_CONFIG = {
    "openai": {
        "api_key": os.getenv("OPENAI_API_KEY"),
        "model": "gpt-4",
        "max_tokens": 1000,
        "temperature": 0.7
    },
    "stability_ai": {
        "api_key": os.getenv("STABILITY_AI_API_KEY"),
        "model": "stable-diffusion-xl-1024-v1-0",
        "default_resolution": "1024x1024"
    },
    "stripe": {
        "api_key": os.getenv("STRIPE_SECRET_KEY"),
        "webhook_secret": os.getenv("STRIPE_WEBHOOK_SECRET"),
        "currency": "aed"
    },
    "sendgrid": {
        "api_key": os.getenv("SENDGRID_API_KEY"),
        "from_email": "noreply@dubaicons.ai"
    },
    "whatsapp": {
        "access_token": os.getenv("WHATSAPP_ACCESS_TOKEN"),
        "phone_number_id": os.getenv("WHATSAPP_PHONE_NUMBER_ID")
    },
    "redis": {
        "host": os.getenv("REDIS_HOST", "localhost"),
        "port": int(os.getenv("REDIS_PORT", 6379)),
        "db": int(os.getenv("REDIS_DB", 0))
    },
    "s3": {
        "bucket_name": os.getenv("S3_BUCKET_NAME"),
        "region": os.getenv("S3_REGION", "us-east-1"),
        "access_key": os.getenv("AWS_ACCESS_KEY_ID"),
        "secret_key": os.getenv("AWS_SECRET_ACCESS_KEY")
    }
}
```

---

*Документ создан: Октябрь 2024*  
*Версия: 1.0*  
*Статус: Утверждено*
