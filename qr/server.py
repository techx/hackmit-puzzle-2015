from flask import Flask
from flask import render_template

import qr
app = Flask(__name__)

@app.route('/p')
@app.route('/p/<name>')

def hello(name="a"):

    num = str(qr.newPuzzle(name))
    return render_template('index.html', num=num)



if __name__ == "__main__":
    app.run()
