import React,{useEffect,useMemo,useState} from 'react';
import{createRoot}from'react-dom/client';
import{ChevronDown,Sun,Moon,ArrowRight,Copy,Check,Activity,Calculator,Shield,ChartNoAxesCombined,Menu,X,RotateCcw,Info,AlertTriangle,TrendingUp,BarChart3}from'lucide-react';
import'./styles.css';

const TOOL_DATA=[
{name:'Monte Carlo Simulator',slug:'monte-carlo',icon:ChartNoAxesCombined,desc:'Run randomized trade-path simulations and see how outcomes can vary.'},
{name:'Breakeven Win Rate',slug:'breakeven',icon:Calculator,desc:'Find the win rate needed to reach mathematical breakeven at a chosen RR.'},
{name:'Loss Streak Simulator',slug:'loss-streak',icon:Activity,desc:'Generate 50–500 trade sequences and inspect possible loss streaks.'},
{name:'Drawdown Simulator',slug:'drawdown',icon:Shield,desc:'Model static and intraday trailing drawdown trade by trade.'},
{name:'Consistency Calculator',slug:'consistency',icon:ChartNoAxesCombined,desc:'Work backwards from profit, biggest day and consistency limits.'},
{name:'Profit Split Calculator',slug:'profit-split',icon:Calculator,desc:'Calculate trader payout from net profit and your profit split.'}
];

const INSTRUMENTS=['XAUUSD','NAS100','US30','BTCUSD','EURUSD','GBPUSD','SPX500','USDJPY'];
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(Number(n)||0);
const pct=n=>`${Number(n||0).toFixed(2)}%`;
const num=v=>Number(v)||0;

function App(){
 const[dark,setDark]=useState(()=>localStorage.getItem('tee-theme')!=='light');
 const[mobile,setMobile]=useState(false);
 const[route,setRoute]=useState(()=>location.hash.replace('#/','')||'home');
 useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';localStorage.setItem('tee-theme',dark?'dark':'light')},[dark]);
 useEffect(()=>{const fn=()=>setRoute(location.hash.replace('#/','')||'home');addEventListener('hashchange',fn);return()=>removeEventListener('hashchange',fn)},[]);
 const navigate=slug=>{location.hash=slug==='home'?'':'/'+slug;setMobile(false)};
 return <div className="site"><Background dark={dark}/><Header dark={dark} setDark={setDark} mobile={mobile} setMobile={setMobile} navigate={navigate}/>
 {route==='home'?<Home navigate={navigate}/>:<ToolPage slug={route} navigate={navigate}/>}
 <Footer navigate={navigate}/></div>
}

function Header({dark,setDark,mobile,setMobile,navigate}){
 return <header className="header"><button className="brand" onClick={()=>navigate('home')}><span className="brand-mark">T</span><span>TheEntryExit</span></button>
 <nav className={mobile?'nav open':'nav'}><Dropdown label="Tools" items={TOOL_DATA.map(t=>({label:t.name,action:()=>navigate(t.slug)}))}/><Dropdown label="Prop Firms" items={[{label:'Prop Firm Offers',action:()=>document.getElementById('firms')?.scrollIntoView()}]}/><button className="nav-link" onClick={()=>document.getElementById('resources')?.scrollIntoView()}>Resources</button><Dropdown label="Social" items={[{label:'YouTube',action:()=>{}},{label:'X / Twitter',action:()=>{}},{label:'Discord',action:()=>{}}]}/></nav>
 <div className="header-actions"><button className="theme" onClick={()=>setDark(!dark)} aria-label="Toggle theme">{dark?<Sun size={18}/>:<Moon size={18}/>}</button><button className="mobile-toggle" onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button></div></header>
}

function Dropdown({label,items}){return <details className="dropdown"><summary>{label}<ChevronDown size={14}/></summary><div className="dropdown-menu">{items.map((x,i)=><button key={i} onClick={e=>{e.preventDefault();x.action?.()}}>{x.label}</button>)}</div></details>}

