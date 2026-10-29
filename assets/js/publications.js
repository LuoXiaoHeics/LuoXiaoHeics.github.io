(function () {
  'use strict';

  var toc = document.querySelector('.publications-toc');
  if (!toc) return;

  var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
  var headings = links.map(function (link) {
    return document.getElementById(link.hash.slice(1));
  });
  var scheduled = false;

  function updateCurrentTopic() {
    var current = 0;
    headings.forEach(function (heading, index) {
      if (heading.getBoundingClientRect().top <= 110) current = index;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = headings.length - 1;
    }
    links.forEach(function (link, index) {
      if (index === current) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
    scheduled = false;
  }

  // Handle topic links before the theme's generic jQuery scroll handler.
  toc.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    var index = links.indexOf(link);
    if (index === -1) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.stopPropagation();
    if (window.location.hash !== link.hash) history.pushState(null, '', link.hash);
    headings[index].focus({ preventScroll: true });
    headings[index].scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  }, true);

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateCurrentTopic);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', scheduleUpdate);
  updateCurrentTopic();
}());
