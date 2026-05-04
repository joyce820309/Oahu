/* global React, Icon, MistyBackdrop, HomeScreen, DayScreen, ExploreScreen, DetailScreen, PackScreen, MeScreen, STRINGS, TRIP */

const { useState: useStateT } = React;

// ─── Shared nav tabs config ─────────────────────────────────────
const NAV_TABS = [
  { id: 'trip',    icon: 'home',     en: 'Trip',    zh: '行程' },
  { id: 'days',    icon: 'calendar', en: 'Days',    zh: '每日' },
  { id: 'explore', icon: 'compass',  en: 'Explore', zh: '探索' },
  { id: 'pack',    icon: 'pack',     en: 'Pack',    zh: '打包' },
  { id: 'me',      icon: 'user',     en: 'Me',      zh: '我' },
];

// ─── Day switcher strip (used in tablet + desktop) ──────────────
function DayStrip({ activeDay, onChange, lang, layout = 'h' }) {
  // layout: 'h' = horizontal chips, 'v' = vertical list
  const isV = layout === 'v';
  return (
    <div className={isV ? '' : 'no-scrollbar'} style={{
      display: 'flex',
      flexDirection: isV ? 'column' : 'row',
      gap: isV ? 4 : 6,
      overflowX: isV ? undefined : 'auto',
      overflowY: isV ? 'auto' : undefined,
      padding: isV ? '8px 0' : '0 4px',
    }}>
      {TRIP.days.map(d => {
        const on = d.n === activeDay;
        return (
          <button key={d.n} onClick={() => onChange(d.n)} style={{
            display: 'flex',
            flexDirection: isV ? 'row' : 'column',
            alignItems: isV ? 'center' : 'flex-start',
            gap: isV ? 10 : 2,
            padding: isV ? '10px 14px' : '8px 12px',
            borderRadius: 14, border: 0, cursor: 'pointer', flexShrink: 0,
            background: on ? 'var(--accent)' : 'var(--surface-translucent)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            transition: 'all .2s',
            minWidth: isV ? undefined : 80,
            width: isV ? '100%' : undefined,
            textAlign: 'left',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.12,
              textTransform: 'uppercase',
              color: on ? 'rgba(255,255,255,0.85)' : 'var(--ink-mute)' }}>
              Day {d.n}
            </div>
            <div style={{ fontSize: isV ? 13 : 11, fontWeight: 600,
              color: on ? '#fff' : 'var(--ink)',
              lineHeight: 1.25, whiteSpace: isV ? undefined : 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: isV ? undefined : 90 }}>
              {d.title[lang]}
            </div>
            {isV && (
              <div style={{ fontSize: 11, color: on ? 'rgba(255,255,255,0.7)' : 'var(--ink-mute)',
                marginLeft: 'auto', flexShrink: 0 }}>
                {d.stops.length > 0 ? `${d.stops.length} stops` : '—'}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── TABLET SHELL (600–1199px) ──────────────────────────────────
// Layout: left icon rail (60px) | main content
// When tab=days: top sticky day strip above main content
function TabletShell({ theme = 'light', lang = 'en', initialTab = 'trip', initialDay = 1 }) {
  const dark = theme === 'dark';
  const [tab, setTab] = useStateT(initialTab);
  const [day, setDay] = useStateT(initialDay);
  const [route, setRoute] = useStateT({ name: 'tab' });
  const t = STRINGS[lang];

  const showDayStrip = tab === 'days' && route.name === 'tab';

  return (
    <div data-theme={theme} style={{ width: '100%', height: '100%', display: 'flex',
      background: 'var(--bg)', overflow: 'hidden', position: 'relative', fontFamily: 'var(--font-sans)' }}>

      {/* App background wash */}
      <div className="app-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }}/>

      {/* ── Left icon rail ── */}
      <nav style={{
        position: 'relative', zIndex: 10, width: 68, flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '24px 0 20px', gap: 4,
        background: 'var(--surface-translucent)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderRight: '0.5px solid var(--surface-stroke)',
      }}>
        {/* Logo mark */}
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
            color: 'var(--accent)', lineHeight: 1 }}>H</div>
          <div style={{ fontSize: 8, letterSpacing: 0.15, textTransform: 'uppercase',
            color: 'var(--ink-mute)', marginTop: 2 }}>ele</div>
        </div>

        {NAV_TABS.map(nav => {
          const on = tab === nav.id && route.name === 'tab';
          return (
            <button key={nav.id} onClick={() => { setTab(nav.id); setRoute({ name: 'tab' }); }}
              style={{
                width: 48, padding: '10px 0', borderRadius: 14, border: 0, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                background: on ? 'var(--accent-soft)' : 'transparent',
                color: on ? 'var(--accent-deep)' : 'var(--ink-mute)',
                transition: 'all .2s',
              }}>
              <Icon name={nav.icon} size={20} sw={on ? 2 : 1.6}/>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.06 }}>
                {lang === 'zh' ? nav.zh : nav.en}
              </span>
            </button>
          );
        })}

        {/* theme toggle bottom */}
        <button onClick={() => {}} style={{
          marginTop: 'auto', width: 40, height: 40, borderRadius: 20, border: 0,
          background: 'var(--surface-translucent)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink-mute)',
        }}><Icon name={dark ? 'sun' : 'moon'} size={16} sw={1.6}/></button>
      </nav>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{
          height: 56, flexShrink: 0, display: 'flex', alignItems: 'center',
          padding: '0 24px', gap: 12, borderBottom: '0.5px solid var(--surface-stroke)',
          background: 'var(--surface-translucent)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        }}>
          <div style={{ flex: 1 }}>
            <div className="t-mono-cap">{lang === 'zh' ? 'Oʻahu 7 天 6 夜' : 'Oʻahu · 7 days'}</div>
          </div>
          {/* day strip (horizontal) when on Days tab */}
          {showDayStrip && (
            <div className="no-scrollbar" style={{ flex: 3, overflowX: 'auto' }}>
              <DayStrip activeDay={day} onChange={setDay} lang={lang} layout="h"/>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
            <button className="glass" style={{ width: 34, height: 34, borderRadius: 10, border: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: 'var(--ink-mute)' }}><Icon name="search" size={15}/></button>
            <button className="glass" style={{ width: 34, height: 34, borderRadius: 10, border: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: 'var(--ink-mute)' }}><Icon name="plus" size={15}/></button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto' }}>
          {route.name === 'tab' && tab === 'trip' && (
            <HomeScreen lang={lang} dark={dark}
              onOpenDay={(n) => { setDay(n); setTab('days'); }}
              onExplore={() => setTab('explore')}/>
          )}
          {route.name === 'tab' && tab === 'days' && (
            <DayScreen lang={lang} dark={dark} dayN={day}
              onBack={() => setTab('trip')} onPickStop={() => {}}/>
          )}
          {route.name === 'tab' && tab === 'explore' && (
            <ExploreScreen lang={lang} dark={dark}
              onPickPoi={(poi) => setRoute({ name: 'detail', poi })}/>
          )}
          {route.name === 'tab' && tab === 'pack' && (
            <PackScreen lang={lang} dark={dark}/>
          )}
          {route.name === 'tab' && tab === 'me' && (
            <MeScreen lang={lang} dark={dark} theme={theme} setTheme={() => {}}/>
          )}
          {route.name === 'detail' && (
            <DetailScreen lang={lang} dark={dark} poi={route.poi}
              onBack={() => setRoute({ name: 'tab' })}/>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DESKTOP SHELL (1200px+) ────────────────────────────────────
// Layout: sidebar (220px) | secondary panel (260px) | main content
function DesktopShell({ theme = 'light', lang = 'en', initialTab = 'trip', initialDay = 1 }) {
  const dark = theme === 'dark';
  const [tab, setTab] = useStateT(initialTab);
  const [day, setDay] = useStateT(initialDay);
  const [route, setRoute] = useStateT({ name: 'tab' });
  const t = STRINGS[lang];

  // Secondary panel content per tab
  const showDayPanel   = tab === 'days';
  const showPoiPanel   = tab === 'explore';
  const showPackPanel  = tab === 'pack';

  return (
    <div data-theme={theme} style={{ width: '100%', height: '100%', display: 'flex',
      background: 'var(--bg)', overflow: 'hidden', position: 'relative', fontFamily: 'var(--font-sans)' }}>

      {/* App background wash */}
      <div className="app-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }}/>

      {/* ── Sidebar (220px) ── */}
      <aside style={{
        position: 'relative', zIndex: 10, width: 220, flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        padding: '28px 0 20px',
        background: 'var(--surface-translucent)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderRight: '0.5px solid var(--surface-stroke)',
      }}>
        {/* Brand */}
        <div style={{ padding: '0 20px 24px', borderBottom: '0.5px solid var(--surface-stroke)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700,
            color: 'var(--accent)', lineHeight: 1 }}>Hele</div>
          <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4 }}>
            {lang === 'zh' ? 'Oʻahu · 7 天 6 夜' : 'Oʻahu · 7 days, 6 nights'}
          </div>
          {/* trip progress */}
          <div style={{ marginTop: 10, height: 3, background: 'var(--surface-stroke)', borderRadius: 2 }}>
            <div style={{ width: '72%', height: '100%', background: 'var(--accent)', borderRadius: 2 }}/>
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 4 }}>72% ready · 38 days to go</div>
        </div>

        {/* Nav items */}
        <nav style={{ padding: '12px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_TABS.map(nav => {
            const on = tab === nav.id && route.name === 'tab';
            return (
              <button key={nav.id} onClick={() => { setTab(nav.id); setRoute({ name: 'tab' }); }}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 12, border: 0, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: on ? 'var(--accent-soft)' : 'transparent',
                  color: on ? 'var(--accent-deep)' : 'var(--ink-soft)',
                  transition: 'all .2s', textAlign: 'left',
                }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                  background: on ? 'var(--accent)' : 'var(--surface-stroke)',
                  color: on ? '#fff' : 'var(--ink-mute)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={nav.icon} size={15} sw={1.8}/>
                </div>
                <span style={{ fontSize: 14, fontWeight: on ? 600 : 500 }}>
                  {lang === 'zh' ? nav.zh : nav.en}
                </span>
                {nav.id === 'days' && (
                  <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600,
                    background: 'var(--accent-soft)', color: 'var(--accent-deep)',
                    padding: '2px 7px', borderRadius: 99 }}>7</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom profile */}
        <div style={{ padding: '12px 14px 0', borderTop: '0.5px solid var(--surface-stroke)',
          display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 17, background: 'var(--accent-soft)',
            color: 'var(--accent-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="user" size={16}/>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
              {lang === 'zh' ? '林先生' : 'Lin'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>
              {lang === 'zh' ? '2 位旅人' : '2 travelers'}
            </div>
          </div>
          <button style={{ marginLeft: 'auto', background: 'transparent', border: 0, cursor: 'pointer',
            color: 'var(--ink-mute)' }}>
            <Icon name={dark ? 'sun' : 'moon'} size={15}/>
          </button>
        </div>
      </aside>

      {/* ── Secondary panel (240px) ── only when relevant tab is active */}
      {(showDayPanel || showPoiPanel || showPackPanel) && (
        <div style={{
          position: 'relative', zIndex: 9, width: 240, flexShrink: 0,
          borderRight: '0.5px solid var(--surface-stroke)',
          background: 'var(--surface-translucent)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Secondary panel header */}
          <div style={{ padding: '18px 16px 12px', borderBottom: '0.5px solid var(--surface-stroke)', flexShrink: 0 }}>
            <div className="t-mono-cap">
              {showDayPanel  && (lang === 'zh' ? '行程天數' : 'Days')}
              {showPoiPanel  && (lang === 'zh' ? '景點列表' : 'Places')}
              {showPackPanel && (lang === 'zh' ? '打包分類' : 'Categories')}
            </div>
          </div>

          {/* Day list */}
          {showDayPanel && (
            <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '8px 10px' }}>
              <DayStrip activeDay={day} onChange={setDay} lang={lang} layout="v"/>
            </div>
          )}

          {/* POI list (compact) */}
          {showPoiPanel && (
            <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '8px 10px',
              display: 'flex', flexDirection: 'column', gap: 6 }}>
              {window.POIS.map(p => (
                <button key={p.id} style={{
                  background: 'transparent', border: 0, cursor: 'pointer', padding: '8px 10px',
                  borderRadius: 10, textAlign: 'left', display: 'flex', gap: 10, alignItems: 'center',
                  transition: 'background .15s',
                  ':hover': { background: 'var(--accent-soft)' },
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'var(--accent-soft)', color: 'var(--accent-deep)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={p.kind === 'beach' ? 'wave' : p.kind === 'hike' ? 'mountain' : p.kind === 'food' ? 'utensil' : 'museum'} size={16}/>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{p.name[lang]}</div>
                    <div style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 1 }}>★ {p.rating} · {p.mins} min</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Pack categories */}
          {showPackPanel && (
            <div style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(lang === 'zh' ? ['必備', '海灘', '健行', '夜晚'] : ['Essentials', 'Beach', 'Hikes', 'Evenings']).map((cat, i) => {
                const cats = ['Essentials', 'Beach', 'Hikes', 'Evenings'];
                const list = window.PACK[cats[i]];
                const done = list.filter(x => x.done).length;
                return (
                  <button key={cat} style={{
                    background: 'var(--surface-translucent)', border: 0, cursor: 'pointer',
                    padding: '10px 12px', borderRadius: 12, textAlign: 'left',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{cat}</div>
                      <div style={{ fontSize: 10, color: 'var(--ink-mute)' }}>{done}/{list.length}</div>
                    </div>
                    <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: 'var(--surface-stroke)' }}>
                      <div style={{ height: '100%', borderRadius: 2, background: 'var(--accent)',
                        width: `${(done / list.length) * 100}%` }}/>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Main content ── */}
      <main className="no-scrollbar" style={{
        flex: 1, overflow: 'auto', position: 'relative', zIndex: 1,
        minWidth: 0,
      }}>
        {route.name === 'tab' && tab === 'trip' && (
          <HomeScreen lang={lang} dark={dark}
            onOpenDay={(n) => { setDay(n); setTab('days'); }}
            onExplore={() => setTab('explore')}/>
        )}
        {route.name === 'tab' && tab === 'days' && (
          <DayScreen lang={lang} dark={dark} dayN={day}
            onBack={() => setTab('trip')} onPickStop={() => {}}/>
        )}
        {route.name === 'tab' && tab === 'explore' && (
          <ExploreScreen lang={lang} dark={dark}
            onPickPoi={(poi) => setRoute({ name: 'detail', poi })}/>
        )}
        {route.name === 'tab' && tab === 'pack' && (
          <PackScreen lang={lang} dark={dark}/>
        )}
        {route.name === 'tab' && tab === 'me' && (
          <MeScreen lang={lang} dark={dark} theme={theme} setTheme={() => {}}/>
        )}
        {route.name === 'detail' && (
          <DetailScreen lang={lang} dark={dark} poi={route.poi}
            onBack={() => setRoute({ name: 'tab' })}/>
        )}
      </main>
    </div>
  );
}

Object.assign(window, { TabletShell, DesktopShell, DayStrip });
