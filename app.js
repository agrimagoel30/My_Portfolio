document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing curve
    smoothWheel: true,
    smoothTouch: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Custom Cursor & Spotlight Glow (Desktop Only)
  const cursor = document.getElementById('custom-cursor');
  const cursorGlow = document.getElementById('custom-cursor-glow');

  if (cursor && cursorGlow && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      
      cursor.style.left = `${clientX}px`;
      cursor.style.top = `${clientY}px`;
      
      cursorGlow.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
      }, { duration: 500, fill: 'forwards' });
    });

    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .bento-card, .skill-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.backgroundColor = 'rgba(94, 234, 212, 0.2)';
        cursor.style.boxShadow = '0 0 15px rgba(94, 234, 212, 0.4)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '8px';
        cursor.style.height = '8px';
        cursor.style.backgroundColor = 'var(--primary-accent)';
        cursor.style.boxShadow = '0 0 10px var(--primary-accent)';
      });
    });
  }

  // Interactive Particle Node Canvas Backdrop in Hero
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update(mouseX, mouseY) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce at boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Repel from mouse coordinates
        if (mouseX !== undefined && mouseY !== undefined) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 1.5;
            this.y += Math.sin(angle) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(94, 234, 212, 0.2)';
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleDensity = Math.min(80, Math.floor((width * height) / 20000));
      for (let i = 0; i < particleDensity; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();
    window.addEventListener('resize', initParticles);

    let mouseX, mouseY;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
      mouseX = undefined;
      mouseY = undefined;
    });

    const animateCanvas = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.update(mouseX, mouseY);
        p.draw();

        // Connect close lines
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(94, 234, 212, ${0.1 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animateCanvas);
    };
    animateCanvas();
  }

  // Bento Card, Project Mockup Wrapper, and Skill Card - Spotlight & 3D Tilt
  const tiltCards = document.querySelectorAll('.bento-card, .project-media-wrapper, .skill-card, .timeline-content');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (window.innerWidth > 768) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((centerY - y) / centerY) * 8; // degrees
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // Magnetic Button Effect
  const magneticItems = document.querySelectorAll('.magnetic');
  magneticItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      item.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translate(0, 0)';
    });
  });

  // Navigation Pill Indicator System
  const navMenu = document.querySelector('.navbar-menu');
  const indicator = document.querySelector('.nav-indicator-pill');
  const navLinks = document.querySelectorAll('.nav-link');

  const setIndicatorToActive = () => {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink && indicator && navMenu) {
      const rect = activeLink.getBoundingClientRect();
      const menuRect = navMenu.getBoundingClientRect();
      indicator.style.width = `${rect.width}px`;
      indicator.style.height = `${rect.height}px`;
      indicator.style.left = `${rect.left - menuRect.left}px`;
      indicator.style.top = `${rect.top - menuRect.top}px`;
      indicator.style.opacity = '1';
    }
  };

  setTimeout(setIndicatorToActive, 150);

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      if (!indicator || !navMenu) return;
      const rect = link.getBoundingClientRect();
      const menuRect = navMenu.getBoundingClientRect();
      indicator.style.width = `${rect.width}px`;
      indicator.style.height = `${rect.height}px`;
      indicator.style.left = `${rect.left - menuRect.left}px`;
      indicator.style.top = `${rect.top - menuRect.top}px`;
      indicator.style.opacity = '1';
    });
  });

  if (navMenu) {
    navMenu.addEventListener('mouseleave', setIndicatorToActive);
  }

  // Interactive Typing Terminal Simulation
  const runTerminalSimulation = (card) => {
    const typingEl = card.querySelector('.typing-text');
    const lines = card.querySelectorAll('.terminal-line.output');
    const command = 'compile-skills --optimize';
    let charIndex = 0;
    
    const typeCommand = () => {
      if (charIndex < command.length) {
        typingEl.textContent += command.charAt(charIndex);
        charIndex++;
        setTimeout(typeCommand, 50);
      } else {
        let lineIndex = 0;
        const showNextLine = () => {
          if (lineIndex < lines.length) {
            lines[lineIndex].classList.add('visible');
            lineIndex++;
            setTimeout(showNextLine, 500);
          }
        };
        setTimeout(showNextLine, 250);
      }
    };
    typeCommand();
  };

  // Numeric Stats Counters Animation
  const animateStats = (item) => {
    const numberEl = item.querySelector('.stat-number');
    const target = parseFloat(numberEl.getAttribute('data-target'));
    const isFloat = target % 1 !== 0;
    
    let count = 0;
    const duration = 2000;
    const start = performance.now();

    const update = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = progress * (2 - progress);
      const current = easedProgress * target;

      if (isFloat) {
        numberEl.textContent = current.toFixed(1);
      } else {
        numberEl.textContent = Math.floor(current);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        numberEl.textContent = target;
      }
    };
    requestAnimationFrame(update);
  };

  // Cinematic Intersection Observer for Reveal Elements & Counters
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        if (entry.target.classList.contains('bento-card-center') || entry.target.id === 'stats' || entry.target.classList.contains('about-grid')) {
          const stats = entry.target.querySelectorAll('.stats-item');
          stats.forEach(stat => {
            if (!stat.classList.contains('animated')) {
              stat.classList.add('animated');
              animateStats(stat);
            }
          });
        }

        if (entry.target.classList.contains('terminal-card')) {
          if (!entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            runTerminalSimulation(entry.target);
          }
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
  
  const statCards = document.querySelectorAll('.bento-card-center');
  statCards.forEach(card => observer.observe(card));

  // Timeline Progress Scroll Drawing
  const timeline = document.querySelector('.timeline');
  const progressLine = document.getElementById('timeline-progress-line');

  const drawTimeline = () => {
    if (!timeline || !progressLine) return;
    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    const startY = rect.top - windowHeight * 0.7;
    const timelineHeight = rect.height;
    
    let progress = -startY / (timelineHeight - windowHeight * 0.45);
    progress = Math.max(0, Math.min(1, progress));
    
    progressLine.setAttribute('stroke-dashoffset', (100 - (progress * 100)).toString());
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
      const dot = item.querySelector('.timeline-dot');
      const dotRect = dot.getBoundingClientRect();
      
      if (dotRect.top < windowHeight * 0.65) {
        item.classList.add('timeline-active');
      } else {
        item.classList.remove('timeline-active');
      }
    });
  };

  // Scroll Actions Callback (Lenis Integration)
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const onScroll = () => {
    // Navbar Visual Compression
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll active link highlight
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      let changed = false;
      navLinks.forEach(link => {
        const wasActive = link.classList.contains('active');
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSectionId) {
          link.classList.add('active');
          if (!wasActive) changed = true;
        }
      });
      if (changed) {
        setIndicatorToActive();
      }
    }

    // Draw Timeline SVG
    drawTimeline();

    // Scroll Parallax for Project Mockups
    const projectMedia = document.querySelectorAll('.project-media');
    projectMedia.forEach(media => {
      const rect = media.getBoundingClientRect();
      const speed = 0.08;
      const yOffset = (rect.top - window.innerHeight / 2) * speed;
      // Restrain translate range & scale image
      media.style.transform = `scale(1.06) translateY(${yOffset}px)`;
    });
  };

  // Bind scrolling mechanisms
  lenis.on('scroll', onScroll);

  window.addEventListener('resize', () => {
    onScroll();
    setIndicatorToActive();
  });

  // Form submission handler
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      formStatus.textContent = 'Verifying security gates...';
      formStatus.className = 'form-status';
      
      setTimeout(() => {
        formStatus.textContent = 'Sending secure telemetry transmission...';
        
        setTimeout(() => {
          formStatus.textContent = 'Transmission established successfully! Aiden will review shortly.';
          formStatus.className = 'form-status success';
          contactForm.reset();
        }, 1500);
      }, 1000);
    });
  }
});
