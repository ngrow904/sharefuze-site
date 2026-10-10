const FORM_ENDPOINT = '';

/* ShareFuze landing page behaviour. */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  function handleScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(links.classList.contains('open')));
  });
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    document.documentElement.classList.add('js-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 0.08}s`;
      observer.observe(el);
    });
  }

  const form = document.getElementById('waitlist-form');
  const email = document.getElementById('waitlist-email');
  const btn = form.querySelector('button');
  const status = document.getElementById('form-status');
  const errorText = 'Could not join the list. Email ceo@sharefuze.com for early access.';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (btn.disabled || !form.reportValidity()) return;
    const address = email.value.trim();
    if (!address) return;

    if (!FORM_ENDPOINT) {
      status.textContent = 'Send the email draft to join. If it does not open, email ceo@sharefuze.com.';
      const subject = encodeURIComponent('ShareFuze early access');
      const body = encodeURIComponent(`Please send me ShareFuze early-access news.\nEmail: ${address}`);
      window.location.href = `mailto:ceo@sharefuze.com?subject=${subject}&body=${body}`;
      return;
    }

    if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(FORM_ENDPOINT)) {
      status.textContent = errorText;
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';
    status.textContent = '';
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams({ email: address })
      });
      if (!response.ok) throw new Error('Sign-up failed');
      status.textContent = 'Thanks, you are on the list';
      form.reset();
    } catch {
      status.textContent = errorText;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Get early access';
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href.startsWith('#modal-')) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  function setupModal(triggerId, modalId) {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    const closeBtn = modal.querySelector('.modal-close-btn');
    let previousFocus;

    function close() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (previousFocus) previousFocus.focus();
    }
    trigger.addEventListener('click', e => {
      e.preventDefault();
      previousFocus = document.activeElement;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      closeBtn.focus();
    });
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', e => {
      if (e.target === modal) close();
    });
    modal.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
      if (e.key === 'Tab') {
        const focusable = [...modal.querySelectorAll('button, a[href]')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
  setupModal('link-privacy', 'modal-privacy');
  setupModal('link-terms', 'modal-terms');
  setupModal('link-security', 'modal-security');
});
