const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const START_TIME = new Date();

app.use(express.json());

// Root endpoint — rich HTML dashboard
app.get('/', (req, res) => {
  const uptime = Math.floor((new Date() - START_TIME) / 1000);
  const hours   = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;

  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>DevOps CI/CD Pipeline – Live Demo</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#0d1117;--surface:#161b22;--border:#30363d;
      --accent:#238636;--accent2:#1f6feb;--text:#e6edf3;--muted:#8b949e;
      --green:#3fb950;--blue:#58a6ff;--orange:#f0883e;--purple:#bc8cff;
    }
    body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;padding:2rem 1rem}
    .container{max-width:860px;margin:0 auto}
    header{text-align:center;margin-bottom:3rem}
    .badge{display:inline-flex;align-items:center;gap:.4rem;background:#0f3d23;border:1px solid var(--accent);color:var(--green);border-radius:999px;padding:.3rem .9rem;font-size:.75rem;font-weight:600;letter-spacing:.04em;margin-bottom:1.2rem;animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 #3fb95040}50%{box-shadow:0 0 0 6px #3fb95000}}
    h1{font-size:2.2rem;font-weight:800;letter-spacing:-.03em;line-height:1.2;margin-bottom:.6rem}
    h1 span{background:linear-gradient(135deg,var(--blue),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .subtitle{color:var(--muted);font-size:1rem}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-bottom:1.5rem}
    .card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.4rem;transition:border-color .2s,transform .2s}
    .card:hover{border-color:var(--accent2);transform:translateY(-2px)}
    .card-icon{font-size:1.6rem;margin-bottom:.6rem}
    .card-label{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:600;margin-bottom:.3rem}
    .card-value{font-size:1.05rem;font-weight:700;font-family:'JetBrains Mono',monospace}
    .card-value.green{color:var(--green)}
    .card-value.blue{color:var(--blue)}
    .card-value.orange{color:var(--orange)}
    .card-value.purple{color:var(--purple)}
    .pipeline{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.6rem;margin-bottom:1.5rem}
    .pipeline h2{font-size:.8rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:1.2rem;font-weight:600}
    .stages{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}
    .stage{display:flex;align-items:center;gap:.5rem;background:#0d1117;border:1px solid var(--border);border-radius:8px;padding:.5rem 1rem;font-size:.82rem;font-weight:600;flex:1;min-width:120px}
    .stage .dot{width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);flex-shrink:0}
    .arrow{color:var(--muted);font-size:.9rem}
    .tech-stack{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.6rem;margin-bottom:1.5rem}
    .tech-stack h2{font-size:.8rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:1rem;font-weight:600}
    .tags{display:flex;flex-wrap:wrap;gap:.5rem}
    .tag{padding:.3rem .8rem;border-radius:6px;font-size:.78rem;font-weight:600;border:1px solid}
    .tag.docker{background:#0d2a3a;border-color:#1d6f9f;color:#4fc3f7}
    .tag.github{background:#1a1a2e;border-color:#444;color:#e6edf3}
    .tag.node{background:#0f2e1a;border-color:#2e7d32;color:#81c784}
    .tag.aws{background:#2c1810;border-color:#b35800;color:#f0883e}
    .tag.cicd{background:#1e1a2e;border-color:#6a3db5;color:#bc8cff}
    .endpoints{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.6rem}
    .endpoints h2{font-size:.8rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:1rem;font-weight:600}
    .endpoint{display:flex;align-items:center;gap:.8rem;padding:.6rem 0;border-bottom:1px solid var(--border)}
    .endpoint:last-child{border-bottom:none}
    .method{background:#1a3a1a;color:var(--green);font-family:'JetBrains Mono',monospace;font-size:.72rem;font-weight:700;padding:.2rem .5rem;border-radius:4px;min-width:36px;text-align:center}
    .path{font-family:'JetBrains Mono',monospace;font-size:.85rem;color:var(--blue)}
    .desc{color:var(--muted);font-size:.82rem;margin-left:auto}
    footer{text-align:center;margin-top:2rem;color:var(--muted);font-size:.8rem}
    footer a{color:var(--blue);text-decoration:none}
  </style>
</head>
<body>
<div class="container">
  <header>
    <div class="badge">🟢 LIVE &nbsp;|&nbsp; DEPLOYED VIA CI/CD</div>
    <h1>DevOps <span>CI/CD Pipeline</span></h1>
    <p class="subtitle">Node.js · Docker · GitHub Actions · AWS EC2</p>
  </header>

  <div class="grid">
    <div class="card">
      <div class="card-icon">🚀</div>
      <div class="card-label">Status</div>
      <div class="card-value green">● Healthy</div>
    </div>
    <div class="card">
      <div class="card-icon">⏱</div>
      <div class="card-label">Uptime</div>
      <div class="card-value blue">${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}</div>
    </div>
    <div class="card">
      <div class="card-icon">📦</div>
      <div class="card-label">Runtime</div>
      <div class="card-value orange">Node.js v${process.version}</div>
    </div>
    <div class="card">
      <div class="card-icon">🌐</div>
      <div class="card-label">Environment</div>
      <div class="card-value purple">${process.env.NODE_ENV || 'production'}</div>
    </div>
  </div>

  <div class="pipeline">
    <h2>CI/CD Pipeline Stages</h2>
    <div class="stages">
      <div class="stage"><span class="dot"></span> Git Push</div>
      <span class="arrow">→</span>
      <div class="stage"><span class="dot"></span> Run Tests</div>
      <span class="arrow">→</span>
      <div class="stage"><span class="dot"></span> Build Image</div>
      <span class="arrow">→</span>
      <div class="stage"><span class="dot"></span> Push Docker Hub</div>
      <span class="arrow">→</span>
      <div class="stage"><span class="dot"></span> Deploy EC2</div>
    </div>
  </div>

  <div class="tech-stack">
    <h2>Tech Stack</h2>
    <div class="tags">
      <span class="tag node">Node.js</span>
      <span class="tag node">Express</span>
      <span class="tag docker">Docker</span>
      <span class="tag docker">Docker Hub</span>
      <span class="tag github">GitHub Actions</span>
      <span class="tag aws">AWS EC2</span>
      <span class="tag cicd">CI/CD</span>
    </div>
  </div>

  <div class="endpoints">
    <h2>API Endpoints</h2>
    <div class="endpoint">
      <span class="method">GET</span>
      <span class="path">/</span>
      <span class="desc">Live dashboard (this page)</span>
    </div>
    <div class="endpoint">
      <span class="method">GET</span>
      <span class="path">/health</span>
      <span class="desc">JSON health check</span>
    </div>
    <div class="endpoint">
      <span class="method">GET</span>
      <span class="path">/info</span>
      <span class="desc">System information</span>
    </div>
  </div>

  <footer>
    <p>Built by <a href="https://github.com/HammadGhani23">HammadGhani23</a> · Deployed automatically via GitHub Actions</p>
  </footer>
</div>
</body>
</html>`);
});

// Health check — used by CI/CD pipeline and monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status:    'healthy',
    timestamp: new Date().toISOString(),
    uptime:    process.uptime(),
    version:   process.version,
  });
});

// System info endpoint
app.get('/info', (req, res) => {
  res.status(200).json({
    app:       'devops-cicd-project',
    version:   '1.0.0',
    node:      process.version,
    platform:  process.platform,
    env:       process.env.NODE_ENV || 'production',
    startedAt: START_TIME.toISOString(),
    uptime:    `${Math.floor(process.uptime())}s`,
  });
});

const server = app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`);
});

module.exports = server;
