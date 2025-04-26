import pandas as pd
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
            'total_orders': len(df),
            'completed_orders': len(df[df['status'] == 'completed']),
            'pending_orders': len(df[df['status'] == 'pending']),
            'total_revenue': df['amount'].sum(),
            'average_order_value': df['amount'].mean()
        }
        
        # Get monthly trend data
        monthly_data = df.groupby(pd.Grouper(key='date', freq='M')).agg({
            'amount': 'sum',
            'order_id': 'count'
        }).reset_index()
        
        stats['monthly_trend'] = {
            'labels': monthly_data['date'].dt.strftime('%B %Y').tolist(),
            'revenue': monthly_data['amount'].tolist(),
            'orders': monthly_data['order_id'].tolist()
        }
        
        return stats
        
    def get_invoice_data(self):
        """Get data for the invoice dashboard."""
        df = self.read_excel_file('invoice_data.xlsx')
        if df is None:
            return {}
            
        stats = {
            'total_invoices': len(df),
            'pending_approval': len(df[df['status'] == 'pending_approval']),
            'approved': len(df[df['status'] == 'approved']),
            'total_amount': df['amount'].sum()
        }
        
        # Get status distribution
        status_dist = df['status'].value_counts().to_dict()
        stats['status_distribution'] = {
            'labels': list(status_dist.keys()),
            'values': list(status_dist.values())
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
            'values': list(delay_reasons.values())
        }
        
    def get_table_data(self, table_type):
        """Get data for specific tables."""
        filename = f"{table_type}_data.xlsx"
        df = self.read_excel_file(filename)
        if df is None:
            return []
            
        return df.to_dict('records') 