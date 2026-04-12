// =============================================
// HOME.JS — lê config.json e atualiza o site
// =============================================

let config = null;

document.addEventListener('DOMContentLoaded', async function () {
  await loadConfig();
  updateCountdown();
  setInterval(updateCountdown, 1000);
});

// ── Carrega config.json ──
async function loadConfig() {
  try {
    const response = await fetch('config.json?t=' + Date.now());
    if (!response.ok) throw new Error('config.json não encontrado');
    config = await response.json();
    applyConfig();
  } catch (error) {
    console.error('Erro ao carregar config.json:', error);
  }
}

// ── Aplica todos os campos no DOM ──
function applyConfig() {
  if (!config) return;

  const t   = config.tournament   || {};
  const p   = config.players      || {};
  const r   = config.registration || {};
  const pay = config.payment      || {};
  const f   = config.form         || {};

  // Título e badge
  setTextById('tournamentName',  t.name);
  setTextById('tournamentBadge', t.badge);
  if (t.name) document.title = t.name + (t.badge ? ' ' + t.badge : '');

  // Botão de inscrição
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton && f.url) {
    ctaButton.onclick = () => window.open(f.url, '_self');
  }

  // Local e data
  const locationEl = document.getElementById('tournamentInfo');
  if (locationEl && t.location && t.date) {
    const date = new Date(t.date + 'T12:00:00');
    const formattedDate = isNaN(date)
      ? t.date
      : date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
    const afterMass = t.after_mass ? ', logo após a Santa Missa' : '';
    locationEl.innerHTML = `O torneio será realizado no <strong>${t.location}</strong>, no dia <strong>${formattedDate}</strong>, às <strong>${t.time || '8h'}</strong>${afterMass}.`;
  }

  // Jogadores
  setTextById('minAge',     p.min_age     || '13');
  setTextById('minPlayers', p.min_per_team || '5');
  setTextById('maxPlayers', p.max_per_team || '8');

  // Preço total
  setTextById('priceValue', r.total_price ? r.total_price + ' por time' : null);

  // Parcelas
  setTextById('installment1Value',    r.installment_1_value);
  setTextById('installment1Deadline', r.installment_1_deadline);
  setTextById('installment2Value',    r.installment_2_value);
  setTextById('installment2Deadline', r.installment_2_deadline);

  // Prêmio
  setTextById('prize', r.prize);

  // PIX e coordenador
  setTextById('pixKey',          pay.pix_key);
  setTextById('coordinatorName', pay.coordinator_name);

  // WhatsApp global
  if (pay.whatsapp) window.whatsappNumber = pay.whatsapp;
}

function setTextById(id, value) {
  if (!value) return;
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ── Contagem regressiva ──
function updateCountdown() {
  const dateStr = config?.tournament?.date || '2026-05-25';
  const timeStr = config?.tournament?.time || '08:00';
  const tournamentDate = new Date(`${dateStr}T${timeStr}:00`).getTime();
  const distance = tournamentDate - Date.now();

  if (isNaN(distance)) return;

  if (distance <= 0) {
    const el = document.getElementById('countdown');
    if (el) el.innerHTML = '<div class="countdown-finished">O torneio já começou!</div>';
    return;
  }

  const pad = n => String(Math.floor(n)).padStart(2, '0');
  setTextById('days',    pad(distance / (1000 * 60 * 60 * 24)));
  setTextById('hours',   pad((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  setTextById('minutes', pad((distance % (1000 * 60 * 60)) / (1000 * 60)));
  setTextById('seconds', pad((distance % (1000 * 60)) / 1000));
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function shareOnWhatsApp() {
  const phone = (window.whatsappNumber || '5521974563511').replace(/\D/g, '');
  const text  = encodeURIComponent('Olá, gostaria de tirar dúvidas sobre o torneio!');
  window.open('https://wa.me/' + phone + '?text=' + text, '_blank');
}