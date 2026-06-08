// featureIconMap — maps API icon names (Heroicon style) to Font Awesome icons

import {
  faBoxArchive, faShoppingCart, faTruck, faSlidersH, faTag, faChartBar,
  faExchangeAlt, faFolder, faBell, faClipboardCheck, faBuilding,
  faRulerCombined, faWarehouse, faDollarSign, faDesktop, faUsers,
  faFileAlt, faMoneyBillWave, faLockOpen, faLock, faTicket,
  faClipboardList, faStar, faShoppingBag, faInbox, faChartLine,
  faChartPie, faUserGroup, faBoxOpen, faReceipt,
  faCashRegister,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const iconMap: Record<string, IconDefinition> = {
  'archive-box':                faBoxArchive,
  'shopping-cart':              faShoppingCart,
  'truck':                      faTruck,
  'adjustments-horizontal':     faSlidersH,
  'tag':                        faTag,
  'chart-bar':                  faChartBar,
  'arrows-right-left':          faExchangeAlt,
  'folder':                     faFolder,
  'bell-alert':                 faBell,
  'clipboard-document-check':   faClipboardCheck,
  'building-storefront':        faBuilding,
  'scale':                      faRulerCombined,
  'receipt-percent':            faReceipt,
  'building-office-2':          faWarehouse,
  'currency-dollar':            faDollarSign,
  'computer-desktop':           faDesktop,
  'users':                      faUsers,
  'user-group':                 faUserGroup,
  'document-text':              faFileAlt,
  'banknotes':                  faMoneyBillWave,
  'lock-open':                  faLockOpen,
  'lock-closed':                faLock,
  'ticket':                     faTicket,
  'clipboard-document-list':    faClipboardList,
  'star':                       faStar,
  'shopping-bag':               faShoppingBag,
  'inbox-arrow-down':           faInbox,
  'presentation-chart-line':    faChartLine,
  'chart-pie':                  faChartPie,
  'cash-register':              faCashRegister,
}

const fallbackIcon: IconDefinition = faBoxOpen

export function getFeatureIcon(apiIconName: string): IconDefinition {
  return iconMap[apiIconName] ?? fallbackIcon
}

const groupColorMap: Record<string, { bg: string; text: string; border: string; tab: string }> = {
  INVENTORY: { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-200', tab: 'bg-primary-500 text-white' },
  SALES:     { bg: 'bg-secondary-50', text: 'text-secondary-600', border: 'border-secondary-200', tab: 'bg-secondary-500 text-white' },
  PURCHASING:{ bg: 'bg-accent-50', text: 'text-accent-600', border: 'border-accent-200', tab: 'bg-accent-500 text-white' },
}

const defaultColor = { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', tab: 'bg-gray-700 text-white' }

export function getGroupColor(code: string) {
  return groupColorMap[code] ?? defaultColor
}
