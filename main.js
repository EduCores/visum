/* ══════════════════════════════════════════════
   VISUM – MEDICINA OCULAR  |  main.js
   ══════════════════════════════════════════════ */

// ─── NAVBAR SCROLL ───────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── MOBILE HAMBURGER ────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks.querySelectorAll('.nav-link, .btn-nav').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── SCROLL REVEAL ──────────────────────────
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => el.classList.add('visible'), el.dataset.delay || 0);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    // Stagger sibling cards
    const parent = el.closest('.services-grid, .patologias-grid, .test-grid, .about-pillars, .tech-list, .contact-details');
    if (parent) {
      const siblings = parent.querySelectorAll(':scope > .reveal, :scope > div > .reveal');
      const idx = [...siblings].indexOf(el);
      el.dataset.delay = idx * 90;
    }
    observer.observe(el);
  });
}
initReveal();

// ─── COUNTER ANIMATION ──────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 2200;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('es-CO');
  }, step);
}

const statsSection = document.getElementById('hero-stats');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
if (statsSection) statsObserver.observe(statsSection);

// ─── SMOOTH ACTIVE NAV LINK ─────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const activateNav = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinkEls.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'white'
      : '';
    link.style.background = link.getAttribute('href') === `#${current}`
      ? 'rgba(255,255,255,0.12)'
      : '';
  });
};
window.addEventListener('scroll', activateNav, { passive: true });

// ─── PARALLAX HERO ──────────────────────────
const heroImg = document.getElementById('hero-img');
window.addEventListener('scroll', () => {
  if (heroImg && window.scrollY < window.innerHeight) {
    heroImg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.15}px)`;
  }
}, { passive: true });

// ─── FORM SUBMISSION ────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const btn  = document.getElementById('btn-submit');
  const text = document.getElementById('btn-submit-text');
  const icon = document.getElementById('btn-submit-icon');

  btn.disabled = true;
  text.textContent = 'Enviando...';
  icon.textContent = '⏳';

  setTimeout(() => {
    document.getElementById('contact-form').classList.add('hidden');
    document.getElementById('form-success').classList.remove('hidden');
  }, 1800);
}

function resetForm() {
  document.getElementById('contact-form').reset();
  document.getElementById('contact-form').classList.remove('hidden');
  document.getElementById('form-success').classList.add('hidden');
  const btn  = document.getElementById('btn-submit');
  document.getElementById('btn-submit-text').textContent = 'Enviar Solicitud';
  document.getElementById('btn-submit-icon').textContent = '→';
  btn.disabled = false;
}

// ─── SERVICE CARD HOVER TILT ────────────────
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── TECH ITEMS ENTRY STAGGER ───────────────
document.querySelectorAll('.tech-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.08}s`;
});

// ─── DOCTORS DIRECTORY FILTERING ────────────
const searchInput = document.getElementById('doctor-search');
const filterBtns = document.querySelectorAll('.filter-btn');
const doctorCards = document.querySelectorAll('.doctor-card');

function filterDoctors() {
  const searchTerm = searchInput.value.toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

  doctorCards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const specs = card.dataset.specialties.toLowerCase();
    const matchesSearch = name.includes(searchTerm) || specs.includes(searchTerm);
    const matchesFilter = activeFilter === 'all' || specs.includes(activeFilter);

    if (matchesSearch && matchesFilter) {
      card.classList.remove('hidden-doctor');
      // Re-trigger reveal animation check
      card.classList.add('visible'); 
    } else {
      card.classList.add('hidden-doctor');
    }
  });
}

if (searchInput) {
  searchInput.addEventListener('input', filterDoctors);
}

if (filterBtns) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterDoctors();
    });
  });
}

