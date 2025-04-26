import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Create sample data directory
import os
data_dir = os.path.dirname(os.path.abspath(__file__))

# Generate dates for the last 6 months
end_date = datetime.now()
start_date = end_date - timedelta(days=180)
dates = pd.date_range(start=start_date, end=end_date, freq='D')

# Shop data
shop_data = []
shops = ['Shop A', 'Shop B', 'Shop C', 'Shop D']
statuses = ['completed', 'pending']

for date in dates:
    for shop in shops:
        num_orders = np.random.randint(1, 5)
        for _ in range(num_orders):
            shop_data.append({
                'date': date,
                'shop_name': shop,
                'order_id': f'ORD-{len(shop_data) + 1}',
                'status': np.random.choice(statuses, p=[0.8, 0.2]),
                'amount': np.random.randint(1000, 10000)
            })

shop_df = pd.DataFrame(shop_data)
shop_df.to_excel(os.path.join(data_dir, 'shop_data.xlsx'), index=False)

# Invoice data
invoice_statuses = ['approved', 'pending_approval', 'draft']
invoice_data = []

for _ in range(100):
    invoice_data.append({
        'date': np.random.choice(dates),
        'invoice_id': f'INV-{_ + 1}',
        'status': np.random.choice(invoice_statuses),
        'amount': np.random.randint(10000, 100000),
        'shop_name': np.random.choice(shops)
    })

invoice_df = pd.DataFrame(invoice_data)
invoice_df.to_excel(os.path.join(data_dir, 'invoice_data.xlsx'), index=False)

# Delay analysis data
delay_reasons = [
    'Documentation incomplete',
    'Pending approval',
    'System issues',
    'Shop verification needed',
    'Payment processing delay'
]

delay_data = []
for _ in range(50):
    delay_data.append({
        'date': np.random.choice(dates),
        'invoice_id': f'INV-{np.random.randint(1, 100)}',
        'delay_reason': np.random.choice(delay_reasons),
        'duration_days': np.random.randint(1, 10)
    })

delay_df = pd.DataFrame(delay_data)
delay_df.to_excel(os.path.join(data_dir, 'delay_data.xlsx'), index=False)

# Contract summary data
contract_summary = [{
    'fixedPriceLabour': 135756,
    'overAndAboveLabour': 26902,
    'componentRepairCatalogue': 264633,
    'material': 7753989
}]
contract_df = pd.DataFrame(contract_summary)
contract_df.to_excel(os.path.join(data_dir, 'contract_summary.xlsx'), index=False)

# SV summary data
sv_summary = [{
    'subContractCharge': 1302009,
    'fuelAndOil': 10215,
    'testCellCharge': 15597
}]
sv_df = pd.DataFrame(sv_summary)
sv_df.to_excel(os.path.join(data_dir, 'sv_summary.xlsx'), index=False)

# Recent activities
recent_activities = []
activity_types = ['invoice', 'payment', 'approval']
descriptions = {
    'invoice': 'New invoice created',
    'payment': 'Payment received',
    'approval': 'Invoice approved'
}

for i in range(20):
    activity_type = np.random.choice(activity_types)
    recent_activities.append({
        'id': i + 1,
        'type': activity_type,
        'description': descriptions[activity_type],
        'time': (end_date - timedelta(hours=np.random.randint(1, 72))).isoformat()
    })

activities_df = pd.DataFrame(recent_activities)
activities_df.to_excel(os.path.join(data_dir, 'recent_activities.xlsx'), index=False)

# Shops list
shops_list = []
for i, shop in enumerate(shops):
    shops_list.append({
        'id': i + 1,
        'name': shop,
        'status': 'active' if np.random.random() > 0.2 else 'inactive',
        'invoices': np.random.randint(30, 100),
        'amount': np.random.randint(300000, 1000000)
    })

shops_df = pd.DataFrame(shops_list)
shops_df.to_excel(os.path.join(data_dir, 'shops.xlsx'), index=False)

print("Sample data files created successfully!") 