import { useMemo } from 'react'
import { Chart } from 'primereact/chart'
import '../styles/charts.css'

interface RevenueChartProps {
  isLoading?: boolean
}

export function RevenueChart({ isLoading = false }: RevenueChartProps) {
  const { data, options } = useMemo(() => {
    const style = getComputedStyle(document.documentElement)
    const primaryColor = style.getPropertyValue('--color-primary-500').trim()
    const primaryLight = style.getPropertyValue('--color-primary-100').trim()
    const textSecondary = style.getPropertyValue('--color-text-secondary').trim()
    const borderColor = style.getPropertyValue('--card-border').trim()

    const chartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Revenue',
          data: [4200, 5800, 3900, 7100, 6500, 8200, 5400],
          backgroundColor: primaryLight,
          borderColor: primaryColor,
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    }

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: { parsed: { y: number } }) =>
              `$${ctx.parsed.y.toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: borderColor },
          ticks: { color: textSecondary, font: { size: 12 } },
        },
        y: {
          grid: { color: borderColor },
          ticks: {
            color: textSecondary,
            font: { size: 12 },
            callback: (value: number) => `$${(value / 1000).toFixed(0)}k`,
          },
        },
      },
    }

    return { data: chartData, options: chartOptions }
  }, [])

  return (
    <div className="chart-card">
      <div className="chart-card__title">Revenue Trend</div>
      <div className="chart-card__body">
        {isLoading ? (
          <div className="chart-skeleton" />
        ) : (
          <Chart type="bar" data={data} options={options} style={{ height: '220px' }} />
        )}
      </div>
    </div>
  )
}
