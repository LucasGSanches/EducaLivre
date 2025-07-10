# app1/urls.py

from django.urls import path
from . import views

urlpatterns = [
    
    path('', views.pagina_inicial, name='rota_pagina_inicial'), #
    path('matematica/', views.pagina_matematica_view, name='rota_pagina_matematica'), #
    path('portugues/', views.pagina_portugues_view, name='rota_pagina_portugues'), #
    path('calculadora/', views.calculadora_view, name='calculadora'), #
    path('dicionario/', views.dicionario_view, name='dicionario'), #

    
    path('quiz/<str:topico_nome>/', views.quiz_page, name='quiz_page'),

    
    path('api/quiz/<str:topico_nome>/', views.quiz_api, name='quiz_api'),
]