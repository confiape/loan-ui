import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DashboardCard {
  title: string;
  value: string | number;
  icon: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  variant: 'primary' | 'success' | 'warning' | 'error';
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true,
})
export class Dashboard {
  // State
  stats = signal<DashboardCard[]>([
    {
      title: 'Préstamos Activos',
      value: 1234,
      icon: '💰',
      change: '+12.5%',
      trend: 'up',
      variant: 'primary',
    },
    {
      title: 'Clientes',
      value: 856,
      icon: '👥',
      change: '+8.2%',
      trend: 'up',
      variant: 'success',
    },
    {
      title: 'Pendientes',
      value: 45,
      icon: '⏳',
      change: '-5.1%',
      trend: 'down',
      variant: 'warning',
    },
    {
      title: 'Mora',
      value: 12,
      icon: '⚠️',
      change: '+2.3%',
      trend: 'up',
      variant: 'error',
    },
  ]);

  recentLoans = signal([
    { id: '001', client: 'Juan Pérez', amount: '$15,000', status: 'Aprobado', date: '2025-10-20' },
    { id: '002', client: 'María García', amount: '$25,000', status: 'Pendiente', date: '2025-10-22' },
    { id: '003', client: 'Carlos López', amount: '$10,000', status: 'Revisión', date: '2025-10-23' },
    { id: '004', client: 'Ana Martínez', amount: '$30,000', status: 'Aprobado', date: '2025-10-24' },
    { id: '005', client: 'Pedro Sánchez', amount: '$18,000', status: 'Rechazado', date: '2025-10-25' },
  ]);

  // Methods
  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      Aprobado: 'badge-success',
      Pendiente: 'badge-warning',
      Revisión: 'badge-info',
      Rechazado: 'badge-error',
    };
    return statusMap[status] || 'badge-dark';
  }

  getTrendIcon(trend?: string): string {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  }

  getTrendClass(trend?: string): string {
    if (trend === 'up') return 'trend-up';
    if (trend === 'down') return 'trend-down';
    return 'trend-neutral';
  }
}
