function dataTemp() {
  return {
    versionPlayed: "testing", // set to "testing" when finished
    playtime: 0,
    
    points: new MetaNum(0),
    bpoints: new MetaNum(0),
    neat_comp: new MetaNum(0),
    mat_comp: new MetaNum(0),

    upgs: {},
    neat_timer: [0,0], // 1st: current, 2nd: target
    neat_active: false,

    started: false,
    cooldown: 0,
    b10_timer: 30,
    u23_timer: 0,
  }
}

var you = dataTemp()

let cps = [new MetaNum(0), 0] // 1st: CPS, 2nd: time until click
let n7_timer = 45
let m_req = new MetaNum(Infinity)
let c_rate = 125
let p_upgs = 0

let s_time = 0
let time = Date.now()
let isInUI = false
let timeStop = false // CHANGE TO false BEFORE COMMIT!!!

// helper functions
function save() {
	localStorage.setItem("prutor_you", unescape(encodeURIComponent(JSON.stringify(you))));
}
function load() {
  // load
  let get = localStorage.getItem("prutor_you")
  let get2 = JSON.parse(get)
	if (get === null || get === undefined) {
    you = dataTemp()
  } else {
    you = Object.assign(dataTemp(), get2)
    you.points = new MetaNum(get2.points)
    you.bpoints = new MetaNum(get2.bpoints)
    you.neat_comp = new MetaNum(get2.neat_comp)
    you.mat_comp = new MetaNum(get2.mat_comp)

    if (you.versionPlayed != "testing") dataReset()
  }

  /* disclaimer
  if (!you.started) {
    show(".disclaimer", true)
    isInUI = true

    // ariii can you make it so that audio plays when loading, instead of clicking?
    let hg = new Audio("assets/audio/disclaimer_notif.ogg");
    hg.play().catch(() => {document.addEventListener("click", () => hg.play(), { once: true });});
  }*/
}

function dataReset() {
  you = dataTemp()
  save()
  location.reload()
}
function fmt_cost(u, pt = 0, str = []) {
  // formats the upgrade's cost yeah
  let f_str = [...str]
  try {
    if (pt == 0) f_str.push(format(upgs[u].p_cost()) + "p")
    if (pt == 1) f_str.push(format(upgs[u].bp_cost()) + "ь")
    if (pt == 2) f_str.push(format(upgs[u].n_cost()) + "N")
  } finally {
    if (pt != 3) return fmt_cost(u, pt + 1, f_str)
    return f_str.join(", ")
  }
}
/*
function hide(c, showAnim) {
  const a = document.querySelector(c)
  if (showAnim) {
    a.style.top = "200vh"
    setTimeout(() => {a.style.display = "none"}, 250)
  }
  else a.style.display = "none"
}
function show(c, showAnim) {
  const a = document.querySelector(c)
  if (showAnim) {
    a.style.top = "200vh"
    setTimeout(() => {
      a.style.display = ""
      a.style.top = "50vh"
    }, 5)
  } else {
    a.style.display = ""
  }
}*/
function hide(c, showAnim) {
  const a = document.querySelector(c)
  if (!a) return

  if (showAnim) {
    a.style.transition = "top 0.15s ease, opacity 0.15s ease"
    a.style.top = "150vh"
    a.style.opacity = "1"

    setTimeout(() => {
      a.style.display = "none"
      a.style.top = "50vh"
      a.style.opacity = "0"
    }, 250)
  } else {
    a.style.display = "none"
    a.style.top = "50vh"
  }
}
function show(c, showAnim) {
  const a = document.querySelector(c)
  if (!a) return

  a.style.display = ""
  a.style.top = "150vh"
  a.style.opacity = "0"

  if (showAnim) {
    a.style.transition = "top 0.15s ease, opacity 0.15s ease"

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        a.style.top = "50vh"
        a.style.opacity = "1"
      })
    })
  } else {
    a.style.top = "50vh"
    a.style.opacity = "1"
  }
}

