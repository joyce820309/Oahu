/* global React, Icon, MistyBackdrop, PlaceImg, OahuMap, TRIP, POIS, STRINGS, PACK */

// ─── Tablet shell (600 – 768px) ──────────────────────────────────
function TabletShell({ lang = 'en', theme = 'light', initialTab = 'trip', initialDay = 1 }) {
  const { useState } = React;
  const [tab, setTab] = useState(initialTab);
  const [dayN, setDayN] = useState(initialDay);
  const [poi, setPoi] = useState(null);
  const dark = theme === 'dark';
  const t = STRINGS[lang];

  return (
    <div data-theme={theme} className="app" style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'row',
    }}>
      <div className="app-bg"/>
      {tab === 'trip' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.55 }}>
          <MistyBackdrop palette={theme}/>
        </div>
      )}
      <SideNav lang={lang} active={tab} onChange={setTab} compact/>
      <div style={{ flex: 1, position: 'relative', zIndex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TopBar lang={lang} title={t.tabs[tab]}/>
        <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '8px 24px 24px' }}>
          {tab === 'trip'    && <TripPane lang={lang} dark={dark} onOpenDay={(n) => { setDayN(n); setTab('days'); }}/>}
          {tab === 'days'    && <DaysPane lang={lang} dark={dark} dayN={dayN} setDayN={setDayN}/>}
          {tab === 'explore' && <ExplorePane lang={lang} dark={dark} onPickPoi={setPoi} selected={poi}/>}
          {tab === 'pack'    && <PackPane lang={lang} dark={dark}/>}
          {tab === 'me'      && <MePane lang={lang} dark={dark}/>}
        </div>
      </div>
    </div>
  );
}

// ─── Desktop shell (768px+) ──────────────────────────────────────
function DesktopShell({ lang = 'en', theme = 'light', initialTab = 'trip', initialDay = 1 }) {
  const { useState } = React;
  const [tab, setTab] = useState(initialTab);
  const [dayN, setDayN] = useState(initialDay);
  const [poi, setPoi] = useState(null);
  const dark = theme === 'dark';
  const t = STRINGS[lang];

  return (
    <div data-theme={theme} className="app" style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'row',
    }}>
      <div className="app-bg"/>
      {tab === 'trip' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.45 }}>
          <MistyBackdrop palette={theme}/>
        </div>
      )}
      <SideNav lang={lang} active={tab} onChange={setTab}/>
      {(tab === 'days' || tab === 'trip') && (
        <DayRail lang={lang} dayN={dayN}
          setDayN={(n) => { setDayN(n); if (tab === 'trip') setTab('days'); }}
          active={tab === 'days'}/>
      )}
      {tab === 'explore' && <ExploreList lang={lang} dark={dark} onPickPoi={setPoi} selected={poi}/>}
      {tab === 'pack'    && <PackCategoryRail lang={lang}/>}
      <div style={{ flex: 1, position: 'relative', zIndex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TopBar lang={lang} title={t.tabs[tab]}/>
        <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '8px 32px 32px' }}>
          {tab === 'trip'    && <TripPane lang={lang} dark={dark} onOpenDay={(n) => { setDayN(n); setTab('days'); }} wide/>}
          {tab === 'days'    && <DaysPane lang={lang} dark={dark} dayN={dayN} setDayN={setDayN} hideRail wide/>}
          {tab === 'explore' && <ExploreMapPane lang={lang} dark={dark} selected={poi} onPickPoi={setPoi}/>}
          {tab === 'pack'    && <PackPane lang={lang} dark={dark} wide/>}
          {tab === 'me'      && <MePane lang={lang} dark={dark}/>}
        </div>
      </div>
    </div>
  );
}