function Home({navigate}){
 const[copied,setCopied]=useState('');
 const copy=c=>{navigator.clipboard?.writeText(c);setCopied(c);setTimeout(()=>setCopied(''),1400)};
 return <main>
 <section className="hero"><div className="hero-glow"/><div className="eyebrow"><span className="pulse"/>TRADING COMMAND CENTER</div><h1>Trade beyond<br/><span>the obvious.</span></h1><p>Simulators, calculators and prop-firm tools built to help traders understand the numbers behind every decision.</p><div className="hero-actions"><button className="primary" onClick={()=>document.getElementById('tools')?.scrollIntoView()}>Explore Tools <ArrowRight size={17}/></button><button className="secondary" onClick={()=>document.getElementById('firms')?.scrollIntoView()}>View Prop Firms</button></div></section>
 <section className="promo"><div><span className="promo-kicker">PROP FIRM DEALS</span><strong>Verified offers will appear here as they are added.</strong></div><button onClick={()=>document.getElementById('firms')?.scrollIntoView()}>View offers <ArrowRight size={16}/></button></section>
 <section className="ticker" aria-label="Market instruments">{[...INSTRUMENTS,...INSTRUMENTS].map((x,i)=><span key={x+i}><b>{x}</b><em>MARKET</em></span>)}</section>
 <section id="tools" className="section"><div className="section-head"><div><span className="eyebrow">THE TOOLKIT</span><h2>Numbers in.<br/><span>Clarity out.</span></h2></div><span className="section-note">6 tools ready</span></div><div className="tool-grid">{TOOL_DATA.map((t,i)=><ToolCard key={t.slug} tool={t} index={i} navigate={navigate}/>)}</div></section>
 <section id="firms" className="section"><div className="section-head"><div><span className="eyebrow">PROP FIRMS</span><h2>Current <span>offers.</span></h2></div></div><div className="empty-offers"><div className="icon-box"><Shield size={21}/></div><div><h3>No verified offers added yet</h3><p>Prop-firm cards are designed for logo, name, discount and either Copy Code or Go to Firm. Add verified data here when ready.</p></div></div></section>
 <section id="resources" className="resources"><div className="resource-inner"><span className="eyebrow">TRADING RESOURCES</span><h2>Built next,<br/><span>without the noise.</span></h2><p>Guides, market references and educational resources will be added after the core simulator suite.</p></div></section>
 </main>
}

function ToolCard({tool,index,navigate}){const Icon=tool.icon;return <button className="tool-card" onClick={()=>navigate(tool.slug)}><div className="tool-number">0{index+1}</div><div className="icon-box"><Icon size={20}/></div><h3>{tool.name}</h3><p>{tool.desc}</p><span className="card-arrow"><ArrowRight size={17}/></span></button>}

function ToolPage({slug,navigate}){
 const tool=TOOL_DATA.find(t=>t.slug===slug);
 if(!tool)return <main className="not-found"><h1>Tool not found</h1><button className="primary" onClick={()=>navigate('home')}>Back home</button></main>;
 const Icon=tool.icon;
 return <main className="tool-page"><div className="tool-page-head"><button className="back-link" onClick={()=>navigate('home')}>← All tools</button><div className="tool-title"><div className="icon-box"><Icon size={22}/></div><div><span className="eyebrow">THEENTRYEXIT TOOL</span><h1>{tool.name}</h1><p>{tool.desc}</p></div></div></div>{slug==='monte-carlo'?<MonteCarlo/>:slug==='breakeven'?<Breakeven/>:slug==='loss-streak'?<LossStreak/>:slug==='drawdown'?<Drawdown/>:slug==='consistency'?<Consistency/>:<ProfitSplit/>}</main>
}

function Panel({children,title}){return <section className="panel"><div className="panel-title">{title}</div>{children}</section>}
function Field({label,value,onChange,step='1',min='0',max,help}){return <label className="field"><span>{label}</span><input type="number" value={value} min={min} max={max} step={step} onChange={e=>onChange(e.target.value)}/>{help&&<small>{help}</small>}</label>}
function ToolLayout({inputs,output}){return <div className="tool-layout"><div className="tool-inputs">{inputs}</div><div className="tool-output">{output}</div></div>}

