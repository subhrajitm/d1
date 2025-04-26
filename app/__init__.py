from flask import Flask
from flask_socketio import SocketIO
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this in production
socketio = SocketIO(app)

# Import routes after app creation to avoid circular imports
from app import routes 