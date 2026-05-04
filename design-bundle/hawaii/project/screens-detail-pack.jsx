/* global React, Icon, PlaceImg, STRINGS, POIS, PACK */

const { useState: useStateP } = React;

// ─── Detail screen ──────────────────────────────────────────────
function DetailScreen({ lang, dark, poi, onBack }) {
  const t = STRINGS[lang].detail;
  if (!poi) return null;
  const [saved, setSaved] = useStateP(false);

  return (
    <div className="no-scrollbar" style={{ height: '100%', overflow: 'auto', position: 'relative' }}>
      {/* Hero image */}
      <div style={{ position: 'relative', height: 360 }}>
        <PlaceImg seed={poi.id.charCodeAt(1)} kind={poi.kind} dark={dark}
          style={{ position: 'absolute', inset: 0 }}/>
        {/* gradient veil */}
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 28%, transparent 70%, rgba(0,0,0,0.45) 100%)' }}/>

        {/* Top bar */}
        <div style={{ position: 'absolute', top: 60, left: 18, right: 18,
          display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onBack} className="glass-strong" style={{
            width: 38, height: 38, borderRadius: 19, border: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--ink)',
          }}><Icon name="back" size={16}/></button>
          <button onClick={() => setSaved(!saved)} className="glass-strong" style={{
            width: 38, height: 38, borderRadius: 19, border: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: saved ? '#C4794D' : 'var(--ink)',
          }}><Icon name="heart" size={16} fill={saved ? '#C4794D' : 'none'}/></button>
        </div>

        {/* Title overlay */}
        <div style={{ position: 'absolute', left: 22, right: 22, bottom: 22, color: '#fff' }}>
          <div style={{ fontSize: 11, letterSpacing: 0.18, textTransform: 'uppercase',
            opacity: 0.8, fontWeight: 500 }}>{poi.area[lang]}</div>
          <div className="t-display" style={{ fontSize: 44, marginTop: 4, color: '#fff' }}>{poi.name[lang]}</div>
          <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 12, opacity: 0.9 }}>
            <span>★ {poi.rating}</span>
            <span>· {poi.mins} min {lang === 'zh' ? '車程' : 'drive'}</span>
          </div>
        </div>
      </div>

      {/* Floating info card — translucent (matches reference 2) */}
      <div style={{ padding: '0 16px', marginTop: -32, position: 'relative', zIndex: 2 }}>
        <div className="glass-strong" style={{
          padding: '16px 18px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
        }}>
          {[
            { ic: 'clock', l: t.hours, v: t.open },
            { ic: 'sun',   l: lang === 'zh' ? '最佳時段' : 'Best time', v: t.crowd },
            { ic: 'pin',   l: lang === 'zh' ? '距離' : 'From hotel', v: t.drive },
          ].map((x, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4,
              borderLeft: i > 0 ? '0.5px solid var(--surface-stroke)' : 0,
              paddingLeft: i > 0 ? 12 : 0 }}>
                <div style={{ color: 'var(--accent)' }}><Icon name={x.ic} size={14} sw={1.8}/></div>
              <div style={{ fontSize: 10, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: 0.1 }}>{x.l}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>{x.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div style={{ padding: '24px 22px 0' }}>
        <div className="t-mono-cap" style={{ marginBottom: 8 }}>{t.about}</div>
        <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          {poi.blurb[lang]} {lang === 'zh'
            ? '建議攜帶友善珊瑚的防曬乳，並於日出前抵達避開人潮。停車場 06:00 開放，付費 $10/日。'
            : 'Bring reef-safe sunscreen and arrive before sunrise to beat the crowds. Parking opens at 6am, $10/day.'}
        </div>
      </div>

      {/* Similar */}
      <div style={{ padding: '24px 0 100px' }}>
        <div className="t-mono-cap" style={{ marginBottom: 12, padding: '0 22px' }}>{t.similar}</div>
        <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 18px' }}>
          {POIS.filter(p => p.id !== poi.id && p.kind === poi.kind).slice(0, 5).map(p => (
            <div key={p.id} style={{ minWidth: 140, flexShrink: 0 }}>
              <PlaceImg seed={p.id.charCodeAt(1)} kind={p.kind} dark={dark}
                style={{ width: 140, height: 100, borderRadius: 14 }}/>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginTop: 6 }}>{p.name[lang]}</div>
              <div style={{ fontSize: 10, color: 'var(--ink-mute)' }}>★ {p.rating} · {p.mins} min</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'absolute', left: 14, right: 14, bottom: 90, zIndex: 5,
      }}>
        <button className="glass-strong" style={{
          width: '100%', padding: '14px', borderRadius: 999, border: 0, cursor: 'pointer',
          background: 'var(--ink)', color: 'var(--bg)',
          fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: 'var(--shadow-float)',
        }}>
          <Icon name="plus" size={15} sw={2}/> {t.addToDay}
        </button>
      </div>
    </div>
  );
}

