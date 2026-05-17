// FeatureCard — displays a single module inside a feature group

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import "../styles/home_page.css"

interface FeatureCardProps {
  title: string
  description: string
  icon: IconDefinition
  colorBg: string
  colorText: string
}

export function FeatureCard({ title, description, icon, colorBg, colorText }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <div className={`feature-card-icon-wrap ${colorBg}`}>
        <FontAwesomeIcon icon={icon} className={`text-base ${colorText}`} />
      </div>
      <div>
        <h4 className="feature-card-title">{title}</h4>
        <p className="feature-card-desc">{description}</p>
      </div>
    </div>
  )
}