// ─── Side nav ────────────────────────────────────────────────────
function SideNav({ lang, active, onChange, compact = false }) {
  const t = STRINGS[lang];
  const items = [
    { k: 'trip',    icon: 'home' },
    { k: 'days',    icon: 'calendar' },
    { k: 'explore', icon: 'compass' },
    { k: 'pack',    icon: 'pack' },
    { k: 'me',      icon: 'user' },
  ];
  return (
    <aside style={{
      width: compact ? 88 : 220, flexShrink: 0, height: '100%',
      borderRight: '0.5px solid var(--surface-stroke)',
      display: 'flex', flexDirection: 'column',
      padding: '24px 14px', gap: 4,
      background: 'var(--surface-translucent)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      position: 'relative', zIndex: 2,
    }}>
      <div style={{ padding: compact ? '4px 0 14px 4px' : '4px 8px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: 'linear-gradient(135deg, var(--accent), var(--warm))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', flexShrink: 0,
        }}><Icon name="wave" size={16} sw={2}/></div>
        {!compact && <div className="t-display" style={{ fontSize: 26, color: 'var(--accent)' }}>Hele</div>}
      </div>
      {items.map(it => {
        const on = active === it.k;
        return (
          <button key={it.k} onClick={() => onChange(it.k)} style={{
            background: on ? 'var(--accent-soft)' : 'transparent',
            color: on ? 'var(--accent-deep)' : 'var(--ink-soft)',
            border: 0, borderRadius: 14,
            padding: compact ? '12px 8px' : '11px 14px',
            display: 'flex', flexDirection: compact ? 'column' : 'row',
            alignItems: 'center', gap: compact ? 4 : 12,
            fontSize: compact ? 11 : 14, fontWeight: 500,
            justifyContent: compact ? 'center' : 'flex-start',
            cursor: 'pointer', textAlign: 'left',
          }}>
            <Icon name={it.icon} size={compact ? 22 : 18} sw={on ? 2 : 1.6}/>
            <span>{t.tabs[it.k]}</span>
          </button>
        );
      })}
    </aside>
  );
}

// ─── Top bar ─────────────────────────────────────────────────────
function TopBar({ lang, title }) {
  return (
    <header style={{
      padding: '18px 24px 4px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexShrink: 0,
    }}>
      <div>
        <div className="t-mono-cap">{lang === 'zh' ? '夏威夷 · 7 天' : 'HAWAII · 7 DAYS'}</div>
        <div className="t-display" style={{ fontSize: 36, color: 'var(--accent)', marginTop: 2 }}>{title}</div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="glass" style={{
          width: 38, height: 38, borderRadius: 12, padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)',
        }}><Icon name="search" size={16} sw={1.7}/></button>
        <button className="glass" style={{
          width: 38, height: 38, borderRadius: 12, padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)',
        }}><Icon name="cloud" size={16} sw={1.7}/></button>
      </div>
    </header>
  );
}

