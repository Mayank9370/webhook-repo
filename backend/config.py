import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/github_events')
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')