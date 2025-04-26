from flask import render_template, jsonify
from app import app, socketio
from datetime import datetime
from app.services.data_service import DataService
import json

# Initialize DataService
data_service = DataService()

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
    invoice_data = data_service.get_invoice_data()
    return jsonify({
        'totalInvoices': invoice_data.get('total_invoices', 0),
        'pendingInvoices': invoice_data.get('pending_approval', 0),
        'completedInvoices': invoice_data.get('approved', 0),
        'totalAmount': invoice_data.get('total_amount', 0),
        'recentActivities': data_service.get_table_data('recent_activities')
    })

@app.route('/api/shop/status')
def get_shop_status():
    shop_stats = data_service.get_shop_statistics()
    return jsonify({
        'summary': {
            'totalOrders': shop_stats.get('total_orders', 0),
            'completedOrders': shop_stats.get('completed_orders', 0),
            'pendingOrders': shop_stats.get('pending_orders', 0),
            'totalRevenue': shop_stats.get('total_revenue', 0),
            'averageOrderValue': shop_stats.get('average_order_value', 0)
        },
        'monthlyTrend': shop_stats.get('monthly_trend', {
            'labels': [],
            'revenue': [],
            'orders': []
        }),
        'shops': data_service.get_table_data('shops')
    })

@app.route('/api/invoice/details')
def get_invoice_details():
    contract_data = data_service.get_table_data('contract_summary')
    sv_data = data_service.get_table_data('sv_summary')
    
    if not contract_data or not sv_data:
        return jsonify({
            'contractSummary': {
                'fixedPriceLabour': 0,
                'overAndAboveLabour': 0,
                'componentRepairCatalogue': 0,
                'material': 0
            },
            'svSummary': {
                'subContractCharge': 0,
                'fuelAndOil': 0,
                'testCellCharge': 0
            }
        })
    
    return jsonify({
        'contractSummary': contract_data[0] if contract_data else {},
        'svSummary': sv_data[0] if sv_data else {}
    })

@app.route('/api/delay/analysis')
def get_delay_analysis():
    return jsonify(data_service.get_delay_analysis())

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
    updated_data = {
        'dashboard': get_dashboard_summary().json,
        'shop': get_shop_status().json,
        'invoice': get_invoice_details().json,
        'delay': get_delay_analysis().json,
        'timestamp': datetime.now().isoformat()
    }
    socketio.emit('data_update', updated_data) 