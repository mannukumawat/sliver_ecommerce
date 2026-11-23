import { useId } from 'react'

/*
 * Static vector pendant. Used (1) as the instant hero visual, (2) as the loading
 * backdrop and (3) as the fallback when WebGL is unavailable or fails.
 * tone="dark" paints the midnight background; tone="light" is transparent.
 */
export default function FallbackHero({ tone = 'light', className = '', label = 'Silver pendant necklace with a blue stone' }) {
  const id = useId().replace(/:/g, '')
  const dark = tone === 'dark'
  const gemPts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8
    return [300 + Math.cos(a) * 52, 480 + Math.sin(a) * 52]
  })
  const inner = gemPts.map(([x, y]) => [300 + (x - 300) * 0.5, 480 + (y - 480) * 0.5])
  const pts = (arr) => arr.map((p) => p.join(',')).join(' ')

  return (
    <svg className={className} viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1c2740" /><stop offset="1" stopColor="#030508" /></linearGradient>
        <radialGradient id={`${id}glow`} cx=".5" cy=".62" r=".5">
          <stop offset="0" stopColor={dark ? '#5b93e6' : '#ffffff'} stopOpacity={dark ? 0.5 : 1} />
          <stop offset="1" stopColor={dark ? '#5b93e6' : '#ffffff'} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}s`} gradientUnits="userSpaceOnUse" x1="180" y1="380" x2="420" y2="600">
          <stop offset="0" stopColor="#ffffff" /><stop offset=".3" stopColor={dark ? '#b9c7dc' : '#a9b7cc'} /><stop offset=".55" stopColor="#f5f8fc" /><stop offset=".8" stopColor={dark ? '#8da1c0' : '#8294b0'} /><stop offset="1" stopColor="#e9eff7" />
        </linearGradient>
        <radialGradient id={`${id}g`} cx=".35" cy=".3" r=".85"><stop offset="0" stopColor="#b9d3fa" /><stop offset=".55" stopColor="#3470c8" /><stop offset="1" stopColor="#12356d" /></radialGradient>
        <filter id={`${id}sh`} x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="12" floodColor={dark ? '#000a1c' : '#0b3068'} floodOpacity={dark ? 0.6 : 0.28} /></filter>
      </defs>
      {dark && <rect width="600" height="700" fill={`url(#${id}bg)`} />}
      <rect width="600" height="700" fill={`url(#${id}glow)`} />
      <g fill="none" stroke={dark ? '#8fb4ee' : '#9db8e3'} strokeOpacity={dark ? 0.45 : 0.55} strokeWidth="1">
        <ellipse cx="300" cy="480" rx="230" ry="70" transform="rotate(-18 300 480)" />
        <ellipse cx="300" cy="480" rx="270" ry="96" transform="rotate(14 300 480)" />
      </g>
      <g filter={`url(#${id}sh)`}>
        <path d="M30 -10 C 120 515 480 515 570 -10" fill="none" stroke={`url(#${id}s)`} strokeWidth="7" strokeDasharray="10 4" strokeLinecap="round" />
        <circle cx="300" cy="392" r="13" fill="none" stroke={`url(#${id}s)`} strokeWidth="5" />
        <circle cx="300" cy="480" r="96" fill={`url(#${id}s)`} />
        <circle cx="300" cy="480" r="86" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2" />
        {Array.from({ length: 20 }, (_, i) => {
          const a = (i / 20) * Math.PI * 2
          return <circle key={i} cx={300 + Math.cos(a) * 74} cy={480 + Math.sin(a) * 74} r="4.2" fill="#fff" opacity=".9" />
        })}
        <circle cx="300" cy="480" r="64" fill={`url(#${id}s)`} stroke="#7b8dab" strokeOpacity=".5" />
        <polygon points={pts(gemPts)} fill={`url(#${id}g)`} />
        <g stroke="#fff" strokeOpacity=".5" strokeWidth="1.4" fill="none">
          <polygon points={pts(inner)} />
          {gemPts.map((p, i) => <line key={i} x1={p[0]} y1={p[1]} x2={inner[i][0]} y2={inner[i][1]} />)}
        </g>
        <polygon points={pts(inner.slice(0, 4).concat([[300, 480]]))} fill="#fff" opacity=".18" />
        <ellipse cx="282" cy="458" rx="12" ry="6" fill="#fff" opacity=".85" transform="rotate(-30 282 458)" />
      </g>
      <g fill={dark ? '#e3eeff' : '#ffffff'}>
        {[[110, 300, 3], [500, 260, 2.4], [470, 600, 3], [90, 580, 2], [380, 220, 2]].map(([x, y, r], i) => (
          <path key={i} d={`M${x} ${y - r * 4} L${x + r} ${y - r} L${x + r * 4} ${y} L${x + r} ${y + r} L${x} ${y + r * 4} L${x - r} ${y + r} L${x - r * 4} ${y} L${x - r} ${y - r}Z`} opacity={dark ? 0.8 : 1} />
        ))}
      </g>
    </svg>
  )
}