// ─── Day rail ────────────────────────────────────────────────────
function DayRail({ lang, dayN, setDayN, active }) {
  return (
    <aside style={{
      width: 240, flexShrink: 0, height: '100%',
      borderRight: '0.5px solid var(--surface-stroke)',
      display: 'flex', flexDirection: 'column', padding: '24px 14px',
      position: 'relative', zIndex: 1,
    }}>
      <div className="t-mono-cap" style={{ padding: '4px 8px 12px' }}>
        {lang === 'zh' ? '行程天數' : 'ITINERARY'}
      </div>
      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TRIP.days.map(d => {
          const on = active && dayN === d.n;
          return (
            <button key={d.n} onClick={() => setDayN(d.n)} style={{
              background: on ? 'var(--accent-soft)' : 'var(--surface-translucent)',
              border: on ? '1.5px solid var(--accent)' : '0.5px solid var(--surface-stroke)',
              borderRadius: 14, padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer', textAlign: 'left',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: on ? 'var(--accent)' : 'var(--bg-soft)',
                color: on ? '#fff' : 'var(--accent-deep)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 600, lineHeight: 1, flexShrink: 0,
              }}>
                <div style={{ opacity: 0.85 }}>DAY</div>
                <div style={{ fontSize: 16, marginTop: 1 }}>{d.n}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {d.title[lang]}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 1 }}>
                  {d.dateLabel[lang]} · {d.stops.length} {lang === 'zh' ? '站' : 'stops'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

// ─── Explore list rail ───────────────────────────────────────────
function ExploreList({ lang, dark, onPickPoi, selected }) {
  return (
    <aside style={{
      width: 280, flexShrink: 0, height: '100%',
      borderRight: '0.5px solid var(--surface-stroke)',
      display: 'flex', flexDirection: 'column', padding: '24px 14px',
      position: 'relative', zIndex: 1,
    }}>
      <div className="t-mono-cap" style={{ padding: '4px 8px 8px' }}>
        {lang === 'zh' ? '景點探索' : 'PLACES'}
      </div>
      <div className="glass" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, borderRadius: 12 }}>
        <Icon name="search" size={14} sw={1.7}/>
        <input placeholder={lang === 'zh' ? '搜尋' : 'Search'} style={{
          background: 'transparent', border: 0, outline: 'none', flex: 1,
          color: 'var(--ink)', fontSize: 13,
        }}/>
      </div>
      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {POIS.map((p, idx) => {
          const on = selected && selected.id === p.id;
          return (
            <button key={p.id} onClick={() => onPickPoi(p)} style={{
              background: on ? 'var(--accent-soft)' : 'var(--surface-translucent)',
              border: on ? '1.5px solid var(--accent)' : '0.5px solid var(--surface-stroke)',
              borderRadius: 14, padding: 10,
              display: 'flex', gap: 10, cursor: 'pointer', textAlign: 'left',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            }}>
              <PlaceImg seed={idx + 1} kind={p.kind} dark={dark} style={{
                width: 56, height: 56, borderRadius: 10, flexShrink: 0,
              }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.name[lang]}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>
                  {p.area[lang]} · {p.mins}min
                </div>
                <div style={{ fontSize: 11, color: 'var(--accent-deep)', marginTop: 2, fontWeight: 500 }}>★ {p.rating}</div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

// ─── Pack categories rail ────────────────────────────────────────
function PackCategoryRail({ lang }) {
  const cats = Object.keys(PACK);
  const labels = { Essentials: { en: 'Essentials', zh: '必備' }, Beach: { en: 'Beach', zh: '海灘' }, Hikes: { en: 'Hikes', zh: '健行' }, Evenings: { en: 'Evenings', zh: '夜晚' } };
  const icons = { Essentials: 'note', Beach: 'wave', Hikes: 'mountain', Evenings: 'moon' };
  return (
    <aside style={{
      width: 220, flexShrink: 0, height: '100%',
      borderRight: '0.5px solid var(--surface-stroke)',
      padding: '24px 14px', position: 'relative', zIndex: 1,
    }}>
      <div className="t-mono-cap" style={{ padding: '4px 8px 12px' }}>
        {lang === 'zh' ? '分類' : 'CATEGORIES'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {cats.map((c, i) => {
          const items = PACK[c];
          const done = items.filter(it => it.done).length;
          return (
            <button key={c} style={{
              background: i === 0 ? 'var(--accent-soft)' : 'transparent',
              color: i === 0 ? 'var(--accent-deep)' : 'var(--ink-soft)',
              border: 0, borderRadius: 12,
              padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left',
            }}>
              <Icon name={icons[c]} size={16} sw={1.7}/>
              <span style={{ flex: 1 }}>{labels[c][lang]}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{done}/{items.length}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

// ─── Trip pane ───────────────────────────────────────────────────
function TripPane({ lang, dark, onOpenDay, wide = false }) {
  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: wide ? 'minmax(0, 2fr) minmax(0, 1fr)' : '1fr' }}>
      <div className="glass-strong" style={{ padding: 24, borderRadius: 24 }}>
        <div className="t-mono-cap">{lang === 'zh' ? '倒數' : 'COUNTDOWN'}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 4 }}>
          <div className="t-display" style={{ fontSize: 84, color: 'var(--accent)', lineHeight: 0.9 }}>32</div>
          <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
            {lang === 'zh' ? '天後出發 · 6/14 → 6/20' : 'days to go · Jun 14 → 20'}
          </div>
        </div>
        <div style={{ marginTop: 18, height: 6, borderRadius: 3, background: 'var(--surface-stroke)', overflow: 'hidden' }}>
          <div style={{ width: '40%', height: '100%', background: 'var(--accent)', borderRadius: 3 }}/>
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-mute)' }}>
          {lang === 'zh' ? '準備中 · 機票/住宿/活動 4/10' : 'Planning · 4 of 10 ready'}
        </div>
      </div>
      <div className="glass" style={{ padding: 18, borderRadius: 20 }}>
        <div className="t-mono-cap">{lang === 'zh' ? '行程概覽' : 'OVERVIEW'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
          {[
            { v: '7', l: lang === 'zh' ? '天' : 'days', c: 'var(--accent)' },
            { v: String(POIS.length), l: lang === 'zh' ? '景點' : 'spots', c: 'var(--lagoon)' },
            { v: 'Oʻahu', l: lang === 'zh' ? '島嶼' : 'island', c: 'var(--leaf)' },
            { v: '$3.2k', l: lang === 'zh' ? '預算' : 'budget', c: 'var(--warm)' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-soft)', borderRadius: 12, padding: '12px 14px' }}>
              <div className="t-display" style={{ fontSize: 28, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: 0.08 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ gridColumn: wide ? '1 / -1' : 'auto' }}>
        <div className="t-mono-cap" style={{ marginBottom: 10, padding: '0 4px' }}>
          {lang === 'zh' ? '7 天行程' : '7-DAY ITINERARY'}
        </div>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: wide ? 'repeat(auto-fill, minmax(220px, 1fr))' : 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          {TRIP.days.map(d => (
            <button key={d.n} onClick={() => onOpenDay(d.n)} className="glass" style={{
              padding: 14, textAlign: 'left', cursor: 'pointer', borderRadius: 16,
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'var(--accent)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                }}>{d.n}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{d.dateLabel[lang]}</div>
              </div>
              <div className="t-display" style={{ fontSize: 22, color: 'var(--ink)' }}>{d.title[lang]}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>
                {d.stops.length} {lang === 'zh' ? '個景點' : 'stops'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Days pane ───────────────────────────────────────────────────
function DaysPane({ lang, dark, dayN, setDayN, hideRail = false, wide = false }) {
  const day = TRIP.days.find(d => d.n === dayN) || TRIP.days[0];
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {!hideRail && (
        <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {TRIP.days.map(d => {
            const on = d.n === dayN;
            return (
              <button key={d.n} onClick={() => setDayN(d.n)} style={{
                background: on ? 'var(--accent)' : 'var(--surface-translucent)',
                color: on ? '#fff' : 'var(--ink-soft)',
                border: '0.5px solid var(--surface-stroke)',
                borderRadius: 14, padding: '10px 14px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                minWidth: 80, cursor: 'pointer', flexShrink: 0,
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              }}>
                <div style={{ fontSize: 9, fontWeight: 600, opacity: 0.8 }}>DAY</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{d.n}</div>
                <div style={{ fontSize: 10, opacity: 0.85 }}>{d.dateLabel[lang]}</div>
              </button>
            );
          })}
        </div>
      )}
      <div className="glass-strong" style={{ padding: 20, borderRadius: 20 }}>
        <div className="t-mono-cap">DAY {day.n} · {day.dateLabel[lang]}</div>
        <div className="t-display" style={{ fontSize: 38, color: 'var(--accent)', marginTop: 4 }}>{day.title[lang]}</div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6 }}>
          {day.stops.length} {lang === 'zh' ? '個景點' : 'stops'}
        </div>
      </div>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: wide ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr' }}>
        {day.stops.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--ink-mute)', textAlign: 'center', padding: 30 }}>
            {lang === 'zh' ? '尚無行程，點擊下方新增' : 'No stops yet — add one below'}
          </div>
        ) : day.stops.map((s) => (
          <div key={s.id} className="glass" style={{
            padding: 14, borderRadius: 16, display: 'flex', gap: 12,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12,
              background: 'var(--accent-soft)', color: 'var(--accent-deep)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <div style={{ fontSize: 9, fontWeight: 600, opacity: 0.85 }}>{s.time}</div>
              <div style={{ fontSize: 11, fontWeight: 500, marginTop: 2, opacity: 0.85 }}>{s.dur}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{s.title[lang]}</div>
              {s.sub && (
                <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 3 }}>{s.sub[lang]}</div>
              )}
            </div>
            <Icon name="drag" size={16} sw={1.5}/>
          </div>
        ))}
      </div>
      <button style={{
        background: 'transparent', border: '1.5px dashed var(--surface-stroke)',
        color: 'var(--accent-deep)', borderRadius: 14, padding: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontSize: 13, fontWeight: 500, cursor: 'pointer',
      }}>
        <Icon name="plus" size={16} sw={2}/>
        {lang === 'zh' ? '新增行程' : 'Add stop'}
      </button>
    </div>
  );
}

// ─── Explore pane (tablet) ───────────────────────────────────────
function ExplorePane({ lang, dark, onPickPoi }) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div className="glass-strong" style={{ borderRadius: 20, overflow: 'hidden', height: 320 }}>
        <OahuMap dark={dark}/>
      </div>
      <div className="t-mono-cap">{POIS.length} {lang === 'zh' ? '個景點' : 'PLACES'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {POIS.map((p, idx) => (
          <button key={p.id} onClick={() => onPickPoi(p)} className="glass" style={{
            borderRadius: 16, padding: 0, overflow: 'hidden',
            display: 'flex', flexDirection: 'column', cursor: 'pointer', textAlign: 'left',
          }}>
            <PlaceImg seed={idx + 1} kind={p.kind} dark={dark} style={{ width: '100%', height: 120 }}/>
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{p.name[lang]}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 3 }}>
                {p.area[lang]} · ★ {p.rating}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Explore map pane (desktop) ──────────────────────────────────
function ExploreMapPane({ lang, dark, selected }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 16, height: '100%' }}>
      <div className="glass-strong" style={{ borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
        <OahuMap dark={dark}/>
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[lang === 'zh' ? '全部' : 'All', lang === 'zh' ? '海灘' : 'Beach', lang === 'zh' ? '健行' : 'Hike', lang === 'zh' ? '美食' : 'Food', lang === 'zh' ? '文化' : 'Culture'].map((c, i) => (
            <button key={i} className="glass" style={{
              padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500,
              color: i === 0 ? '#fff' : 'var(--ink-soft)',
              background: i === 0 ? 'var(--accent)' : 'var(--surface-translucent)',
              border: 0, cursor: 'pointer',
            }}>{c}</button>
          ))}
        </div>
      </div>
      <div className="glass-strong" style={{ borderRadius: 20, padding: 18, overflow: 'auto' }}>
        {selected ? (
          <>
            <PlaceImg seed={POIS.indexOf(selected) + 1} kind={selected.kind} dark={dark}
              style={{ width: '100%', height: 160, borderRadius: 14, marginBottom: 14 }}/>
            <div className="t-mono-cap">{selected.area[lang]}</div>
            <div className="t-display" style={{ fontSize: 30, color: 'var(--accent)', marginTop: 4 }}>{selected.name[lang]}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 10, lineHeight: 1.5 }}>{selected.blurb[lang]}</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button style={{
                flex: 1, padding: '10px 14px', borderRadius: 12, border: 0,
                background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}>{lang === 'zh' ? '加入行程' : 'Add to trip'}</button>
              <button style={{
                width: 42, padding: 10, borderRadius: 12, border: 0,
                background: 'var(--accent-soft)', color: 'var(--accent-deep)', cursor: 'pointer',
              }}><Icon name="heart" size={16} sw={1.7}/></button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--ink-mute)', fontSize: 13, padding: '40px 20px' }}>
            <Icon name="pin" size={28} sw={1.4}/>
            <div style={{ marginTop: 10 }}>{lang === 'zh' ? '從左側選擇景點查看詳情' : 'Select a place to see details'}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pack pane ───────────────────────────────────────────────────
function PackPane({ lang, dark, wide = false }) {
  const cats = Object.keys(PACK);
  const labels = { Essentials: { en: 'Essentials', zh: '必備' }, Beach: { en: 'Beach', zh: '海灘' }, Hikes: { en: 'Hikes', zh: '健行' }, Evenings: { en: 'Evenings', zh: '夜晚' } };
  const icons = { Essentials: 'note', Beach: 'wave', Hikes: 'mountain', Evenings: 'moon' };
  const total = cats.reduce((a, c) => a + PACK[c].length, 0);
  const done = cats.reduce((a, c) => a + PACK[c].filter(it => it.done).length, 0);
  const pct = Math.round((done / total) * 100);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div className="glass-strong" style={{ padding: 22, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 18 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--surface-stroke)" strokeWidth="6"/>
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--accent)" strokeWidth="6"
                  strokeDasharray={`${pct * 2.136} 999`} strokeLinecap="round" transform="rotate(-90 40 40)"/>
        </svg>
        <div style={{ flex: 1 }}>
          <div className="t-mono-cap">{lang === 'zh' ? '打包進度' : 'PACKING'}</div>
          <div className="t-display" style={{ fontSize: 36, color: 'var(--accent)', marginTop: 2 }}>{done} / {total}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>
            {lang === 'zh' ? `已準備 ${pct}%` : `${pct}% ready`}
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: wide ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr' }}>
        {cats.map(c => {
          const items = PACK[c];
          return (
            <div key={c} className="glass" style={{ padding: 14, borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Icon name={icons[c]} size={16} sw={1.7}/>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{labels[c][lang]}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>
                  {items.filter(it => it.done).length}/{items.length}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {items.map((it) => (
                  <label key={it.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '6px 4px', cursor: 'pointer',
                    fontSize: 13, color: it.done ? 'var(--ink-mute)' : 'var(--ink)',
                    textDecoration: it.done ? 'line-through' : 'none',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 6,
                      border: '1.5px solid var(--surface-stroke)',
                      background: it.done ? 'var(--accent)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', flexShrink: 0,
                    }}>{it.done && <Icon name="check" size={11} sw={2.4}/>}</div>
                    <span>{it.label[lang]}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Me pane ─────────────────────────────────────────────────────
function MePane({ lang }) {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 600 }}>
      <div className="glass-strong" style={{ padding: 22, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--warm))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 24, fontWeight: 700,
        }}>L</div>
        <div>
          <div className="t-display" style={{ fontSize: 28, color: 'var(--accent)' }}>
            {lang === 'zh' ? '林先生' : 'Lin'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>lin@hele.app</div>
        </div>
      </div>
      <div className="glass" style={{ padding: '4px 0', borderRadius: 16 }}>
        {[
          { i: 'heart', l: lang === 'zh' ? '我的收藏' : 'Saved', v: '12' },
          { i: 'note',  l: lang === 'zh' ? '旅遊筆記' : 'Notes', v: '4' },
          { i: 'globe', l: lang === 'zh' ? '語言' : 'Language', v: lang === 'zh' ? '中文' : 'English' },
          { i: 'cloud', l: lang === 'zh' ? '通知' : 'Notifications', v: lang === 'zh' ? '已開啟' : 'On' },
        ].map((row, i) => (
          <div key={i} style={{
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
            borderTop: i > 0 ? '0.5px solid var(--surface-stroke)' : 0,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9, background: 'var(--accent-soft)',
              color: 'var(--accent-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name={row.i} size={14} sw={1.7}/></div>
            <div style={{ flex: 1, fontSize: 14, color: 'var(--ink)' }}>{row.l}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{row.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { TabletShell, DesktopShell });
