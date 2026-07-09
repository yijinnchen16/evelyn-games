const $=id=>document.getElementById(id);const game=$('game'),playfield=$('playfield'),startBtn=$('startBtn'),againBtn=$('againBtn'),mobileSettingsBtn=$('mobileSettingsBtn'),closeSettings=$('closeSettings'),statusEl=$('status'),scoreEl=$('score'),highEl=$('highScore'),perfectEl=$('perfect'),wrongEl=$('wrong'),settingsReadout=$('settingsReadout'),highScoreCard=$('highScoreCard'),speed=$('speed'),amount=$('amount'),snakeWrap=$('snakeWrap'),head=$('snakeHead'),floatMsg=$('floatMsg'),goldAlert=$('goldAlert'),mega=$('mega'),megaPts=$('megaPts'),gameOver=$('gameOver'),finalScore=$('finalScore'),infoModal=$('infoModal'),modalContent=$('modalContent'),modalClose=$('modalClose'),quickButtons=$('quickButtons');
const meats=['🥩','🍖','🍗','🥓'],wrongs=['🍎','🥕','🥦','🥒','🍩','🍪','🍰','🧀'];let playing=false,dead=false,paused=false,score=0,perfect=0,wrong=0,high=Number(localStorage.getItem('evelynSnakeHighScore'))||0,spawnTimer=null,goldTimer=null,dragged=null;
function speedLabel(v){return v<=3?'🐢 Speed: Slow':v>=8?'🐇 Speed: Fast':'🚲 Speed: Medium'}function amountLabel(v){return v<=3?'🌱 Amount: Few':v>=8?'🎉 Amount: Many':'🌸 Amount: Medium'}function hud(){scoreEl.textContent=score;highEl.textContent=high;if(highScoreCard)highScoreCard.textContent=high;perfectEl.textContent=perfect;wrongEl.textContent=`${wrong} / 3`;settingsReadout.innerHTML=`<span class="settings-line"><span class="settings-name">🐢 Speed:</span><span class="settings-value">${speedLabel(+speed.value).split(': ')[1]}</span></span><span class="settings-line"><span class="settings-name">🥩 Amount:</span><span class="settings-value">${amountLabel(+amount.value).split(': ')[1]}</span></span>`}function duration(){return Math.max(4.8,12.5-(+speed.value)*.75)}function delay(){return Math.max(260,1750-(+amount.value)*125)}
function startGame(e){if(e)e.preventDefault();playing=true;dead=false;paused=false;score=0;perfect=0;wrong=0;dragged=null;game.classList.add('playing');game.classList.remove('settings-open');startBtn.textContent='Restart Game';statusEl.textContent="Drag meat to the snake's head!";gameOver.classList.remove('show');document.querySelectorAll('.food').forEach(f=>f.remove());clearInterval(spawnTimer);clearTimeout(goldTimer);
const modalTemplates={
  how:`<h2>❔ How to Play</h2>
  <ul>
    <li>Hold a food item with your mouse or finger.</li>
    <li>Drag it to the snake's head.</li>
    <li>Release to feed the snake.</li>
    <li>Meat gives <b style="color:#009d52">+10 points</b>.</li>
    <li>Wrong food gives <b style="color:#e7202c">-10 points</b>.</li>
    <li>Three wrong eats means Game Over.</li>
  </ul>`,
  power:`<h2>⭐ Power Up</h2>
  <p><b>Golden Meat</b> appears first after about 8 seconds, then every 20–30 seconds.</p>
  <ul>
    <li>Feeds all meat currently on screen.</li>
    <li>Triggers Mega Feast.</li>
    <li>Creates rainbow hearts and confetti.</li>
    <li>Makes the snake dance.</li>
  </ul>`,
  score:`<h2>🏆 High Score</h2>
  <p>Your best score is:</p>
  <p style="text-align:center;font-size:3rem;color:#ef3f92;margin:8px 0">${high}</p>
  <p>High score is saved on this device/browser.</p>`
};

function openInfoModal(type){
  paused=true;
  infoModal.classList.add('show');
  infoModal.setAttribute('aria-hidden','false');
  modalContent.innerHTML=modalTemplates[type]||modalTemplates.how;
}

function closeInfoModal(){
  infoModal.classList.remove('show');
  infoModal.setAttribute('aria-hidden','true');
  paused=false;
}

if(quickButtons){
  quickButtons.addEventListener('click',e=>{
    const btn=e.target.closest('button[data-modal]');
    if(!btn)return;
    openInfoModal(btn.dataset.modal);
  });
}
if(modalClose){
  modalClose.addEventListener('click',closeInfoModal);
  modalClose.addEventListener('touchend',e=>{e.preventDefault();closeInfoModal();},{passive:false});
}
if(infoModal){
  infoModal.addEventListener('click',e=>{
    if(e.target===infoModal)closeInfoModal();
  });
}

hud();restartSpawn();scheduleGold(true);for(let i=0;i<6;i++)setTimeout(()=>spawn(false),i*280)}
function restartSpawn(){clearInterval(spawnTimer);if(!playing||dead)return;spawnTimer=setInterval(()=>spawn(false),delay())}function scheduleGold(first=false){clearTimeout(goldTimer);if(!playing||dead)return;goldTimer=setTimeout(()=>{if(playing&&!dead&&!document.querySelector('.food.golden')){spawn(true);showGold()}scheduleGold(false)},first?8000:20000+Math.random()*10000)}
function spawn(gold){if(!playing||dead||paused)return;const f=document.createElement('div');const meat=!gold&&Math.random()<.55;f.className=gold?'food golden':'food';f.dataset.type=gold?'golden':meat?'meat':'wrong';if(gold)f.innerHTML='<div class="golden-icon"><span class="golden-meat">🥩</span></div>';else{const icon=meat?meats[Math.floor(Math.random()*meats.length)]:wrongs[Math.floor(Math.random()*wrongs.length)];f.innerHTML='<span class="food-emoji">'+icon+'</span>';}const r=playfield.getBoundingClientRect(),size=gold?74:innerWidth<=620?44:58,x=Math.random()*Math.max(1,r.width-size-20)+10;f.style.left=x+'px';f.style.animationDuration=duration()+'s';f.addEventListener('pointerdown',dragStart);f.addEventListener('animationend',()=>f.remove());playfield.appendChild(f)}
function dragStart(e){if(!playing||dead||paused)return;e.preventDefault();dragged=e.currentTarget;dragged.classList.add('dragging');dragged.setPointerCapture(e.pointerId);dragged.style.position='fixed';dragged.style.bottom='auto';dragged.style.animationPlayState='paused';move(e);dragged.addEventListener('pointermove',move);dragged.addEventListener('pointerup',drop);dragged.addEventListener('pointercancel',drop)}
function move(e){if(!dragged)return;e.preventDefault();dragged.style.left=(e.clientX-dragged.offsetWidth/2)+'px';dragged.style.top=(e.clientY-dragged.offsetHeight/2)+'px';dragged.style.bottom='auto'}
function drop(e){if(!dragged)return;e.preventDefault();const f=dragged;try{f.releasePointerCapture(e.pointerId)}catch{}f.removeEventListener('pointermove',move);f.removeEventListener('pointerup',drop);f.removeEventListener('pointercancel',drop);const fr=f.getBoundingClientRect(),hr=head.getBoundingClientRect(),cx=fr.left+fr.width/2,cy=fr.top+fr.height/2,hit=cx>=hr.left&&cx<=hr.right&&cy>=hr.top&&cy<=hr.bottom;if(hit)feed(f);else{const gr=playfield.getBoundingClientRect();f.classList.remove('dragging');f.style.position='absolute';f.style.left=Math.max(0,Math.min(gr.width-f.offsetWidth,e.clientX-gr.left-f.offsetWidth/2))+'px';f.style.top=Math.max(0,Math.min(gr.height-f.offsetHeight,e.clientY-gr.top-f.offsetHeight/2))+'px';f.style.bottom='auto';f.style.animationPlayState='running'}dragged=null}
function feed(f){const type=f.dataset.type;f.remove();eat();if(type==='golden'){megaFeast();return}if(type==='meat'){score+=10;perfect++;statusEl.textContent='+10 points! Yummy meat! 💖';msg('+10','white');happy();if(score>0&&score%50===0)confetti(70)}else{score=Math.max(0,score-10);wrong++;statusEl.textContent='Oops! Snake only eats meat. -10 points!';msg('-10 💔','#ff1744');bad();if(wrong>=3)end()}saveHigh();hud()}
function megaFeast(){const foods=[...document.querySelectorAll('.food')].filter(f=>f.dataset.type==='meat'),count=foods.length+1,pts=count*10;foods.forEach((f,i)=>setTimeout(()=>f.remove(),i*35));score+=pts;perfect+=count;megaPts.textContent='+'+pts+' points';mega.classList.remove('show');void mega.offsetWidth;mega.classList.add('show');statusEl.textContent='MEGA FEAST! +'+pts+' points!';msg('🌈 MEGA FEAST!','white');hearts();confetti(160);dance();saveHigh();hud()}
function eat(){snakeWrap.classList.add('eat');setTimeout(()=>snakeWrap.classList.remove('eat'),500)}function happy(){snakeWrap.classList.remove('happy');void snakeWrap.offsetWidth;snakeWrap.classList.add('happy');setTimeout(()=>snakeWrap.classList.remove('happy'),900)}function bad(){snakeWrap.classList.remove('wrong');playfield.classList.remove('shake');void snakeWrap.offsetWidth;snakeWrap.classList.add('wrong');playfield.classList.add('shake');heart('💔');setTimeout(()=>{snakeWrap.classList.remove('wrong');playfield.classList.remove('shake')},780)}function dance(){snakeWrap.classList.remove('mega-dance');void snakeWrap.offsetWidth;snakeWrap.classList.add('mega-dance');setTimeout(()=>snakeWrap.classList.remove('mega-dance'),2000)}
function msg(t,c){floatMsg.textContent=t;floatMsg.style.color=c;floatMsg.classList.remove('show');void floatMsg.offsetWidth;floatMsg.classList.add('show')}function showGold(){goldAlert.classList.add('show');setTimeout(()=>goldAlert.classList.remove('show'),2200)}
function heart(icon){const h=document.createElement('div');h.className='heart';h.textContent=icon;h.style.left='50%';h.style.top='45%';h.style.setProperty('--dx',(Math.random()*120-60)+'px');h.style.setProperty('--dy',(-110-Math.random()*80)+'px');playfield.appendChild(h);setTimeout(()=>h.remove(),1800)}function hearts(){['❤️','🧡','💛','💚','💙','💜','💖','🌈'].forEach((_,i)=>{setTimeout(()=>heart(['❤️','🧡','💛','💚','💙','💜','💖','🌈'][Math.floor(Math.random()*8)]),i*35)})}
function confetti(n){const colors=['#fff','#0879e8','#ff1f28','#ffd1ec','#ffeb3b','#64e584'];for(let i=0;i<n;i++){const p=document.createElement('div');p.className='confetti';p.style.left=Math.random()*100+'vw';p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.animationDelay=Math.random()*.5+'s';document.body.appendChild(p);setTimeout(()=>p.remove(),3200)}}function saveHigh(){if(score>high){high=score;localStorage.setItem('evelynSnakeHighScore',String(high))}}function end(){dead=true;playing=false;clearInterval(spawnTimer);clearTimeout(goldTimer);saveHigh();hud();finalScore.textContent='Final score: '+score;gameOver.classList.add('show')}
function settingsChanged(){hud();if(playing&&!dead)restartSpawn()}startBtn.addEventListener('click',startGame);startBtn.addEventListener('touchend',startGame,{passive:false});againBtn.addEventListener('click',startGame);againBtn.addEventListener('touchend',startGame,{passive:false});speed.addEventListener('input',settingsChanged);amount.addEventListener('input',settingsChanged);function openSettings(e){if(e)e.preventDefault();game.classList.add('settings-open')}
function closeSettingsPanel(e){if(e)e.preventDefault();game.classList.remove('settings-open')}
function toggleSettings(e){if(e)e.preventDefault();game.classList.toggle('settings-open')}
mobileSettingsBtn.addEventListener('click',toggleSettings);
mobileSettingsBtn.addEventListener('touchend',toggleSettings,{passive:false});
closeSettings.addEventListener('click',closeSettingsPanel);
closeSettings.addEventListener('touchend',closeSettingsPanel,{passive:false});
closeSettings.addEventListener('pointerup',closeSettingsPanel);
hud();