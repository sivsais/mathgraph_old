from flask import Flask
from flask import request, jsonify, render_template, json

app = Flask(__name__, static_folder='./static')

@app.route('/')
def index():
    return render_template('index.html')
	
if __name__ == "__main__":
	app.run(debug = True, port = 5000)