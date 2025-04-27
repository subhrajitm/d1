import pandas as pd
import numpy as np
import os
from datetime import datetime

class DataService:
    def __init__(self, data_dir='app/static/data'):
        self.data_dir = data_dir
        
    def read_excel_file(self, filename):
        """Read data from an Excel file."""
        file_path = os.path.join(self.data_dir, filename)
        try:
            return pd.read_excel(file_path)
        except Exception as e:
            print(f"Error reading Excel file {filename}: {str(e)}")
            return None
            
    def get_shop_statistics(self):
        """Get statistics for the shop dashboard."""
        df = self.read_excel_file('shop_data.xlsx')
        if df is None:
            return {}
            
        stats = {
            'total_orders': int(len(df)),
            'completed_orders': int(len(df[df['status'] == 'completed'])),
            'pending_orders': int(len(df[df['status'] == 'pending'])),
            'total_revenue': float(df['amount'].sum()),
            'average_order_value': float(df['amount'].mean())
        }
        
        # Get monthly trend data
        monthly_data = df.groupby(pd.Grouper(key='date', freq='M')).agg({
            'amount': 'sum',
            'order_id': 'count'
        }).reset_index()
        
        stats['monthly_trend'] = {
            'labels': monthly_data['date'].dt.strftime('%B %Y').tolist(),
            'revenue': [float(x) for x in monthly_data['amount'].tolist()],
            'orders': [int(x) for x in monthly_data['order_id'].tolist()]
        }
        
        return stats
        
    def get_invoice_data(self):
        """Get data for the invoice dashboard."""
        df = self.read_excel_file('invoice_data.xlsx')
        if df is None:
            return {}
            
        stats = {
            'total_invoices': int(len(df)),
            'pending_approval': int(len(df[df['status'] == 'pending_approval'])),
            'approved': int(len(df[df['status'] == 'approved'])),
            'total_amount': float(df['amount'].sum())
        }
        
        # Get status distribution
        status_dist = df['status'].value_counts().to_dict()
        stats['status_distribution'] = {
            'labels': list(status_dist.keys()),
            'values': [int(x) for x in list(status_dist.values())]
        }
        
        return stats
        
    def get_delay_analysis(self):
        """Get delay analysis data."""
        df = self.read_excel_file('delay_data.xlsx')
        if df is None:
            return {}
            
        delay_reasons = df['delay_reason'].value_counts().to_dict()
        return {
            'labels': list(delay_reasons.keys()),
            'values': [int(x) for x in list(delay_reasons.values())]
        }
        
    def get_table_data(self, table_type):
        """Get data for specific tables."""
        filename = f"{table_type}.xlsx"  # Changed from {table_type}_data.xlsx
        df = self.read_excel_file(filename)
        if df is None:
            return []
            
        # Convert numpy types to Python native types
        records = df.to_dict('records')
        for record in records:
            for key, value in record.items():
                if isinstance(value, (np.int64, np.int32)):
                    record[key] = int(value)
                elif isinstance(value, (np.float64, np.float32)):
                    record[key] = float(value)
                elif isinstance(value, pd.Timestamp):
                    record[key] = value.isoformat()
                    
        return records 