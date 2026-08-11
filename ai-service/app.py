from flask import Flask
from flask_cors import CORS
from routes.recognition_routes import recognition_bp

app = Flask(__name__)
CORS(app)

# Register routes
app.register_blueprint(recognition_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(port=5001, debug=True)