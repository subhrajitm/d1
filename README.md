# SMBA Dashboard

A Flask-based dashboard application for monitoring and managing shop performance and invoices.

## Features

- Real-time data updates using Socket.IO
- Interactive dashboard with charts and statistics
- Shop status monitoring
- Invoice creation and management
- Responsive design for all devices

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smba-dashboard
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Start the Flask development server:
```bash
python run.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

## Project Structure

```
smba-dashboard/
├── app/
│   ├── static/
│   │   ├── css/
│   │   │   ├── main.css
│   │   │   ├── index.css
│   │   │   ├── shop.css
│   │   │   └── invoice.css
│   │   └── js/
│   │       ├── script.js
│   │       ├── index.js
│   │       ├── shop.js
│   │       ├── invoice.js
│   │       └── realtime.js
│   ├── templates/
│   │   ├── base.html
│   │   ├── index.html
│   │   ├── shop.html
│   │   └── invoiceCreation.html
│   ├── __init__.py
│   └── routes.py
├── requirements.txt
└── run.py
```

## API Endpoints

- `/api/dashboard/summary` - Get dashboard summary data
- `/api/shop/status` - Get shop status information
- `/api/invoice/details` - Get invoice details

## WebSocket Events

- `connect` - Client connects to server
- `disconnect` - Client disconnects from server
- `request_update` - Client requests data update
- `data_update` - Server sends data update to clients

## Development

1. Make sure you have all dependencies installed
2. Run the development server with debug mode enabled
3. Make changes to the code
4. The server will automatically reload on code changes

## Production Deployment

For production deployment:

1. Set appropriate environment variables
2. Use a production-grade WSGI server (e.g., Gunicorn)
3. Configure a reverse proxy (e.g., Nginx)
4. Set up proper SSL/TLS certificates

## License

This project is licensed under the MIT License - see the LICENSE file for details. 