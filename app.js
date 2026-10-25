/**
 * RAJGURU BOOK MANUFACTURERS - CORE APPLICATION SCRIPT
 * Reverse-Engineered & Enhanced from Venkatesh Groups Industrial Web Architecture
 */

(() => {
  'use strict';

  // 1. Reduced Motion Preference
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Elements & Navigation
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  const setMenu = (open) => {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMenu(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        setMenu(false);
      }
    });
  }

  // 3. Hero Multi-Slide Showcase
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.hero-dots button')];
  const currentEl = document.getElementById('heroCurrent');
  const progressEl = document.getElementById('heroProgress');
  let activeSlide = 0;
  let slideStarted = performance.now();
  let pauseUntil = 0;
  const duration = 6500;

  function showSlide(next, userInitiated = false) {
    if (!slides.length) return;
    activeSlide = (next + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const active = index === activeSlide;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === activeSlide));
    if (currentEl) currentEl.textContent = String(activeSlide + 1).padStart(2, '0');
    slideStarted = performance.now();
    if (userInitiated) pauseUntil = performance.now() + 9000;
  }

  document.getElementById('heroPrev')?.addEventListener('click', () => showSlide(activeSlide - 1, true));
  document.getElementById('heroNext')?.addEventListener('click', () => showSlide(activeSlide + 1, true));
  dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.go), true)));

  // Touch Swipe on Hero to change slides naturally on mobile
  const heroSection = document.getElementById('top');
  let heroTouchX = 0;
  let heroTouchY = 0;
  heroSection?.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length === 1) {
      heroTouchX = e.touches[0].clientX;
      heroTouchY = e.touches[0].clientY;
    }
  }, { passive: true });
  heroSection?.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length === 1) {
      const diffX = e.changedTouches[0].clientX - heroTouchX;
      const diffY = e.changedTouches[0].clientY - heroTouchY;
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          showSlide(activeSlide + 1, true); // swipe left
        } else {
          showSlide(activeSlide - 1, true); // swipe right
        }
      }
    }
  }, { passive: true });

  if (!reduceMotion && progressEl) {
    const heroTick = (now) => {
      const paused = now < pauseUntil;
      const elapsed = paused ? 0 : now - slideStarted;
      progressEl.style.width = `${Math.min(100, (elapsed / duration) * 100)}%`;
      if (!paused && elapsed >= duration) {
        showSlide(activeSlide + 1);
      }
      if (paused) slideStarted = now;
      requestAnimationFrame(heroTick);
    };
    requestAnimationFrame(heroTick);
  } else if (progressEl) {
    progressEl.style.width = '100%';
  }

  // 4. Value Chain (Sticky Horizontal Scroll Track)
  const chain = document.getElementById('process');
  const chainTrack = document.getElementById('chainTrack');
  const chainProgress = document.getElementById('chainProgress');

  function updateScroll() {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 30);
    }
    if (window.innerWidth > 900 && chain && chainTrack && chainProgress) {
      const rect = chain.getBoundingClientRect();
      const scrollable = chain.offsetHeight - window.innerHeight;
      const progressed = Math.max(0, Math.min(1, -rect.top / scrollable));
      chainTrack.style.transform = `translate3d(${-progressed * 400}vw, 0, 0)`;
      chainProgress.style.width = `${progressed * 100}%`;
    } else if (chainTrack) {
      chainTrack.style.transform = '';
    }
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();

  // Mobile Value Chain Controls
  const chainPanels = [...document.querySelectorAll('.chain-panel')];
  const chainPosition = document.getElementById('chainPosition');
  const moveChain = (direction) => {
    if (window.innerWidth > 900 || !chainTrack) return;
    const panelWidth = chainPanels[0]?.getBoundingClientRect().width || window.innerWidth;
    const current = Math.round(chainTrack.scrollLeft / panelWidth);
    const next = Math.max(0, Math.min(chainPanels.length - 1, current + direction));
    chainTrack.scrollTo({ left: next * panelWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  document.getElementById('chainPrev')?.addEventListener('click', () => moveChain(-1));
  document.getElementById('chainNext')?.addEventListener('click', () => moveChain(1));
  chainTrack?.addEventListener('scroll', () => {
    if (window.innerWidth > 900 || !chainPosition) return;
    const panelWidth = chainPanels[0]?.getBoundingClientRect().width || 1;
    const current = Math.max(0, Math.min(chainPanels.length - 1, Math.round(chainTrack.scrollLeft / panelWidth)));
    chainPosition.textContent = `${current + 1} of ${chainPanels.length}`;
  }, { passive: true });

  // 5. Ruling Explorer Data & Interactive Switcher
  const rulingData = {
    single: {
      number: '01',
      title: 'Single Line Ruled',
      desc: 'Standard horizontal ruling with precision blue lines and red vertical left margin. Ideal for school essays, college lecture notes, and general everyday writing.',
      specs: [
        ['Line Spacing', '8 mm'],
        ['Paper Grade', 'High-Brightness Woodfree 58-70 GSM'],
        ['Ink Compatibility', 'Ballpoint, Gel & Fountain Pen']
      ],
      previewClass: 'single-line-preview'
    },
    fourline: {
      number: '02',
      title: '4-Line (Red & Blue)',
      desc: 'Four calibrated guidelines with dual red bounds and dual inner blue lines designed specifically for primary students mastering English handwriting proportion.',
      specs: [
        ['Guideline System', '4-Line calibrated cursive balance'],
        ['Margins', 'Red vertical border margin'],
        ['Grades', 'Nursery to Standard 4 Primary Education']
      ],
      previewClass: 'four-line-preview'
    },
    square: {
      number: '03',
      title: 'Square Grid (Maths & Tables)',
      desc: 'Accurately spaced square grid layout for arithmetic, tabular calculations, geometry diagrams, and structural notes.',
      specs: [
        ['Grid Dimension', '9 mm / 10 mm precision box'],
        ['Line Tone', 'Non-intrusive soft blue ink'],
        ['Usage', 'Mathematics, Science & Statistics']
      ],
      previewClass: 'square-preview'
    },
    unruled: {
      number: '04',
      title: 'Unruled / Plain Blank',
      desc: 'Pure, crisp white woodfree pages without any lines. Perfect for freehand drawing, geometric constructions, diagrams, and artistic ideation.',
      specs: [
        ['Page Surface', 'Smooth satin unruled finish'],
        ['Opacity', 'High opacity, zero reverse shadow'],
        ['Usage', 'Sketches, Rough Work & Geometry']
      ],
      previewClass: 'unruled-preview'
    },
    ledger: {
      number: '05',
      title: 'Commercial Ledger & Accounts',
      desc: 'Specialized accounting ruling with dual debit/credit columns, folio markers, and cash book demarcations printed for long-term audit endurance.',
      specs: [
        ['Format', 'Journal, Cash Book & Ledger columns'],
        ['Binding Compatibility', 'Calico cloth & heavy case bound'],
        ['Usage', 'CA Firms, Retailers & Business Accounts']
      ],
      previewClass: 'ledger-preview'
    }
  };

  const sheetPreview = document.getElementById('sheetPreview');
  const rulingNumber = document.getElementById('rulingNumber');
  const rulingTitle = document.getElementById('rulingTitle');
  const rulingDesc = document.getElementById('rulingDescription');
  const rulingSpecs = document.getElementById('rulingSpecs');
  const paperStage = document.querySelector('.paper-stage');

  document.querySelectorAll('[data-ruling]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-ruling]').forEach(b => b.setAttribute('aria-selected', 'false'));
      tab.setAttribute('aria-selected', 'true');
      const rKey = tab.dataset.ruling;
      const data = rulingData[rKey];
      if (!data || !paperStage) return;

      paperStage.classList.add('is-changing');
      setTimeout(() => {
        if (rulingNumber) rulingNumber.textContent = data.number;
        if (rulingTitle) rulingTitle.textContent = data.title;
        if (rulingDesc) rulingDesc.textContent = data.desc;
        if (rulingSpecs) {
          rulingSpecs.innerHTML = data.specs.map(([k, v]) => `<span><b>${k}:</b> ${v}</span>`).join('');
        }
        if (sheetPreview) {
          sheetPreview.className = `notebook-sheet-preview ${data.previewClass}`;
        }
        paperStage.classList.remove('is-changing');
      }, 180);
    });
  });

  // 6. Quality Comparison Slider
  const compare = document.getElementById('compare');
  const compareRange = document.getElementById('compareRange');
  const compareTop = document.getElementById('compareTop');
  const compareLine = document.getElementById('compareLine');

  if (compareRange && compareTop && compareLine) {
    const updateCompare = () => {
      const val = Number(compareRange.value);
      const pct = `${val}%`;
      compareTop.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
      compareTop.style.webkitClipPath = `inset(0 ${100 - val}% 0 0)`;
      compareLine.style.left = pct;
    };
    compareRange.addEventListener('input', updateCompare);
    compareRange.addEventListener('change', updateCompare);
    updateCompare();

    if (compare) {
      let isDragging = false;
      const setSliderFromPointer = (e) => {
        const rect = compare.getBoundingClientRect();
        if (rect.width <= 0) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        if (typeof clientX !== 'number') return;
        const x = clientX - rect.left;
        const pct = Math.max(5, Math.min(95, Math.round((x / rect.width) * 100)));
        compareRange.value = pct;
        updateCompare();
      };

      compare.addEventListener('pointerdown', (e) => {
        isDragging = true;
        setSliderFromPointer(e);
      });
      window.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        setSliderFromPointer(e);
      });
      window.addEventListener('pointerup', () => {
        isDragging = false;
      });
      window.addEventListener('pointercancel', () => {
        isDragging = false;
      });
    }
  }

  // 7. Industry Switcher
  const industryTitle = document.getElementById('industryTitle');
  const industryDetail = document.getElementById('industryDetail');
  const industryDisplay = document.querySelector('.industry-display');
  const industryDisplayImage = document.getElementById('industryDisplayImage');

  document.querySelectorAll('[data-industry]').forEach(btn => {
    const pickIndustry = () => {
      document.querySelectorAll('[data-industry]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      if (!industryDisplay) return;

      industryDisplay.classList.add('is-changing');
      setTimeout(() => {
        if (industryTitle) industryTitle.textContent = btn.dataset.industry;
        if (industryDetail) industryDetail.textContent = btn.dataset.detail;
        if (industryDisplayImage && btn.dataset.img) {
          industryDisplayImage.style.backgroundImage = `url('${btn.dataset.img}')`;
          industryDisplayImage.setAttribute('aria-label', `${btn.dataset.industry} environment`);
        }
        industryDisplay.classList.remove('is-changing');
      }, 180);
    };
    btn.addEventListener('click', pickIndustry);
  });

  // 8. Factory Video Modal
  const videoModal = document.getElementById('videoModal');
  const modalVideoPlayer = document.getElementById('modalVideoPlayer');
  const modalVideoFrame = document.getElementById('modalVideoFrame');
  const closeVideoModalBtn = document.getElementById('closeVideoModalBtn');
  const videoBackdrop = document.getElementById('videoModalBackdrop');
  const heroPlayVideoBtn = document.getElementById('heroPlayVideoBtn');
  const openVideoModalBtn = document.getElementById('openVideoModalBtn');
  const driveEmbedUrl = 'https://drive.google.com/file/d/1DOlOTDlwVoY3LvEV1JHB4-PfBNDW6wzi/preview';

  const videoSoundToggleBtn = document.getElementById('videoSoundToggleBtn');
  const soundBadgeIcon = document.getElementById('soundBadgeIcon');
  const soundBadgeText = document.getElementById('soundBadgeText');
  let soundBadgeHideTimer = null;

  const updateSoundBadgeUI = () => {
    if (!modalVideoPlayer || !videoSoundToggleBtn) return;
    clearTimeout(soundBadgeHideTimer);
    if (modalVideoPlayer.muted || modalVideoPlayer.volume === 0) {
      videoSoundToggleBtn.classList.remove('is-unmuted');
      if (soundBadgeIcon) soundBadgeIcon.textContent = '🔇';
      if (soundBadgeText) soundBadgeText.textContent = 'Sound is Off · Tap to Unmute';
      videoSoundToggleBtn.style.display = 'inline-flex';
      videoSoundToggleBtn.style.opacity = '1';
    } else {
      videoSoundToggleBtn.classList.add('is-unmuted');
      if (soundBadgeIcon) soundBadgeIcon.textContent = '🔊';
      if (soundBadgeText) soundBadgeText.textContent = 'Sound ON';
      videoSoundToggleBtn.style.display = 'inline-flex';
      videoSoundToggleBtn.style.opacity = '1';
      soundBadgeHideTimer = setTimeout(() => {
        if (!modalVideoPlayer.muted && videoSoundToggleBtn) {
          videoSoundToggleBtn.style.opacity = '0';
          setTimeout(() => {
            if (!modalVideoPlayer.muted && videoSoundToggleBtn) videoSoundToggleBtn.style.display = 'none';
          }, 350);
        }
      }, 2500);
    }
  };

  const toggleSound = (e) => {
    if (e) e.stopPropagation();
    if (!modalVideoPlayer) return;
    modalVideoPlayer.muted = !modalVideoPlayer.muted;
    if (!modalVideoPlayer.muted) modalVideoPlayer.volume = 1.0;
    updateSoundBadgeUI();
  };

  videoSoundToggleBtn?.addEventListener('click', toggleSound);
  modalVideoPlayer?.addEventListener('volumechange', updateSoundBadgeUI);
  modalVideoPlayer?.addEventListener('click', () => {
    if (modalVideoPlayer.muted) {
      modalVideoPlayer.muted = false;
      modalVideoPlayer.volume = 1.0;
      updateSoundBadgeUI();
    }
  });

  const openVideo = () => {
    if (videoModal) {
      videoModal.classList.add('is-open');
      videoModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    }
    if (modalVideoPlayer) {
      modalVideoPlayer.style.display = 'block';
      if (modalVideoFrame) modalVideoFrame.style.display = 'none';
      modalVideoPlayer.currentTime = 0;
      modalVideoPlayer.muted = false;
      modalVideoPlayer.volume = 1.0;
      updateSoundBadgeUI();

      modalVideoPlayer.play().catch(err => {
        console.warn('Unmuted autoplay prevented by browser policy; starting muted with unmute badge ready:', err);
        modalVideoPlayer.muted = true;
        updateSoundBadgeUI();
        modalVideoPlayer.play().catch(() => {});
      });
    } else if (modalVideoFrame) {
      modalVideoFrame.style.display = 'block';
      modalVideoFrame.src = driveEmbedUrl;
    }
  };

  const closeVideo = () => {
    if (modalVideoPlayer) {
      modalVideoPlayer.pause();
    }
    if (modalVideoFrame) {
      modalVideoFrame.src = '';
    }
    if (videoModal) {
      videoModal.classList.remove('is-open');
      videoModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }
  };

  heroPlayVideoBtn?.addEventListener('click', openVideo);
  openVideoModalBtn?.addEventListener('click', openVideo);
  closeVideoModalBtn?.addEventListener('click', closeVideo);
  videoBackdrop?.addEventListener('click', closeVideo);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal?.classList.contains('is-open')) closeVideo();
  });

  // 9. Intersection Observer for Scroll Reveals
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // 10. PRODUCT CATALOG & INQUIRY BASKET ENGINE
  const allProducts = window.RAJGURU_PRODUCTS || [];
  const productsGrid = document.getElementById('productsGrid');
  const catalogSearch = document.getElementById('catalogSearch');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const pageCountFilter = document.getElementById('pageCountFilter');
  const sortOrder = document.getElementById('sortOrder');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const catalogPagination = document.getElementById('catalogPagination');
  const catalogCountText = document.getElementById('catalogCountText');

  // Filter state
  let currentCategory = 'all';
  let searchQuery = '';
  let selectedPageRange = 'all';
  let currentSort = 'default';
  let visibleCount = 24;



  function filterAndSortProducts() {
    return allProducts.filter(item => {
      // Category match
      if (currentCategory !== 'all' && item.category !== currentCategory) {
        return false;
      }

      // Search match (code, series, category, ruling)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = (
          (item.code && item.code.toLowerCase().includes(q)) ||
          (item.series && item.series.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q)) ||
          (item.ruling && item.ruling.toLowerCase().includes(q))
        );
        if (!match) return false;
      }

      // Page Count Filter
      if (selectedPageRange !== 'all') {
        const pages = parseInt(item.pages, 10);
        if (isNaN(pages)) return false;
        if (selectedPageRange === '1-80' && pages > 80) return false;
        if (selectedPageRange === '81-160' && (pages < 81 || pages > 160)) return false;
        if (selectedPageRange === '161-260' && (pages < 161 || pages > 260)) return false;
        if (selectedPageRange === '261+' && pages < 261) return false;
      }

      return true;
    }).sort((a, b) => {
      const pA = parseInt(a.pages, 10) || 0;
      const pB = parseInt(b.pages, 10) || 0;

      if (currentSort === 'pages-asc') return pA - pB;
      if (currentSort === 'pages-desc') return pB - pA;
      return 0;
    });
  }

  function renderCatalog(resetCount = false) {
    if (!productsGrid) return;
    if (resetCount) visibleCount = 24;

    const filtered = filterAndSortProducts();
    const toShow = filtered.slice(0, visibleCount);

    if (catalogCountText) {
      catalogCountText.textContent = `Showing ${toShow.length} of ${filtered.length} products`;
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fff; border-radius: 8px;">
          <h3 style="margin-bottom: 8px; font-size: 1.3rem;">No products found</h3>
          <p style="color: #6c7880;">Try adjusting your search keywords, page filters or select 'All Categories'.</p>
        </div>
      `;
      if (catalogPagination) catalogPagination.style.display = 'none';
      return;
    }

    // Official Rajguru Product Catalog Cover Imagery from Google Drive
    function getProductImage(item) {
      const s = (item.series || '').toUpperCase();
      const cat = (item.category || '').toUpperCase();
      const code = (item.code || '').toUpperCase();

      // 1. Direct Series Matches from Google Drive Folder
      if (s.includes('BIG BOSS') || s.includes('BIG-BOSS')) return 'assets/catalog/01_Big_Boss.png';
      if (s.includes('HONOUR')) return 'assets/catalog/02_Honour_of_India.png';
      if (s.includes('SUPER DELUXE')) return 'assets/catalog/03_super_deluxe_copy.png';
      if (s.includes('EXCEL') || s.includes('BOND')) return 'assets/catalog/04_NoteBook_Excel_Bond.png';
      if (s.includes('ALTO')) return 'assets/catalog/05_Alto_jumbo_Brown.jpg';
      if (s.includes('HANDSOME')) return 'assets/catalog/06_NB_Handsome.png';
      if (s.includes('RITZ')) return 'assets/catalog/07_Ritz.png';
      if (s.includes('AMAR')) return 'assets/catalog/08_Amar.png';
      if (s.includes('HI-SPEED') || s.includes('HI SPEED')) return 'assets/catalog/09_Hi-_Speed.JPG';
      if (s.includes('KHUSHI')) return 'assets/catalog/10_khushi_Soft.png';
      if (s.includes('SAFARI')) return 'assets/catalog/11_safari.png';
      if (s.includes('KANSAGAR')) return 'assets/catalog/12_Kansagar.png';
      if (s.includes('PUNEETH')) return 'assets/catalog/13_Puneeth.png';
      if (s.includes('CRICKETER')) return 'assets/catalog/14_Cricketer.jpg';
      if (s.includes('BROWN')) return 'assets/catalog/15_Brown.png';
      if (s.includes('SOFTY')) return 'assets/catalog/16_softy_.png';
      if (s.includes('PREMIUM')) return 'assets/catalog/18_Premium.png';
      if (s.includes('SONATA')) return 'assets/catalog/19_Sonata.png';
      if (s.includes('EXAM GOLD') || s.includes('EXAM-GOLD')) return 'assets/catalog/7_no_Exam_gold_inside_.png';
      if (s.includes('BATAKA')) return 'assets/catalog/6x4_BATAKA.png';
      if (s.includes('2 IN 1') || s.includes('2-IN-1')) return 'assets/catalog/2_in_1_A4.png';
      if (s.includes('3 IN 1') || s.includes('3-IN-1')) return 'assets/catalog/3_in_1_A4.png';
      if (s.includes('FLAP') || s.includes('COBRA') || s.includes('FILE') || s.includes('FOLDER')) return 'assets/catalog/2_Flpa_SPL.png';

      // 2. Category-Specific High Resolution Pools
      let hash = 0;
      for (let i = 0; i < code.length; i++) hash = (hash * 31 + code.charCodeAt(i)) >>> 0;

      if (cat.includes('SCHOOL')) {
        const pool = ['assets/catalog/1.png', 'assets/catalog/2.png', 'assets/catalog/3.png', 'assets/catalog/15_Brown.png', 'assets/catalog/14_Cricketer.jpg'];
        return pool[hash % pool.length];
      }
      if (cat.includes('KING SIZE')) {
        const pool = ['assets/catalog/01_Big_Boss.png', 'assets/catalog/05_Alto_jumbo_Brown.jpg', 'assets/catalog/13_Puneeth.png', 'assets/catalog/04_NoteBook_Excel_Bond.png'];
        return pool[hash % pool.length];
      }
      if (cat.includes('LONG BOOK')) {
        const pool = ['assets/catalog/2_in_1_A4.png', 'assets/catalog/3_in_1_A4.png', 'assets/catalog/03_super_deluxe_copy.png', 'assets/catalog/5.png'];
        return pool[hash % pool.length];
      }
      if (cat.includes('ROUGH')) {
        const pool = ['assets/catalog/6x4_BATAKA.png', 'assets/catalog/10_khushi_Soft.png', 'assets/catalog/6.png'];
        return pool[hash % pool.length];
      }
      if (cat.includes('REGISTER')) {
        const pool = ['assets/catalog/7_no_Super_deluxe_inside.png', 'assets/catalog/8_no_exam_gold_inside.png', 'assets/catalog/7_no_Super_inside.png', 'assets/catalog/7.png'];
        return pool[hash % pool.length];
      }
      if (cat.includes('COMMERCIAL') || cat.includes('ACCOUNT')) {
        const pool = ['assets/catalog/7_no_Super_inside.png', 'assets/catalog/8_no_exam_gold_inside.png', 'assets/catalog/8.png', 'assets/catalog/9.png'];
        return pool[hash % pool.length];
      }
      if (cat.includes('BILL') || cat.includes('RECEIPT')) {
        const pool = ['assets/catalog/6x4_BATAKA.png', 'assets/catalog/10.png', 'assets/catalog/11.png'];
        return pool[hash % pool.length];
      }
      if (cat.includes('GRAPH') || cat.includes('DRAWING')) {
        const pool = ['assets/catalog/12.png', 'assets/catalog/14.png', 'assets/catalog/16.png'];
        return pool[hash % pool.length];
      }
      if (cat.includes('PRACTICAL') || cat.includes('JOURNAL')) {
        const pool = ['assets/catalog/17.png', 'assets/catalog/18.png', 'assets/catalog/19.png'];
        return pool[hash % pool.length];
      }
      if (cat.includes('EXAM')) {
        return 'assets/catalog/7_no_Exam_gold_inside_.png';
      }
      if (cat.includes('FILE') || cat.includes('FOLDER')) {
        const pool = ['assets/catalog/2_Flpa_SPL.png', 'assets/catalog/2_Flap_got.png', 'assets/catalog/2_Flpa_SPL_back.png'];
        return pool[hash % pool.length];
      }

      return 'assets/catalog/01_Big_Boss.png';
    }

    productsGrid.innerHTML = toShow.map(item => {
      const pageDisplay = item.pages && item.pages !== '-' ? `${item.pages} Pages` : 'Stationery';
      const pktDisplay = item.per_pkt && item.per_pkt !== '-' ? `${item.per_pkt} pcs` : '-';
      const bundleDisplay = item.bundle && item.bundle !== '-' ? `${item.bundle} pcs` : '-';
      const prodImg = getProductImage(item);

      return `
        <article class="product-card" data-product-code="${item.code}">
          <div class="product-card-media">
            <img src="${prodImg}" alt="${item.series || 'Rajguru'} - ${item.category}" loading="lazy" />
            <span class="media-code">${item.code || 'SKU'}</span>
          </div>

          <div class="product-card-body">
            <div class="card-top">
              <span class="product-category-meta">${item.category}</span>
              <span class="product-b2b-pill">Wholesale Supply</span>
            </div>

            <h3 class="product-title">${item.series || 'Rajguru'}</h3>

            <ul class="product-specs-list">
              <li><span>Page Count:</span> <b>${pageDisplay}</b></li>
              <li><span>Per Packet:</span> <b>${pktDisplay}</b></li>
              <li><span>Bundle Pack:</span> <b>${bundleDisplay}</b></li>
            </ul>

            <div class="product-ruling-info">
              <strong>Ruling:</strong> ${item.ruling || 'Standard'}
            </div>

            <div class="card-actions">
              <a href="#contact" class="card-inquire-btn" data-sku="${item.code}">
                Inquire for Supply <span>→</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Toggle Load More button
    if (catalogPagination) {
      catalogPagination.style.display = visibleCount >= filtered.length ? 'none' : 'flex';
    }

    // Attach card inquire click listeners to pre-populate contact form
    productsGrid.querySelectorAll('.card-inquire-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sku = btn.dataset.sku;
        const reqField = document.getElementById('formRequirement');
        if (reqField && sku) {
          reqField.value = `Inquiring about SKU: ${sku}. Please provide bulk pricing, packaging specifications, and delivery timeline.`;
        }
      });
    });
  }

  // Category Pill Clicks
  document.querySelectorAll('#categoryPills .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#categoryPills .pill').forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      currentCategory = pill.dataset.cat;
      renderCatalog(true);
    });
  });

  // Category Spotlight Cards Click Listeners
  document.querySelectorAll('.cat-spotlight-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.cat;
      if (!cat) return;
      document.querySelectorAll('#categoryPills .pill').forEach(p => {
        p.classList.toggle('is-active', p.dataset.cat === cat);
      });
      currentCategory = cat;
      renderCatalog(true);
      const toolbar = document.querySelector('.catalog-toolbar');
      if (toolbar) toolbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Search Input Listener
  catalogSearch?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
    }
    renderCatalog(true);
  });

  clearSearchBtn?.addEventListener('click', () => {
    if (catalogSearch) catalogSearch.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    renderCatalog(true);
  });

  // Filter Listeners
  pageCountFilter?.addEventListener('change', (e) => {
    selectedPageRange = e.target.value;
    renderCatalog(true);
  });

  sortOrder?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderCatalog(false);
  });

  loadMoreBtn?.addEventListener('click', () => {
    visibleCount += 24;
    renderCatalog(false);
  });

  // Footer Category Link Shortcuts
  document.querySelectorAll('[data-filter-cat]').forEach(link => {
    link.addEventListener('click', (e) => {
      const cat = link.dataset.filterCat;
      const targetPill = document.querySelector(`.pill[data-cat="${cat}"]`);
      if (targetPill) {
        document.querySelectorAll('#categoryPills .pill').forEach(p => p.classList.remove('is-active'));
        targetPill.classList.add('is-active');
        currentCategory = cat;
        renderCatalog(true);
      }
    });
  });

  // 11. WHATSAPP INQUIRY TRANSMITTER
  function buildWhatsAppMessage() {
    const name = document.getElementById('formName')?.value || 'Valued Partner';
    const company = document.getElementById('formCompany')?.value || 'N/A';
    const city = document.getElementById('formCity')?.value || 'N/A';
    const interest = document.getElementById('formInterest')?.value || 'Notebooks & Stationery';
    const note = document.getElementById('formRequirement')?.value || 'Bulk supply quotation';

    let msg = `*RAJGURU BOOK MANUFACTURERS - INQUIRY*\n`;
    msg += `--------------------------------------\n`;
    msg += `*Name:* ${name}\n`;
    msg += `*Company / School:* ${company}\n`;
    msg += `*City:* ${city}\n`;
    msg += `*Category of Interest:* ${interest}\n\n`;
    msg += `*Requirement Details:*\n${note}\n\n`;
    msg += `Please provide bulk distribution pricing, catalog availability, and delivery schedule.`;
    return encodeURIComponent(msg);
  }

  const sendWhatsApp = () => {
    const phone = '919923443222';
    const text = buildWhatsAppMessage();
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  document.getElementById('sendWhatsAppBtn')?.addEventListener('click', sendWhatsApp);

  // 13. Enquiry Form Handler
  const enquiryForm = document.getElementById('enquiryForm');
  const formStatus = document.getElementById('formStatus');

  enquiryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!enquiryForm.reportValidity()) return;

    if (formStatus) {
      formStatus.className = 'form-status';
      formStatus.textContent = 'Preparing inquiry... Launching direct WhatsApp connection with Rajguru sales team.';
    }

    setTimeout(() => {
      sendWhatsApp();
      if (formStatus) {
        formStatus.textContent = 'Enquiry initiated! If WhatsApp did not open automatically, please reach us directly at +91 9923443222.';
      }
    }, 600);
  });

  // 14. Initialize catalog & UI
  renderCatalog(true);
  updateBasketUI();

  // 15. Dynamic Footer Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 16. Direct Section Deep Linking
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'instant', block: 'center' });
      }, 150);
    }
  }

})();
