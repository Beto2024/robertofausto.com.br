from flask import Flask, render_template
import os

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


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


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


if __name__ == '__main__':
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(debug=debug)
