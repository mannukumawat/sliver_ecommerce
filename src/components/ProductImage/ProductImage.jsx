import { useId, useState } from 'react'
import './ProductImage.css'

/*
 * Original vector jewellery artwork. Used in place of licensed photography so the
 * demo never shows a broken image and every card shares one consistent crop (4:5).
 * Swap for real photography by replacing this component's output with <img>.
 */

const GEMS = {
  blue: ['#a9c8f5', '#2f64b8', '#16396f'],
  rose: ['#fbe0e3', '#e09aa6', '#b66673'],
  clear: ['#ffffff', '#cfe0f7', '#8fb0dc'],
  pearl: ['#ffffff', '#efe8de', '#c9bcab'],
  none: ['#ffffff', '#cfe0f7', '#8fb0dc'],
}

const VIEWS = [
  { box: '0 0 400 500', label: 'front view' },
  { box: '95 130 210 262', label: 'close-up detail' },
  { box: '0 0 400 500', label: 'evening styling' },
]

function Gem({ cx, cy, r: rIn, gem, uid, bezel = true, facets = true }) {
  const r = Number(rIn)
  cx = Number(cx); cy = Number(cy)
  const pearl = gem === 'pearl'
  return (
    <g>
      {bezel && !pearl && <circle cx={cx} cy={cy} r={r + r * 0.2} fill={`url(#${uid}-s)`} />}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}-${pearl ? 'p' : 'g'})`} />
      {facets && !pearl && (
        <g stroke="#fff" strokeOpacity=".5" strokeWidth={Math.max(0.6, r * 0.05)} fill="none">
          <path d={`M${cx - r * 0.55} ${cy - r * 0.55} L${cx} ${cy} L${cx + r * 0.55} ${cy - r * 0.55} M${cx} ${cy} L${cx} ${cy + r}`} />
          <circle cx={cx} cy={cy} r={r * 0.55} />
        </g>
      )}
      <ellipse cx={cx - r * 0.3} cy={cy - r * 0.38} rx={r * 0.26} ry={r * 0.15} fill="#fff" opacity={pearl ? 0.85 : 0.7} />
    </g>
  )
}

const chain = (uid, w = 5, dash = '7 3') => ({ stroke: `url(#${uid}-s)`, strokeWidth: w, strokeDasharray: dash, strokeLinecap: 'round', fill: 'none' })
const solid = (uid, w) => ({ stroke: `url(#${uid}-s)`, strokeWidth: w, fill: 'none', strokeLinecap: 'round' })

function Ring({ variant, gem, uid }) {
  return (
    <g>
      <circle cx="200" cy="305" r="96" {...solid(uid, variant === 'twist' ? 11 : 15)} />
      {variant === 'twist' && <circle cx="200" cy="305" r="96" stroke="#6f819b" strokeWidth="11" strokeDasharray="26 40" fill="none" strokeLinecap="round" opacity=".6" />}
      <circle cx="200" cy="305" r="88" stroke="#fff" strokeOpacity=".35" strokeWidth="2" fill="none" />
      {variant === 'solitaire' && (
        <g>
          <path d="M176 222 L186 196 M224 222 L214 196" {...solid(uid, 8)} />
          <Gem cx="200" cy="185" r="30" gem={gem} uid={uid} />
        </g>
      )}
      {variant === 'halo' && (
        <g>
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2
            return <Gem key={i} cx={200 + Math.cos(a) * 44} cy={188 + Math.sin(a) * 44} r="7" gem="clear" uid={uid} bezel={false} facets={false} />
          })}
          <Gem cx="200" cy="188" r="24" gem="clear" uid={uid} />
        </g>
      )}
      {variant === 'twist' && <path d="M178 212 C190 190 210 190 222 212" {...solid(uid, 10)} />}
    </g>
  )
}