const larp = (start, end, t) => start * (1 - t) + end * t
const randNum = (min, max) => Math.random() * (max - min) + min
const stupidRounding = (n) => Math.floor(n*20)/20
const centerize_thing = (m, n) => add_px(m, mult_px("-" + n, 0.5))
const add_px = (a, b) => `${parseFloat(a)+parseFloat(b)}px`
const mult_px = (a, b) => `${parseFloat(a)*b}px`

function gain() {
  if (you.cooldown <= 0) {
    you.points = you.points.add(calc("p"))
    you.cooldown = 0.1
  }
  if (you.points.gte(5)) you.started = true
}
// TODO: fix effect on buy
function buy(u) {
  let h = you.upgs[u] || 0
  if (h < upgs[u].max()) {
    // Check if stat > stat_cost or stat_cost = undefined
    try { if (!you.points.gte(upgs[u].p_cost())) return } catch (err) {}
    try { if (!you.bpoints.gte(upgs[u].bp_cost())) return } catch (err) {}
    try { if (!you.neat_comp.gte(upgs[u].n_cost())) return } catch (err) {}

    try { you.points = you.points.sub(upgs[u].p_cost()) } catch (err) {}
    try { you.bpoints = you.bpoints.sub(upgs[u].bp_cost()) } catch (err) {}
    try { you.neat_comp = you.neat_comp.sub(upgs[u].n_cost()) } catch (err) {}
    you.upgs[u] = h + 1

    // Special cases
    if (u == "b10") you.b10_timer = 30
    if (u == "n15") window.alert("[TESTER] Reached N15 in "+formatTime(you.playtime)+" (Screenshot this and send it to IJS dev-chat)")

    // VFX
    const vfx = document.createElement("div")
    const uh = document.querySelector(`#${u} > .upg`)
    vfx.className = "upg_vfx"
    vfx.style.width = uh.style.width
    vfx.style.height = uh.style.height
    vfx.style.top = uh.style.top
    vfx.style.left = uh.style.left

    vfx.style.backgroundColor = "#e4e4e4"
    document.getElementById("map-content").append(vfx)

    setTimeout(() => {
      vfx.style.width = mult_px(uh.style.width, 2)
      vfx.style.height = mult_px(uh.style.height, 2)
      vfx.style.top = centerize_thing(uh.style.top, uh.style.height)
      vfx.style.left = centerize_thing(uh.style.left, uh.style.width)
      vfx.style.opacity = 0
    }, 5)

    setTimeout(() => {
      vfx.remove()
    }, 1005)
  }
}
function calc(s) {
  switch (s) {
    case "p":
      let r = new MetaNum(1)
      if (you.upgs.u1 >= 1) r = r.mul(upgs.u1.boost())
      if (you.upgs.u2 >= 1) r = r.mul(upgs.u2.boost())
      if (you.upgs.u4 >= 1) r = r.mul(upgs.u4.boost())
      if (you.upgs.u8 >= 1) r = r.mul(upgs.u8.boost())
      if (you.upgs.u9 >= 1) r = r.mul(upgs.u9.boost()[0])
      if (you.upgs.u10 >= 1) r = r.mul(upgs.u10.boost())
      if (you.upgs.u16 >= 1) r = r.mul(upgs.u16.boost())
      if (you.upgs.u17 >= 1) r = r.mul(upgs.u17.boost()[0])
      if (you.upgs.u22 >= 1) r = r.mul(upgs.u22.boost()[0])
      if (you.upgs.u23 >= 1) r = r.mul(upgs.u23.boost())

      if (you.upgs.b1 >= 1) r = r.mul(upgs.b1.boost())
      if (you.upgs.b4 >= 1) r = r.mul(upgs.b4.boost()[0])
      if (you.upgs.b5 >= 1) r = r.mul(upgs.b5.boost())
      if (you.upgs.b8 >= 1) r = r.mul(upgs.b8.boost()[0])
      if (you.upgs.b10 >= 1) r = r.mul(upgs.b10.boost())
      if (you.upgs.b12 >= 1) r = r.mul(upgs.b12.boost())
      if (you.upgs.b13 >= 1) r = r.mul(upgs.b13.boost()[0])
      
      if (you.mat_comp.gte(1)) r = r.mul(10)
      return r
    case "cps":
      let g = new MetaNum(0)
      if (you.upgs.u3 >= 1) g = g.add(upgs.u3.boost())
      if (you.upgs.u5 >= 1) g = g.add(upgs.u5.boost())
      if (you.upgs.u7 >= 1) g = g.add(upgs.u7.boost())
      if (you.upgs.u9 >= 1) g = g.add(upgs.u9.boost()[1])
      if (you.upgs.u14 >= 1) g = g.add(upgs.u14.boost())
      if (you.upgs.u24 >= 1) g = g.add(upgs.u24.boost())

      if (you.upgs.b2 >= 1) g = g.add(upgs.b2.boost())
      if (you.upgs.b8 >= 1) g = g.add(upgs.b8.boost()[1])
      if (you.upgs.b9 >= 1) g = g.add(upgs.b9.boost())
      if (you.upgs.b13 >= 1) g = g.add(upgs.b13.boost()[1])

      if (you.mat_comp.gte(2)) g = g.add(6)
      return g
    case "bp":
      let m = 1
      let ex = 1
      if (you.upgs.u17 >= 1) m *= upgs.u17.boost()[1]
      if (you.upgs.b4 >= 1) m *= upgs.b4.boost()[1]
      if (you.upgs.n5 >= 1) m *= upgs.n5.boost()
      if (you.upgs.n12 >= 1) ex += 0.025 * (you.upgs.n12||0)
      return you.points.pow(ex).div(10000).pow(0.5).mul(m)
    case "n":
      let be = 1
      if (you.upgs.u15 >= 1) be *= upgs.u15.boost()
      if (you.upgs.u17 >= 1) be *= upgs.u17.boost()[2]
      if (you.upgs.u22 >= 1) be *= upgs.u22.boost()[1]

      if (you.upgs.n1 >= 1) be *= upgs.n1.boost()
      if (you.upgs.n3 >= 1) be *= upgs.n3.boost()
      if (you.upgs.n4 >= 1) be *= upgs.n4.boost()
      if (you.upgs.n10 >= 1) be *= upgs.n10.boost()
      if (you.upgs.b8 >= 1) be *= upgs.b8.boost()[2]

      if (you.mat_comp.gte(1)) be *= 5
      return be
    case "n_conv":
      return calc("p").mul(cps[0]).mul(c_rate)
    
    default:
      return 0
  }
}
function neat(m) {
  switch (m) {
    case "mat":
      if (you.neat_comp.gte(m_req)) {
        bp_reset(true, false)
        for (var u of Object.keys(you.upgs)) {
          // Check if it's a neat upg
          if (u[0] == "n") delete you.upgs[u]
        }
        you.mat_comp = you.mat_comp.add(1)
      }
      break
    case "m_conv":
      you.points = you.points.add(calc("n_conv").mul(you.neat_comp))
      you.neat_comp = new MetaNum(0)
      break
    case "conv": // conversion
      if (you.neat_comp.gte(1)) {
        you.points = you.points.add(calc("n_conv"))
        you.neat_comp = you.neat_comp.sub(1)
      }
      break

    default:
      you.neat_active = !you.neat_active
      if (you.neat_active) {
        if (you.upgs.n6 >= 1)
          you.neat_timer = [0, stupidRounding(randNum(11, 15))]
        else if (you.upgs.b6 >= 1)
          you.neat_timer = [0, stupidRounding(randNum(14, 18))]
        else
          you.neat_timer = [0, stupidRounding(randNum(16, 22))]
      } else {
          let o = you.upgs.n3 >= 1 ? (you.upgs.n14 >= 1 ? 0.2 : 0.25) : 0.3
          if (
              you.neat_timer[0] > you.neat_timer[1] - o &&
              you.neat_timer[0] < you.neat_timer[1] + o
          ) {
            you.neat_comp = you.neat_comp.add(calc("n"))
          }
      }
      break
  }
}
function bp_reset(force, canGain = true) {
  if ((you.points.gte(10000) && you.upgs.u10 >= 1) || force) {
    if (canGain) you.bpoints = you.bpoints.add(calc("bp"))
    you.points = new MetaNum(0)
    you.neat_comp = new MetaNum(0)

    you.neat_active = false
    you.neat_timer = [0,0]
    you.b10_timer = 30
    you.u23_timer = 0

    for (var u of Object.keys(you.upgs)) {
      // Check if it's a point upg
      if (u[0] == "u") delete you.upgs[u]
    }
  }
}

