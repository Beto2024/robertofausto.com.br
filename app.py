from flask import Flask, render_template, session, redirect, request
from flask_babel import Babel, _
import os
import sqlite3

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Caminho do banco de dados SQLite para contador de visitas
DATABASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'visits.db')

babel = Babel()

app.config['BABEL_DEFAULT_LOCALE'] = 'pt'
app.config['BABEL_DEFAULT_TIMEZONE'] = 'America/Recife'
app.config['LANGUAGES'] = ['pt', 'en']


def get_locale():
    return session.get('lang', 'pt')


babel.init_app(app, locale_selector=get_locale)

# Disponibilizar get_locale nos templates
app.jinja_env.globals['get_locale'] = get_locale


def init_db():
    """Inicializa o banco de dados criando a tabela de visitas se não existir."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()


def get_visit_count():
    """Registra uma nova visita e retorna o total de visitas."""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO visits (visited_at) VALUES (CURRENT_TIMESTAMP)')
        conn.commit()
        cursor.execute('SELECT COUNT(*) FROM visits')
        count = cursor.fetchone()[0]
        conn.close()
        return count
    except sqlite3.Error:
        return 0


# Inicializa o banco na inicialização da app
init_db()


@app.route('/')
def home():
    visit_count = get_visit_count()
    return render_template('index.html', visit_count=visit_count)


@app.route('/sobre')
def sobre():
    return render_template('sobre.html')


@app.route('/habilidades')
def habilidades():
    return render_template('habilidades.html')


@app.route('/projetos')
def projetos():
    return render_template('projetos.html')


@app.route('/dashboards')
def dashboards():
    return render_template('dashboards.html')


@app.route('/curriculo')
def curriculo():
    return render_template('curriculo.html')


@app.route('/contato')
def contato():
    return render_template('contato.html')


@app.route('/set_lang/<lang>')
def set_lang(lang):
    if lang in app.config['LANGUAGES']:
        session['lang'] = lang
    return redirect(request.referrer or '/')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


if __name__ == '__main__':
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(debug=debug)
