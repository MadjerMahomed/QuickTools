/* QuickTools — shared UI enhancements for navigation, preferences, and results. */

(function () {
  'use strict';

  /* ── Theme (dark mode) ───────────────────── */
  function setTheme(theme, save) {
    document.documentElement.dataset.theme = theme;
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = theme === 'dark'
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.1A8.5 8.5 0 0 1 8.9 4a8.5 8.5 0 1 0 11.1 11.1Z"/></svg>';
    }
    if (save) {
      try { localStorage.setItem('qt-theme', theme); } catch (e) {}
    }
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('qt-theme'); } catch (e) {}
    setTheme(saved === 'dark' ? 'dark' : 'light', false);

    const nav = document.querySelector('nav.main-nav');
    if (nav) {
      const btn = document.createElement('button');
      btn.id = 'themeToggle';
      btn.className = 'theme-toggle';
      btn.type = 'button';
      btn.setAttribute(
        'aria-label',
        document.documentElement.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      btn.innerHTML = document.documentElement.dataset.theme === 'dark'
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.1A8.5 8.5 0 0 1 8.9 4a8.5 8.5 0 1 0 11.1 11.1Z"/></svg>';
      nav.appendChild(btn);
      btn.addEventListener('click', () => {
        setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
      });
    }
  }

  /* ── Toast notifications ─────────────────── */
  let toastTimer = null;
  function toast(msg) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }
  window.qtToast = toast;

  const FAVORITES_KEY = 'qt-favorites';
  const RECENT_KEY = 'qt-recent-tools';
  const TOOL_INFO = {
    'word-counter.html': { title: 'Word Counter', description: 'Count and analyze text' },
    'percentage-calculator.html': { title: 'Percentage Calculator', description: 'Calculate percentages and change' },
    'unit-converter.html': { title: 'Unit Converter', description: 'Convert common measurements' },
    'age-calculator.html': { title: 'Age Calculator', description: 'Find your exact age' },
    'password-generator.html': { title: 'Password Generator', description: 'Create a random password' },
    'bmi-calculator.html': { title: 'BMI Calculator', description: 'Calculate body mass index' },
    'tip-calculator.html': { title: 'Tip Calculator', description: 'Calculate and split a tip' },
    'compound-interest.html': { title: 'Compound Interest', description: 'Project savings and investment growth' },
    'loan-calculator.html': { title: 'Loan Calculator', description: 'Estimate payments and total interest' },
    'date-difference.html': { title: 'Date Difference', description: 'Find the time between two dates' },
    'discount-calculator.html': { title: 'Discount Calculator', description: 'Calculate sale prices and savings' },
    'text-case-converter.html': { title: 'Text Case Converter', description: 'Transform text capitalization' }
  };

  function readToolList(key) {
    try {
      const value = localStorage.getItem(key);
      if (!value) return [];
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) throw new Error('Stored tool list is not an array');
      return [...new Set(parsed.filter(path => Object.prototype.hasOwnProperty.call(TOOL_INFO, path)))];
    } catch (err) {
      toast('Saved tools are unavailable in this browser');
      return [];
    }
  }

  function writeToolList(key, paths) {
    try {
      localStorage.setItem(key, JSON.stringify(paths));
      return true;
    } catch (err) {
      toast('Could not save your tools in this browser');
      return false;
    }
  }

  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.setAttribute('aria-hidden', 'true');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw new Error('Clipboard copy was not available');
  }
  window.qtCopyText = copyText;

  function initToolActions() {
    const h1 = document.querySelector('.tool-page h1');
    if (!h1) return;
    const path = location.pathname.split('/').pop();
    if (!Object.prototype.hasOwnProperty.call(TOOL_INFO, path)) return;

    const actions = document.createElement('div');
    actions.className = 'tool-actions';

    const favorite = document.createElement('button');
    favorite.className = 'btn secondary favorite-toggle';
    favorite.type = 'button';
    favorite.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.75 5.57 6.15.9-4.45 4.34 1.05 6.13L12 17.05l-5.5 2.89 1.05-6.13L3.1 9.47l6.15-.9L12 3Z"/></svg><span></span>';
    const setFavoriteState = isFavorite => {
      favorite.setAttribute('aria-pressed', String(isFavorite));
      favorite.querySelector('span').textContent = isFavorite ? 'Saved' : 'Save tool';
    };
    setFavoriteState(readToolList(FAVORITES_KEY).includes(path));
    favorite.addEventListener('click', () => {
      const favorites = readToolList(FAVORITES_KEY);
      const isFavorite = favorites.includes(path);
      const next = isFavorite ? favorites.filter(item => item !== path) : [path, ...favorites];
      if (writeToolList(FAVORITES_KEY, next)) {
        setFavoriteState(!isFavorite);
        toast(isFavorite ? 'Removed from favorites' : 'Added to favorites');
      }
    });
    actions.appendChild(favorite);

    const share = document.createElement('button');
    share.className = 'btn secondary share-btn';
    share.type = 'button';
    share.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5"/></svg><span>Share this tool</span>';
    share.addEventListener('click', async () => {
      const data = { title: document.title, url: location.href };
      if (navigator.share) {
        try { await navigator.share(data); return; } catch (err) { if (err.name === 'AbortError') return; }
      }
      try {
        await copyText(location.href);
        toast('Link copied to clipboard');
      } catch (err) {
        toast('Could not copy the link');
      }
    });
    actions.appendChild(share);
    h1.insertAdjacentElement('afterend', actions);

    const recent = readToolList(RECENT_KEY).filter(item => item !== path);
    if (writeToolList(RECENT_KEY, [path, ...recent].slice(0, 4))) renderQuickAccess();
  }

  /* ── Breadcrumb back to all tools ────────── */
  function initBreadcrumb() {
    const h1 = document.querySelector('.tool-page h1');
    if (!h1) return;
    const crumb = document.createElement('a');
    crumb.className = 'breadcrumb';
    crumb.href = 'index.html';
    crumb.textContent = '← All tools';
    h1.insertAdjacentElement('beforebegin', crumb);
  }

  function renderQuickAccess() {
    const section = document.getElementById('quickAccess');
    if (!section) return;
    const favorites = readToolList(FAVORITES_KEY);
    const recent = readToolList(RECENT_KEY);
    const favoriteGroup = document.getElementById('favoritesGroup');
    const recentGroup = document.getElementById('recentGroup');

    function renderList(container, group, paths, canRemove) {
      while (container.firstChild) container.removeChild(container.firstChild);
      group.hidden = paths.length === 0;
      paths.forEach(path => {
        const info = TOOL_INFO[path];
        const item = document.createElement('div');
        item.className = 'quick-link-item';
        const link = document.createElement('a');
        link.className = 'quick-link';
        link.href = path;
        const title = document.createElement('strong');
        title.textContent = info.title;
        const description = document.createElement('span');
        description.textContent = info.description;
        link.append(title, description);
        item.appendChild(link);

        if (canRemove) {
          const remove = document.createElement('button');
          remove.className = 'quick-remove';
          remove.type = 'button';
          remove.setAttribute('aria-label', `Remove ${info.title} from favorites`);
          remove.textContent = '×';
          remove.addEventListener('click', () => {
            const next = readToolList(FAVORITES_KEY).filter(saved => saved !== path);
            if (writeToolList(FAVORITES_KEY, next)) renderQuickAccess();
          });
          item.appendChild(remove);
        }
        container.appendChild(item);
      });
    }

    renderList(document.getElementById('favoriteLinks'), favoriteGroup, favorites, true);
    renderList(document.getElementById('recentLinks'), recentGroup, recent, false);
    section.hidden = favorites.length === 0 && recent.length === 0;
  }

  function initResultCopy() {
    document.querySelectorAll('.tool-page .result:not(#output)').forEach(result => {
      const button = document.createElement('button');
      button.className = 'btn secondary result-copy';
      button.type = 'button';
      button.textContent = 'Copy result';
      button.hidden = getComputedStyle(result).display === 'none';
      button.addEventListener('click', async () => {
        try {
          await copyText(result.innerText || result.textContent);
          toast('Result copied');
        } catch (err) {
          toast('Could not copy the result');
        }
      });
      result.insertAdjacentElement('afterend', button);

      const updateVisibility = () => {
        button.hidden = getComputedStyle(result).display === 'none';
      };
      new MutationObserver(updateVisibility).observe(result, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
        attributeFilter: ['style']
      });
    });

    document.querySelectorAll('.tool-page #r1, .tool-page #r2, .tool-page #r3').forEach(result => {
      const button = document.createElement('button');
      button.className = 'result-copy-inline';
      button.type = 'button';
      button.textContent = 'Copy';
      button.disabled = result.textContent.trim() === '—';
      button.addEventListener('click', async () => {
        try {
          await copyText(result.textContent.trim());
          toast('Result copied');
        } catch (err) {
          toast('Could not copy the result');
        }
      });
      result.insertAdjacentElement('afterend', button);
      new MutationObserver(() => {
        button.disabled = result.textContent.trim() === '—';
      }).observe(result, { childList: true, characterData: true, subtree: true });
    });

    const copyCounts = document.getElementById('copyCounts');
    if (copyCounts) {
      copyCounts.addEventListener('click', async () => {
        const values = [
          `Words: ${document.getElementById('words').textContent}`,
          `Characters: ${document.getElementById('chars').textContent}`,
          `Characters (no spaces): ${document.getElementById('charsNs').textContent}`,
          `Sentences: ${document.getElementById('sentences').textContent}`,
          `Paragraphs: ${document.getElementById('paragraphs').textContent}`,
          `Reading time: ${document.getElementById('reading').textContent} min`
        ].join('\n');
        try {
          await copyText(values);
          toast('Text statistics copied');
        } catch (err) {
          toast('Could not copy the statistics');
        }
      });
    }
  }

  function initAccessibility() {
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main-content';
    if (!document.querySelector('.skip-link') && main) {
      const skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.href = '#main-content';
      skip.textContent = 'Skip to main content';
      document.body.insertBefore(skip, document.body.firstChild);
    }

    document.querySelectorAll('input, textarea, select').forEach(field => {
      if (!field.id) return;
      const label = document.querySelector(`label[for="${field.id}"]`);
      if (label && field.getAttribute('aria-label') === null) {
        field.setAttribute('aria-label', label.textContent.trim());
      }
    });
  }

  initAccessibility();
  initTheme();
  initBreadcrumb();
  initToolActions();
  initResultCopy();
  renderQuickAccess();

  /* ── Homepage tool search ────────────────── */
  const toolSearch = document.getElementById('toolSearch');
  if (toolSearch) {
    const cards = [...document.querySelectorAll('.tool-card')];
    const count = document.querySelector('.tool-count');
    const empty = document.getElementById('toolEmpty');
    const filterButtons = [...document.querySelectorAll('.filter-chip')];
    let activeCategory = 'all';

    function filterTools() {
      const query = toolSearch.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach(card => {
        const matchesQuery = card.dataset.search.includes(query);
        const matchesCategory = activeCategory === 'all' ||
          (card.dataset.category || '').split(/\s+/).includes(activeCategory);
        const match = matchesQuery && matchesCategory;
        card.hidden = !match;
        if (match) visible++;
      });
      const filtering = query || activeCategory !== 'all';
      if (count) count.textContent = filtering
        ? `${visible} tool${visible === 1 ? '' : 's'} found`
        : `${cards.length} tools available`;
      if (empty) empty.hidden = visible !== 0;
    }

    toolSearch.addEventListener('input', filterTools);
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        activeCategory = button.dataset.category;
        filterButtons.forEach(filter => {
          const selected = filter === button;
          filter.classList.toggle('active', selected);
          filter.setAttribute('aria-pressed', String(selected));
        });
        filterTools();
      });
    });
    const clearFilters = document.getElementById('clearToolFilters');
    if (clearFilters) clearFilters.addEventListener('click', () => {
      toolSearch.value = '';
      activeCategory = 'all';
      filterButtons.forEach(button => {
        const selected = button.dataset.category === 'all';
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      filterTools();
      toolSearch.focus();
    });
    document.addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toolSearch.focus();
      }
      if (event.key === '/' && document.activeElement !== toolSearch) {
        event.preventDefault();
        toolSearch.focus();
      }
    });
  }

  /* ── Gentle card entrance ────────────────── */
  document.querySelectorAll('.tool-card').forEach((card, index) => {
    card.style.setProperty('--delay', `${index * 55}ms`);
  });

  /* ── Subtle pointer depth ─────────────── */
  if (window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.tool-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          `perspective(900px) translateY(-7px) rotateX(${-y * 3.2}deg) rotateY(${x * 3.2}deg)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('transform');
      });
    });
  }
})();
