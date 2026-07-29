import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSolutionDetailStore } from '../stores/solution-detail.store'

export function useSolutionDetail() {
  const { code } = useParams<{ code: string }>()
  const { fetch, reset } = useSolutionDetailStore()

  useEffect(() => {
    if (code) fetch(code)
    return () => reset()
  }, [code, fetch, reset])

  return useSolutionDetailStore()
}
