/* global React, Icon, IOSDevice, HomeScreen, DayScreen, ExploreScreen, DetailScreen, PackScreen, MeScreen, TabBar, STRINGS, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSlider, TweakToggle, TabletShell, DesktopShell, DesignCanvas, DCSection, DCArtboard */

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "sunset",
  "blur": 4,
  "radius": 22,
  "fontSize": 15,
  "language": "en"
}/*EDITMODE-END*/;

const ACCENTS = {
  // default — sunset orange + photo-derived
  sunset:  { accent: '#FF9D5C', soft: '#FFE3C2', deep: '#E07A2E', dAccent: '#F2B788', dSoft: 'rgba(242,183,136,0.22)', dDeep: '#FFCE9E' },
  // lagoon teal from photo sky top
  teal:    { accent: '#4FB8BF', soft: '#C8EAEC', deep: '#2E9098', dAccent: '#7FB8D8', dSoft: 'rgba(127,184,216,0.20)', dDeep: '#A8D4E8' },
  // twilight pink from dark photo horizon
  rose:    { accent: '#E5798E', soft: '#FAD3DA', deep: '#C4566A', dAccent: '#C26A86', dSoft: 'rgba(194,106,134,0.22)', dDeep: '#E098AC' },
  // violet from dark photo mid-sky
  violet:  { accent: '#8B7AC8', soft: '#DDD8F2', deep: '#6658A8', dAccent: '#9A8BB8', dSoft: 'rgba(154,139,184,0.22)', dDeep: '#C0B8DC' },
};

function applyTokens(theme, accentKey, blur, radius, fontSize) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  const a = ACCENTS[accentKey];
  if (theme === 'dark') {
    root.style.setProperty('--accent', a.dAccent);
    root.style.setProperty('--accent-soft', a.dSoft);
    root.style.setProperty('--accent-deep', a.dDeep);
  } else {
    root.style.setProperty('--accent', a.accent);
    root.style.setProperty('--accent-soft', a.soft);
    root.style.setProperty('--accent-deep', a.deep);
  }
  root.style.setProperty('--blur', `${blur}px`);
  root.style.setProperty('--radius-card', `${radius}px`);
  root.style.setProperty('--fs-base', `${fontSize}px`);
}

// ─── Single phone wrapper ───────────────────────────────────────
function HelePhone({ initialTheme = 'light', lang = 'en', label }) {
  const [theme, setTheme] = useState(initialTheme);
  const [tab, setTab] = useState('trip');
  const [route, setRoute] = useState({ name: 'tab' }); // {name:'tab'} | {name:'day', n} | {name:'detail', poi}

  const dark = theme === 'dark';

  // Local theme override on this phone instance — apply via wrapper data-theme
  return (
    <div data-theme={theme} style={{ width: 402, height: 874, position: 'relative' }}>
      <IOSDevice width={402} height={874} dark={dark}>
        <div className="app" style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
          <div className="app-bg"/>
          <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
            {route.name === 'tab' && tab === 'trip' && (
              <HomeScreen lang={lang} dark={dark}
                onOpenDay={(n) => setRoute({ name: 'day', n })}
                onExplore={() => setTab('explore')}/>
            )}
            {route.name === 'tab' && tab === 'days' && (
              <DayScreen lang={lang} dark={dark} dayN={1}
                onBack={() => setTab('trip')}
                onPickStop={() => {}}/>
            )}
            {route.name === 'tab' && tab === 'explore' && (
              <ExploreScreen lang={lang} dark={dark}
                onPickPoi={(poi) => setRoute({ name: 'detail', poi })}/>
            )}
            {route.name === 'tab' && tab === 'pack' && (
              <PackScreen lang={lang} dark={dark}/>
            )}
            {route.name === 'tab' && tab === 'me' && (
              <MeScreen lang={lang} dark={dark} theme={theme} setTheme={setTheme}/>
            )}
            {route.name === 'day' && (
              <DayScreen lang={lang} dark={dark} dayN={route.n}
                onBack={() => setRoute({ name: 'tab' })}
                onPickStop={() => {}}/>
            )}
            {route.name === 'detail' && (
              <DetailScreen lang={lang} dark={dark} poi={route.poi}
                onBack={() => setRoute({ name: 'tab' })}/>
            )}
          </div>
          {/* Tab bar shown only on root tab routes */}
          {route.name === 'tab' && (
            <TabBar active={tab} onChange={setTab} t={STRINGS[lang]}/>
          )}
          {/* Quick light/dark toggle (top-right corner) */}
          <button onClick={() => setTheme(dark ? 'light' : 'dark')} className="glass" style={{
            position: 'absolute', top: 60, right: 14, zIndex: 40,
            width: 36, height: 36, borderRadius: 18, border: 0,
            display: route.name === 'tab' && tab === 'trip' ? 'flex' : 'none',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink)', cursor: 'pointer',
          }}><Icon name={dark ? 'sun' : 'moon'} size={15} sw={1.7}/></button>
        </div>
      </IOSDevice>
    </div>
  );
}

