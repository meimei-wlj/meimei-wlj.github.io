'use client';

import {type ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {portfolioContent} from '../lib/content';

type View = 'home' | 'index' | 'writing' | 'photography' | 'design';
type LightboxItem = {src: string; alt: string; label: string};
type HistoryState = {view: View; lightbox?: LightboxItem};
type BookItem = {type: string; overline: string; title: string; note: string};
type TurnState = {direction: 1 | -1; target: number; dragging: boolean};

const assets = {
  meadow: '/assets/tv-meadow-print-v4.webp',
  television: '/assets/television-light-v3.webp',
  botanical: '/assets/botanical-line-v3.webp',
  catPoster: '/assets/cat-poster-v3.webp',
  catIdle: '/assets/cat-idle-atlas-v3.webp',
} as const;

const rooms = [
  {id: 'writing' as const, no: '01', zh: '文案', en: 'WRITING'},
  {id: 'photography' as const, no: '02', zh: '摄影', en: 'PHOTOGRAPHY'},
  {id: 'design' as const, no: '03', zh: '设计', en: 'DESIGN'},
];

const emptyBook: BookItem[] = [
  {type: 'title', overline: 'MABEL / WRITING', title: '文案', note: '一册等待文字进入的软封艺术家书。'},
  {type: 'blank', overline: 'INSIDE COVER', title: '', note: ''},
  {type: 'chapter', overline: '01 / TEXT', title: '文案待导入', note: '公开文案文件到达后，将依照原文标题、段落与顺序分页，不改写内容。'},
  {type: 'end', overline: 'END PAPER', title: '待续', note: '文字会从这里继续生长。'},
];

function CatAnimation({paused}: {paused: boolean}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const node = canvas.current;
    const context = node?.getContext('2d');
    if (!node || !context) return;
    const idle = new Image();
    let stopped = false;
    let timer = 0;
    let raf = 0;
    let frame = 0;
    const draw = () => {
      if (!idle.naturalWidth) return;
      const sx = (frame % 8) * 300;
      const sy = Math.floor(frame / 8) * 200;
      context.clearRect(0, 0, 600, 400);
      context.drawImage(idle, sx, sy, 300, 200, 0, 0, 600, 400);
    };
    const schedule = () => {
      if (stopped || paused || document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      timer = window.setTimeout(() => {
        raf = requestAnimationFrame(() => {frame = (frame + 1) % 48; draw(); schedule();});
      }, 1000 / 12);
    };
    const start = async () => {
      try {await idle.decode();} catch {return;}
      if (stopped) return;
      draw(); setReady(true); schedule();
    };
    const visibility = () => {
      window.clearTimeout(timer); cancelAnimationFrame(raf);
      if (!document.hidden) schedule();
    };
    idle.src = assets.catIdle;
    start();
    document.addEventListener('visibilitychange', visibility);
    return () => {stopped = true; window.clearTimeout(timer); cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', visibility);};
  }, [paused]);
  return <span className={'cat-layer' + (ready ? ' is-ready' : '')}><img className="cat-fallback" src={assets.catPoster} alt=""/><canvas ref={canvas} className="cat-canvas" width="600" height="400" role="img" aria-label="黑白颗粒手绘小猫"/></span>;
}

function SceneHeader({room, onClose}: {room: string; onClose: () => void}) {
  return <header className="scene-header room-header"><div><span>mabel portfolio</span><small>{room} / SELECTED WORKS</small></div><button className="close-button" onClick={onClose} aria-label="返回作品选择"><span>×</span> 返回选择</button></header>;
}

function PageContent({item, number}: {item?: BookItem; number: number}) {
  if (!item) return null;
  return <><span className="page-overline">{item.overline}</span>{item.title && <h1>{item.title}</h1>}{item.note && <p>{item.note}</p>}<span className="folio">{String(number + 1).padStart(2, '0')}</span></>;
}

function paginateParagraphs(paragraphs: {text: string}[], limit = 290) {
  const pages: string[] = [];
  let current = '';
  const push = () => {if (current.trim()) pages.push(current.trim()); current = '';};
  paragraphs.forEach(({text}) => {
    const pieces = text.length > limit ? (text.match(/[^。！？；]+[。！？；]?/g) || [text]) : [text];
    pieces.forEach((piece) => {
      const next = current ? `${current}\n\n${piece}` : piece;
      if (next.length > limit && current) push();
      current = current ? `${current}\n\n${piece}` : piece;
    });
  });
  push();
  return pages;
}

function TurningPage({turn, front, back, frontNumber, backNumber}: {turn: TurnState; front?: BookItem; back?: BookItem; frontNumber: number; backNumber: number}) {
  return <div className={'turning-sheet ' + (turn.direction > 0 ? 'flip-next' : 'flip-previous')} aria-hidden="true">
    <article className="sheet-face sheet-front"><PageContent item={front} number={frontNumber}/><span className="page-glint"/></article>
    <article className="sheet-face sheet-back"><PageContent item={back} number={backNumber}/></article>
  </div>;
}

function WritingRoom() {
  const content: BookItem[] = portfolioContent.writing.length ? portfolioContent.writing.flatMap((work, index) => {
    const number = String(index + 1).padStart(2, '0');
    return [
      {type: index === 0 ? 'title' : 'chapter', overline: `MABEL / WRITING ${number}`, title: work.title, note: work.subtitle || ''},
      ...paginateParagraphs(work.body).map((note, pageIndex) => ({type: 'text', overline: `TEXT ${number} / ${String(pageIndex + 1).padStart(2, '0')}`, title: '', note})),
    ];
  }) : emptyBook;
  const total = content.length;
  const [opened, setOpened] = useState(() => typeof window !== 'undefined' && sessionStorage.getItem('mabel-book-open') === '1');
  const [opening, setOpening] = useState(false);
  const [page, setPage] = useState(() => typeof window === 'undefined' ? 0 : Math.min(total - 1, Number(sessionStorage.getItem('mabel-writing-page') || 0)));
  const [turn, setTurn] = useState<TurnState | null>(null);
  const [single, setSingle] = useState(() => typeof window !== 'undefined' && matchMedia('(max-width: 760px)').matches);
  const queued = useRef<1 | -1 | null>(null);
  useEffect(() => {
    const query = matchMedia('(max-width: 760px)'); const update = () => setSingle(query.matches);
    query.addEventListener('change', update); return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => sessionStorage.setItem('mabel-writing-page', String(page)), [page]);
  const step = single ? 1 : 2;
  const canTurn = useCallback((direction: 1 | -1) => {
    const target = Math.max(0, Math.min(total - 1, page + direction * step));
    return target === page ? null : target;
  }, [page, step, total]);
  const finish = useCallback((commit: boolean, state: TurnState) => {
    if (commit) setPage(state.target);
    setTurn(null);
    if (commit && queued.current) {
      const next = queued.current; queued.current = null;
      requestAnimationFrame(() => {
        const target = Math.max(0, Math.min(total - 1, state.target + next * step));
        if (target !== state.target) setTurn({direction: next, target, dragging: false});
      });
    }
  }, [step, total]);
  useEffect(() => {
    if (!turn) return;
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 720;
    const timer = window.setTimeout(() => finish(true, turn), duration);
    return () => window.clearTimeout(timer);
  }, [turn, finish]);
  const change = useCallback((direction: 1 | -1) => {
    const target = canTurn(direction); if (target === null) return;
    setTurn((current) => {
      if (current) {queued.current = direction; return current;}
      return {direction, target, dragging: false};
    });
  }, [canTurn]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {if (event.key === 'ArrowRight') change(1); if (event.key === 'ArrowLeft') change(-1);};
    addEventListener('keydown', key); return () => removeEventListener('keydown', key);
  }, [change]);
  const openBook = () => {if (opening) return; setOpening(true); window.setTimeout(() => {setOpened(true); setOpening(false); sessionStorage.setItem('mabel-book-open', '1');}, matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 820);};
  if (!opened) return <section className="writing-room room-body closed-book-stage"><div className={'book-opening-set' + (opening ? ' is-opening' : '')}><div className="book-block"/><button className="closed-book" onClick={openBook} aria-label="打开文案书"><span className="cover-overline">MABEL / WRITING</span><strong>文案</strong><em>点击打开</em><span className="cover-thread"/></button></div></section>;
  const frontNumber = turn ? (turn.direction > 0 ? page + (single ? 0 : 1) : page) : page;
  const backNumber = turn ? turn.target : page;
  return <section className="writing-room room-body">
    <div className={'book' + (single ? ' is-single' : '')}>
      {[0, 1].map((offset) => <article key={page + offset} className={'book-page base-page page-' + offset + (!content[page + offset] ? ' is-empty' : '')} onClick={() => change(offset === 0 ? -1 : 1)}><PageContent item={content[page + offset]} number={page + offset}/><span className="page-corner"/></article>)}
      {turn && <TurningPage turn={turn} front={content[frontNumber]} back={content[backNumber]} frontNumber={frontNumber} backNumber={backNumber}/>}<span className="book-spine" aria-hidden="true"/>
    </div>
    <div className="book-controls"><button onClick={() => change(-1)} disabled={page === 0}>上一页</button><span>{Math.min(page + 1, total)} / {total}</span><button onClick={() => change(1)} disabled={page >= total - step}>下一页</button></div>
  </section>;
}

function PhotographyRoom({open}: {open: (item: LightboxItem) => void}) {
  const images = portfolioContent.photography[0]?.images || [];
  const track = useRef<HTMLDivElement>(null); const frameRefs = useRef<Array<HTMLButtonElement | null>>([]); const raf = useRef(0); const [active, setActive] = useState(0);
  const findActive = useCallback(() => {
    const node = track.current; if (!node) return;
    const middle = node.scrollLeft + node.clientWidth / 2; let nearest = 0; let distance = Infinity;
    frameRefs.current.forEach((frame, index) => {if (!frame) return; const center = frame.offsetLeft + frame.offsetWidth / 2; if (Math.abs(center - middle) < distance) {distance = Math.abs(center - middle); nearest = index;}});
    setActive(nearest);
  }, []);
  useEffect(() => {
    const node = track.current; if (!node) return;
    node.scrollLeft = Number(sessionStorage.getItem('mabel-photo-scroll') || 0); findActive();
    let storageTimer = 0;
    const onScroll = () => {cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(findActive); window.clearTimeout(storageTimer); storageTimer = window.setTimeout(() => sessionStorage.setItem('mabel-photo-scroll', String(node.scrollLeft)), 160);};
    node.addEventListener('scroll', onScroll, {passive: true}); return () => {node.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf.current); window.clearTimeout(storageTimer);};
  }, [findActive]);
  const moveTo = (index: number) => frameRefs.current[Math.max(0, Math.min(images.length - 1, index))]?.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
  return <section className="photo-room room-body"><div className="section-intro photo-intro"><p className="kicker">PHOTO ARCHIVE / 01–05</p><h1>摄影</h1></div><div className="film-space"><div className="film-track" ref={track} tabIndex={0} aria-label="摄影作品横向胶片" onKeyDown={(event) => {if (event.key === 'ArrowRight') moveTo(active + 1); if (event.key === 'ArrowLeft') moveTo(active - 1);}}>
    {images.map((image, index) => {const distance = Math.min(2, Math.abs(index - active)); const label = `PHOTO ${String(index + 1).padStart(2, '0')}`; return <button ref={(node) => {frameRefs.current[index] = node;}} data-distance={distance} data-side={index < active ? 'left' : index > active ? 'right' : 'center'} className="film-frame" key={image.src} onClick={() => open({src: image.src, alt: image.alt, label})}><span className="sprocket sprocket-top"/><span className="sprocket sprocket-bottom"/><span className="film-number">{label} · MABEL</span><span className="film-image"><img src={image.previewSrc || image.src} width={image.width} height={image.height} alt={image.alt} loading={index > 1 ? 'lazy' : 'eager'} decoding="async"/></span></button>;})}
  </div></div><div className="film-controls"><button onClick={() => moveTo(active - 1)}>上一格</button><span>{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')} · 拖动胶片</span><button onClick={() => moveTo(active + 1)}>下一格</button></div></section>;
}

function DesignRoom({open}: {open: (item: LightboxItem) => void}) {
  const scroll = useRef<HTMLDivElement>(null); const botanical = useRef<HTMLDivElement>(null); const raf = useRef(0);
  useEffect(() => {
    const node = scroll.current; if (!node) return;
    node.scrollTop = Number(sessionStorage.getItem('mabel-design-scroll') || 0);
    let storageTimer = 0;
    const update = () => {if (botanical.current && !matchMedia('(prefers-reduced-motion: reduce)').matches && innerWidth > 760) botanical.current.style.transform = `translate3d(0, ${node.scrollTop * .18}px, 0)`;};
    const onScroll = () => {cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(update); window.clearTimeout(storageTimer); storageTimer = window.setTimeout(() => sessionStorage.setItem('mabel-design-scroll', String(node.scrollTop)), 180);};
    update(); node.addEventListener('scroll', onScroll, {passive: true}); return () => {node.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf.current); window.clearTimeout(storageTimer);};
  }, []);
  return <div className="design-scroll" ref={scroll}><section className="design-room room-body"><div className="botanical-layer" ref={botanical} aria-hidden="true"/><div className="work-layer"><header className="section-intro design-title"><p className="kicker">DESIGN ARCHIVE / 01–05</p><h1>设计</h1></header>
    {portfolioContent.design.map((project, index) => {const asset = project.assets[0]; return <article className={'design-project design-project-' + (index + 1)} key={project.slug}><button className="design-art" onClick={() => open({src: asset.src, alt: asset.alt, label: project.title})}><img src={asset.previewSrc || asset.src} alt={asset.alt} width={asset.width} height={asset.height} loading={index > 0 ? 'lazy' : 'eager'} decoding="async"/></button></article>;})}
    </div></section></div>;
}

