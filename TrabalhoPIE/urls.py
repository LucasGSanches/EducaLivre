# urls.py

from django.contrib import admin
from django.urls import path, include

# --- Imports necessários para servir arquivos de mídia em desenvolvimento 
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('app1.urls')),
]

# --- Linha para servir arquivos de mídia 
# Isto só funciona quando DEBUG=True em settings.py
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)