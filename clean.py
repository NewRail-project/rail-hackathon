import os
import re

def clean_codebase(directory):
    # Паттерны для поиска комментариев
    js_css_pattern = re.compile(r'/\*.*?\*/|//.*?(?=\n|$)', re.DOTALL)
    html_pattern = re.compile(r'<!--.*?-->', re.DOTALL)

    for root, _, files in os.walk(directory):
        for file in files:
            filepath = os.path.join(root, file)
            
            try:
                # Очистка JS и CSS
                if file.endswith(('.js', '.css')):
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    # Замена комментариев на пустую строку
                    cleaned = re.sub(js_css_pattern, '', content)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(cleaned)
                        
                # Очистка HTML
                elif file.endswith('.html'):
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    cleaned = re.sub(html_pattern, '', content)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(cleaned)
            except Exception as e:
                print(f"Ошибка при обработке {file}: {e}")

    print("Очистка системы от текстовых комментариев завершена.")

# Укажите путь к распакованной папке проекта
clean_codebase('./rail-hackathon-main')

