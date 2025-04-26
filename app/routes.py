from flask import render_template, jsonify
from app import app, socketio
from datetime import datetime
import json

# Dashboard routes
@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/shop')
def shop():
    return render_template('shop.html')

@app.route('/invoice')
def invoice():
    return render_template('invoiceCreation.html')

# API endpoints for real-time data
@app.route('/api/dashboard/summary')
def get_dashboard_summary():
    # Example data - replace with your actual data source
    data = {
        'totalInvoices': 150,
        'pendingInvoices': 25,
        'completedInvoices': 125,
        'totalAmount': 1500000,
        'recentActivities': [
            {'id': 1, 'type': 'invoice', 'description': 'New invoice created', 'time': datetime.now().isoformat()},
            {'id': 2, 'type': 'payment', 'description': 'Payment received', 'time': datetime.now().isoformat()}
        ]
    }
    return jsonify(data)

@app.route('/api/shop/status')
def get_shop_status():
    # Example data - replace with your actual data source
    data = {
        'shops': [
            {'id': 1, 'name': 'Shop A', 'status': 'active', 'invoices': 50, 'amount': 500000},
            {'id': 2, 'name': 'Shop B', 'status': 'inactive', 'invoices': 30, 'amount': 300000}
        ]
    }
    return jsonify(data)

@app.route('/api/invoice/details')
def get_invoice_details():
    # Example data - replace with your actual data source
    data = {
        'contractSummary': {
            'fixedPriceLabour': 135756,
            'overAndAboveLabour': 26902,
            'componentRepairCatalogue': 264633,
            'material': 7753989
        },
        'svSummary': {
            'subContractCharge': 1302009,
            'fuelAndOil': 10215,
            'testCellCharge': 15597
        }
    }
    return jsonify(data)

# WebSocket events
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('request_update')
def handle_update_request(data):
    # Handle real-time update requests
    # Example: Broadcast updates to all connected clients
    socketio.emit('data_update', {'message': 'Data updated', 'timestamp': datetime.now().isoformat()}) 