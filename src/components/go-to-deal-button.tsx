"use client"
import { useState } from "react"

type Props = { id: string; affiliateLink: string }

export default function GoToDealButton({ id, affiliateLink }: Props) {
  const [loading, setLoading] = useState(false)
  async function handleClick() {
    setLoading(true)
    try {
      await fetch(`/api/deals/${id}/click`, { method: "POST" })
    } catch { }
    finally {
      setLoading(false)
      window.open(affiliateLink || "#", "_blank")
    }
  }
  return (
    <button
      onClick={handleClick}
      className="rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-base font-bold text-white shadow-lg transition hover:from-emerald-600 hover:to-green-700 hover:shadow-xl disabled:opacity-60 dark:from-cyan-400 dark:to-cyan-500 dark:text-slate-900 dark:hover:from-cyan-300 dark:hover:to-cyan-400"
      disabled={loading}
    >
      {loading ? "Loading…" : "Go to Deal"}
    </button>
  )
}