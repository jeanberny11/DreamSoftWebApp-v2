import { useMemo } from 'react'
import { Chart } from 'primereact/chart'
import type { Invoice } from '@/apps/tenant/features/invoices/types/invoice.types'
import '../styles/charts.css'

interface InvoiceStatusChartProps {
  invoices: Invoice[]
  isLoading?: boolean
}

export function InvoiceStatusChart({ invoices, isLoading = false }: InvoiceStatusChartProps) {
  const { data, options } = useMemo(() => {
    const style = getComputedStyle(document.documentElement)
    const successColor = style.getPropertyValue('--color-success-500').trim()
    const infoColor = style.getPropertyValue('--color-info-500').trim()
    const errorColor = style.getPropertyValue('--color-error-500').trim()
    const grayColor = style.getPropertyValue('--color-gray-400').trim()
    const textSecondary = style.getPropertyValue('--color-text-secondary').trim()

    const counts = {
      paid: invoices.filter((i) => i.status === 'paid').length,
      sent: invoices.filter((i) => i.status === 'sent').length,
      overdue: invoices.filter((i) => i.status === 'overdue').length,
      draft: invoices.filter((i) => i.status === 'draft').length,
    }

    const fallback = { paid: 75, sent: 30, overdue: 5, draft: 10 }
    const values = invoices.length > 0 ? counts : fallback

    const chartData = {
      labels: ['Paid', 'Sent', 'Overdue', 'Draft'],
      datasets: [
        {
          data: [values.paid, values.sent, values.overdue, values.draft],
          backgroundColor: [successColor, infoColor, errorColor, grayColor],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    }

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            color: textSecondary,
            font: { size: 12 },
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 8,
          },
        },
      },
    }

    return { data: chartData, options: chartOptions }
  }, [invoices])

  return (
    <div className="chart-card">
      <div className="chart-card__title">Invoice Status</div>
      <div className="chart-card__body">
        {isLoading ? (
          <div className="chart-skeleton" />
        ) : (
          <Chart type="doughnut" data={data} options={options} style={{ height: '220px' }} />
        )}
      </div>
    </div>
  )
}