// ─── Me screen (settings) ───────────────────────────────────────
function MeScreen({ lang, dark, theme, setTheme }) {
  return (
    <div className="no-scrollbar" style={{ height: '100%', overflow: 'auto', paddingBottom: 110 }}>
      <div style={{ padding: '60px 22px 12px' }}>
        <div className="t-mono-cap">{lang === 'zh' ? '個人' : 'Profile'}</div>
        <div className="t-display" style={{ fontSize: 40, color: 'var(--accent)', marginTop: 4 }}>
          {lang === 'zh' ? '林先生' : 'Lin'}
        </div>
      </div>
      <div style={{ padding: '8px 16px' }}>
        <div className="glass-strong" style={{ padding: '4px 0' }}>
          {[
            { i: dark ? 'sun' : 'moon', l: lang === 'zh' ? '主題' : 'Theme', v: dark ? (lang === 'zh' ? '暗色' : 'Dark') : (lang === 'zh' ? '明亮' : 'Light'),
              onClick: () => setTheme(dark ? 'light' : 'dark') },
            { i: 'globe', l: lang === 'zh' ? '語言' : 'Language', v: lang === 'zh' ? '中文' : 'English' },
            { i: 'cloud', l: lang === 'zh' ? '通知' : 'Notifications', v: lang === 'zh' ? '已開啟' : 'On' },
            { i: 'heart', l: lang === 'zh' ? '我的收藏' : 'Saved places', v: '12' },
            { i: 'note',  l: lang === 'zh' ? '旅遊筆記' : 'Trip notes', v: '4' },
          ].map((row, idx) => (
            <button key={idx} onClick={row.onClick} style={{
              width: '100%', background: 'transparent', border: 0, cursor: 'pointer',
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
              borderTop: idx > 0 ? '0.5px solid var(--surface-stroke)' : 0, textAlign: 'left',
            }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--accent-soft)',
                color: 'var(--accent-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={row.i} size={15} sw={1.7}/>
              </div>
              <div style={{ flex: 1, fontSize: 14, color: 'var(--ink)' }}>{row.l}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{row.v}</div>
              <Icon name="chevron" size={12} sw={1.8}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Top-level App with Tweaks panel + canvas of variations ────
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    applyTokens(tweaks.theme, tweaks.accent, tweaks.blur, tweaks.radius, tweaks.fontSize);
  }, [tweaks.theme, tweaks.accent, tweaks.blur, tweaks.radius, tweaks.fontSize]);

  const lang = tweaks.language;

  return (
    <>
      <DesignCanvas defaultZoom={0.65}>
        <DCSection id="hawaii" title="Hele · Hawaii Trip Planner"
          subtitle="Misty neutral palette · frosted glass cards · light + dark · iOS frame">

          <DCArtboard id="home-light" label={lang === 'zh' ? '首頁 · 明亮' : 'Home · Light'} width={402} height={874}>
            <HelePhone initialTheme="light" lang={lang}/>
          </DCArtboard>

          <DCArtboard id="home-dark" label={lang === 'zh' ? '首頁 · 暗色' : 'Home · Dark'} width={402} height={874}>
            <HelePhone initialTheme="dark" lang={lang}/>
          </DCArtboard>

          <DCArtboard id="day-light" label={lang === 'zh' ? '每日行程 · 明亮' : 'Day · Light'} width={402} height={874}>
            <PhonePreset theme="light" lang={lang} initial={{ tab: 'days' }}/>
          </DCArtboard>

          <DCArtboard id="day-dark" label={lang === 'zh' ? '每日行程 · 暗色' : 'Day · Dark'} width={402} height={874}>
            <PhonePreset theme="dark" lang={lang} initial={{ tab: 'days' }}/>
          </DCArtboard>

          <DCArtboard id="explore-light" label={lang === 'zh' ? '探索地圖 · 明亮' : 'Explore · Light'} width={402} height={874}>
            <PhonePreset theme="light" lang={lang} initial={{ tab: 'explore' }}/>
          </DCArtboard>

          <DCArtboard id="explore-dark" label={lang === 'zh' ? '探索地圖 · 暗色' : 'Explore · Dark'} width={402} height={874}>
            <PhonePreset theme="dark" lang={lang} initial={{ tab: 'explore' }}/>
          </DCArtboard>

          <DCArtboard id="detail-light" label={lang === 'zh' ? '景點詳情 · 明亮' : 'Detail · Light'} width={402} height={874}>
            <PhonePreset theme="light" lang={lang} initial={{ route: { name: 'detail', poi: window.POIS[0] } }}/>
          </DCArtboard>

          <DCArtboard id="detail-dark" label={lang === 'zh' ? '景點詳情 · 暗色' : 'Detail · Dark'} width={402} height={874}>
            <PhonePreset theme="dark" lang={lang} initial={{ route: { name: 'detail', poi: window.POIS[0] } }}/>
          </DCArtboard>

          <DCArtboard id="pack-light" label={lang === 'zh' ? '打包清單 · 明亮' : 'Packing · Light'} width={402} height={874}>
            <PhonePreset theme="light" lang={lang} initial={{ tab: 'pack' }}/>
          </DCArtboard>

          <DCArtboard id="pack-dark" label={lang === 'zh' ? '打包清單 · 暗色' : 'Packing · Dark'} width={402} height={874}>
            <PhonePreset theme="dark" lang={lang} initial={{ tab: 'pack' }}/>
          </DCArtboard>
        </DCSection>

        <DCSection id="tablet" title={lang === 'zh' ? '平板版型 · 600 – 768px' : 'Tablet layout · 600 – 768px'}
          subtitle={lang === 'zh' ? '左側精簡導覽 + 主內容單欄；天數採水平捲動切換' : 'Compact rail nav + single-column content; day switcher scrolls horizontally'}>
          <DCArtboard id="tablet-trip-light" label={lang === 'zh' ? '行程 · 明亮' : 'Trip · Light'} width={720} height={900}>
            <TabletShell theme="light" lang={lang} initialTab="trip"/>
          </DCArtboard>
          <DCArtboard id="tablet-days-light" label={lang === 'zh' ? '每日 · Day 2' : 'Days · Day 2'} width={720} height={900}>
            <TabletShell theme="light" lang={lang} initialTab="days" initialDay={2}/>
          </DCArtboard>
          <DCArtboard id="tablet-explore-light" label={lang === 'zh' ? '探索 · 明亮' : 'Explore · Light'} width={720} height={900}>
            <TabletShell theme="light" lang={lang} initialTab="explore"/>
          </DCArtboard>
          <DCArtboard id="tablet-pack-light" label={lang === 'zh' ? '打包 · 明亮' : 'Pack · Light'} width={720} height={900}>
            <TabletShell theme="light" lang={lang} initialTab="pack"/>
          </DCArtboard>
          <DCArtboard id="tablet-trip-dark" label={lang === 'zh' ? '行程 · 暗色' : 'Trip · Dark'} width={720} height={900}>
            <TabletShell theme="dark" lang={lang} initialTab="trip"/>
          </DCArtboard>
          <DCArtboard id="tablet-explore-dark" label={lang === 'zh' ? '探索 · 暗色' : 'Explore · Dark'} width={720} height={900}>
            <TabletShell theme="dark" lang={lang} initialTab="explore"/>
          </DCArtboard>
        </DCSection>

        <DCSection id="desktop" title={lang === 'zh' ? '桌面版型 · 768px+' : 'Desktop layout · 768px+'}
          subtitle={lang === 'zh' ? '完整側邊導覽 + 第二欄（Day 1–7 / 景點清單 / 打包分類）+ 主內容' : 'Full sidebar + secondary rail (Day 1–7 / places / pack categories) + main pane'}>
          <DCArtboard id="desktop-trip-light" label={lang === 'zh' ? '行程總覽 · 明亮' : 'Trip · Light'} width={1280} height={840}>
            <DesktopShell theme="light" lang={lang} initialTab="trip"/>
          </DCArtboard>
          <DCArtboard id="desktop-days-light" label={lang === 'zh' ? '每日 · Day 2 · 明亮' : 'Days · Day 2 · Light'} width={1280} height={840}>
            <DesktopShell theme="light" lang={lang} initialTab="days" initialDay={2}/>
          </DCArtboard>
          <DCArtboard id="desktop-days-d4" label={lang === 'zh' ? '每日 · Day 4 · 明亮' : 'Days · Day 4 · Light'} width={1280} height={840}>
            <DesktopShell theme="light" lang={lang} initialTab="days" initialDay={4}/>
          </DCArtboard>
          <DCArtboard id="desktop-explore-light" label={lang === 'zh' ? '探索 · 明亮' : 'Explore · Light'} width={1280} height={840}>
            <DesktopShell theme="light" lang={lang} initialTab="explore"/>
          </DCArtboard>
          <DCArtboard id="desktop-pack-light" label={lang === 'zh' ? '打包 · 明亮' : 'Pack · Light'} width={1280} height={840}>
            <DesktopShell theme="light" lang={lang} initialTab="pack"/>
          </DCArtboard>
          <DCArtboard id="desktop-trip-dark" label={lang === 'zh' ? '行程總覽 · 暗色' : 'Trip · Dark'} width={1280} height={840}>
            <DesktopShell theme="dark" lang={lang} initialTab="trip"/>
          </DCArtboard>
          <DCArtboard id="desktop-days-dark" label={lang === 'zh' ? '每日 · Day 2 · 暗色' : 'Days · Day 2 · Dark'} width={1280} height={840}>
            <DesktopShell theme="dark" lang={lang} initialTab="days" initialDay={2}/>
          </DCArtboard>
          <DCArtboard id="desktop-explore-dark" label={lang === 'zh' ? '探索 · 暗色' : 'Explore · Dark'} width={1280} height={840}>
            <DesktopShell theme="dark" lang={lang} initialTab="explore"/>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label={lang === 'zh' ? '主題' : 'Theme'}>
          <TweakRadio label={lang === 'zh' ? '預設主題' : 'Default theme'}
            value={tweaks.theme} onChange={(v) => setTweak('theme', v)}
            options={[
              { value: 'light', label: lang === 'zh' ? '明亮' : 'Light' },
              { value: 'dark',  label: lang === 'zh' ? '暗色' : 'Dark' },
            ]}/>
          <TweakRadio label={lang === 'zh' ? '主色調' : 'Accent'}
            value={tweaks.accent} onChange={(v) => setTweak('accent', v)}
            options={[
              { value: 'sunset', label: lang === 'zh' ? '夕陽橘' : 'Sunset' },
              { value: 'teal',   label: lang === 'zh' ? '潟湖青' : 'Lagoon' },
              { value: 'rose',   label: lang === 'zh' ? '暮色玫瑰' : 'Rose' },
              { value: 'violet', label: lang === 'zh' ? '紫暮' : 'Violet' },
            ]}/>
        </TweakSection>
        <TweakSection label={lang === 'zh' ? '形狀與感覺' : 'Shape & feel'}>
          <TweakSlider label={lang === 'zh' ? '玻璃模糊強度' : 'Glass blur'} min={2} max={36} step={1}
            value={tweaks.blur} onChange={(v) => setTweak('blur', v)} unit="px"/>
          <TweakSlider label={lang === 'zh' ? '卡片圓角' : 'Card radius'} min={6} max={36} step={1}
            value={tweaks.radius} onChange={(v) => setTweak('radius', v)} unit="px"/>
          <TweakSlider label={lang === 'zh' ? '字體大小' : 'Font size'} min={13} max={18} step={1}
            value={tweaks.fontSize} onChange={(v) => setTweak('fontSize', v)} unit="px"/>
        </TweakSection>
        <TweakSection label={lang === 'zh' ? '語言' : 'Language'}>
          <TweakRadio label={lang === 'zh' ? '介面語言' : 'Interface'}
            value={tweaks.language} onChange={(v) => setTweak('language', v)}
            options={[
              { value: 'en', label: 'English' },
              { value: 'zh', label: '中文' },
            ]}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// PhonePreset boots a phone into a specific tab/route
function PhonePreset({ theme, lang, initial }) {
  const [tab, setTab] = useState(initial.tab || 'trip');
  const [route, setRoute] = useState(initial.route || { name: 'tab' });
  const dark = theme === 'dark';
  return (
    <div data-theme={theme} style={{ width: 402, height: 874 }}>
      <IOSDevice width={402} height={874} dark={dark}>
        <div className="app" style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
          <div className="app-bg"/>
          <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
            {route.name === 'tab' && tab === 'trip' && (
              <HomeScreen lang={lang} dark={dark}
                onOpenDay={(n) => setRoute({ name: 'day', n })} onExplore={() => setTab('explore')}/>
            )}
            {route.name === 'tab' && tab === 'days' && (
              <DayScreen lang={lang} dark={dark} dayN={1}
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
            {route.name === 'day' && (
              <DayScreen lang={lang} dark={dark} dayN={route.n}
                onBack={() => setRoute({ name: 'tab' })} onPickStop={() => {}}/>
            )}
            {route.name === 'detail' && (
              <DetailScreen lang={lang} dark={dark} poi={route.poi}
                onBack={() => setRoute({ name: 'tab' })}/>
            )}
          </div>
          {route.name === 'tab' && (
            <TabBar active={tab} onChange={setTab} t={STRINGS[lang]}/>
          )}
        </div>
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