function Pendant({ variant, gem, uid, cy = 265 }) {
  const y = cy + 55
  return (
    <g>
      <circle cx="200" cy={cy + 7} r="7" {...solid(uid, 3)} />
      {variant === 'heart' && (
        <path d={`M200 ${y + 38} C158 ${y + 8} 158 ${y - 32} 182 ${y - 34} C192 ${y - 35} 198 ${y - 28} 200 ${y - 21} C202 ${y - 28} 208 ${y - 35} 218 ${y - 34} C242 ${y - 32} 242 ${y + 8} 200 ${y + 38}Z`} fill={`url(#${uid}-s)`} />
      )}
      {variant === 'twist' && (
        <g fill="none">
          <ellipse cx="200" cy={y} rx="15" ry="40" transform={`rotate(32 200 ${y})`} {...solid(uid, 9)} />
          <ellipse cx="200" cy={y} rx="15" ry="40" transform={`rotate(-32 200 ${y})`} {...solid(uid, 9)} />
        </g>
      )}
      {variant === 'drop' && (
        <g>
          <path d={`M200 ${y - 38} C236 ${y} 242 ${y + 26} 200 ${y + 46} C158 ${y + 26} 164 ${y} 200 ${y - 38}Z`} fill={`url(#${uid}-s)`} />
          <path d={`M200 ${y - 26} C228 ${y + 2} 232 ${y + 22} 200 ${y + 36} C168 ${y + 22} 172 ${y + 2} 200 ${y - 26}Z`} fill={`url(#${uid}-g)`} />
          <path d={`M200 ${y - 26} L200 ${y + 36} M184 ${y + 6} L216 ${y + 6}`} stroke="#fff" strokeOpacity=".4" fill="none" />
        </g>
      )}
      {variant === 'coin' && (
        <g>
          <circle cx="200" cy={y} r="28" fill={`url(#${uid}-s)`} />
          <circle cx="200" cy={y} r="21" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2" />
        </g>
      )}
      {variant === 'pearl' && <Gem cx="200" cy={y} r="22" gem="pearl" uid={uid} />}
    </g>
  )
}

function Necklace({ variant, gem, uid }) {
  return (
    <g>
      <path d="M70 55 C 90 330 310 330 330 55" {...chain(uid, 6, '8 3')} />
      <Pendant variant={variant} gem={gem} uid={uid} />
    </g>
  )
}

function Earring({ x, variant, gem, uid }) {
  return (
    <g>
      <circle cx={x} cy="150" r="9" {...solid(uid, 4)} />
      {variant === 'hoop' && <circle cx={x} cy="238" r="54" {...solid(uid, 9)} />}
      {variant === 'hoop' && <circle cx={x} cy="238" r="49" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="1.5" />}
      {variant === 'pearl' && (
        <g>
          <path d={`M${x} 159 L${x} 222`} {...solid(uid, 4)} />
          <Gem cx={x} cy="258" r="30" gem="pearl" uid={uid} />
        </g>
      )}
      {variant === 'stud' && (
        <g>
          <path d={`M${x} 159 L${x} 190`} {...solid(uid, 4)} />
          <Gem cx={x} cy="222" r="26" gem={gem} uid={uid} />
        </g>
      )}
      {variant === 'chandelier' && (
        <g>
          <Gem cx={x} cy="186" r="11" gem="clear" uid={uid} />
          <path d={`M${x - 36} 232 Q${x} 205 ${x + 36} 232`} {...solid(uid, 5)} />
          {[-36, 0, 36].map((dx, i) => (
            <g key={dx}>
              <path d={`M${x + dx} 232 L${x + dx} ${i === 1 ? 274 : 262}`} {...solid(uid, 3)} />
              <Gem cx={x + dx} cy={i === 1 ? 292 : 278} r={i === 1 ? 14 : 11} gem="clear" uid={uid} />
            </g>
          ))}
        </g>
      )}
    </g>
  )
}

function Earrings({ variant, gem, uid }) {
  return (
    <g>
      <Earring x={140} variant={variant} gem={gem} uid={uid} />
      <Earring x={260} variant={variant} gem={gem} uid={uid} />
    </g>
  )
}

const ellipsePt = (cx, cy, rx, ry, a) => [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]

