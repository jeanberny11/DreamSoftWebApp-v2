import { Skeleton } from 'primereact/skeleton'
import '../styles/kpi-card.css'

type IconVariant = 'primary' | 'warning' | 'error' | 'secondary'
type TrendDirection = 'up' | 'down' | 'neutral'

interface KpiCardProps {
  title: string
  value: string
  icon: string
  iconVariant: IconVariant
  trend?: string
  trendDirection?: TrendDirection
  isLoading?: boolean
}

export function KpiCard({
  title,
  value,
  icon,
  iconVariant,
  trend,
  trendDirection = 'neutral',
  isLoading = false,
}: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="kpi-card">
        <div className="kpi-card__top">
          <Skeleton width="2.5rem" height="2.5rem" borderRadius="0.5rem" />
          <Skeleton width="3rem" height="1rem" />
        </div>
        <Skeleton width="6rem" height="2rem" />
        <Skeleton width="8rem" height="1rem" />
      </div>
    )
  }

  const trendIcon =
    trendDirection === 'up' ? 'pi pi-arrow-up' : trendDirection === 'down' ? 'pi pi-arrow-down' : ''

  return (
    <div className="kpi-card">
      <div className="kpi-card__top">
        <div className={`kpi-card__icon-wrap kpi-card__icon-wrap--${iconVariant}`}>
          <i className={icon} />
        </div>
        {trend && (
          <span className={`kpi-card__trend kpi-card__trend--${trendDirection}`}>
            {trendIcon && <i className={trendIcon} style={{ fontSize: '0.625rem' }} />}
            {trend}
          </span>
        )}
      </div>
      <div className="kpi-card__value">{value}</div>
      <div className="kpi-card__label">{title}</div>
    </div>
  )
}
