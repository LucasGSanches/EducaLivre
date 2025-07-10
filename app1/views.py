# app1/views.py

from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Topico, Opcao 
import random


def pagina_inicial(request): #
    contexto = {
        'mensagem_ola': "Olá, Mundo! Vindo de um Template!"
    }
    return render(request, 'app1/pagina_inicial.html', contexto) #

def pagina_matematica_view(request): #
    contexto_pagina_matematica = {
        'titulo': "Esta de Matemática",
        'mensagem': "Bem-vindo à seção de matemática!"
    }
    return render(request, 'app1/matematica.html', contexto_pagina_matematica) #

def pagina_portugues_view(request): #
    contexto_pagina_portugues = {
        'titulo': "Esta de Português",
        'mensagem': "Bem-vindo à seção de português!"
    }
    return render(request, 'app1/portugues.html', contexto_pagina_portugues) #

def calculadora_view(request): #
    return render(request, 'app1/calculadora.html') #

def dicionario_view(request): #
    return render(request, 'app1/dicionario.html') #




def quiz_page(request, topico_nome):
    """Renderiza a página HTML do quiz."""
    # Apenas passamos o nome do tópico para o template.
    # O JavaScript se encarregará de buscar os dados.
    context = {'topico_nome': topico_nome}
    return render(request, 'app1/quiz.html', context)

def quiz_api(request, topico_nome):
    """Fornece os dados do quiz (perguntas e opções) em formato JSON."""
    pergunta_atual_texto = "" # Variável para guardar o texto da pergunta em caso de erro
    try:
        # Busca o tópico pelo nome (ignorando maiúsculas/minúsculas)
        topico = get_object_or_404(Topico, nome__iexact=topico_nome) #
        perguntas = topico.perguntas.all() #

        data = []
        for pergunta in perguntas:
            pergunta_atual_texto = pergunta.texto #
            # Pega as opções da pergunta
            opcoes = list(pergunta.opcoes.values('id', 'texto')) #
            # Encontra o ID da opção marcada como correta
            resposta_correta_id = pergunta.opcoes.get(e_correta=True).id #
            data.append({
                'id': pergunta.id, #
                'texto': pergunta.texto, #
                'opcoes': opcoes, #
                'resposta': resposta_correta_id
            })
        
        # Embaralha a ordem das perguntas para não ser sempre a mesma
        random.shuffle(data)

        return JsonResponse(data, safe=False)

    except Topico.DoesNotExist:
        return JsonResponse({'error': 'Tópico não encontrado.'}, status=404)
    except Opcao.DoesNotExist:
        # Este erro acontece se uma pergunta não tiver uma opção marcada como correta.
        error_msg = f'A pergunta "{pergunta_atual_texto}" não tem uma resposta correta definida no Admin.'
        return JsonResponse({'error': error_msg}, status=500)