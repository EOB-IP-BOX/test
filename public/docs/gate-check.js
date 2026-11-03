;(function () {
  var SESSION_KEY = 'letzz_demo_hub_session_v1'
  try {
    if (sessionStorage.getItem(SESSION_KEY) === '1') return
  } catch (_) {
    /* private mode: fall through to gate */
  }

  document.documentElement.setAttribute('data-docs-locked', '1')

  function renderGate() {
    document.body.innerHTML =
      '<main class="locked-gate" data-testid="docs-session-gate">' +
      '<div class="locked-card">' +
      '<h1>Business documentation is protected</h1>' +
      '<p>Please enter the demo hub with the partner password first. Documentation opens from the chooser after unlock.</p>' +
      '<a class="btn btn-primary" href="../#/">Open demo gate</a>' +
      '</div></main>'
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGate)
  } else {
    renderGate()
  }
})()