// ─── Packing list screen ────────────────────────────────────────
function PackScreen({ lang, dark }) {
  const t = STRINGS[lang].pack;
  const [items, setItems] = useStateP(PACK);
  const all = Object.values(items).flat();
  const done = all.filter(x => x.done).length;
  const pct = Math.round((done / all.length) * 100);

  const toggle = (cat, id) => {
    setItems(prev => ({
      ...prev,
      [cat]: prev[cat].map(x => x.id === id ? { ...x, done: !x.done } : x),
    }));
  };

  const catLabels = ['Essentials', 'Beach', 'Hikes', 'Evenings'];

  return (
    <div className="no-scrollbar" style={{ height: '100%', overflow: 'auto', paddingBottom: 110 }}>
      {/* Header */}
      <div style={{ padding: '60px 22px 8px' }}>
        <div className="t-mono-cap">{lang === 'zh' ? '出發前打包' : 'Before takeoff'}</div>
        <div className="t-display" style={{ fontSize: 40, color: 'var(--accent)', marginTop: 4 }}>{t.title}</div>
      </div>

      {/* Progress card */}
      <div style={{ padding: '12px 16px 16px' }}>
        <div className="glass-strong" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{done} / {all.length} {t.progress}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>{pct}%</div>
            </div>
            {/* circular progress */}
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="var(--surface-stroke)" strokeWidth="4"/>
              <circle cx="28" cy="28" r="22" fill="none" stroke="var(--accent)" strokeWidth="4"
                strokeDasharray={`${(pct/100) * 138.2} 138.2`} strokeLinecap="round"
                transform="rotate(-90 28 28)"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Categories */}
      {catLabels.map((cat, i) => {
        const list = items[cat];
        const catName = t.categories[i];
        const catDone = list.filter(x => x.done).length;
        return (
          <div key={cat} style={{ padding: '10px 16px 4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '0 6px 8px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{catName}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{catDone}/{list.length}</div>
            </div>
            <div className="glass-strong" style={{ overflow: 'hidden' }}>
              {list.map((it, idx) => (
                <button key={it.id} onClick={() => toggle(cat, it.id)} style={{
                  width: '100%', border: 0, background: 'transparent', cursor: 'pointer',
                  padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                  borderTop: idx > 0 ? '0.5px solid var(--surface-stroke)' : 0,
                }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, flexShrink: 0,
                    background: it.done ? 'var(--accent)' : 'transparent',
                    border: it.done ? '0' : '1.5px solid var(--ink-faint)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', transition: 'all .2s',
                  }}>{it.done && <Icon name="check" size={14} sw={2.5}/>}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: it.done ? 'var(--ink-mute)' : 'var(--ink)',
                      textDecoration: it.done ? 'line-through' : 'none' }}>{it.label[lang]}</div>
                    {it.note && <div style={{ fontSize: 10, color: 'var(--warm)', marginTop: 2 }}>{it.note[lang]}</div>}
                  </div>
                </button>
              ))}
              <button style={{
                width: '100%', border: 0, background: 'transparent', cursor: 'pointer',
                padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8,
                borderTop: '0.5px solid var(--surface-stroke)',
                color: 'var(--ink-mute)', fontSize: 12,
              }}>
                <Icon name="plus" size={13} sw={2}/> {t.addItem}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { DetailScreen, PackScreen });
