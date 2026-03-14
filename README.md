# 🚀 robertofausto.com.br

Site-currículo profissional de **Roberto Fausto** — Desenvolvedor & Analista de Sistemas.

[![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.1.0-black?logo=flask)](https://flask.palletsprojects.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-CDN-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Deploy](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render)](https://render.com)

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia    | Função                        |
|---------------|-------------------------------|
| Python 3.12   | Linguagem principal           |
| Flask 3.1.0   | Web framework backend         |
| Tailwind CSS  | Estilização via CDN           |
| Jinja2        | Templates HTML                |
| Gunicorn      | Servidor WSGI para produção   |
| Render        | Deploy gratuito               |
| Hostinger     | Domínio registrado            |

---

## 📋 Pré-requisitos

- Python 3.12 ou superior
- pip (gerenciador de pacotes Python)
- Git

---

## 🖥️ Como Rodar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/Beto2024/robertofausto.com.br.git
cd robertofausto.com.br

# 2. Crie e ative o ambiente virtual
python -m venv venv

# Linux/Mac:
source venv/bin/activate

# Windows (PowerShell):
venv\Scripts\activate

# 3. Instale as dependências
pip install -r requirements.txt

# 4. Inicie o servidor de desenvolvimento
flask run
```

Acesse em: **http://127.0.0.1:5000**

---

## ☁️ Deploy no Render (Passo a Passo)

1. Crie uma conta gratuita em [render.com](https://render.com)
2. No dashboard, clique em **"New +"** → **"Web Service"**
3. Conecte sua conta GitHub e selecione o repositório `robertofausto.com.br`
4. Configure o serviço:
   - **Name:** `robertofausto`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Plan:** `Free`
5. Clique em **"Create Web Service"**
6. Aguarde o build completar (2–3 minutos)
7. Seu site estará disponível em: `https://robertofausto.onrender.com`

> ⚠️ No plano gratuito do Render, o serviço "dorme" após 15 minutos de inatividade e pode demorar ~30 segundos para acordar na primeira requisição.

---

## 🌐 Configurar Domínio na Hostinger

Após o deploy no Render, configure o domínio `robertofausto.com.br` seguindo estes passos:

### 1. Obtenha o IP do Render
No painel do Render, acesse seu serviço e vá em **"Settings"** → **"Custom Domains"**.
Adicione `robertofausto.com.br` e anote o IP fornecido.

### 2. Configure o DNS na Hostinger
Acesse o [painel de controle da Hostinger](https://hpanel.hostinger.com):

1. Vá em **"Domínios"** → selecione `robertofausto.com.br`
2. Clique em **"DNS / Nameservers"** → **"Gerenciar DNS"**
3. Adicione os seguintes registros:

| Tipo  | Nome | Valor                              | TTL  |
|-------|------|------------------------------------|------|
| A     | @    | `IP_DO_RENDER`                     | 3600 |
| CNAME | www  | `robertofausto.onrender.com`       | 3600 |

### 3. Adicionar domínio customizado no Render
No Render, vá em **"Settings"** → **"Custom Domains"** e adicione:
- `robertofausto.com.br`
- `www.robertofausto.com.br`

### 4. Aguardar propagação
A propagação DNS pode levar de **alguns minutos a 48 horas**.
Verifique com: `nslookup robertofausto.com.br`

---

## 📁 Estrutura do Projeto

```
📁 robertofausto.com.br/
├── app.py                    # Flask principal com todas as rotas
├── requirements.txt          # Dependências: flask, gunicorn
├── render.yaml               # Configuração de deploy no Render
├── .gitignore                # Arquivos ignorados pelo Git
├── README.md                 # Esta documentação
├── static/
│   ├── css/
│   │   └── style.css         # Animações e estilos customizados
│   ├── js/
│   │   └── main.js           # JavaScript (menu mobile, scroll, animações)
│   └── img/
│       └── .gitkeep          # Pasta para imagens
└── templates/
    ├── base.html             # Layout base com navbar e footer
    ├── index.html            # Home — hero section
    ├── sobre.html            # Sobre Mim — timeline da trajetória
    ├── habilidades.html      # Habilidades — cards com barras de progresso
    ├── projetos.html         # Projetos — grid de aplicações
    ├── dashboards.html       # Dashboards — embeds de Power BI
    ├── curriculo.html        # Currículo — versão interativa
    ├── contato.html          # Contato — formulário + links sociais
    └── 404.html              # Página de erro 404 customizada
```

---

## 🎨 Como Personalizar

### Trocar textos e informações pessoais
Edite os arquivos HTML em `templates/` com suas informações reais.
Os principais campos a personalizar:

- **Email:** trocar `contato@robertofausto.com.br` pelo seu email real
- **LinkedIn:** atualizar a URL em `base.html`, `curriculo.html` e `contato.html`
- **Foto de perfil:** adicione sua foto em `static/img/` e atualize `sobre.html`

### Adicionar embeds do Power BI
Em `templates/dashboards.html`, localize os comentários `<!-- Para incorporar o dashboard real... -->` e substitua os placeholders pelo iframe do Power BI:

```html
<iframe
    title="Nome do Dashboard"
    width="100%"
    height="100%"
    src="https://app.powerbi.com/reportEmbed?reportId=SEU_ID..."
    frameborder="0"
    allowFullScreen="true">
</iframe>
```

Para obter a URL de embed:
1. Abra o relatório no **Power BI Service**
2. Clique em **Arquivo → Incorporar relatório → Site ou portal**
3. Copie a URL do `src` do iframe gerado

### Adicionar novos projetos
Em `templates/projetos.html`, copie um dos blocos `<article>` e ajuste com as informações do novo projeto.

---

## 📜 Licença

MIT License — veja o arquivo [LICENSE](LICENSE) para detalhes.