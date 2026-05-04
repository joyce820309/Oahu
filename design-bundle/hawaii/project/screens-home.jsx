/* global React, Icon, MistyBackdrop, PlaceImg, OahuMap, STRINGS, TRIP, POIS, PACK */

const { useState, useRef, useEffect } = React;

// ─── Tab bar (sticky, glass) ────────────────────────────────────
function TabBar({ active, onChange, t }) {
  const tabs = [
    { id: 'trip',    label: t.tabs.trip,    icon: 'home' },
    { id: 'days',    label: t.tabs.days,    icon: 'calendar' },
    { id: 'explore', label: t.tabs.explore, icon: 'compass' },
    { id: 'pack',    label: t.tabs.pack,    icon: 'pack' },
    { id: 'me',      label: t.tabs.me,      icon: 'user' },
  ];
  return (
    <div className="glass-strong" style={{
      position: 'absolute', left: 12, right: 12, bottom: 18,
      display: 'flex', justifyContent: 'space-between',
      padding: '8px 6px', borderRadius: 28, zIndex: 30,
    }}>
      {tabs.map(tab => {
        const on = tab.id === active;
        return (
          <button key={tab.id} onClick={() => onChange(tab.id)}
            style={{
              flex: 1, background: 'transparent', border: 0,
              padding: '8px 4px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, color: on ? 'var(--accent-deep)' : 'var(--ink-mute)',
              transition: 'color .25s',
            }}>
            <div style={{
              width: 40, height: 26, borderRadius: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: on ? 'var(--accent-soft)' : 'transparent',
              transition: 'background .25s',
            }}>
              <Icon name={tab.icon} size={18} sw={1.7}/>
            </div>
            <span style={{ fontSize: 10, fontWeight: on ? 600 : 500, letterSpacing: 0.02 }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Section header ─────────────────────────────────────────────
function SectionHead({ kicker, title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 18px', marginBottom: 12 }}>
      <div>
        {kicker && <div className="t-mono-cap" style={{ marginBottom: 4 }}>{kicker}</div>}
        <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: -0.01, color: 'var(--ink)' }}>{title}</div>
      </div>
      {action}
    </div>
  );
}

// ─── HOME / Trip overview ───────────────────────────────────────
function HomeScreen({ lang, dark, onOpenDay, onExplore }) {
  const t = STRINGS[lang].home;
  const daysToGo = 38;

  return (
    <div className="no-scrollbar" style={{ height: '100%', overflow: 'auto', paddingBottom: 110 }}>
      {/* Hero — misty mountain backdrop with floating glass card */}
      <div style={{ position: 'relative', height: 360, marginBottom: 20 }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <MistyBackdrop palette={dark ? 'dark' : 'light'} intensity={1}/>
        </div>
        {/* status-bar safe spacer */}
        <div style={{ position: 'absolute', top: 60, left: 18, right: 18, color: dark ? 'var(--ink)' : 'var(--ink)' }}>
          <div className="t-mono-cap">{STRINGS[lang].appName} · {STRINGS[lang].tagline}</div>
          <div className="t-display" style={{ fontSize: 44, marginTop: 6, color: 'var(--ink)' }}>
            {t.greeting}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>{t.subtitle}</div>
        </div>

        {/* Floating glass countdown card */}
        <div className="glass-strong fade-up" style={{
          position: 'absolute', left: 18, right: 18, bottom: -40,
          padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="t-mono-cap">{t.tripTitle}</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4, color: 'var(--ink)' }}>{t.tripDates}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 2 }}>{t.pax}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="t-display" style={{ fontSize: 56, color: 'var(--accent)', lineHeight: 1 }}>
                {daysToGo}
              </div>
              <div className="t-mono-cap" style={{ marginTop: 2 }}>{t.countdown}</div>
            </div>
          </div>
          {/* progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-mute)', marginBottom: 6 }}>
              <span>{t.progress}</span><span>72%</span>
            </div>
            <div style={{ height: 4, background: 'var(--surface-stroke)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: '72%', background: 'var(--accent)', borderRadius: 2 }}/>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: 50, padding: '0 18px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[
          { icon: 'plus',    label: t.addPlace, k: 'add',  bg: 'var(--accent-soft)',   fg: 'var(--accent-deep)' },
          { icon: 'ticket',  label: t.booking,  k: 'book', bg: 'var(--lagoon-soft)',   fg: 'var(--lagoon)' },
          { icon: 'note',    label: t.notes,    k: 'note', bg: 'var(--warm-soft)',     fg: 'var(--warm)' },
          { icon: 'cloud',   label: t.weather,  k: 'wx',   bg: 'var(--hibiscus-soft)', fg: 'var(--hibiscus)' },
        ].map(a => (
          <button key={a.k} className="glass" style={{
            padding: '14px 8px 12px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 6, cursor: 'pointer',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: a.bg, color: a.fg,
            }}>
              <Icon name={a.icon} size={18} sw={1.8}/>
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-soft)' }}>{a.label}</div>
          </button>
        ))}
      </div>

      {/* Up next card */}
      <div style={{ padding: '24px 18px 0' }}>
        <SectionHead kicker={t.upNext} title={t.upNextSub}
          action={<button onClick={() => onOpenDay(1)} style={{ background: 'transparent', border: 0, color: 'var(--accent-deep)', fontSize: 13, fontWeight: 500 }}>→</button>}/>
        <div className="glass-strong" style={{ overflow: 'hidden' }}>
          <div style={{ position: 'relative', height: 140 }}>
            <PlaceImg seed={3} kind="beach" dark={dark} style={{ position: 'absolute', inset: 0 }}/>
            <div style={{
              position: 'absolute', left: 14, top: 14,
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
              fontSize: 10, fontWeight: 600, letterSpacing: 0.12, textTransform: 'uppercase',
              color: '#2E6962',
            }}>Day 1 · 17:30</div>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>
              {lang === 'zh' ? '威基基海灘日落' : 'Waikīkī Beach sunset'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 3 }}>
              {lang === 'zh' ? '飯店步行 6 分鐘 · 帶薄外套' : '6 min walk from hotel · bring a layer'}
            </div>
          </div>
        </div>
      </div>

      {/* Mini timeline */}
      <div style={{ padding: '24px 18px 0' }}>
        <SectionHead kicker={t.timeline} title={lang === 'zh' ? '7 天 6 夜' : '7 days, 6 nights'}/>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 18px', margin: '0 -18px' }} className="no-scrollbar">
          {TRIP.days.map(d => (
            <button key={d.n} onClick={() => onOpenDay(d.n)} className="glass" style={{
              minWidth: 110, padding: '14px 12px', textAlign: 'left', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div className="t-mono-cap">Day {d.n}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>
                {d.title[lang]}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{d.dateLabel[lang]}</div>
              <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
                {Array.from({ length: Math.max(d.stops.length, 1) }).map((_, i) => (
                  <div key={i} style={{ width: 14, height: 3, borderRadius: 2,
                    background: d.stops.length ? 'var(--accent)' : 'var(--surface-stroke)' }}/>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Local tips */}
      <div style={{ padding: '24px 18px 0' }}>
        <SectionHead kicker={t.tipsTitle} title={lang === 'zh' ? '出發前小提醒' : 'Before you go'}/>
        <div className="glass-strong" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: 'sun',  bg: 'var(--warm-soft)',      fg: 'var(--warm)',     t: lang === 'zh' ? '只能用「友善珊瑚」防曬乳' : 'Only reef-safe sunscreen is legal' },
            { icon: 'water', bg: 'var(--lagoon-soft)',   fg: 'var(--lagoon)',   t: lang === 'zh' ? 'Hanauma 灣需提前 48 小時預約' : 'Hanauma Bay requires 48h advance booking' },
            { icon: 'wave', bg: 'var(--hibiscus-soft)',  fg: 'var(--hibiscus)', t: lang === 'zh' ? '北岸冬季浪況危險，夏季最佳' : 'North Shore is best in summer; winter swells are serious' },
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: tip.bg, color: tip.fg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={tip.icon} size={16} sw={1.8}/>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, paddingTop: 5 }}>{tip.t}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TabBar, SectionHead, HomeScreen });
