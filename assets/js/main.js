(function(){
  "use strict";

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header
  var header = document.getElementById('siteHeader');
  var onScroll = function(){
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', function(){
    document.body.classList.toggle('nav-open');
  });
  mainNav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ document.body.classList.remove('nav-open'); });
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  // Gallery tabs + category card links
  var masonry = document.getElementById('masonry');
  var tabBtns = document.querySelectorAll('.tab-btn');
  function setFilter(filter){
    tabBtns.forEach(function(b){ b.classList.toggle('active', b.dataset.tab === filter); });
    masonry.classList.remove('show-all', 'show-menswear', 'show-saree');
    if (filter === 'all') masonry.classList.add('show-all');
    else if (filter === 'menswear') masonry.classList.add('show-menswear');
    else masonry.classList.add('show-saree');
  }
  tabBtns.forEach(function(btn){
    btn.addEventListener('click', function(){ setFilter(btn.dataset.tab); });
  });
  document.querySelectorAll('.cat-link[data-filter]').forEach(function(link){
    link.addEventListener('click', function(){
      setFilter(link.dataset.filter);
    });
  });

  // Lightbox
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var currentItems = [];
  var currentIndex = 0;

  function visibleGalleryItems(){
    return Array.prototype.filter.call(masonry.querySelectorAll('.g-item'), function(item){
      return getComputedStyle(item).display !== 'none';
    });
  }

  function openLightbox(items, index){
    currentItems = items;
    currentIndex = index;
    var img = currentItems[currentIndex].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showDelta(delta){
    if (!currentItems.length) return;
    currentIndex = (currentIndex + delta + currentItems.length) % currentItems.length;
    var img = currentItems[currentIndex].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
  }

  masonry.addEventListener('click', function(e){
    var item = e.target.closest('.g-item');
    if (!item) return;
    var items = visibleGalleryItems();
    var index = items.indexOf(item);
    if (index === -1) return;
    openLightbox(items, index);
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function(){ showDelta(-1); });
  lbNext.addEventListener('click', function(){ showDelta(1); });
  lightbox.addEventListener('click', function(e){
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function(e){
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showDelta(-1);
    if (e.key === 'ArrowRight') showDelta(1);
  });

})();
