# app1/admin.py

from django.contrib import admin
from .models import Materia, Topico, Pergunta, Opcao #

# --- CÓDIGO ADICIONADO ---

# Configuração para mostrar as Opções de forma aninhada dentro da página da Pergunta
class OpcaoInline(admin.TabularInline):
    model = Opcao #
    extra = 1  # Mostra 1 campo extra para adicionar uma nova opção de cara

@admin.register(Pergunta)
class PerguntaAdmin(admin.ModelAdmin):
    list_display = ('texto', 'topico') # Colunas a serem exibidas na lista de perguntas
    list_filter = ('topico', 'topico__materia') # Adiciona filtros na barra lateral
    search_fields = ('texto',) # Adiciona um campo de busca pelo texto da pergunta
    inlines = [OpcaoInline] # Adiciona o formulário de opções na mesma página

@admin.register(Topico)
class TopicoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'materia') #
    list_filter = ('materia',) #

# Registra o modelo Materia para que apareça no admin
admin.site.register(Materia)