function MonteCarlo(){
 const[w,setW]=useState(50),[rr,setRr]=useState(1),[trades,setTrades]=useState(200),[sims,setSims]=useState(1000),[seed,setSeed]=useState(1);
 const result=useMemo(()=>{let finals=[],maxDD=[],best=0,worst=0;for(let s=0;s<sims;s++){let eq=0,peak=0,dd=0;for(let i=0;i<trades;i++){eq+=Math.random()*100<w?rr: -1;peak=Math.max(peak,eq);dd=Math.max(dd,peak-eq)}finals.push(eq);maxDD.push(dd)}finals.sort((a,b)=>a-b);return{median:finals[Math.floor(finals.length/2)],p10:finals[Math.floor(finals.length*.1)],p90:finals[Math.floor(finals.length*.9)],avg:finals.reduce((a,b)=>a+b,0)/finals.length,dd:maxDD.reduce((a,b)=>a+b,0)/maxDD.length};},[w,rr,trades,sims,seed]);
 return <ToolLayout inputs={<Panel title="Simulation settings"><Field label="Win rate %" value={w} onChange={setW} step=".1" max="100"/><Field label="Risk / reward" value={rr} onChange={setRr} step=".1"/><Field label="Trades per simulation" value={trades} onChange={setTrades} min="10" max="5000"/><Field label="Simulations" value={sims} onChange={setSims} min="100" max="10000" step="100"/><button className="primary wide" onClick={()=>setSeed(seed+1)}>Generate fresh simulation <RotateCcw size={16}/></button><small className="hint">Each unit represents 1R. Results are probabilistic, not predictions.</small></Panel>} output={<><Stats cards={[['Median outcome',`${result.median.toFixed(1)}R`],['10th percentile',`${result.p10.toFixed(1)}R`],['90th percentile',`${result.p90.toFixed(1)}R`],['Avg max DD',`${result.dd.toFixed(1)}R`]]}/><Distribution result={result}/></>}/>
}

function Distribution({result}){return <Panel title="Simulation range"><div className="range-chart"><div className="range-line"/><div className="range-marker m10"><span>P10</span><b>{result.p10.toFixed(1)}R</b></div><div className="range-marker med"><span>MEDIAN</span><b>{result.median.toFixed(1)}R</b></div><div className="range-marker m90"><span>P90</span><b>{result.p90.toFixed(1)}R</b></div></div><div className="explain"><Info size={16}/> Run Generate again to create a fresh randomized path set.</div></Panel>}

function Breakeven(){
 const[rr,setRr]=useState(1),[cost,setCost]=useState(0);const win=(1+cost)/(rr+1+cost)*100;
 return <ToolLayout inputs={<Panel title="Inputs"><Field label="Risk / reward (R)" value={rr} onChange={setRr} step=".1" min=".01"/><Field label="Cost per trade (R)" value={cost} onChange={setCost} step=".01"/><div className="formula">Breakeven = (1R + cost) ÷ (RR + 1R + cost)</div></Panel>} output={<Panel title="Breakeven result"><div className="big-result">{pct(win)}</div><p className="muted">Required win rate before any additional edge, slippage or execution differences.</p><div className="result-row"><span>RR</span><b>{num(rr).toFixed(2)}R</b></div><div className="result-row"><span>Cost</span><b>{num(cost).toFixed(2)}R</b></div></Panel>}/>
}

