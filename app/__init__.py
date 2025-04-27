from flask import Flask
from flask_socketio import SocketIO
from datetime import datetime
import os

# Get the absolute path to the app directory
app_dir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__,
    static_folder=os.path.join(app_dir, 'static'),
    static_url_path='/static'
)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this in production
socketio = SocketIO(app)

# Import routes after app creation to avoid circular imports
from app import routes 