# app1/models.py

from django.db import models

# --- CÓDIGO ADICIONADO ---

# Modelo para a Matéria (Matemática, Português, etc.)
class Materia(models.Model):
    nome = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nome

# Modelo para o Tópico, ligado a uma Matéria
class Topico(models.Model):
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name='topicos')
    nome = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"{self.nome} ({self.materia.nome})"

# Modelo para a Pergunta, ligada a um Tópico
class Pergunta(models.Model):
    topico = models.ForeignKey(Topico, on_delete=models.CASCADE, related_name='perguntas')
    texto = models.TextField()

    def __str__(self):
        # Mostra os primeiros 50 caracteres para facilitar a visualização no admin
        return self.texto[:50] + '...'

# Modelo para a Opção de resposta, ligada a uma Pergunta
class Opcao(models.Model):
    pergunta = models.ForeignKey(Pergunta, on_delete=models.CASCADE, related_name='opcoes')
    texto = models.CharField(max_length=200)
    e_correta = models.BooleanField(default=False, help_text="Marque esta opção se for a resposta correta.")

    def __str__(self):
        return self.texto