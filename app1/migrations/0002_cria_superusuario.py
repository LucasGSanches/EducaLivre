# app1/migrations/XXXX_cria_superusuario.py

from django.db import migrations
import os # Importamos o 'os' para ler variáveis de ambiente

def cria_superusuario(apps, schema_editor):
    # Pega o modelo de Usuário padrão do Django
    User = apps.get_model('auth', 'User')

    # Lê as credenciais das variáveis de ambiente que vamos configurar no Render
    username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
    email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

    # Verifica se o usuário já não existe
    if not User.objects.filter(username=username).exists():
        print(f'Criando superusuário {username}')
        User.objects.create_superuser(username=username, email=email, password=password)
    else:
        print(f'Superusuário {username} já existe.')

class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(cria_superusuario),
    ]