let g_loop = setInterval(() => {
  let now = Date.now()
  let diff = (now - time) / 1e3

  // Update values
  cps[0] = calc("cps").max(0)
  m_req = new MetaNum(1000).mul(MetaNum(100).pow(you.mat_comp))

  let p_upgs2 = 0
  for (var u of Object.keys(you.upgs)) {
    if (u[0] == "u") p_upgs2 += 1
  }
  p_upgs = p_upgs2

  let c_rate2 = 125
  if (you.upgs.u11 >= 1) c_rate2 *= 2.2
  if (you.upgs.n10 >= 1) c_rate2 *= 3
  c_rate = c_rate2

  // Automation stuff
  if (cps[0].gte(20)) {
    you.points = you.points.add(calc("p").mul(cps[0].div(20)))
  } else if (cps[0].gte(0.1) && cps[1] <= 0) {
    if (s_time >= 0.25)
      you.points = you.points.add(calc("p"))
    cps[1] = 1/ cps[0].toNumber()
  }
  if (n7_timer <= 0 && you.upgs.n7 >= 1) {
    you.neat_comp = you.neat_comp.add(calc("n"))
    n7_timer = 45
  }

  // Check if unlocked
  for (var u of Object.keys(upgs)) {
    document.getElementById(u).style.display =
    upgs[u].unlockedIf() ? "" : "none"

    // Check if bought
    const uButton = document.querySelector(`#${u} > .upg`)
    const uCost = document.querySelector(`#${u} > .upg > .cost`)
    const uNode = document.querySelectorAll(`#${u} > .node`)
    const u_isMaxed = (you.upgs[u] || 0) >= upgs[u].max()
  
    uButton.classList.toggle('owned', u_isMaxed)
    uNode.forEach(hg => hg.classList.toggle('owned', u_isMaxed))
    if (u_isMaxed) {
      if (upgs[u].type == 0) {
        if (upgs[u].max() > 1) uCost.textContent = `Maxed! (${you.upgs[u]||0}/${upgs[u].max()})`
        else uCost.textContent = "Bought!"
      }
      if (upgs[u].type == 1) uCost.textContent = `x${format(upgs[u].boost())}p`
      if (upgs[u].type == 2) uCost.textContent = `+${format(upgs[u].boost())} CPS`
      if (upgs[u].type == 3) uCost.textContent = `x${format(upgs[u].boost())}N`
      if (upgs[u].type == 4) uCost.textContent = `x${format(upgs[u].boost())}ь`
      if (upgs[u].type == 5) uCost.textContent = `x${format(upgs[u].boost())} speed`
    } else {
      if (upgs[u].max() > 1)
        uCost.textContent = `${fmt_cost(u)} (${you.upgs[u]||0}/${upgs[u].max()})`
      else
        uCost.textContent = fmt_cost(u)
    }
  }

  // Structure unlocks
  document.querySelector(".bg_ui_thing").style.display = 
    (isInUI) ? "" : "none"
  document.querySelector(".n_plate").style.display =
    you.upgs.u6 >= 1 ? "" : "none"
  document.getElementById("bp_bridge_nodes").style.display =
    you.upgs.u10 >= 1 ? "" : "none"
  document.querySelector(".bp_plate").style.display =
    you.upgs.u10 >= 1 || you.bpoints.neq(0) ? "" : "none"
  document.querySelector(".n_upgs_plate").style.display =
    you.upgs.b7 >= 1 ? "" : "none"
  document.querySelector(".m_plate").style.display =
    you.upgs.b11 >= 1 ? "" : "none"
  
  // Update text/style
  document.getElementById("pluh").innerHTML = `+${format(calc("p"))}p<br>${cps[0].gte(0) ? "("+format(cps[0])+" CPS)" : ""}`
  document.getElementById("point").innerHTML = 
  `${format(you.points)}p${cps[0].gte(1) ? "<br>(+"+format(calc("p").mul(cps[0]))+"p/s)" : ""}
  <img class="statImage" src="assets/p.png" draggable="false" style="user-select: none;">`
  document.getElementById("neat").innerHTML = 
    `${format(you.neat_comp)}N<br>(+${format(calc("n"))})
    <img class="statImage" src="assets/n.png" draggable="false" style="user-select: none;">`
  document.getElementById("neat").style.display =
    (you.neat_comp.neq(0)) ? "" : "none"
  document.getElementById("bpoint").innerHTML = `${format(you.bpoints)}ь <img class="statImage" src="assets/bp.png" draggable="false" style="user-select: none;">`
  document.getElementById("bpoint").style.display =
    (you.bpoints.neq(0)) ? "" : "none"
  document.getElementById("mat").innerHTML = `${format(you.mat_comp)}ɱ <img class="statImage" src="assets/m.png" draggable="false" style="user-select: none;">`
  document.getElementById("mat").style.display =
    (you.mat_comp.neq(0)) ? "" : "none"
  document.getElementById("playtime").textContent = `Playtime: ${formatTime(you.playtime)}`
  
  document.getElementById("neat_timer").textContent = `${format(you.neat_timer[0])}s`
  document.getElementById("neat_target").textContent = `${format(you.neat_timer[1])}s`
  document.getElementById("neat_offset").textContent = `±${you.upgs.n3 >= 1 ? (you.upgs.n14 >= 1 ? 0.2 : 0.25) : 0.3}s`
  document.querySelector(".n_plate > .upg_n > .boost").innerHTML =
    `<div>
    Convert your <col_n>1N</col_n> to <col_p>${format(calc("n_conv"))}p</col_p><br>
    <col_footer>(Formula: p multi * CPS * ${format(c_rate)})</col_footer>
    </div>`
  document.querySelector(".n_upgs_plate > .upg_n > .boost").innerHTML =
    `<div>
    Double-click to convert all your <col_n>N</col_n> to <col_p>${format(calc("n_conv").mul(you.neat_comp))}p</col_p>
    </div>`
  document.getElementById("mat_req").textContent = `${format(m_req)}N`

  // Update upg. texts
  let u18 = 0.1
  if (you.upgs.u18 >= 1) u18 += 0.05
  if (you.upgs.u25 >= 1) u18 += 1.25
  document.querySelector(`#u3 > .upg > .boost > div`).innerHTML = `<col_cps>+${format(u18)} CPS</col_cps> (Clicks per Second) for each level`

  if (you.upgs.u21 >= 1)
    document.querySelector(`#u14 > .upg > .boost > div`).innerHTML =
      `Gain <col_cps>CPS</col_cps> based on <col_bp>ь</col_bp> and <col_n>N</col_n><br>
      <col_footer>10th-root(ь*N^1.15+2)-1</col_footer>`
  else
    document.querySelector(`#u14 > .upg > .boost > div`).innerHTML =
      `Gain <col_cps>CPS</col_cps> based on <col_bp>ь</col_bp><br>
      <col_footer>10th-root(ь+2)-1</col_footer>`
  if (you.upgs.n9 >= 1) {
    document.querySelector(`#n4 > .upg > .boost > div`).innerHTML =
      `Boost <col_n>N</col_n> based on <col_p>p</col_p><br>
      <col_footer>(p+1)^0.045</col_footer>`
    document.querySelector(`#n5 > .upg > .boost > div`).innerHTML =
      `Boost <col_bp>ь</col_bp> based on <col_n>N</col_n><br>
      <col_footer>(N+1)^0.075</col_footer>`
  } else {
    document.querySelector(`#n4 > .upg > .boost > div`).innerHTML =
      `Boost <col_n>N</col_n> based on <col_p>p</col_p><br>
      <col_footer>(p+1)^0.02</col_footer>`
    document.querySelector(`#n5 > .upg > .boost > div`).innerHTML =
      `Boost <col_bp>ь</col_bp> based on <col_n>N</col_n><br>
      <col_footer>(N+1)^0.05</col_footer>`
  }
  if (you.upgs.n14 >= 1)
    document.querySelector(`#n3 > .upg > .boost > div`).innerHTML =
      `<col_n>x3 N</col_n> gain, but allowed offset is reduced to ±0.2s`
  else
    document.querySelector(`#n3 > .upg > .boost > div`).innerHTML =
      `<col_n>x1.4 N</col_n> gain, but allowed offset is reduced to ±0.25s`
  
  if (you.upgs.u10 >= 1) {
    if (you.points.gte(10000))
      document.querySelector(".bp_plate > .upg_bp > .cost").textContent =
        `${format(you.points)}p -> ${format(calc("bp"))}ь`
    else
      document.querySelector(".bp_plate > .upg_bp > .cost").textContent = `Reach 10,000p first!`
  } else {
    document.querySelector(".bp_plate > .upg_bp > .cost").textContent = `Buy U10 first!`
  }

  document.querySelector(".neat").style.outline =
    `5px solid ${you.neat_active ? "#00cf00" : "#cf0000"}`

  // diff stuff
  you.cooldown -= diff
  if (!timeStop) you.playtime += diff
  s_time += diff
  if (!timeStop) cps[1] -= diff
  if (!timeStop) n7_timer -= diff
  if (!timeStop && you.b10_timer > 0) {
    if (you.upgs.n11 >= 1) you.b10_timer -= diff * upgs.n11.boost()
    else you.b10_timer -= diff
  }
  if (!timeStop && you.upgs.u23 >= 1) you.u23_timer += diff
  if (you.neat_active) you.neat_timer[0] += diff

  time = now
}, 50)