function Lightbox({item, close}: {item: LightboxItem; close: () => void}) {const showLabel = !item.label.startsWith('DESIGN'); return <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.label}><button className="lightbox-close" onClick={close} aria-label="关闭大图">×</button><figure className={'lightbox-paper' + (showLabel ? '' : ' image-only')}><img src={item.src} alt={item.alt}/>{showLabel && <figcaption>{item.label}</figcaption>}</figure></div>;}

function HomeScene({paused, blurred, enter, togglePause}: {paused: boolean; blurred: boolean; enter: () => void; togglePause: () => void}) {
  return <main className={'home-scene' + (blurred ? ' is-background' : '')} aria-hidden={blurred}><div className="paper-grain" aria-hidden="true"/><img className="botanical-line" src={assets.botanical} alt=""/><span className="botanical-imprint" aria-hidden="true"/><div className="tv-stage"><button className="tv-entry" onClick={enter} aria-label="进入 Mabel 作品集"><img className="television" src={assets.television} alt="浅灰绿色复古电视，屏幕里有一只颗粒手绘小猫"/><span className="tv-screen"><img className="ascii-meadow" src={assets.meadow} alt=""/><CatAnimation paused={paused}/><span className="screen-noise"/><span className="enter-label">点击屏幕进入</span></span></button></div><h1 className="hero-title ink-title" data-text="mabel portfolio" aria-label="mabel portfolio">mabel portfolio</h1><div className="home-meta"><span>ARCHIVE / 2026</span><span>WRITING · PHOTOGRAPHY · DESIGN</span></div><button className="pause-button" onClick={togglePause} aria-pressed={paused}><span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>{paused ? '播放画面' : '暂停画面'}</button></main>;
}

