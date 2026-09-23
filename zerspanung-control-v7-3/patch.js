(function(){
  const MEDIA_STORE='zc-v7-media-v2';
  const HAAS_5AXIS='https://www.haascnc.com/content/dam/haascnc/service/guides/how-to/umc-750---service---general-information/Sheet-Metal-Removed2.png';
  const HAAS_UMC='https://www.haascnc.com/content/dam/haascnc/pdp_feed/machines/UMC-500.png';
  const HAAS_VF='https://www.haascnc.com/content/dam/haascnc/pdp_feed/machines/VF-2.png';

  const style=document.createElement('style');
  style.textContent=`
    .zc-media-actions{display:flex;gap:7px;flex-wrap:wrap;margin:8px 0}
    .zc-media-input{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none}
    .zc-media-gallery,.zc-examples{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:9px}
    .zc-media-card,.zc-example{border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fff}
    .zc-media-card img,.zc-example img{display:block;width:100%;height:150px;object-fit:cover;background:#f8fafc}
    .zc-media-copy,.zc-example-copy{padding:8px}.zc-media-copy b,.zc-example-copy b{font-size:9px;display:block}
    .zc-media-copy small,.zc-example-copy small{font-size:8px;color:var(--muted);display:block;margin-top:2px;line-height:1.35}
    .zc-media-empty{padding:13px;border:1px dashed #cbd5e1;border-radius:9px;text-align:center;color:var(--muted);font-size:9px;background:#fafcff}
    @media(max-width:760px){.zc-media-gallery,.zc-examples{grid-template-columns:1fr}.zc-media-card img,.zc-example img{height:190px}}
  `;
  document.head.appendChild(style);

  function loadMedia(){try{return JSON.parse(localStorage.getItem(MEDIA_STORE)||'{}')}catch(e){return{}}}
  let media=loadMedia();
  function list(id,type){media[id]=media[id]||{fixture:[],tools:[]};media[id][type]=media[id][type]||[];return media[id][type]}
  function saveMedia(){try{localStorage.setItem(MEDIA_STORE,JSON.stringify(media));return true}catch(e){alert('Der lokale Fotospeicher ist voll. Bitte ein Foto löschen und erneut versuchen.');return false}}

  function toolSvg(){
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560" viewBox="0 0 900 560">
      <rect width="900" height="560" fill="#eef2f7"/><rect x="55" y="55" width="790" height="450" rx="24" fill="white" stroke="#d9e1eb" stroke-width="5"/>
      <text x="85" y="105" font-family="Arial" font-size="30" font-weight="700" fill="#172033">Beispiel-Werkzeugsatz Haas</text>
      ${[['T01',160,85],['T05',340,58],['T06',520,72],['T12',700,48]].map(([t,x,h],i)=>`<g><rect x="${x-55}" y="365" width="110" height="75" rx="12" fill="#263447"/><path d="M ${x-30} 365 L ${x-18} 225 L ${x+18} 225 L ${x+30} 365 Z" fill="#aeb8c5"/><rect x="${x-18}" y="${225-h}" width="36" height="${h}" rx="8" fill="#566273"/><path d="M ${x-18} ${225-h+15} Q ${x} ${225-h-6} ${x+18} ${225-h+15}" fill="none" stroke="#dce3ea" stroke-width="6"/><text x="${x}" y="415" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700" fill="white">${t}</text></g>`).join('')}
      <text x="85" y="480" font-family="Arial" font-size="20" fill="#667085">Planfräser · VHM-Fräser · Schlichtfräser · Bohrer</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  }
  const TOOL_EXAMPLE=toolSvg();

  function exampleHtml(j,type){
    let items=[];
    if(type==='fixture'){
      if(j.m==='M01') items=[['Haas 5-Achs – Innenraum / Tisch',HAAS_5AXIS,'Referenz für Tisch, Spindel und 5-Achs-Maschinenraum.'],['Haas UMC – Maschinenreferenz',HAAS_UMC,'Beispiel für die zugehörige Haas-UMC-Bauart.']];
      else if(j.m==='M02') items=[['Haas 3-Achs – Maschinenreferenz',HAAS_VF,'Referenz für eine klassische Haas-Vertikalfräsmaschine.']];
      else items=[['Haas Fräsmaschine – Referenz',HAAS_5AXIS,'Für Drehmaschinen am besten später ein eigenes Foto hinterlegen.']];
    } else items=[['Werkzeugbeispiel mit T-Plätzen',TOOL_EXAMPLE,'T01, T05, T06 und T12 als Beispiel für eine klar vorbereitete Werkzeugliste.']];
    return `<div class="zc-examples">${items.map(x=>`<div class="zc-example"><img src="${x[1]}" alt="${x[0]}"><div class="zc-example-copy"><b>${x[0]}</b><small>${x[2]}</small></div></div>`).join('')}</div>`;
  }

  function mediaPanel(j,type){
    const arr=list(j.id,type), title=type==='fixture'?'Fotos der Aufspannung':'Werkzeugfotos';
    return `<div class="subpanel"><h3>${title}</h3><div class="zc-media-actions">
      <label class="btn small">📷 Foto aufnehmen<input class="zc-media-input" type="file" accept="image/*" capture="environment" onchange="zcAddMedia('${j.id}','${type}',this.files)"></label>
      <label class="btn small">🖼 Mediathek<input class="zc-media-input" type="file" accept="image/*" multiple onchange="zcAddMedia('${j.id}','${type}',this.files)"></label>
    </div>${arr.length?`<div class="zc-media-gallery">${arr.map((p,i)=>`<div class="zc-media-card"><img src="${p.data}" alt="Eigenes Foto"><div class="zc-media-copy"><b>${p.name||'Eigenes Foto'}</b><small>${p.created||''}</small><button class="btn small danger" style="margin-top:7px" onclick="zcRemoveMedia('${j.id}','${type}',${i})">Entfernen</button></div></div>`).join('')}</div>`:'<div class="zc-media-empty">Noch kein eigenes Foto hinterlegt.</div>'}</div>
    <div class="subpanel"><h3>Beispielbild</h3>${exampleHtml(j,type)}<div class="tiny muted" style="margin-top:8px">Referenzbild – im echten Einsatz durch eure eigenen Fotos ersetzen.</div></div>`;
  }

  function imageToThumb(file){return new Promise((resolve,reject)=>{const fr=new FileReader();fr.onerror=reject;fr.onload=()=>{const im=new Image();im.onerror=reject;im.onload=()=>{const max=1100,s=Math.min(1,max/Math.max(im.width,im.height)),w=Math.max(1,Math.round(im.width*s)),h=Math.max(1,Math.round(im.height*s)),c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);resolve(c.toDataURL('image/jpeg',.72))};im.src=fr.result};fr.readAsDataURL(file)})}
  window.zcAddMedia=async function(id,type,files){const arr=list(id,type);for(const file of [...files]){try{arr.push({data:await imageToThumb(file),name:file.name||'Foto',created:new Date().toLocaleString('de-DE')})}catch(e){alert('Das Foto konnte nicht verarbeitet werden. Bitte JPG/PNG oder die Kamera verwenden.')}}if(saveMedia()&&typeof renderSheet==='function')renderSheet()};
  window.zcRemoveMedia=function(id,type,i){list(id,type).splice(i,1);saveMedia();if(typeof renderSheet==='function')renderSheet()};

  const baseFixture=window.fixtureTab;
  const baseTools=window.toolsTab;
  if(typeof baseFixture==='function'){
    window.fixtureTab=fixtureTab=function(j){
      let h=baseFixture(j);
      const old='<div class="subpanel"><h3>Foto der Aufspannung</h3><div class="photo">📷 Foto-Upload kommt in der späteren Datenbank-Version</div></div>';
      return h.includes(old)?h.replace(old,mediaPanel(j,'fixture')):h+mediaPanel(j,'fixture');
    };
  }
  if(typeof baseTools==='function') window.toolsTab=toolsTab=function(j){return baseTools(j)+mediaPanel(j,'tools')};

  const brand=document.querySelector('.brand small'); if(brand) brand.textContent='Privater Test · V7.3';
})();