/*document.addEventListener("keydown", (e) => {
  if (e.key == "q") timeStop = !timeStop
}, {passive: false}) // REMOVE AFTER RELEASE!!!!*/
document.addEventListener("beforeunload", save, {passive: false})

let n2_gen = setInterval(() => {
  if (you.upgs.n2 >= 1 && !timeStop) you.points = you.points.add(upgs.n2.boost())
}, 1000)
let a_save = setInterval(save, 5000)
load()


































// vault for testers >:D
let SEED = [14791n, 18203940n, 58293n]
if (!you.started) {
  if (prompt("what's the powerhouse of the cell? (CASE SENSITIVE)") == "mitochondria") {
    if (gurt(prompt("who are you then?")) == "n1o!uR{>0*~Sul9M_A>NLbn]y{ha]I[Eb") {

    } else window.location.href = "https://www.youtube.com/shorts/aOIFGzMgXRI"
  } else window.location.href = "https://www.youtube.com/shorts/aOIFGzMgXRI"
}
function gurt(n){let t=" abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,?!/<>@#$%^&*()_-+=~№;:'\"[]{}|",e=BigInt(t.length),g=0n,i=SEED[0],l="";for(let l=BigInt(n.length)-1n;l>=0n;l--){let E=BigInt(t.indexOf(n[l])),r=E>=0n?e**(BigInt(n.length)-l-1n)*E:0;l%2n==0n&&r%3n==l%(r%4n+2n)&&(r*=(r%4n+2n)*(l+1n)),g+=r*i,i=(i+SEED[2]**(l%3n+l*(E+2n)%3n))%SEED[1]}for(;g>0n;)l+=t[g%e],g/=e;return l}