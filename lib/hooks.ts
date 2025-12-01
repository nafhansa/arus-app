"use client"

import useSWR from "swr"

type AutomationConfig = Record<string, any>

export type AutomationRecipe = {
  id: number
  title: string
  enabled: boolean
  config: AutomationConfig
  category: string
  updatedAt?: string
}

export type DashboardResponse = {
  revenue: { id: number; month: string; revenue: number; cost: number }[]
  activity: { id: number; action: string; time: string }[]
  insights?: { id: number; title: string; type: string; message: string; action?: string }[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useAutomations(userId?: number) {
  const key = `/api/automations?userId=${userId ?? 1}`
  const { data, error, isLoading, mutate } = useSWR<{ recipes: AutomationRecipe[] }>(key, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  })

  async function updateAutomation(id: number, patch: Partial<AutomationRecipe>) {
    const previous = data?.recipes ?? []
    await mutate(
      async () => {
        const next = previous.map((r) => (r.id === id ? { ...r, ...patch } : r))
        const method = Object.prototype.hasOwnProperty.call(patch, "enabled") ? "PATCH" : "PUT"
        const res = await fetch(`/api/automations`, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...patch }),
        })
        if (!res.ok) throw new Error("Failed to update automation")
        const json = await res.json()
        return { recipes: next.map((r) => (r.id === id ? json.recipe : r)) }
      },
      { revalidate: false, optimisticData: { recipes: previous.map((r) => (r.id === id ? { ...r, ...patch } : r)) } },
    )
  }

  return { recipes: data?.recipes ?? [], isLoading, error, mutate, updateAutomation }
}

export function useDashboardData(userId?: number) {
  const key = `/api/dashboard?userId=${userId ?? 1}`
  const { data, error, isLoading, mutate } = useSWR<DashboardResponse>(key, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  })
  return { data, error, isLoading, mutate }
}
