/* global React */

// ─── Inline icon set (line-style, 1.6 stroke) ────────────────────
const Icon = ({ name, size = 20, stroke = 'currentColor', fill = 'none', sw = 1.6 }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill, stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'plane':       return <svg {...p}><path d="M2 13l9-3 3-8 2 0 -1 9 7 -2 0 2 -7 3 0 4 -2 0 -2 -3 -3 1 -3 -1z"/></svg>;
    case 'pin':         return <svg {...p}><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case 'wave':        return <svg {...p}><path d="M2 12s2-3 5-3 5 3 8 3 4-1 7-3"/><path d="M2 17s2-3 5-3 5 3 8 3 4-1 7-3"/></svg>;
    case 'mountain':    return <svg {...p}><path d="M3 19l5-9 4 6 3-4 6 7H3z"/><circle cx="17" cy="6" r="1.5"/></svg>;
    case 'utensil':     return <svg {...p}><path d="M7 3v8a2 2 0 0 0 2 2v8M5 3v6M9 3v6M15 13c0-5 2-9 4-9v17"/></svg>;
    case 'museum':      return <svg {...p}><path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-7M15 21v-7M12 21v-7"/></svg>;
    case 'home':        return <svg {...p}><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>;
    case 'calendar':    return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case 'compass':     return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M15 9l-2 5-5 2 2-5z"/></svg>;
    case 'pack':        return <svg {...p}><path d="M5 9h14l-1 11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M9 9V6a3 3 0 0 1 6 0v3M9 13h6"/></svg>;
    case 'user':        return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>;
    case 'plus':        return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'note':        return <svg {...p}><path d="M5 4h10l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 4v5h5M8 13h8M8 17h6"/></svg>;
    case 'ticket':      return <svg {...p}><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 6v12" strokeDasharray="2 2"/></svg>;
    case 'sun':         return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>;
    case 'moon':        return <svg {...p}><path d="M20 14a8 8 0 1 1-10-10 7 7 0 0 0 10 10z"/></svg>;
    case 'chevron':     return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    case 'chevronDown': return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>;
    case 'back':        return <svg {...p}><path d="M15 6l-6 6 6 6"/></svg>;
    case 'search':      return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>;
    case 'heart':       return <svg {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>;
    case 'list':        return <svg {...p}><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>;
    case 'mapIcon':     return <svg {...p}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>;
    case 'clock':       return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'drag':        return <svg {...p}><circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/></svg>;
    case 'ellipsis':    return <svg {...p}><circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/></svg>;
    case 'checkbox':    return <svg {...p}><rect x="4" y="4" width="16" height="16" rx="5"/></svg>;
    case 'check':       return <svg {...p}><path d="M5 12.5l4.5 4.5L19 7"/></svg>;
    case 'cloud':       return <svg {...p}><path d="M7 18a4 4 0 1 1 1-7.9 5 5 0 0 1 9.9 1.4A3.5 3.5 0 0 1 17.5 18z"/></svg>;
    case 'globe':       return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case 'sparkle':     return <svg {...p}><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.5 5.5l4 4M14.5 14.5l4 4M5.5 18.5l4-4M14.5 9.5l4-4"/></svg>;
    case 'water':       return <svg {...p}><path d="M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z"/></svg>;
    default:            return null;
  }
};

