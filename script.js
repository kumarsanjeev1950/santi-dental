document.addEventListener('DOMContentLoaded', () => {
  // 1. Light / Dark Glassmorphism Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  const applyTheme = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isDark));
    }
    if (themeIcon) {
      themeIcon.textContent = isDark ? '☀️' : '🌙';
    }
    if (themeLabel) {
      themeLabel.textContent = isDark ? 'Light' : 'Dark';
    }
  };

  const savedTheme = localStorage.getItem('shanti-theme');
  applyTheme(savedTheme === 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextDark = !document.body.classList.contains('dark-mode');
      applyTheme(nextDark);
      localStorage.setItem('shanti-theme', nextDark ? 'dark' : 'light');
    });
  }

  // 2. Mobile Navigation Drawer
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 3. 3D Tilt + Glare Effect on .tilt-card Elements
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    const glare = document.createElement('div');
    glare.className = 'tilt-glare';
    card.appendChild(glare);

    const maxTilt = parseFloat(card.dataset.tiltMax) || 7;

    card.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 2 * maxTilt;
      const rotateX = (0.5 - y) * 2 * maxTilt;

      card.classList.add('is-tilting');
      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
      card.style.setProperty('--glare-x', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--glare-y', `${(y * 100).toFixed(1)}%`);
    });

    const resetTilt = () => {
      card.classList.remove('is-tilting');
      card.style.transform = '';
    };

    card.addEventListener('pointerleave', resetTilt);
    card.addEventListener('pointercancel', resetTilt);
  });

  // 4. Appointment Form Submission
  const bookingForm = document.getElementById('bookingForm');
  const confirmationMessage = document.getElementById('confirmationMessage');
  const apptDateInput = document.getElementById('apptDate');

  if (apptDateInput) {
    const today = new Date().toISOString().split('T')[0];
    apptDateInput.min = today;
  }

  if (bookingForm && confirmationMessage) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('patientName').value.trim();
      const phone = document.getElementById('patientPhone').value.trim();
      const service = document.getElementById('serviceSelect').value;
      const date = document.getElementById('apptDate').value;
      const shift = document.getElementById('apptTime').value;

      confirmationMessage.innerHTML = `
        <strong>Appointment Request Received!</strong><br>
        Thank you, <strong>${name}</strong>. We have noted your request for <strong>${service}</strong> on <strong>${date}</strong> (${shift}) and will call <strong>${phone}</strong> shortly to confirm.
      `;
      confirmationMessage.classList.remove('hidden');
      bookingForm.reset();
    });
  }
});