function Bracelet({ variant, gem, uid }) {
  const cx = 200, cy = 255, rx = 128, ry = 100
  const n = variant === 'line' ? 22 : 20
  return (
    <g>
      {variant === 'chain' && (
        <g>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...chain(uid, 9, '10 4')} />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="2" strokeDasharray="10 4" />
          <circle cx="328" cy="255" r="10" {...solid(uid, 4)} />
        </g>
      )}
      {variant === 'cuff' && (
        <g>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...solid(uid, 24)} strokeDasharray="640 120" transform="rotate(-20 200 255)" />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="3" strokeDasharray="640 120" transform="rotate(-20 200 255)" />
        </g>
      )}
      {variant === 'beads' && (
        <g>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...solid(uid, 3)} />
          {Array.from({ length: n }, (_, i) => {
            const [x, y] = ellipsePt(cx, cy, rx, ry, (i / n) * Math.PI * 2)
            return i % 2 ? <circle key={i} cx={x} cy={y} r="6" fill={`url(#${uid}-s)`} /> : <Gem key={i} cx={x} cy={y} r="11" gem={gem} uid={uid} bezel={false} facets={false} />
          })}
        </g>
      )}
      {variant === 'line' && (
        <g>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...solid(uid, 18)} />
          {Array.from({ length: n }, (_, i) => {
            const [x, y] = ellipsePt(cx, cy, rx, ry, (i / n) * Math.PI * 2)
            return <Gem key={i} cx={x} cy={y} r="6.5" gem="clear" uid={uid} bezel={false} facets={false} />
          })}
        </g>
      )}
    </g>
  )
}

function Anklet({ variant, gem, uid }) {
  const cx = 200, cy = 235, rx = 140, ry = 74
  const beadsOn = (g, r, count) =>
    Array.from({ length: count }, (_, i) => {
      const [x, y] = ellipsePt(cx, cy, rx, ry, (i / count) * Math.PI * 2 + 0.2)
      return <Gem key={i} cx={x} cy={y} r={r} gem={g} uid={uid} bezel={false} facets={false} />
    })
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...chain(uid, 4, '6 3')} />
      {variant === 'double' && <ellipse cx={cx} cy={cy + 16} rx={rx - 8} ry={ry} {...chain(uid, 4, '3 3')} />}
      {variant === 'beads' && beadsOn(gem, 7, 16)}
      {variant === 'pearl' && beadsOn('pearl', 10, 9)}
      {variant === 'charm' && (
        <g>
          <path d="M120 296 L120 318 M200 309 L200 332 M280 296 L280 318" {...solid(uid, 3)} />
          <path d="M120 350 C100 336 102 316 114 316 C118 316 120 319 120 322 C120 319 122 316 126 316 C138 316 140 336 120 350Z" fill={`url(#${uid}-s)`} />
          <circle cx="200" cy="344" r="12" fill={`url(#${uid}-s)`} />
          <path d="M280 318 L285 332 L300 332 L288 341 L293 355 L280 346 L267 355 L272 341 L260 332 L275 332Z" fill={`url(#${uid}-s)`} />
        </g>
      )}
    </g>
  )
}

function SetArt({ variant, gem, uid }) {
  const pv = variant === 'pearl' ? 'pearl' : variant
  const ev = variant === 'pearl' ? 'pearl' : variant === 'heart' ? 'stud' : 'pearl'
  return (
    <g>
      <g transform="translate(40 -6) scale(.8)">
        <Necklace variant={pv} gem={gem} uid={uid} />
      </g>
      <g transform="translate(90 262) scale(.55)">
        {variant === 'drop' ? (
          <g>
            {[140, 260].map((x) => (
              <g key={x}>
                <circle cx={x} cy="150" r="9" {...solid(uid, 4)} />
                <path d={`M${x} 159 L${x} 190`} {...solid(uid, 4)} />
                <path d={`M${x} 190 C${x + 32} 224 ${x + 36} 250 ${x} 270 C${x - 36} 250 ${x - 32} 224 ${x} 190Z`} fill={`url(#${uid}-s)`} />
                <path d={`M${x} 204 C${x + 22} 228 ${x + 24} 244 ${x} 256 C${x - 24} 244 ${x - 22} 228 ${x} 204Z`} fill={`url(#${uid}-g)`} />
              </g>
            ))}
          </g>
        ) : (
          <Earrings variant={ev} gem={gem} uid={uid} />
        )}
      </g>
    </g>
  )
}

const ART = { ring: Ring, necklace: Necklace, earrings: Earrings, bracelet: Bracelet, anklet: Anklet, set: SetArt }