// ─── PATOLOGIA DATA ─────────────────────────
const patologiasData = {
  'pat-cataratas': {
    title: 'Cirugía de Cataratas',
    desc: 'La catarata es la opacidad del lente natural del ojo (cristalino). Nuestra cirugía de alta precisión reemplaza este lente por uno artificial premium para devolverle la nitidez.',
    details: [
      'Procedimiento ambulatorio de 15-20 minutos.',
      'Anestesia tópica (gotas), sin inyecciones.',
      'Recuperación visual rápida en 24-48 horas.',
      'Implante de lentes intraoculares multifocales.'
    ]
  },
  'pat-glaucoma': {
    title: 'Cirugía de Glaucoma',
    desc: 'El glaucoma es una enfermedad que daña el nervio óptico de forma silenciosa. Diagnosticamos y tratamos de forma temprana para proteger su visión.',
    details: [
      'Tratamiento con SLT (Trabeculoplastía Láser).',
      'Cirugías filtrantes de alta precisión.',
      'Monitoreo continuo de presión intraocular.',
      'Prevención de daño irreversible al nervio óptico.'
    ]
  },
  'pat-oculoplastica': {
    title: 'Cirugía Oculoplástica',
    desc: 'Cirugía plástica ocular enfocada en la función y estética de los párpados, vía lagrimal y órbita.',
    details: [
      'Corrección de párpados caídos (ptosis).',
      'Tratamiento de bolsas y exceso de piel.',
      'Cirugía de vía lagrimal obstruida.',
      'Reconstrucción post-trauma o tumores.'
    ]
  },
  'pat-estetica': {
    title: 'Estética Oculofacial',
    desc: 'Procedimientos para rejuvenecer la mirada y el tercio superior del rostro con un enfoque natural y armonioso.',
    details: [
      'Aplicación de toxina botulínica.',
      'Rellenos con ácido hialurónico.',
      'Blefaroplastia no quirúrgica láser.',
      'Tratamientos para ojeras y Arrugas.'
    ]
  },
  'pat-retina': {
    title: 'Retina y Vitreo',
    desc: 'Atención especializada para las enfermedades que afectan la capa interna del ojo, fundamental para la visión central y detalle.',
    details: [
      'Manejo de Retinopatía Diabética.',
      'Cirugía de Desprendimiento de Retina.',
      'Tratamiento de Degeneración Macular (DMAE).',
      'Inyecciones intravítreas anti-angiogénicas.'
    ]
  },
  'pat-general': {
    title: 'Oftalmología General',
    desc: 'El primer paso para una buena salud visual. Realizamos chequeos completos para detectar cualquier anomalía a tiempo.',
    details: [
      'Examen de agudeza visual y refracción.',
      'Detección de ojo seco y alergias oculares.',
      'Control de presión ocular preventivo.',
      'Receta de lentes graduados de alta precisión.'
    ]
  },
  'pat-refractiva': {
    title: 'Cirugía Refractiva',
    desc: 'Libérese de los anteojos. Utilizamos tecnología láser avanzada para corregir defectos ópticos de forma permanente.',
    details: [
      'Técnica LASIK y PRK con laser excimer.',
      'Corrección de miopía, astigmatismo e hipermetropía.',
      'Procedimiento de 10 minutos por ojo.',
      'Independencia total de lentes de contacto.'
    ]
  },
  'pat-cornea': {
    title: 'Córnea y Superficie',
    desc: 'Especialistas en la salud de la ventana frontal del ojo y las capas que lo mantienen hidratado y protegido.',
    details: [
      'Tratamiento avanzado de Queratocono.',
      'Manejo de Úlceras y Distrofias corneales.',
      'Protocolos modernos para Ojo Seco severo.',
      'Trasplante de córnea (si es requerido).'
    ]
  }
};

