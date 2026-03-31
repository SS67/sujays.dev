(function () {
  'use strict';

  /* ─── CSS ──────────────────────────────────────────────────────────────── */
  var CSS = [
    ':root{',
    '  --bg:#eae9e3;--text:#3d3d3d;--muted:#6b6b6b;',
    '  --accent:#c9e5f0;--accent-h:#a8d4e6;',
    '  --link:#4a90a4;--border:#d5d5d0;',
    '  --sw:260px;--code-bg:#f6f8fa;',
    '}',
    '*{margin:0;padding:0;box-sizing:border-box}',
    'body{font-family:"Inter",system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.7;font-size:16px}',
    'a{color:var(--link);text-decoration:none}',
    'a:hover{text-decoration:underline}',

    /* layout */
    '.wrap{display:flex;min-height:100vh}',

    /* sidebar */
    '.sb{width:var(--sw);padding:1.8rem 1.4rem;border-right:1px solid var(--border);',
    '  position:fixed;height:100vh;overflow-y:auto;background:var(--bg);z-index:100}',
    '.sb-home{display:flex;align-items:center;gap:.4rem;color:var(--text);font-weight:600;font-size:.95rem;margin-bottom:1.4rem}',
    '.sb-home:hover{color:var(--link);text-decoration:none}',
    '.sb-label{font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:1.1rem 0 .4rem}',
    '.sb nav a{display:block;padding:.38rem .7rem;color:var(--text);font-size:.84rem;border-radius:5px;margin-bottom:.12rem;transition:background .15s}',
    '.sb nav a:hover,.sb nav a.on{background:var(--accent);text-decoration:none}',
    '.toc-h2{padding-left:.3rem}',
    '.toc-h3{padding-left:1.4rem;font-size:.78rem;color:var(--muted)}',

    /* content */
    '.ct{margin-left:var(--sw);flex:1;padding:2.5rem 3rem;max-width:860px}',

    /* breadcrumb */
    '.bc{font-size:.8rem;color:var(--muted);margin-bottom:1.5rem;display:flex;align-items:center;gap:.35rem;flex-wrap:wrap}',
    '.bc a{color:var(--muted)}.bc a:hover{color:var(--link)}',
    '.bc .sep{color:var(--border)}',

    /* markdown body */
    '.md h1{font-size:1.9rem;font-weight:600;line-height:1.3;margin-bottom:.4rem}',
    '.md>h1+p>em{color:var(--muted);display:block;margin-bottom:1.4rem}',
    '.md h2{font-size:1.35rem;font-weight:600;margin:2rem 0 .75rem;padding-bottom:.4rem;border-bottom:1px solid var(--border)}',
    '.md h3{font-size:1.05rem;font-weight:600;margin:1.5rem 0 .55rem}',
    '.md h4{font-size:.95rem;font-weight:600;margin:1.2rem 0 .4rem}',
    '.md p{margin-bottom:.85rem}',
    '.md ul,.md ol{margin:.4rem 0 .9rem 1.6rem}',
    '.md li{margin-bottom:.25rem}',
    '.md pre{background:var(--code-bg);border:1px solid var(--border);border-radius:8px;',
    '  padding:1.1rem 1.2rem;overflow-x:auto;margin:1rem 0;font-size:.84rem;line-height:1.55}',
    '.md code{font-family:"JetBrains Mono","Fira Code",Consolas,monospace;font-size:.84em;',
    '  background:rgba(201,229,240,.4);padding:.1em .3em;border-radius:3px}',
    '.md pre code{background:none;padding:0;font-size:inherit}',
    '.md table{width:100%;border-collapse:collapse;margin:1rem 0;font-size:.88rem}',
    '.md th{background:rgba(201,229,240,.3);padding:.55rem .9rem;text-align:left;font-weight:600;border-bottom:2px solid var(--border)}',
    '.md td{padding:.45rem .9rem;border-bottom:1px solid var(--border)}',
    '.md tr:hover td{background:rgba(255,255,255,.4)}',
    '.md hr{border:none;border-top:1px solid var(--border);margin:1.8rem 0}',
    '.md blockquote{border-left:3px solid var(--accent-h);padding:.5rem 1rem;margin:1rem 0;',
    '  color:var(--muted);background:rgba(201,229,240,.15);border-radius:0 6px 6px 0}',
    '.md strong{font-weight:600}',
    '.md img{max-width:100%;border-radius:6px;margin:.5rem 0}',

    /* loading */
    '.spin{display:flex;align-items:center;justify-content:center;min-height:220px;color:var(--muted);font-size:.9rem}',

    /* hamburger */
    '.ham{display:none;position:fixed;top:.8rem;right:1rem;z-index:1001;',
    '  background:var(--accent);border:none;padding:.65rem;border-radius:7px;cursor:pointer;flex-direction:column;gap:4px}',
    '.ham span{display:block;width:22px;height:2px;background:var(--text)}',
    '.ov{display:none;position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:99}',
    '.ov.show{display:block}',

    /* responsive */
    '@media(max-width:768px){',
    '  .ham{display:flex}',
    '  .sb{transform:translateX(-100%);transition:transform .3s;z-index:100;width:260px}',
    '  .sb.open{transform:translateX(0)}',
    '  .ct{margin-left:0;padding:1.2rem 1rem;padding-top:4rem}',
    '}',
    '@media(max-width:400px){.ct{padding:.9rem .7rem;padding-top:4rem}}',

    /* highlight.js override: make code blocks look clean */
    '.hljs{background:var(--code-bg)!important;color:#24292e}'
  ].join('\n');

  /* ─── Sidebar nav map ──────────────────────────────────────────────────── */
  var NAV = {
    articles: {
      title: 'Articles',
      links: [
        ['/articles/podman-guide.html',           'Getting Started with Podman'],
        ['/articles/satellite-setup.html',        'Red Hat Satellite Setup'],
        ['/articles/idm-setup.html',              'Identity Management with IdM'],
        ['/articles/vsphere-tips.html',           'vSphere Best Practices'],
        ['/articles/kaniko-builds.html',          'Building Images with Kaniko'],
        ['/articles/cloudops-fundamentals.html',  'CloudOps Fundamentals']
      ]
    },
    projects: {
      title: 'Projects',
      links: [
        ['/projects/index.html', 'All Projects']
      ]
    },
    'knowledge/linux': {
      title: '🐧 Linux',
      links: [
        ['/knowledge/linux/index.html',           'Overview'],
        ['/knowledge/linux/networking.html',      'Networking'],
        ['/knowledge/linux/filesystem.html',      'Filesystem'],
        ['/knowledge/linux/systemd.html',         'Systemd'],
        ['/knowledge/linux/troubleshooting.html', 'Troubleshooting']
      ]
    },
    'knowledge/kubernetes': {
      title: '☸️ Kubernetes',
      links: [
        ['/knowledge/kubernetes/index.html',     'Overview'],
        ['/knowledge/kubernetes/commands.html',  'Commands'],
        ['/knowledge/kubernetes/debugging.html', 'Debugging']
      ]
    },
    'knowledge/terraform': {
      title: '🏗️ Terraform',
      links: [
        ['/knowledge/terraform/index.html',    'Overview'],
        ['/knowledge/terraform/patterns.html', 'Patterns']
      ]
    },
    'knowledge/ansible': {
      title: '⚙️ Ansible',
      links: [
        ['/knowledge/ansible/index.html',     'Overview'],
        ['/knowledge/ansible/playbooks.html', 'Playbooks'],
        ['/knowledge/ansible/roles.html',     'Roles']
      ]
    },
    'knowledge/vsphere': {
      title: '🖥️ vSphere',
      links: [
        ['/knowledge/vsphere/index.html',          'Overview'],
        ['/knowledge/vsphere/administration.html', 'Administration'],
        ['/knowledge/vsphere/powercli.html',       'PowerCLI']
      ]
    },
    'knowledge/redhat': {
      title: '🔴 Red Hat',
      links: [
        ['/knowledge/redhat/index.html',     'Overview'],
        ['/knowledge/redhat/satellite.html', 'Satellite'],
        ['/knowledge/redhat/idm.html',       'IdM']
      ]
    },
    knowledge: {
      title: 'Knowledge Base',
      links: [
        ['/knowledge/index.html',            'Overview'],
        ['/knowledge/linux/index.html',      '🐧 Linux'],
        ['/knowledge/kubernetes/index.html', '☸️ Kubernetes'],
        ['/knowledge/terraform/index.html',  '🏗️ Terraform'],
        ['/knowledge/ansible/index.html',    '⚙️ Ansible'],
        ['/knowledge/vsphere/index.html',    '🖥️ vSphere'],
        ['/knowledge/redhat/index.html',     '🔴 Red Hat']
      ]
    }
  };

  /* ─── Helpers ──────────────────────────────────────────────────────────── */
  function getSection(path) {
    var keys = [
      'knowledge/linux', 'knowledge/kubernetes', 'knowledge/terraform',
      'knowledge/ansible', 'knowledge/vsphere', 'knowledge/redhat',
      'articles', 'projects', 'knowledge'
    ];
    for (var i = 0; i < keys.length; i++) {
      if (path.indexOf('/' + keys[i] + '/') === 0 || path === '/' + keys[i] + '/index.html') {
        return NAV[keys[i]];
      }
    }
    return NAV.knowledge;
  }

  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }

  function loadCSS(href) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }

  function slug(text) {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function buildBreadcrumb(path) {
    var parts = path.replace(/^\//, '').replace(/\.html$/, '').split('/').filter(function (p) {
      return p && p !== 'index';
    });
    var html = '<a href="/">Home</a>';
    var cum = '';
    parts.forEach(function (part, i) {
      cum += '/' + part;
      var label = part.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
      html += ' <span class="sep">›</span> ';
      if (i < parts.length - 1) {
        html += '<a href="' + cum + '/index.html">' + label + '</a>';
      } else {
        html += '<span>' + label + '</span>';
      }
    });
    return html;
  }

  function buildTOC(md) {
    var headings = [];
    var re = /^(#{2,3})\s+(.+)/gm;
    var m;
    while ((m = re.exec(md)) !== null) {
      headings.push({ level: m[1].length, text: m[2].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`[\]()]/g, '') });
    }
    if (headings.length < 3) return '';
    var html = '<div class="sb-label" style="margin-top:1.4rem">On this page</div><nav>';
    headings.forEach(function (h) {
      var cls = h.level === 3 ? 'toc-h3' : 'toc-h2';
      html += '<a href="#' + slug(h.text) + '" class="' + cls + '">' + h.text + '</a>';
    });
    return html + '</nav>';
  }

  /* ─── Bootstrap ────────────────────────────────────────────────────────── */
  var path = window.location.pathname;

  // Derive markdown file path from current HTML URL
  var mdPath;
  if (path.endsWith('/') || path.endsWith('/index.html')) {
    mdPath = path.replace(/index\.html$/, 'index.md').replace(/\/$/, '/index.md');
  } else {
    mdPath = path.replace(/\.html$/, '.md');
  }

  // Inject styles + fonts
  var styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  var fontEl = document.createElement('link');
  fontEl.rel = 'stylesheet';
  fontEl.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
  document.head.appendChild(fontEl);

  loadCSS('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css');

  var section = getSection(path);

  // Build sidebar nav HTML
  var navHTML = section.links.map(function (l) {
    var active = (path === l[0] || (l[0].endsWith('/index.html') && path === l[0].replace('/index.html', '/')));
    return '<a href="' + l[0] + '"' + (active ? ' class="on"' : '') + '>' + l[1] + '</a>';
  }).join('');

  // Render page skeleton
  document.body.innerHTML =
    '<button class="ham" aria-label="Menu" onclick="' +
    'document.querySelector(\'.sb\').classList.toggle(\'open\');' +
    'document.querySelector(\'.ov\').classList.toggle(\'show\')">' +
    '<span></span><span></span><span></span></button>' +
    '<div class="ov" onclick="document.querySelector(\'.sb\').classList.remove(\'open\');this.classList.remove(\'show\')"></div>' +
    '<div class="wrap">' +
    '<aside class="sb">' +
    '<a class="sb-home" href="/">← sujays.dev</a>' +
    '<div class="sb-label">' + section.title + '</div>' +
    '<nav id="sb-nav">' + navHTML + '</nav>' +
    '</aside>' +
    '<main class="ct" id="ct"><div class="spin">Loading…</div></main>' +
    '</div>';

  var ct = document.getElementById('ct');

  // Load marked + hljs, then fetch + render
  loadScript('https://cdn.jsdelivr.net/npm/marked@4/marked.min.js', function () {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js', function () {

      marked.setOptions({ gfm: true, breaks: false });

      fetch(mdPath)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.text();
        })
        .then(function (md) {
          var html = marked.parse(md);

          // Page title from first H1
          var titleMatch = md.match(/^#\s+(.+)/m);
          if (titleMatch) document.title = titleMatch[1].replace(/[*_`]/g, '') + ' · sujays.dev';

          // TOC into sidebar
          var toc = buildTOC(md);
          if (toc) document.querySelector('.sb').insertAdjacentHTML('beforeend', toc);

          // Render content
          ct.innerHTML =
            '<div class="bc">' + buildBreadcrumb(path) + '</div>' +
            '<article class="md">' + html + '</article>';

          // Add anchor IDs to headings
          ct.querySelectorAll('h1,h2,h3,h4').forEach(function (h) {
            h.id = slug(h.textContent);
          });

          // Syntax-highlight code blocks
          ct.querySelectorAll('pre code').forEach(function (block) {
            hljs.highlightElement(block);
          });

          // Rewrite .md links → .html so internal navigation stays styled
          ct.querySelectorAll('a[href]').forEach(function (a) {
            var href = a.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return;
            if (href.endsWith('.md')) {
              a.setAttribute('href', href.replace(/\.md$/, '.html'));
            } else if (href.endsWith('/')) {
              a.setAttribute('href', href + 'index.html');
            }
          });
        })
        .catch(function () {
          ct.innerHTML =
            '<article class="md">' +
            '<h2>Page not found</h2>' +
            '<p>Could not load <code>' + mdPath + '</code></p>' +
            '<p><a href="/">← Back to home</a></p>' +
            '</article>';
        });
    });
  });
}());