function IndexOverlay({go, close}: {go: (view: View) => void; close: () => void}) {return <main className="index-overlay"><header className="scene-header"><div><span>mabel portfolio</span><small>SELECTED WORKS / 2026</small></div><button className="close-button" onClick={close} aria-label="返回电视首页"><span>×</span> 返回首页</button></header><section className="index-content" aria-label="作品目录"><p className="index-label">MABEL PORTFOLIO · CONTENTS</p><div className="paper-menu">{rooms.map((room, index) => <button key={room.id} className={'paper-card paper-card-' + (index + 1)} onClick={() => go(room.id)}><span className="paper-no">{room.no}</span><strong>{room.zh}</strong><em>{room.en}</em></button>)}</div></section></main>;}

export default function Portfolio() {
  const [view, setView] = useState<View>('home'); const [paused, setPaused] = useState(false); const [lightbox, setLightbox] = useState<LightboxItem | null>(null);
  useEffect(() => {history.replaceState({view: 'home'} satisfies HistoryState, ''); const onPop = (event: PopStateEvent) => {const state = event.state as HistoryState | null; setView(state?.view || 'home'); setLightbox(state?.lightbox || null);}; addEventListener('popstate', onPop); return () => removeEventListener('popstate', onPop);}, []);
  useEffect(() => {const onKey = (event: KeyboardEvent) => {if (event.key === 'Escape' && (lightbox || view !== 'home')) history.back();}; addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey);}, [view, lightbox]);
  const go = (next: View) => {history.pushState({view: next} satisfies HistoryState, ''); setView(next); setLightbox(null);};
  const open = (item: LightboxItem) => {history.pushState({view, lightbox: item} satisfies HistoryState, ''); setLightbox(item);};
  let room: ReactNode = null;
  if (view === 'writing') room = <main className="room-scene writing-scene"><SceneHeader room="WRITING" onClose={() => history.back()}/><WritingRoom/></main>;
  if (view === 'photography') room = <main className="room-scene photo-scene"><SceneHeader room="PHOTOGRAPHY" onClose={() => history.back()}/><PhotographyRoom open={open}/></main>;
  if (view === 'design') room = <main className="room-scene design-scene"><SceneHeader room="DESIGN" onClose={() => history.back()}/><DesignRoom open={open}/></main>;
  return <>{(view === 'home' || view === 'index') && <HomeScene paused={paused || view === 'index'} blurred={view === 'index'} enter={() => go('index')} togglePause={() => setPaused((value) => !value)}/>} {view === 'index' && <IndexOverlay go={go} close={() => history.back()}/>} {room}{lightbox && <Lightbox item={lightbox} close={() => history.back()}/>}</>;
}
