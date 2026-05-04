/* global React, Icon, PlaceImg, OahuMap, STRINGS, TRIP, POIS, PACK */

const { useState: useStateD } = React;

// ─── Day-by-day editor with drag-reorder ────────────────────────
function DayScreen({ lang, dark, dayN = 1, onBack, onPickStop }) {
  const t = STRINGS[lang].days;
  const [activeDay, setActiveDay] = useStateD(dayN);
  const day = TRIP.days.find(d => d.n === activeDay) || TRIP.days[0];
  const [stops, setStops] = useStateD(day.stops);
  const [dragId, setDragId] = useStateD(null);
  const [overId, setOverId] = useStateD(null);

  React.useEffect(() => { setStops(day.stops); }, [activeDay]);

  const reorder = (from, to) => {
    if (from === to) return;
    const next = [...stops];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setStops(next);
  };

  return (
    <div className="no-scrollbar" style={{ height: '100%', overflow: 'auto', paddingBottom: 110 }}>
      {/* Header */}
      <div style={{ padding: '60px 18px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="glass" style={{
          width: 38, height: 38, borderRadius: 19, border: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink)', cursor: 'pointer',
        }}><Icon name="back" size={16}/></button>
        <div style={{ textAlign: 'center' }}>
          <div className="t-mono-cap">Day {day.n} / {TRIP.days.length}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{day.dateLabel[lang]}</div>
        </div>
        <button className="glass" style={{
          width: 38, height: 38, borderRadius: 19, border: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink)', cursor: 'pointer',
        }}><Icon name="ellipsis" size={16}/></button>
      </div>

      {/* Title */}
      <div style={{ padding: '12px 22px 4px' }}>
        <div className="t-display" style={{ fontSize: 42, color: 'var(--accent)' }}>{day.title[lang]}</div>
      </div>

      {/* Day switcher chips */}
      <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 18px 6px' }}>
        {TRIP.days.map(d => {
          const on = d.n === activeDay;
          return (
            <button key={d.n} onClick={() => setActiveDay(d.n)} style={{
              padding: '8px 14px', borderRadius: 999, border: 0, cursor: 'pointer',
              flexShrink: 0, transition: 'all .25s',
              background: on ? 'var(--ink)' : 'var(--surface-translucent)',
              color: on ? 'var(--bg)' : 'var(--ink-soft)',
              fontSize: 12, fontWeight: 600, letterSpacing: 0.02,
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              border: '0.5px solid var(--surface-stroke)',
            }}>
              Day {d.n}
            </button>
          );
        })}
      </div>

      {/* Reorder hint */}
      <div style={{ padding: '0 22px 8px', fontSize: 11, color: 'var(--ink-mute)' }}>
        <Icon name="drag" size={11} sw={2}/> {t.reorderHint}
      </div>

      {/* Timeline list */}
      <div style={{ padding: '4px 18px', position: 'relative' }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: 38, top: 22, bottom: 22, width: 1, background: 'var(--surface-stroke)' }}/>

        {stops.map((s, idx) => {
          const isDragging = dragId === s.id;
          const isOver = overId === s.id;
          return (
            <div key={s.id}
              draggable
              onDragStart={() => setDragId(s.id)}
              onDragOver={(e) => { e.preventDefault(); setOverId(s.id); }}
              onDrop={() => {
                const from = stops.findIndex(x => x.id === dragId);
                const to = stops.findIndex(x => x.id === s.id);
                reorder(from, to);
                setDragId(null); setOverId(null);
              }}
              onDragEnd={() => { setDragId(null); setOverId(null); }}
              style={{
                position: 'relative', display: 'flex', gap: 12, marginBottom: 10,
                opacity: isDragging ? 0.4 : 1,
                transform: isOver && !isDragging ? 'translateY(4px)' : 'translateY(0)',
                transition: 'transform .2s, opacity .2s',
              }}>
              {/* Time + dot */}
              <div style={{ flexShrink: 0, width: 50, textAlign: 'right', paddingTop: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{s.time}</div>
                <div style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 2 }}>{s.dur}</div>
              </div>
              {/* Dot */}
              <div style={{ flexShrink: 0, width: 14, paddingTop: 18, position: 'relative' }}>
                <div style={{
                  width: 14, height: 14, borderRadius: 7,
                  background: 'var(--bg)', border: '2px solid var(--accent)',
                  boxShadow: '0 0 0 4px var(--bg)',
                }}/>
              </div>
              {/* Card */}
              <button onClick={() => onPickStop(s)} className="glass-strong" style={{
                flex: 1, textAlign: 'left', border: 0, cursor: 'grab',
                padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                  background: s.type === 'beach' ? 'var(--accent-soft)'
                          : s.type === 'food' ? 'var(--warm-soft)'
                          : s.type === 'hike' ? 'rgba(74,139,130,0.18)'
                          : 'var(--surface-stroke)',
                  color: s.type === 'food' ? 'var(--warm)' : 'var(--accent-deep)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>
                  <Icon name={
                    s.type === 'beach' ? 'wave' : s.type === 'food' ? 'utensil' :
                    s.type === 'hike' ? 'mountain' : s.type === 'culture' ? 'museum' :
                    s.type === 'stay' ? 'home' : 'plane'
                  } size={20} sw={1.7}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.25 }}>{s.title[lang]}</div>
                  {s.sub && <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 3 }}>{s.sub[lang]}</div>}
                </div>
                <div style={{ color: 'var(--ink-faint)' }}>
                  <Icon name="drag" size={14}/>
                </div>
              </button>
            </div>
          );
        })}

        {/* Add stop button */}
        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
          <div style={{ width: 50 }}/>
          <div style={{ width: 14 }}/>
          <button style={{
            flex: 1, padding: '14px', borderRadius: 'var(--radius-card)',
            border: '1.2px dashed var(--surface-stroke)', background: 'transparent',
            color: 'var(--ink-mute)', fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer',
          }}>
            <Icon name="plus" size={14} sw={2}/> {t.addStop}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EXPLORE — map + list toggle ────────────────────────────────