function VectorImage({ art, view = 0, name = 'Silver jewellery', className = '', decorative = false }) {
  const uid = useId().replace(/:/g, '')
  const Art = ART[art.type] || Ring
  const v = VIEWS[view] || VIEWS[0]
  const [g0, g1, g2] = GEMS[art.gem] || GEMS.none
  const dark = view === 2
  return (
    <svg
      className={`pimg ${className}`}
      viewBox={v.box}
      preserveAspectRatio="xMidYMid slice"
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : `${name}, ${v.label}`}
      aria-hidden={decorative || undefined}
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          {dark ? (<><stop offset="0" stopColor="#12408a" /><stop offset="1" stopColor="#06142e" /></>) : view === 1 ? (<><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e4ecf8" /></>) : (<><stop offset="0" stopColor="#f8fbff" /><stop offset="1" stopColor="#dbe8fb" /></>)}
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx=".5" cy=".42" r=".55">
          <stop offset="0" stopColor={dark ? '#4f86d6' : '#ffffff'} stopOpacity={dark ? 0.35 : 0.9} />
          <stop offset="1" stopColor={dark ? '#4f86d6' : '#ffffff'} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-s`} gradientUnits="userSpaceOnUse" x1="60" y1="40" x2="340" y2="460">
          {dark ? (
            <><stop offset="0" stopColor="#ffffff" /><stop offset=".25" stopColor="#b7c3d5" /><stop offset=".5" stopColor="#f4f7fb" /><stop offset=".75" stopColor="#8d9fb9" /><stop offset="1" stopColor="#e8eef6" /></>
          ) : (
            <><stop offset="0" stopColor="#f6f9fd" /><stop offset=".22" stopColor="#7f90ab" /><stop offset=".48" stopColor="#e3e9f2" /><stop offset=".74" stopColor="#566a8a" /><stop offset="1" stopColor="#c5d0e0" /></>
          )}
        </linearGradient>
        <radialGradient id={`${uid}-g`} cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor={g0} /><stop offset=".55" stopColor={g1} /><stop offset="1" stopColor={g2} />
        </radialGradient>
        <radialGradient id={`${uid}-p`} cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#ffffff" /><stop offset=".6" stopColor="#efe8de" /><stop offset="1" stopColor="#c9bcab" />
        </radialGradient>
        <filter id={`${uid}-sh`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor={dark ? '#000a1c' : '#0b3068'} floodOpacity={dark ? 0.55 : 0.3} />
        </filter>
      </defs>
      <rect width="400" height="500" fill={`url(#${uid}-bg)`} />
      <rect width="400" height="500" fill={`url(#${uid}-glow)`} />
      {dark && (
        <g fill="#cfe0ff" opacity=".7">
          {[[50, 80, 1.6], [340, 120, 1.2], [90, 430, 1.4], [330, 400, 1.8], [360, 260, 1], [40, 250, 1.2]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}
        </g>
      )}
      <g filter={`url(#${uid}-sh)`}>
        <Art variant={art.variant} gem={art.gem} uid={uid} />
      </g>
    </svg>
  )
}

/*
 * Photo mode: art.photos = [main, alternate]. view 0 = main, 1 = close-up crop of main, 2 = alternate.
 * Falls back to a plain tinted block if a file fails to load (never a broken-image icon).
 */
function PhotoImage({ art, view = 0, name = 'Silver jewellery', className = '', decorative = false, eager = false }) {
  const [failed, setFailed] = useState(false)
  const src = view === 2 ? art.photos[1] || art.photos[0] : art.photos[0]
  const zoom = view === 1
  return (
    <div className={`pimg pimg--photo ${className}`} role={decorative ? 'presentation' : undefined}>
      {!failed && (
        <img
          src={src}
          alt={decorative ? '' : `${name}${zoom ? ', close-up' : ''}`}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable="false"
          onError={() => setFailed(true)}
          style={zoom ? { transform: 'scale(1.9)', transformOrigin: art.focus || '50% 45%' } : undefined}
        />
      )}
    </div>
  )
}

export default function ProductImage(props) {
  return props.art?.photos ? <PhotoImage {...props} /> : <VectorImage {...props} />
}
