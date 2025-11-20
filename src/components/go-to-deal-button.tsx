"use client"
import { useState } from "react"

type Props = { id: string; affiliateLink: string }

export default function GoToDealButton({ id, affiliateLink }: Props) {
  const [loading, setLoading] = useState(false)
  async function handleClick() {
    setLoading(true)
    try {
      await fetch(`/api/deals/${id}/click`, { method: "POST" })
    } catch {}
    finally {
      setLoading(false)
      window.open(affiliateLink || "#", "_blank")
    }
  }
  return (
    <button
      onClick={handleClick}
      className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-300 disabled:opacity-60"
      disabled={loading}
    >
      {loading ? "Loading…" : "Go to Deal"}
    </button>
  )
}