import React, { useEffect, useState } from "react"
import { isMobile } from "react-device-detect"

interface Market {
  mid: number
  ptime: string            
  mtime: string           
  mtype: "OPEN" | "CLOSED"
  mname: string
}

interface Props {
  markets: Market[]
  selectedMarketId: number | null
  onSelect?: (market: Market) => void
}

/**
 * =========================
 * TIME HELPERS
 * =========================
 */
const formatTime = (sec: number) => {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0")
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0")
  const s = String(sec % 60).padStart(2, "0")
  return `${h}:${m}:${s}`
}

const getRemainingSeconds = (mtime: string) => {
  const target = new Date(mtime).getTime()
  const now = Date.now()
  const diff = Math.floor((target - now) / 1000)
  return diff > 0 ? diff : 0
}

/**
 * =========================
 * COMPONENT
 * =========================
 */
const MarketStrip: React.FC<Props> = ({
  markets,
  onSelect,
  selectedMarketId,
}) => {
  const [timers, setTimers] = useState<Record<number, number>>({})

  // 🔹 initialize timers from mtime
  useEffect(() => {
    const initial: Record<number, number> = {}
    markets.forEach(m => {
      initial[m.mid] = getRemainingSeconds(m.mtime)
    })
    setTimers(initial)
  }, [markets])

  // 🔹 countdown tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const next: Record<number, number> = {}
        Object.keys(prev).forEach(k => {
          next[+k] = prev[+k] > 0 ? prev[+k] - 1 : 0
        })
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={styles.wrapper}>
      {markets.map(m => (
        <div
          key={m.mid}
          style={{
            ...styles.card,
            background:
              selectedMarketId === m.mid ? "#125e7b" : "rgb(47, 59, 72)",
            opacity: 1,
            cursor: timers[m.mid] === 0 ? "not-allowed" : "pointer",
          }}
          onClick={() => {
            if (timers[m.mid] > 0) {
              onSelect?.(m)
            }
          }}
        >
          <div style={{...styles.title,
            fontWeight:
              selectedMarketId === m.mid ? "bold" : "400",
          }}>{m.mname.toUpperCase()}</div>

          <div style={styles.timer}>
            <img src='/clock.png' alt='' style={{width:isMobile?'11px': '15px',height:isMobile?'13px': '18px',marginRight:'6px'}}/> {formatTime(timers[m.mid] ?? 0)}
          </div>

          <div style={{...styles.time,fontWeight:
              selectedMarketId === m.mid ? "bold" : "400"}}>{m.mtime}</div>
        </div>
      ))}
    </div>
  )
}

/**
 * =========================
 * STYLES
 * =========================
 */
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    gap: 4,
    padding:isMobile ?"1px 0px 0px 0px": "4px 0px 0px 0px",
    overflowX: "auto",
    // scrollbarWidth: "none",
    msOverflowStyle: "none",
    marginBottom:isMobile ? 1 : 4,
  },
  card: {
    minWidth: 110,
    padding:isMobile ?"3px 6px" : "5px",
    color: "#fff",
    textAlign: "center",
    userSelect: "none",
  },
  title: {
    fontSize:isMobile? 11:14,
    marginBottom:isMobile ? 1:3
  },
  timer: {
    fontWeight: "bold",
    fontSize:isMobile? 11:12,
    color: "#fdcf13",
    marginBottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: isMobile ? 11 : 12,
    opacity: 0.9,
     textTransform: "uppercase",
  },
}

export default MarketStrip