function ExploreScreen({ lang, dark, onPickPoi }) {
  const t = STRINGS[lang].explore;
  const [view, setView] = useStateD('map');
  const [filter, setFilter] = useStateD(0);
  const [activeId, setActiveId] = useStateD('p1');

  const filtered = filter === 0 ? POIS :
    POIS.filter(p => p.kind === ['', 'beach', 'hike', 'food', 'culture'][filter]);

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '60px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="t-mono-cap">{lang === 'zh' ? 'Oʻahu 探索' : 'Discover Oʻahu'}</div>
          <div className="t-display" style={{ fontSize: 38, color: 'var(--accent)' }}>{t.title}</div>
        </div>
        {/* Map / List toggle */}
        <div className="glass" style={{ display: 'inline-flex', padding: 3, borderRadius: 999 }}>
          {[
            { k: 'list', i: 'list', label: t.list },
            { k: 'map',  i: 'mapIcon', label: t.map },
          ].map(o => (
            <button key={o.k} onClick={() => setView(o.k)} style={{
              padding: '6px 12px', borderRadius: 999, border: 0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5,
              background: view === o.k ? 'var(--ink)' : 'transparent',
              color: view === o.k ? 'var(--bg)' : 'var(--ink-soft)',
              fontSize: 11, fontWeight: 600, transition: 'all .25s',
            }}><Icon name={o.i} size={13} sw={1.8}/>{o.label}</button>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 18px 12px' }}>
        {t.filters.map((label, i) => (
          <button key={i} onClick={() => setFilter(i)} style={{
            padding: '6px 12px', borderRadius: 999, flexShrink: 0,
            border: '0.5px solid var(--surface-stroke)', cursor: 'pointer',
            background: filter === i ? 'var(--accent)' : 'transparent',
            color: filter === i ? '#fff' : 'var(--ink-soft)',
            fontSize: 12, fontWeight: 500, transition: 'all .2s',
          }}>{label}</button>
        ))}
      </div>

      {view === 'map' ? (
        <div style={{ position: 'relative', height: 'calc(100% - 200px)' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <OahuMap dark={dark}/>
          </div>
          {/* POI markers */}
          {filtered.map(p => (
            <button key={p.id} onClick={() => setActiveId(p.id)} style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              transform: 'translate(-50%, -50%)', border: 0, padding: 0,
              background: 'transparent', cursor: 'pointer',
            }}>
              <div style={{
                width: activeId === p.id ? 36 : 26,
                height: activeId === p.id ? 36 : 26,
                borderRadius: '50%',
                background: activeId === p.id ? 'var(--warm)' : 'var(--surface)',
                border: `2px solid ${activeId === p.id ? '#fff' : 'var(--accent)'}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: activeId === p.id ? '#fff' : 'var(--accent-deep)',
                transition: 'all .25s',
              }}>
                <Icon name={p.kind === 'beach' ? 'wave' : p.kind === 'hike' ? 'mountain' : p.kind === 'food' ? 'utensil' : 'museum'} size={14} sw={1.8}/>
              </div>
            </button>
          ))}

          {/* Bottom POI sheet */}
          {(() => {
            const p = filtered.find(x => x.id === activeId) || filtered[0];
            if (!p) return null;
            return (
              <button onClick={() => onPickPoi(p)} className="glass-strong" style={{
                position: 'absolute', left: 14, right: 14, bottom: 90,
                padding: 12, display: 'flex', gap: 12, border: 0, cursor: 'pointer', textAlign: 'left',
              }}>
                <PlaceImg seed={p.id.charCodeAt(1)} kind={p.kind} dark={dark}
                  style={{ width: 70, height: 70, borderRadius: 14, flexShrink: 0 }}/>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{p.name[lang]}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{p.area[lang]} · {p.mins} min</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.blurb[lang]}
                  </div>
                </div>
                <div style={{ color: 'var(--ink-faint)', alignSelf: 'center' }}>
                  <Icon name="chevron" size={14}/>
                </div>
              </button>
            );
          })()}
        </div>
      ) : (
        <div className="no-scrollbar" style={{
          height: 'calc(100% - 200px)', overflow: 'auto',
          padding: '4px 18px 100px', display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {filtered.map(p => (
            <button key={p.id} onClick={() => onPickPoi(p)} className="glass-strong" style={{
              border: 0, padding: 12, display: 'flex', gap: 12, cursor: 'pointer', textAlign: 'left',
            }}>
              <PlaceImg seed={p.id.charCodeAt(1)} kind={p.kind} dark={dark}
                style={{ width: 76, height: 76, borderRadius: 14, flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{p.name[lang]}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>★ {p.rating}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>{p.area[lang]} · {p.mins} min</div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.4,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {p.blurb[lang]}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { DayScreen, ExploreScreen });