// ─── DOCTOR DATA ────────────────────────────
const doctorsData = {
  'dr-hermosilla': {
    name: 'Dr. Victor Hermosilla Bucarey',
    title: 'Especialista en Córnea y Cirugía Refractiva',
    img: 'https://www.visum.cl/content/uploads/2020/04/8.png',
    bio: 'Médico Cirujano Universidad Austral. Especialidad en Oftalmología, Universidad de Chile. Miembro de la Sociedad Chilena de Oftalmología.',
    education: [
      'Postgrado en Segmento Anterior y Especialidad en Córnea, Universidad de Chile.',
      'Diplomado en Metodología de la Investigación Clínica, Universidad de Chile.',
      'Diplomado en Gestión de Instituciones de Salud, Universidad de Chile.'
    ],
    experience: [
      'Médico Oftalmólogo de planta en Hospital del Salvador.',
      'Docente de Postgrado de Oftalmología, Universidad de Chile.'
    ]
  },
  'dr-carvallo': {
    name: 'Dr. Alejandro Carvallo Velasco',
    title: 'Especialista en Córnea y Cirugía Plástica Ocular',
    img: 'https://www.visum.cl/content/uploads/2020/04/1.png',
    bio: 'Médico Cirujano Universidad de Chile. Especialidad en Oftalmología, Universidad de Chile. Experto en cirugía reconstructiva y estética ocular.',
    education: [
      'Postgrado en Segmento Anterior y Córnea, Hospital del Salvador, Universidad de Chile.',
      'Postgrado en Cirugía Plástica Ocular, Hospital del Salvador, Universidad de Chile.'
    ],
    experience: [
      'Especialista en Órbita y Oculoplastía.',
      'Miembro de la Sociedad Chilena de Oftalmología.'
    ]
  },
  'dr-fanjul': {
    name: 'Dr. Rodrigo Fanjul Dominguez',
    title: 'Especialista en Glaucoma y Queratocono',
    img: 'https://www.visum.cl/content/uploads/2020/05/6.png',
    bio: 'Médico Cirujano, Universidad de Valparaíso. Especialidad en Oftalmología, Universidad de Chile. Especialista en diagnóstico avanzado de glaucoma.',
    education: [
      'Perfeccionamiento en Glaucoma, Hospital Clínico Universidad de Chile (HCUCH).',
      'Especialista en Segmento Anterior y Microcirugía de Catarata.'
    ],
    experience: [
      'Ex-médico de planta en prestigiosas instituciones de salud pública y privada.'
    ]
  },
  'dr-prado': {
    name: 'Dr. Eduardo Prado Jeanront',
    title: 'Especialista en Cirugía Oculoplástica',
    img: 'https://www.visum.cl/content/uploads/2020/05/web-rect-DR-PRADO-2.jpg',
    bio: 'Especialista en cirugía plástica y reconstructiva ocular, así como en procedimientos refractivos de alta precisión.',
    education: [
      'Título de Médico Cirujano.',
      'Especialidad en Oftalmología certificada por CONACEM.'
    ],
    experience: [
      'Amplia trayectoria en cirugía reconstructiva de párpados y vías lagrimales.'
    ]
  },
  'dr-alvarez': {
    name: 'Dr. Rodrigo Álvarez Odone',
    title: 'Especialista en Oculoplástica y Cataratas',
    img: 'https://www.visum.cl/content/uploads/2020/05/visum-doctor.jpg',
    bio: 'Amplia experiencia en cirugía de cataratas y procedimientos de rejuvenecimiento periocular y reconstructivo.',
    education: [
      'Especialista en Oftalmología con enfoque en Segmento Anterior.',
      'Entrenamiento avanzado en Técnicas Oculoplásticas.'
    ],
    experience: [
      'Médico consultor en patologías del párpado y órbita.'
    ]
  },
  'dra-rao': {
    name: 'Dra. Xi Rao',
    title: 'Especialista en Oftalmología General',
    img: 'https://www.visum.cl/content/uploads/2020/04/figure7.png',
    bio: 'Dedicada al diagnóstico integral y seguimiento de la salud visual en adultos y controles preventivos.',
    education: [
      'Médico Cirujano con distinción máxima.',
      'Especialidad en Oftalmología Clínica.'
    ],
    experience: [
      'Control de salud visual y patologías oftalmológicas de baja y mediana complejidad.'
    ]
  },
  'dr-mayora': {
    name: 'Dr. Jaime Mayora Espinoza',
    title: 'Especialista en Retina y Vítreo',
    img: 'https://www.visum.cl/content/uploads/2020/05/7.png',
    bio: 'Experto en cirugía vitreorretinal y tratamiento de enfermedades complejas de la retina y mácula.',
    education: [
      'Subespecialidad en Retina Médica y Quirúrgica.',
      'Entrenamiento en centros de alta complejidad oftalmológica.'
    ],
    experience: [
      'Manejo de trauma ocular y desprendimiento de retina.'
    ]
  },
  'dr-riesco': {
    name: 'Dr. Benjamín Riesco Urrejola',
    title: 'Especialista en Cirugía de Párpados y Órbita',
    img: 'https://www.visum.cl/content/uploads/2021/01/4.png',
    bio: 'Especializado en cirugía de vía lagrimal y estética facial avanzada con un enfoque mínimamente invasivo.',
    education: [
      'Postgrado en Cirugía de Órbita, Párpados y Vías Lagrimales.',
      'Certificación internacional en procedimientos estéticos oculares.'
    ],
    experience: [
      'Especialista referente en Oculoplastía.'
    ]
  },
  'dr-fau': {
    name: 'Dr. Christian Fau Fuentes',
    title: 'Especialista en Glaucoma y Cirugía de Cataratas',
    img: 'https://www.visum.cl/content/uploads/2021/01/3.png',
    bio: 'Médico Cirujano Universidad de Chile. Especialidad en Oftalmología, Universidad de Chile. Amplia trayectoria en el manejo médico y quirúrgico del glaucoma.',
    education: [
      'Fellowship en Glaucoma, Universidad de Chile.',
      'Especialista en Microcirugía de Segmento Anterior.'
    ],
    experience: [
      'Miembro activo de la Sociedad Chilena de Oftalmología.'
    ]
  },
  'dr-munoz': {
    name: 'Dr. Eduardo Muñoz Merello',
    title: 'Especialista en Cataratas y Glaucoma',
    img: 'https://www.visum.cl/content/uploads/2021/01/5.png',
    bio: 'Especialista en microcirugía de cataratas y tratamiento de patologías oculares en adultos mayores.',
    education: [
      'Título de Médico Cirujano.',
      'Especialista en Oftalmología.'
    ],
    experience: [
      'Enfoque en salud visual integral para el adulto mayor.'
    ]
  },
  'dra-herrera': {
    name: 'Dra. Lorena Herrera Tourrel',
    title: 'Especialista en Oftalmopediatría y Estrabismo',
    img: 'https://www.visum.cl/content/uploads/2021/01/dralorenah2.jpg',
    bio: 'Dedicada a la salud visual infantil y al tratamiento quirúrgico y no quirúrgico del estrabismo en niños y adultos.',
    education: [
      'Subespecialidad en Oftalmología Pediátrica.',
      'Experta en estrabismo complejo.'
    ],
    experience: [
      'Reconocida trayectoria en el manejo de visión infantil.'
    ]
  }
};