// ─── Tropical sunset / dusk backdrop (matches reference photos) ─
function MistyBackdrop({ palette = 'light', intensity = 1, style }) {
  const uid = React.useId().replace(/:/g, '');
  const skyId = `sky-${uid}`;
  const seaId = `sea-${uid}`;
  const glowId = `glow-${uid}`;
  const sandId = `sand-${uid}`;
  const dark = palette === 'dark';

  // Light: golden sunset → teal sky (left photo)
  // Dark:  deep navy → violet → coral horizon (right photo)
  const sky = dark
    ? [
        { o: 0,    c: '#0B1844' },   // top: deep navy
        { o: 0.35, c: '#2A1F5C' },   // upper indigo
        { o: 0.65, c: '#6A3A78' },   // violet
        { o: 0.85, c: '#C26A86' },   // pink horizon
        { o: 1,    c: '#F2B788' },   // warm coral at horizon
      ]
    : [
        { o: 0,    c: '#56C6CC' },   // top: teal
        { o: 0.3,  c: '#88D5D2' },   // soft cyan
        { o: 0.55, c: '#FAD9A8' },   // peach
        { o: 0.78, c: '#FFB97A' },   // golden
        { o: 1,    c: '#FFE3A8' },   // bright sun glow
      ];

  // Sun color & glow
  const sunColor = dark ? '#F2B49A' : '#FFE9A8';
  const sunGlow  = dark ? '#C26A86' : '#FFCB7A';

  // Mountain silhouettes (always dark — backlit by sun)
  const mountFar  = dark ? '#1F1A3A' : '#3A4A52';
  const mountNear = dark ? '#0A0B22' : '#1F2D33';

  // Sea
  const seaTop    = dark ? '#3D4A78' : '#7FCBD0';
  const seaBottom = dark ? '#1A1F4A' : '#3FA8B5';

  // Sand / beach reflection
  const sandLight = dark ? '#5A4878' : '#FCE6B8';
  const sandDeep  = dark ? '#2A2548' : '#E8C794';

  // Palm silhouettes — pure black against the sky
  const palm = dark ? '#000814' : '#0A1418';

  // Coastline twinkly lights
  const lights = dark ? '#FFD27A' : '#FFEFB8';

  return (
    <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"
         style={{ display: 'block', width: '100%', height: '100%', ...style }}>
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          {sky.map((s, i) => <stop key={i} offset={`${s.o * 100}%`} stopColor={s.c}/>)}
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={sunGlow} stopOpacity="0.85"/>
          <stop offset="40%" stopColor={sunGlow} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={sunGlow} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id={seaId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={seaTop}/>
          <stop offset="100%" stopColor={seaBottom}/>
        </linearGradient>
        <linearGradient id={sandId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sandDeep}/>
          <stop offset="100%" stopColor={sandLight}/>
        </linearGradient>
      </defs>

      {/* sky */}
      <rect width="400" height="600" fill={`url(#${skyId})`}/>

      {/* stars (dark only, upper sky) */}
      {dark && (
        <g fill="#FFF4E0">
          {[
            [40, 30, 0.7, 1.1], [110, 18, 0.5, 0.8], [165, 50, 0.6, 1],
            [220, 25, 0.7, 0.9], [280, 60, 0.5, 0.8], [340, 35, 0.7, 1],
            [70, 90, 0.45, 0.7], [200, 110, 0.5, 0.8], [355, 120, 0.4, 0.7],
            [25, 140, 0.4, 0.6], [130, 130, 0.45, 0.7], [310, 165, 0.4, 0.6],
          ].map(([cx, cy, op, r], i) => <circle key={i} cx={cx} cy={cy} r={r} opacity={op}/>)}
        </g>
      )}

      {/* horizon glow halo */}
      <ellipse cx="160" cy={dark ? 380 : 395} rx="240" ry={dark ? 70 : 110}
               fill={`url(#${glowId})`}/>

      {/* sun (light only — sitting on horizon) */}
      {!dark && (
        <g>
          <circle cx="155" cy="395" r="32" fill="#FFF6D8" opacity="0.95"/>
          <circle cx="155" cy="395" r="22" fill="#FFFCEC"/>
        </g>
      )}

      {/* soft cloud streaks (light only) */}
      {!dark && (
        <g fill="#FFFFFF" opacity="0.55">
          <ellipse cx="70"  cy="120" rx="50" ry="5"/>
          <ellipse cx="130" cy="105" rx="32" ry="4"/>
          <ellipse cx="240" cy="135" rx="44" ry="5"/>
          <ellipse cx="320" cy="115" rx="28" ry="4"/>
          <ellipse cx="105" cy="160" rx="38" ry="3.5"/>
        </g>
      )}
      {/* wispy violet clouds (dark only) */}
      {dark && (
        <g opacity="0.45">
          <ellipse cx="80"  cy="200" rx="60" ry="5" fill="#D88AA5"/>
          <ellipse cx="220" cy="220" rx="80" ry="5" fill="#E29CB0"/>
          <ellipse cx="340" cy="195" rx="40" ry="4" fill="#C46B8A"/>
        </g>
      )}

      {/* far mountain ridge */}
      <path d="M0 410 L40 380 L80 395 L130 350 L180 370 L220 340 L260 360 L310 345 L360 365 L400 355 L400 420 L0 420 Z"
            fill={mountFar} opacity={dark ? 1 : 0.85}/>

      {/* near mountain (dominant peak — Koʻolau-ish silhouette) */}
      <path d="M0 420 L60 408 L120 405 L170 380 L210 348 L245 368 L285 395 L330 405 L370 400 L400 410 L400 425 L0 425 Z"
            fill={mountNear}/>

      {/* coastline lights along base of mountain */}
      <g fill={lights}>
        {[180, 200, 215, 232, 250, 268, 288, 305, 322, 340, 358].map((x, i) => (
          <circle key={i} cx={x} cy={415 + (i % 3) * 1.5} r={0.9} opacity={dark ? 0.95 : 0.7}/>
        ))}
      </g>

      {/* sea */}
      <rect x="0" y="425" width="400" height="115" fill={`url(#${seaId})`}/>

      {/* sun / moon reflection on water */}
      <g opacity={dark ? 0.55 : 0.85}>
        <ellipse cx={dark ? 200 : 155} cy="445" rx="14" ry="2"  fill={sunColor}/>
        <ellipse cx={dark ? 200 : 155} cy="465" rx="22" ry="2.5" fill={sunColor} opacity="0.85"/>
        <ellipse cx={dark ? 200 : 155} cy="485" rx="34" ry="3"   fill={sunColor} opacity="0.7"/>
        <ellipse cx={dark ? 200 : 155} cy="510" rx="50" ry="3.5" fill={sunColor} opacity="0.5"/>
        <ellipse cx={dark ? 200 : 155} cy="535" rx="68" ry="4"   fill={sunColor} opacity="0.35"/>
      </g>

      {/* gentle wave lines */}
      <g stroke={dark ? '#7A8FCF' : '#FFFFFF'} strokeWidth="0.8" fill="none" opacity={dark ? 0.35 : 0.5}>
        <path d="M0 455 Q60 452 120 455 T240 455 T360 455 T400 455"/>
        <path d="M0 478 Q60 475 120 478 T240 478 T360 478 T400 478"/>
        <path d="M0 505 Q60 502 120 505 T240 505 T360 505 T400 505"/>
        <path d="M0 530 Q60 527 120 530 T240 530 T360 530 T400 530"/>
      </g>

      {/* wet sand reflection band */}
      <path d="M0 540 Q200 532 400 542 L400 600 L0 600 Z" fill={`url(#${sandId})`}/>
      {/* foam line */}
      <path d="M0 548 Q100 542 200 547 T400 549" fill="none"
            stroke={dark ? '#9A8BB8' : '#FFFFFF'} strokeWidth="1.2" opacity="0.7"/>

      {/* PALM TREE — leaning right, dominant subject (matches both photos) */}
      <g>
        {/* curved trunk */}
        <path d="M348 600 Q344 520 332 440 Q325 380 312 340"
              stroke={palm} strokeWidth="5" fill="none" strokeLinecap="round"/>
        {/* trunk segments / texture */}
        <g stroke={palm} strokeWidth="0.8" opacity="0.7">
          {[460, 480, 500, 520, 540, 560, 580].map((y, i) => (
            <path key={i} d={`M${346 - (600-y)*0.05} ${y} l6 0`}/>
          ))}
        </g>
        {/* fronds — long, drooping, radiating from crown at ~(312,340) */}
        <g stroke={palm} strokeWidth="3.2" fill="none" strokeLinecap="round">
          {/* upper fronds */}
          <path d="M312 340 Q300 305 270 285"/>
          <path d="M312 340 Q325 300 350 280"/>
          <path d="M312 340 Q310 295 305 260"/>
          <path d="M312 340 Q335 305 380 295"/>
          {/* mid fronds */}
          <path d="M312 340 Q280 340 240 350"/>
          <path d="M312 340 Q355 340 395 345"/>
          {/* drooping fronds */}
          <path d="M312 340 Q290 365 260 388"/>
          <path d="M312 340 Q345 365 385 380"/>
          <path d="M312 340 Q300 370 285 405"/>
          <path d="M312 340 Q330 372 350 410"/>
        </g>
        {/* frond leaflets — small strokes along main fronds */}
        <g stroke={palm} strokeWidth="1.2" fill="none" opacity="0.85">
          {/* upper-left frond */}
          <path d="M298 320 l-4 -6 M288 310 l-5 -5 M278 300 l-5 -4"/>
          {/* upper-right */}
          <path d="M328 318 l4 -6 M340 305 l5 -5 M355 295 l5 -3"/>
          {/* drooping right */}
          <path d="M335 358 l5 -3 M355 372 l5 -2 M375 380 l5 -1"/>
        </g>
        {/* coconuts cluster */}
        <circle cx="314" cy="345" r="3.5" fill={dark ? '#1A0F08' : '#3A2210'}/>
        <circle cx="320" cy="347" r="3.5" fill={dark ? '#1A0F08' : '#3A2210'}/>
        <circle cx="317" cy="352" r="3"   fill={dark ? '#1A0F08' : '#3A2210'}/>
      </g>

      {/* small distant palm left of frame (atmosphere) */}
      <g opacity="0.85">
        <path d="M22 600 Q26 540 30 480" stroke={palm} strokeWidth="2.4" fill="none" strokeLinecap="round"/>
        <g stroke={palm} strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M30 480 Q18 470 4 472"/>
          <path d="M30 480 Q42 468 56 470"/>
          <path d="M30 480 Q26 462 18 448"/>
          <path d="M30 480 Q34 462 44 450"/>
          <path d="M30 480 Q24 488 12 498"/>
          <path d="M30 480 Q40 488 52 498"/>
        </g>
      </g>
    </svg>
  );
}

// ─── Tiny placeholder image (gradient + label) — for POI photos ──
function PlaceImg({ seed = 1, kind = 'beach', label, dark = false, style }) {
  // Photo-derived tropical gradients
  const palettes = dark ? [
    ['#6A3A78', '#2A1F5C'], ['#F2B788', '#C26A86'], ['#7FB8D8', '#2A1F5C'],
    ['#C26A86', '#0B1844'], ['#2A1F5C', '#6A3A78'], ['#F2B788', '#6A3A78'],
    ['#7FB8D8', '#C26A86'], ['#6A3A78', '#F2B788'],
  ] : [
    ['#FFB97A', '#FF9D5C'], ['#56C6CC', '#4FB8BF'], ['#FFE3A8', '#FFB97A'],
    ['#88D5D2', '#56C6CC'], ['#FAD9A8', '#FFB97A'], ['#4FB8BF', '#88D5D2'],
    ['#FFD9A8', '#E5798E'], ['#E5798E', '#FFB97A'],
  ];
  const [a, b] = palettes[seed % palettes.length];

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
      ...style,
    }}>
      {/* subtle pattern lines */}
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"
           style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <g stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" fill="none">
          <path d="M0 130 Q50 120 100 128 T200 130"/>
          <path d="M0 145 Q50 138 100 144 T200 145"/>
          <path d="M0 160 Q50 154 100 158 T200 160"/>
        </g>
        {/* a single iconographic mark per kind */}
        {kind === 'beach' && <circle cx="160" cy="60" r="14" fill="rgba(255,255,255,0.35)"/>}
        {kind === 'hike' && <path d="M30 150 L70 90 L100 130 L130 80 L170 150z" fill="rgba(255,255,255,0.18)"/>}
        {kind === 'food' && <circle cx="100" cy="100" r="34" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>}
        {kind === 'culture' && <rect x="70" y="60" width="60" height="80" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>}
      </svg>
      {label && (
        <div style={{
          position: 'absolute', bottom: 8, left: 10, right: 10,
          fontSize: 10, letterSpacing: 0.12, textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.85)', fontWeight: 600,
        }}>{label}</div>
      )}
    </div>
  );
}

