import { useEffect } from 'react'
import { useLanguageStore } from '@/shared/store/language.store'
import { useNewSubscriptionStore } from '../stores/new-subscription.store'
import { useSubscriptionsStore } from '../stores/subscriptions.store'
import { isOwnedStatus } from '../types/subscriptions.types'



    export function useNewSubscriptions() {
    const langCode = useLanguageStore((s) => s.currentLanguage.code)
    const store = useNewSubscriptionStore()
    const subscriptions = useSubscriptionsStore()

    useEffect(() => {
        if (store.state.status === 'idle') store.fetchData(langCode.toUpperCase())
    }, [langCode])

    useEffect(() => {
        if (subscriptions.status === 'idle') subscriptions.fetchSubscriptions(langCode.toUpperCase())
    }, [langCode])

    const getPlanAction = (solutionId: number, planId: number, billingCycleCode: string): 'select' | 'manage' | 'switch' => {
        if (subscriptions.status !== 'success') return 'select'
        const owned = subscriptions.data.find((s) => s.solutionId === solutionId && isOwnedStatus(s.statusCode))
        if (!owned) return 'select'
        return (owned.subscriptionPlanId === planId && owned.billingCycleCode === billingCycleCode) ? 'manage' : 'switch'
    }

    return { store, subscriptions, getPlanAction }
    }