// ─── MODAL CONTROLS ──────────────────────────
const modal = document.getElementById('visum-modal');
const modalInner = document.getElementById('modal-content');

function openModal(type, id = null) {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Show loader initially
  modalInner.innerHTML = '<div class="modal-loader"><div class="loader-spinner"></div></div>';

  // Simulate AJAX fetch
  setTimeout(() => {
    fetchModalContent(type, id);
  }, 400);
}

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

// Logic for Modal Content
function fetchModalContent(type, id) {
  let content = '';
  
  switch(type) {
    case 'doctor':
      const doc = doctorsData[id];
      if (doc) {
        content = `
          <div class="doctor-profile-modal">
            <div class="doctor-profile-header">
              <div class="doctor-profile-img">
                <img src="${doc.img}" alt="${doc.name}">
              </div>
              <div class="doctor-profile-info">
                <h2 class="doctor-profile-name">${doc.name}</h2>
                <p class="doctor-profile-title">${doc.title}</p>
                <div class="doctor-profile-tags">
                  <span class="profile-tag">Certificado CONACEM</span>
                  <span class="profile-tag">SOCHIOF</span>
                </div>
              </div>
            </div>
            
            <div class="doctor-profile-body">
              <div class="profile-section">
                <h3>Biografía Profesional</h3>
                <p>${doc.bio}</p>
              </div>
              
              <div class="profile-section">
                <h3>Formación Académica</h3>
                <ul>
                  ${doc.education.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
              
              <div class="profile-section">
                <h3>Experiencia y Membresías</h3>
                <ul>
                  ${doc.experience.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
              
              <div class="modal-actions">
                <a href="#contacto" class="btn btn-primary" onclick="closeModal()">Agendar Cita</a>
              </div>
            </div>
          </div>
        `;
      } else {
        content = '<p>Médico no encontrado.</p>';
      }
      break;

    case 'sustentabilidad':
      content = `
        <h2 class="section-title">Compromiso con el <span class="gradient-text">Planeta</span></h2>
        <p class="section-desc">En Visum, la salud visual va de la mano con el cuidado de nuestro entorno. Hemos implementado un sistema integral de sustentabilidad que incluye:</p>
        <ul class="service-features" style="margin-top: 24px;">
          <li>Reducción del 40% en uso de papel mediante digitalización clínica.</li>
          <li>Gestión responsable de residuos biológicos y químicos.</li>
          <li>Iluminación LED de bajo consumo en todas nuestras instalaciones.</li>
          <li>Programas de reciclaje de monturas y lentes para comunidades rurales.</li>
        </ul>
      `;
      break;
    case 'servicio':
      content = `
        <h2 class="section-title">Detalle del <span class="gradient-text">Servicio</span></h2>
        <p class="section-desc">Esta sección se está desarrollando para cargar los detalles específicos del tratamiento.</p>
        <div style="margin-top: 30px; padding: 20px; background: var(--neutral-100); border-radius: var(--radius-md);">
          <p><strong>Info:</strong> El ID del servicio seleccionado es ${id}. Estamos integrando protocolos médicos y tiempos de recuperación.</p>
        </div>
      `;
      break;
    case 'patologia':
      const pat = patologiasData[id];
      if (pat) {
        content = `
          <h2 class="section-title">${pat.title.split(' ').slice(0, -1).join(' ')} <span class="gradient-text">${pat.title.split(' ').pop()}</span></h2>
          <p class="section-desc">${pat.desc}</p>
          <div class="profile-section" style="margin-top: 24px;">
            <h3>Aspectos destacados del tratamiento:</h3>
            <ul class="service-features" style="margin-top: 16px;">
              ${pat.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
          </div>
          <div class="modal-actions">
            <a href="#contacto" class="btn btn-primary" onclick="closeModal()">Agendar Evaluación</a>
          </div>
        `;
      } else {
        content = '<p>Información de patología no encontrada.</p>';
      }
      break;
    default:
      content = '<h2>Información</h2><p>Contenido en desarrollo...</p>';
  }
  
  modalInner.innerHTML = `<div class="reveal visible">${content}</div>`;
}

// ─── ATTACH MODAL TO INTERACTIONS ───────────
document.querySelectorAll('.btn-sustentabilidad').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('sustentabilidad');
  });
});

document.querySelectorAll('.service-card .btn-nav').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const cardId = btn.closest('.service-card').id;
    if (cardId) {
      e.preventDefault();
      openModal('servicio', cardId);
    }
  });
});

document.querySelectorAll('.btn-patologia').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const cardId = btn.closest('.patologia-card').id;
    if (cardId) {
      e.preventDefault();
      openModal('patologia', cardId);
    }
  });
});

// ─── INIT ────────────────────────────────────
initReveal();
