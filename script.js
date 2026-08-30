let currentFilter = "all";

const $ = (id) => document.getElementById(id);
const fmt = (n) => new Intl.NumberFormat("en-US").format(Math.round(Number(n) || 0));
const compact = (n) => {
  n = Number(n) || 0;
  if (n >= 1e9) return (n/1e9).toFixed(n >= 1e10 ? 0 : 2) + "B";
  if (n >= 1e6) return (n/1e6).toFixed(n >= 1e8 ? 0 : 1) + "M";
  if (n >= 1e3) return (n/1e3).toFixed(n >= 1e5 ? 0 : 1) + "K";
  return fmt(n);
};

function nowWIB(){
  return new Intl.DateTimeFormat("id-ID", {
    timeZone:"Asia/Jakarta", hour:"2-digit", minute:"2-digit", second:"2-digit",
    day:"2-digit", month:"short", year:"numeric"
  }).format(new Date());
}

function totals(){
  const spotify = CONFIG.releases.reduce((a,r)=>a+(r.spotify?.total||0),0);
  const youtube = CONFIG.releases.reduce((a,r)=>a+(r.youtube?.total||0),0);
  const spotifyDaily = CONFIG.releases.reduce((a,r)=>a+(r.spotify?.daily||0),0);
  const youtubeDaily = CONFIG.releases.reduce((a,r)=>a+(r.youtube?.daily||0),0);
  return {spotify,youtube,spotifyDaily,youtubeDaily};
}

function renderSummary(){
  const t = totals();
  $("spotifyTotal").textContent = compact(t.spotify);
  $("youtubeTotal").textContent = compact(t.youtube);
  $("spotifyDaily").textContent = "+" + fmt(t.spotifyDaily);
  $("youtubeDaily").textContent = "+" + fmt(t.youtubeDaily);

  const max = Math.max(1, CONFIG.target);
  const pct = Math.min(100, (t.spotify/max)*100);
  $("targetProgress").textContent = pct.toFixed(1) + "%";
  $("targetLabel").textContent = "Target " + compact(CONFIG.target);
  $("targetBar").style.width = pct + "%";
}

function releaseCard(r){
  const cover = r.cover
    ? `<img src="${r.cover}" alt="">`
    : `<span>♪</span>`;
  return `
    <article class="release" data-platform="${r.youtube.total ? "youtube" : "spotify"}">
      <div class="cover">${cover}</div>
      <div>
        <h3>${r.title}</h3>
        <div class="artist">${r.artist}</div>
        <div class="stats">
          <div class="stat">
            <b>${fmt(r.spotify.total)}</b>
            <span>SPOTIFY STREAMS</span>
            <span class="mini-gain">▲ ${fmt(r.spotify.daily)} today</span>
          </div>
          <div class="stat">
            <b>${r.youtube.total ? fmt(r.youtube.total) : "—"}</b>
            <span>YOUTUBE VIEWS</span>
            ${r.youtube.total ? `<span class="mini-gain">▲ ${fmt(r.youtube.daily)} today</span>` : ""}
          </div>
        </div>
      </div>
    </article>`;
}

function renderReleases(){
  const grid = $("releaseGrid");
  grid.innerHTML = CONFIG.releases.map(releaseCard).join("");
  [...grid.children].forEach(card=>{
    if(currentFilter !== "all" && card.dataset.platform !== currentFilter) card.classList.add("hidden");
  });
}

function renderRanking(){
  const rows = [...CONFIG.releases]
    .sort((a,b)=>(b.spotify.total+b.youtube.total)-(a.spotify.total+a.youtube.total));
  $("ranking").innerHTML = rows.map((r,i)=>`
    <div class="ranking-row">
      <div class="rank">#${i+1}</div>
      <div>
        <div class="rank-title">${r.title}</div>
        <div class="rank-sub">${r.artist}</div>
      </div>
      <div class="rank-value">${compact(r.spotify.total + r.youtube.total)}
        <small>combined display</small>
      </div>
    </div>`).join("");
}

function drawChart(type="spotify"){
  const canvas = $("chart");
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width*dpr; canvas.height = rect.height*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const w=rect.width,h=rect.height,pad={l:44,r:20,t:20,b:35};
  ctx.clearRect(0,0,w,h);

  const vals = CONFIG.history[type];
  const labels = CONFIG.history.labels;
  const max = Math.max(...vals)*1.12, min = Math.min(...vals)*.92;
  const x = i => pad.l + i*(w-pad.l-pad.r)/(vals.length-1);
  const y = v => h-pad.b - (v-min)*(h-pad.t-pad.b)/(max-min || 1);

  ctx.strokeStyle="rgba(255,255,255,.08)";
  ctx.lineWidth=1;
  for(let i=0;i<5;i++){
    const gy=pad.t+i*(h-pad.t-pad.b)/4;
    ctx.beginPath();ctx.moveTo(pad.l,gy);ctx.lineTo(w-pad.r,gy);ctx.stroke();
  }

  const grad=ctx.createLinearGradient(0,0,w,0);
  grad.addColorStop(0,"#ff5fa2"); grad.addColorStop(1,"#6c8cff");
  ctx.strokeStyle=grad;ctx.lineWidth=3;ctx.lineJoin="round";ctx.lineCap="round";
  ctx.beginPath();
  vals.forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v)));
  ctx.stroke();

  ctx.fillStyle="#ff5fa2";
  vals.forEach((v,i)=>{ctx.beginPath();ctx.arc(x(i),y(v),4,0,Math.PI*2);ctx.fill()});
  ctx.fillStyle="#8f9ac0";ctx.font="11px Inter";
  labels.forEach((lab,i)=>ctx.fillText(lab,x(i)-15,h-12));
  ctx.fillStyle="#f8f9ff";ctx.font="700 11px Inter";
  vals.forEach((v,i)=>{if(i===vals.length-1)ctx.fillText(compact(v),x(i)-28,y(v)-12)});
}

async function fetchYouTube(){
  if(!CONFIG.youtubeApiKey) return;
  const ids = CONFIG.releases.map(r=>r.youtube.videoId).filter(Boolean).join(",");
  if(!ids) return;

  try{
    const url=`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${encodeURIComponent(ids)}&key=${encodeURIComponent(CONFIG.youtubeApiKey)}`;
    const res=await fetch(url);
    if(!res.ok) throw new Error("YouTube API request failed");
    const json=await res.json();
    (json.items||[]).forEach(item=>{
      const r=CONFIG.releases.find(x=>x.youtube.videoId===item.id);
      if(r) r.youtube.total=Number(item.statistics.viewCount||0);
    });
    renderAll();
  }catch(err){ console.warn(err); }
}

function renderAll(){
  renderSummary(); renderReleases(); renderRanking();
  $("lastUpdate").textContent=nowWIB();
  drawChart($("chartSelect").value);
}

document.querySelectorAll(".filter").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    currentFilter=btn.dataset.filter;
    renderReleases();
  });
});

$("chartSelect").addEventListener("change",e=>drawChart(e.target.value));
$("refreshBtn").addEventListener("click", async ()=>{
  $("refreshBtn").disabled=true;
  $("refreshBtn").style.opacity=.6;
  await fetchYouTube();
  renderAll();
  setTimeout(()=>{$("refreshBtn").disabled=false;$("refreshBtn").style.opacity=1},500);
});

window.addEventListener("resize",()=>drawChart($("chartSelect").value));
$("year").textContent=new Date().getFullYear();
renderAll();
fetchYouTube();
