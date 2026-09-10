(function () {
  'use strict';

  var INDEX = [
    // --- MAIN PAGES ---
    { title: 'Home', url: 'index.html', cat: 'Page', desc: 'Energy healing, Reiki, tarot readings, myotherapy and mentoring with Jess Hollamby in Adelaide.', tags: ['home', 'energy', 'healing', 'adelaide', 'jess'] },
    { title: 'About Jess', url: 'about.html', cat: 'Page', desc: 'About Jess Hollamby - energy healer, Reiki Master/Teacher, psychic and tarot reader based in Adelaide.', tags: ['about', 'jess', 'hollamby', 'who'] },
    { title: 'Offerings', url: 'offerings.html', cat: 'Page', desc: 'All services - readings, healing, Reiki, self-paced courses and mentoring programs.', tags: ['offerings', 'services', 'all', 'overview'] },
    { title: 'Book a Session', url: 'booking.html', cat: 'Page', desc: 'Book online or in-person sessions - readings, Reiki, healing, courses and events.', tags: ['book', 'booking', 'schedule', 'appointment', 'calendar'] },
    { title: 'Connect', url: 'connect.html', cat: 'Page', desc: 'Get in touch with Jess. Ask a question or send a message.', tags: ['contact', 'connect', 'question', 'email', 'message'] },
    { title: 'Free Resources', url: 'freebies.html', cat: 'Page', desc: 'Free chakra cheat sheet, nervous system cheat sheet and What Are You Carrying quiz.', tags: ['free', 'freebies', 'cheat sheet', 'chakra', 'nervous system', 'quiz', 'download'] },
    { title: 'Blog', url: 'blog.html', cat: 'Page', desc: 'Articles on Reiki, energy healing, empaths and spiritual growth.', tags: ['blog', 'articles', 'read', 'learn'] },
    { title: 'Refund Policy', url: 'refund-policy.html', cat: 'Page', desc: 'Refund and cancellation policy for Energy with Jess sessions and programs.', tags: ['refund', 'cancel', 'policy', 'cancellation'] },

    // --- READINGS & HEALING ---
    { title: 'Readings & Healing', url: 'readings-healings.html', cat: 'Services', desc: 'All one-on-one readings and healing sessions online and in-person.', tags: ['readings', 'healing', 'all services', '1:1'] },
    { title: 'Clarity & Healing', url: 'clarity-healing.html', cat: 'Services', desc: 'Readings and healing sessions - tarot, psychic, Reiki, Akashic Records, intuitive healing.', tags: ['clarity', 'healing', 'one on one', '1:1', 'sessions'] },
    { title: 'Tarot Reading - 3 Card', url: 'booking.html', cat: 'Reading', desc: '15 minutes, $40. A focused reading for one question or area of your life. Online.', tags: ['tarot', '3 card', '$40', '15 min', 'reading', 'online', 'short'] },
    { title: 'Tarot Reading - 30 Minutes', url: 'booking.html', cat: 'Reading', desc: '30 minutes, $60. In-depth tarot reading online.', tags: ['tarot', '$60', '30 min', 'reading', 'online'] },
    { title: 'Tarot Reading - 45 Minutes', url: 'booking.html', cat: 'Reading', desc: '45 minutes, $75. Extended tarot reading for deeper exploration. Online.', tags: ['tarot', '$75', '45 min', 'reading', 'online'] },
    { title: 'Psychic Reading - 30 Minutes', url: 'booking.html', cat: 'Reading', desc: '30 minutes, $70. Psychic reading online.', tags: ['psychic', '$70', '30 min', 'reading', 'online'] },
    { title: 'Psychic Reading - 60 Minutes', url: 'booking.html', cat: 'Reading', desc: '60 minutes, $120. Full psychic reading online.', tags: ['psychic', '$120', '60 min', 'reading', 'online'] },
    { title: 'Akashic Record Reading', url: 'booking.html', cat: 'Reading', desc: '60 minutes, $120. Akashic Record reading online.', tags: ['akashic', 'records', '$120', '60 min', 'reading', 'online'] },
    { title: 'Reiki Healing - Online', url: 'booking.html', cat: 'Healing', desc: 'Online Reiki healing - 60 minutes $120 or 90 minutes $150.', tags: ['reiki', 'healing', 'online', '$120', '$150', 'distance'] },
    { title: 'Akashic Record Healing', url: 'booking.html', cat: 'Healing', desc: '90 minutes, $160. Deep Akashic Record healing session online.', tags: ['akashic', 'healing', '$160', '90 min', 'online'] },
    { title: 'Intuitive Healing - Online', url: 'booking.html', cat: 'Healing', desc: 'Online intuitive healing - 60 min $120, 75 min $135, or 90 min $150.', tags: ['intuitive', 'healing', 'online', '$120', '$135', '$150'] },
    { title: 'In-Person Healing - Adelaide', url: 'in-person.html', cat: 'Healing', desc: 'In-person intuitive healing, Reiki, myotherapy and massage in Adelaide. 75 min from $125.', tags: ['in-person', 'adelaide', 'healing', 'reiki', 'myotherapy', 'massage', '$125', 'face to face'] },
    { title: 'Myotherapy & Massage - Adelaide', url: 'in-person.html', cat: 'Healing', desc: 'In-person myotherapy and relaxation massage in Adelaide. 75 min $125, 90 min $160, 120 min $210.', tags: ['myotherapy', 'massage', 'in-person', 'adelaide', '$125', '$160', '$210', 'relaxation', 'clinical'] },
    { title: 'Reiki Healing - In Person', url: 'in-person.html', cat: 'Healing', desc: 'In-person Reiki healing in Adelaide. 75 minutes, $125.', tags: ['reiki', 'in-person', 'adelaide', '$125', 'healing'] },

    // --- LEARN REIKI ---
    { title: 'Learn Reiki', url: 'learn-reiki.html', cat: 'Learn Reiki', desc: 'Learn Reiki in Adelaide with Jess - Level 1, Level 2, Reiki Master and Teacher training.', tags: ['learn', 'reiki', 'course', 'training', 'adelaide', 'study'] },
    { title: 'Reiki Level 1', url: 'reiki-level-1.html', cat: 'Learn Reiki', desc: 'Reiki Level 1 training - 10 hours over 2 days, $333. In Adelaide.', tags: ['reiki', 'level 1', 'L1', '$333', 'training', 'course', 'adelaide', 'beginner'] },
    { title: 'Reiki Level 2', url: 'reiki-level-2.html', cat: 'Learn Reiki', desc: 'Reiki Level 2 training - 10 hours over 2 days, $555. In Adelaide.', tags: ['reiki', 'level 2', 'L2', '$555', 'training', 'course', 'adelaide'] },
    { title: 'Reiki Master & Teacher', url: 'reiki-master-teacher.html', cat: 'Learn Reiki', desc: 'Reiki Master training 12 hours $1,111. Teacher pathway additional $555. In Adelaide.', tags: ['reiki', 'master', 'teacher', 'L3', '$1,111', '$555', 'training', 'advanced', 'attunement'] },
    { title: 'Reiki in Adelaide', url: 'reiki-adelaide.html', cat: 'Learn Reiki', desc: 'Reiki healing and Reiki training in Adelaide with Jess Hollamby.', tags: ['reiki', 'adelaide', 'local', 'sa', 'south australia'] },

    // --- COURSES & PROGRAMS ---
    { title: 'Self-Paced Learning', url: 'self-paced.html', cat: 'Course', desc: 'All self-paced courses - Emotion Reset, Empowered Empath, Solid Ground, Regulation Mentoring.', tags: ['self-paced', 'courses', 'online', 'learn', 'at your own pace'] },
    { title: 'Empowered Empath', url: 'empowered-empath.html', cat: 'Course', desc: 'Self-paced course for sensitive women. 9 modules, $333, lifetime access. Available now.', tags: ['empath', 'empowered', 'course', 'self-paced', '$333', 'sensitive', 'online', 'enrol'] },
    { title: 'Emotion Reset', url: 'self-paced.html', cat: 'Course', desc: '21-day process for emotional reconnection. PDF plus private community. $3.99.', tags: ['emotion reset', '$3.99', '21 day', 'emotions', 'pdf', 'cheap', 'affordable'] },
    { title: 'Regulation Mentoring', url: 'self-paced.html', cat: 'Course', desc: 'Emotional Regulation 6 weeks $229. Nervous System Regulation 12 weeks $555. Full 18 weeks $666. Self-paced, coming soon.', tags: ['regulation', 'nervous system', 'emotional', '$229', '$555', '$666', 'self-paced', 'coming soon'] },
    { title: 'Solid Ground', url: 'solid-ground.html', cat: 'Course', desc: 'Self-paced business course for solo women starting from scratch. 12 modules, $333. Doors open Sep 28.', tags: ['solid ground', 'business', 'soul-led', '$333', 'solo', 'self-paced', 'entrepreneur', 'waitlist'] },
    { title: 'The Unbecoming', url: 'the-unbecoming.html', cat: 'Program', desc: '12-month 1:1 signature program for women ready to stop carrying everyone else. $8,888.', tags: ['unbecoming', '1:1', 'program', '$8,888', 'signature', '12 months', 'intensive'] },
    { title: 'Into the Dark', url: 'into-the-dark.html', cat: 'Program', desc: '18-week cohort program for women with Reiki Level 2 or higher. Opening February 2027.', tags: ['into the dark', 'dark divine', 'cohort', '2027', 'reiki', 'advanced', 'waitlist'] },

    // --- EXPANSION & MENTORING ---
    { title: 'Expansion', url: 'expansion.html', cat: 'Mentoring', desc: 'Align and Flow sessions, Soul-Led Business mentoring, Reiki Mentoring and Soul Expansion pathways.', tags: ['expansion', 'mentoring', '1:1', 'align flow', 'soul led', 'practitioner'] },
    { title: 'Align & Flow Sessions', url: 'expansion.html', cat: 'Mentoring', desc: 'Single 90-min session $150. 5-session pack $666. 10-session pack $1,111. Telegram access included.', tags: ['align', 'flow', '1:1', '$150', '$666', '$1,111', 'sessions', 'mentoring', 'pack'] },
    { title: 'Soul-Led Business Mentoring', url: 'expansion.html', cat: 'Mentoring', desc: '6 sessions $777 or 10 sessions $1,111 for women growing a business with energetics and strategy.', tags: ['soul-led', 'business', 'mentoring', '$777', '$1,111', '6 sessions', '10 sessions', 'grow'] },
    { title: 'Reiki Mentoring', url: 'expansion.html', cat: 'Mentoring', desc: 'For Reiki practitioners - Level 1 pathway $1,555, Level 2 $2,999, combined 9 months $4,444.', tags: ['reiki', 'mentoring', 'practitioner', '$1,555', '$2,999', '$4,444', 'pathway'] },
    { title: 'Discovery Calls - Free', url: 'booking.html', cat: 'Mentoring', desc: 'Free 30-minute discovery calls for Expansion, Soul-Led Business and The Unbecoming programs.', tags: ['discovery call', 'free', '30 min', 'consult', 'enquire', 'chat'] },

    // --- BLOG ---
    { title: 'What to Expect From Your First Reiki Session', url: 'your-first-reiki-session.html', cat: 'Blog', desc: 'A guide to your first Reiki session - what happens, how it feels and what to do after.', tags: ['reiki', 'first time', 'what to expect', 'blog', 'guide', 'new'] },
    { title: 'What Is an Akashic Record Reading?', url: 'what-is-an-akashic-record-reading.html', cat: 'Blog', desc: 'What Akashic Records are, what happens in a reading and whether it is right for you.', tags: ['akashic', 'records', 'reading', 'what is', 'blog', 'guide', 'explainer'] },
    { title: 'What Is an Empath?', url: 'what-is-an-empath.html', cat: 'Blog', desc: 'Understanding what it means to be an empath - the challenges and the gifts.', tags: ['empath', 'what is', 'sensitive', 'blog', 'guide', 'highly sensitive'] },

    // --- QUIZZES & FREEBIES ---
    { title: 'Chakra Cheat Sheet - Free', url: 'freebies.html', cat: 'Freebie', desc: 'Free chakra reference guide. Download instantly.', tags: ['chakra', 'cheat sheet', 'free', 'guide', 'download', 'pdf'] },
    { title: 'Nervous System Cheat Sheet - Free', url: 'freebies.html', cat: 'Freebie', desc: 'Free nervous system reference guide. Download instantly.', tags: ['nervous system', 'cheat sheet', 'free', 'guide', 'download', 'pdf'] },
    { title: 'Sensitivity Superpower Quiz', url: 'sensitivity-superpower-quiz.html', cat: 'Quiz', desc: 'Free quiz to understand your sensitivity type and how to work with it.', tags: ['quiz', 'sensitivity', 'empath', 'superpower', 'free', 'test'] },
    { title: 'Shadow Archetype Quiz', url: 'shadow-quiz-landing.html', cat: 'Quiz', desc: 'Discover your shadow archetype and what it is telling you.', tags: ['quiz', 'shadow', 'archetype', 'free', 'personality'] },
    { title: 'Experience Decoder', url: 'experience-decoder.html', cat: 'Tool', desc: 'Make sense of your energy healing or reading experience with this free tool.', tags: ['experience', 'decoder', 'understand', 'healing', 'reading', 'what happened'] },
  ];

  function score(item, q) {
    var title = item.title.toLowerCase();
    var desc  = item.desc.toLowerCase();
    var tags  = item.tags.join(' ').toLowerCase();
    var s = 0;
    if (title === q)                  s += 10;
    else if (title.startsWith(q))     s += 7;
    else if (title.includes(q))       s += 5;
    if (tags.includes(q))             s += 4;
    if (desc.includes(q))             s += 2;
    return s;
  }

  function search(raw) {
    var q = raw.toLowerCase().trim();
    if (q.length < 2) return [];
    return INDEX
      .map(function (item) { return { item: item, s: score(item, q) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 8)
      .map(function (r) { return r.item; });
  }

  function getBase() {
    var scripts = document.querySelectorAll('script[src]');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src');
      if (src && src.indexOf('search.js') !== -1) {
        return src.replace('search.js', '');
      }
    }
    return '';
  }

  function init() {
    var base = getBase();

    // ---- INJECT BUTTON INTO NAV ----
    var navInner = document.querySelector('.nav-inner');
    if (navInner) {
      var btn = document.createElement('button');
      btn.className = 'ewj-search-btn';
      btn.setAttribute('aria-label', 'Search site');
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
      var hamburger = document.getElementById('hamburger');
      if (hamburger) {
        navInner.insertBefore(btn, hamburger);
      } else {
        navInner.appendChild(btn);
      }
      btn.addEventListener('click', openSearch);
    }

    // ---- INJECT OVERLAY ----
    var overlay = document.createElement('div');
    overlay.id = 'ewj-search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Search');
    overlay.hidden = true;
    overlay.innerHTML = [
      '<div id="ewj-search-inner">',
        '<div id="ewj-search-bar">',
          '<svg id="ewj-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
          '<input id="ewj-search-input" type="search" placeholder="Search services, courses, prices…" autocomplete="off" spellcheck="false" />',
          '<button id="ewj-search-close" aria-label="Close search">',
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
          '</button>',
        '</div>',
        '<ul id="ewj-search-results" role="listbox"></ul>',
        '<div id="ewj-search-empty" hidden>No results found. Try a service name, price, or topic.</div>',
        '<div id="ewj-search-hint">Try: tarot, reiki, $120, empath, adelaide, akashic</div>',
      '</div>',
    ].join('');
    document.body.appendChild(overlay);

    // ---- EVENTS ----
    var input   = document.getElementById('ewj-search-input');
    var results = document.getElementById('ewj-search-results');
    var empty   = document.getElementById('ewj-search-empty');
    var hint    = document.getElementById('ewj-search-hint');
    var activeIdx = -1;

    document.getElementById('ewj-search-close').addEventListener('click', closeSearch);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });

    document.addEventListener('keydown', function (e) {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault(); openSearch();
      }
      if (e.key === 'Escape') closeSearch();
    });

    input.addEventListener('input', function () {
      activeIdx = -1;
      render(search(input.value));
    });

    input.addEventListener('keydown', function (e) {
      var items = results.querySelectorAll('li');
      if (!items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIdx = Math.min(activeIdx + 1, items.length - 1);
        highlight(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIdx = Math.max(activeIdx - 1, 0);
        highlight(items);
      } else if (e.key === 'Enter' && activeIdx >= 0) {
        items[activeIdx].querySelector('a').click();
      }
    });

    function highlight(items) {
      items.forEach(function (li, i) {
        li.classList.toggle('ewj-active', i === activeIdx);
        if (i === activeIdx) li.querySelector('a').focus();
      });
    }

    function render(hits) {
      results.innerHTML = '';
      var hasQuery = input.value.trim().length >= 2;
      empty.hidden  = !(hasQuery && hits.length === 0);
      hint.hidden   = hasQuery;

      hits.forEach(function (item, i) {
        var li = document.createElement('li');
        li.setAttribute('role', 'option');
        var url = base + item.url;
        li.innerHTML = '<a href="' + url + '">' +
          '<span class="ewj-result-title">' + item.title + '</span>' +
          '<span class="ewj-result-cat">' + item.cat + '</span>' +
          '<span class="ewj-result-desc">' + item.desc + '</span>' +
          '</a>';
        results.appendChild(li);
      });
    }

    function openSearch() {
      overlay.hidden = false;
      document.body.classList.add('ewj-search-open');
      setTimeout(function () { input.focus(); }, 50);
    }

    function closeSearch() {
      overlay.hidden = true;
      document.body.classList.remove('ewj-search-open');
      input.value = '';
      results.innerHTML = '';
      empty.hidden = true;
      hint.hidden  = false;
      activeIdx = -1;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