function LossStreak(){
 const[w,setW]=useState(50),[rr,setRr]=useState(1),[trades,setTrades]=useState(100),[seed,setSeed]=useState(0);
 const sim=useMemo(()=>{let arr=[],streak=0,max=0;for(let i=0;i<trades;i++){const win=Math.random()*100<w;arr.push(win?'W':'L');streak=win?0:streak+1;max=Math.max(max,streak)}return{arr,max};},[w,trades,seed]);
 const stats=useMemo(()=>{let mins=Infinity,maxs=0,total=0;for(let s=0;s<1000;s++){let streak=0,max=0;for(let i=0;i<trades;i++){const win=Math.random()*100<w;streak=win?0:streak+1;max=Math.max(max,streak)}mins=Math.min(mins,max);maxs=Math.max(maxs,max);total+=max}return{min:mins,avg:total/1000,max:maxs}},[w,trades,seed]);
 const pages=Math.ceil(sim.arr.length/50);
 return <ToolLayout inputs={<Panel title="Simulation settings"><Field label="Win rate %" value={w} onChange={setW} step=".1" max="100"/><Field label="Risk / reward" value={rr} onChange={setRr} step=".1"/><Field label="Number of trades" value={trades} onChange={setTrades} min="50" max="500" step="10"/><button className="primary wide" onClick={()=>setSeed(seed+1)}>Generate fresh data <RotateCcw size={16}/></button><small className="hint">The streak distribution uses 1,000 fresh simulated paths. The displayed sequence is one generated path.</small></Panel>} output={<><Stats cards={[['Minimum streak',`${stats.min} trades`],['Average streak',`${stats.avg.toFixed(2)} trades`],['Maximum streak',`${stats.max} trades`],['RR',`${num(rr).toFixed(2)}R`]]}/><Panel title="One simulated trade sequence"><div className="trade-grid">{sim.arr.map((x,i)=><span className={x==='W'?'trade win':'trade loss'} key={i}>{x}</span>)}</div><div className="pagination-note">{pages} page{pages>1?'s':''} • 50 trades per page • W = win, L = loss</div></Panel></>}/>
}