// ─── Soft Oʻahu map silhouette (used in Explore screen) ─────────
function OahuMap({ dark = false, style, points = [] }) {
  const land  = dark ? '#2A1F5C' : '#C8EAEC';
  const water = dark ? '#0B1844' : '#E8F6F7';
  const stroke = dark ? '#C26A86' : '#4FB8BF';
  return (
    <svg viewBox="0 0 400 480" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', width: '100%', height: '100%', ...style }}>
      <rect width="400" height="480" fill={water}/>
      {/* Subtle grid */}
      <g stroke={dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} strokeWidth="0.5">
        {[0,1,2,3,4,5,6,7,8].map(i => <line key={'h'+i} x1="0" y1={i*60} x2="400" y2={i*60}/>)}
        {[0,1,2,3,4,5,6,7].map(i => <line key={'v'+i} x1={i*60} y1="0" x2={i*60} y2="480"/>)}
      </g>
      {/* Oʻahu silhouette — abstract, recognizable diamond shape */}
      <path d="M70 180 Q90 130 150 110 Q220 95 280 130 Q330 160 340 220 Q345 270 310 310 Q280 345 230 350 Q180 360 140 340 Q90 320 75 280 Q60 230 70 180 Z"
            fill={land} stroke={stroke} strokeWidth="1"/>
      {/* coastal detail */}
      <path d="M140 340 Q120 330 110 310 M310 310 Q330 280 332 250 M280 130 Q300 145 318 175"
            fill="none" stroke={stroke} strokeWidth="1" opacity="0.7"/>
      {/* mountain ridges */}
      <g fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.55">
        <path d="M150 220 Q180 200 220 215 Q260 230 290 210"/>
        <path d="M160 250 Q200 240 240 250 Q270 260 300 245"/>
      </g>
      {/* labels */}
      <g fill={dark ? 'rgba(241,236,226,0.5)' : 'rgba(60,60,60,0.55)'} fontSize="9" fontFamily="-apple-system, system-ui" letterSpacing="0.08em">
        <text x="155" y="135">NORTH SHORE</text>
        <text x="220" y="350">WAIKĪKĪ</text>
        <text x="305" y="225">WINDWARD</text>
      </g>
      {/* points are positioned by parent overlay; reserved here for SVG-only mode */}
      {points.map(pt => (
        <g key={pt.id}>
          <circle cx={pt.x * 4} cy={pt.y * 4.8} r="6" fill={pt.active ? '#C4794D' : '#4A8B82'}/>
          <circle cx={pt.x * 4} cy={pt.y * 4.8} r="11" fill="none" stroke={pt.active ? '#C4794D' : '#4A8B82'} opacity="0.3"/>
        </g>
      ))}
    </svg>
  );
}

Object.assign(window, { Icon, MistyBackdrop, PlaceImg, OahuMap });