function Drawdown(){
 const[balance,setBalance]=useState(10000),[type,setType]=useState('static'),[ddPct,setDdPct]=useState(3),[trades,setTrades]=useState('200,-100,300,-300');
 const values=trades.split(',').map(Number).filter(Number.isFinite);let equity=balance,high=balance,breach=false,breachAt=-1,points=[];const limit=balance*(ddPct/100);
 values.forEach((p,i)=>{equity+=p;high=Math.max(high,equity);const floor=type==='static'?balance-limit:high-limit;const ok=equity>floor;if(!ok&&!breach){breach=true;breachAt=i+1}points.push({equity,floor,p})});
 const current=points.at(-1)?.equity??balance;
 return <ToolLayout inputs={<Panel title="Drawdown settings"><Field label="Starting balance" value={balance} onChange={setBalance} step="100"/><label className="field"><span>Drawdown type</span><select value={type} onChange={e=>setType(e.target.value)}><option value="static">Static</option><option value="trailing">Intraday trailing</option></select><small>{type==='static'?'The floor stays fixed from the starting balance.':'The floor follows the highest equity/high-water mark.'}</small></label><Field label="Drawdown %" value={ddPct} onChange={setDdPct} step=".1" max="100"/><label className="field"><span>Trade outcomes, comma separated</span><textarea value={trades} onChange={e=>setTrades(e.target.value)}/><small>Example: 200,-100,300,-300</small></label></Panel>} output={<><Stats cards={[['Current equity',money(current)],['DD limit',money(limit)],['Mode',type==='static'?'Static':'Trailing'],['Status',breach?'BREACHED':'Active']]}/><Panel title="Live equity path"><div className="equity-chart">{points.length?points.map((p,i)=><div className={p.equity<=p.floor?'equity-point breach':'equity-point'} key={i} style={{height:`${Math.max(8,Math.min(100,(p.equity/balance)*70+20))}%`}} title={`Trade ${i+1}: ${money(p.equity)}`}/> : <span className="muted">Add trade outcomes.</span>}</div>{breach&&<div className="alert"><AlertTriangle size={18}/><div><b>Drawdown breached on trade {breachAt}.</b><span>The account equity crossed the applicable drawdown floor after that trade.</span></div></div>}<div className="dd-rule"><span>Current floor</span><b>{money(points.at(-1)?.floor??(balance-limit))}</b></div></Panel></>}/>
}

function Consistency(){
 const[mode,setMode]=useState('biggest'),[account,setAccount]=useState(10000),[biggest,setBiggest]=useState(250),[net,setNet]=useState(500),[score,setScore]=useState(50),[days,setDays]=useState('100,80,-20,150');
 const daily=days.split(',').map(Number).filter(Number.isFinite),total=daily.reduce((a,b)=>a+b,0),positive=Math.max(...daily,0),actual=total>0?positive/total*100:0;
 let result=0,label='',extra='';
 if(mode==='biggest'){result=score>0?biggest/(score/100):0;label='Minimum net profit required';extra=`Your biggest day of ${money(biggest)} cannot exceed ${pct(score)} of net profit.`}else if(mode==='net'){result=net*(score/100);label='Maximum allowed biggest day';extra=`At ${money(net)} net profit, a ${pct(score)} consistency limit allows a biggest day up to this amount.`}else {result=actual;label='Current consistency';const requiredTotal=score>0?positive/(score/100):Infinity;const needed=Math.max(0,requiredTotal-total);extra=actual<=score?'You are within the target.':`You need approximately ${money(needed)} more net profit while keeping the current biggest day unchanged.`}
 return <ToolLayout inputs={<Panel title="Consistency mode"><label className="field"><span>Mode</span><select value={mode} onChange={e=>setMode(e.target.value)}><option value="biggest">Biggest day → required net profit</option><option value="net">Net profit → maximum biggest day</option><option value="check">Check daily P&L</option></select></label>{mode==='biggest'?<><Field label="Biggest day $" value={biggest} onChange={setBiggest} step="10"/><Field label="Consistency limit %" value={score} onChange={setScore} step="1" max="100"/><Field label="Account size $" value={account} onChange={setAccount} step="100"/><small className="hint">Account size is recorded for context and does not change the basic ratio.</small></>:mode==='net'?<><Field label="Desired net profit $" value={net} onChange={setNet} step="10"/><Field label="Consistency limit %" value={score} onChange={setScore} step="1" max="100"/><Field label="Account size $" value={account} onChange={setAccount} step="100"/></>:<><Field label="Target consistency %" value={score} onChange={setScore} step="1" max="100"/><label className="field"><span>Daily net P&L</span><textarea value={days} onChange={e=>setDays(e.target.value)}/><small>Example: 100,80,-20,150</small></label></>}</Panel>} output={<Panel title="Result"><div className="big-result">{mode==='check'?pct(result):money(result)}</div><h3>{label}</h3>{mode==='check'&&<div className={actual<=score?'status-ok':'status-warn'}>{extra}</div>}<p className="muted">{mode!=='check'?extra:''}</p><p className="muted">This calculator uses biggest positive day ÷ total net profit. Confirm the exact formula used by the specific prop firm before relying on the result.</p></Panel>}/>
}

function ProfitSplit(){
 const[profit,setProfit]=useState(1000),[split,setSplit]=useState(80);const payout=profit*split/100;
 return <ToolLayout inputs={<Panel title="Payout inputs"><Field label="Net profit $" value={profit} onChange={setProfit} step="10"/><Field label="Trader profit split %" value={split} onChange={setSplit} step="1" max="100"/></Panel>} output={<Panel title="Payout"><div className="big-result">{money(payout)}</div><div className="result-row"><span>Trader share</span><b>{pct(split)}</b></div><div className="result-row"><span>Firm share</span><b>{money(profit-payout)}</b></div><div className="result-row"><span>Total profit</span><b>{money(profit)}</b></div></Panel>}/>
}

function Stats({cards}){return <div className="stats">{cards.map(([a,b])=><div className="stat" key={a}><span>{a}</span><b>{b}</b></div>)}</div>}
function Background({dark}){return <div className="space-bg" aria-hidden="true"><div className="stars"/><div className="nebula n1"/><div className="nebula n2"/><div className="sun"/><div className="orbit o1"/><div className="orbit o2"/><div className="planet"/></div>}
function Footer({navigate}){return <footer><div className="footer-brand"><button className="brand" onClick={()=>navigate('home')}><span className="brand-mark">T</span><span>TheEntryExit</span></button><p>A trading command center for better decisions.</p></div><div className="footer-links"><button onClick={()=>document.getElementById('tools')?.scrollIntoView()}>Tools</button><button onClick={()=>document.getElementById('firms')?.scrollIntoView()}>Prop Firms</button><button onClick={()=>{}}>Contact Us</button><Dropdown label="Social" items={[{label:'YouTube',action:()=>{}},{label:'X / Twitter',action:()=>{}},{label:'Discord',action:()=>{}}]}/></div><div className="copyright">© 2026 TheEntryExit</div></footer>}
createRoot(document.getElementById('root')).render(<App/>);