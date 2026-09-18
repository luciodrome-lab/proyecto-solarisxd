// Menú Móvil
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconBars = document.getElementById('menu-icon-bars');
    const iconClose = document.getElementById('menu-icon-close');

    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      iconBars.classList.toggle('hidden');
      iconClose.classList.toggle('hidden');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        iconBars.classList.remove('hidden');
        iconClose.classList.add('hidden');
      });
    });

    // Simulador Interactivo
    function setSimMode(mode) {
      const btnSol = document.getElementById('btn-mode-sol');
      const btnCorte = document.getElementById('btn-mode-corte');
      const btnNoche = document.getElementById('btn-mode-noche');
      
      const nodePaneles = document.getElementById('node-paneles');
      const nodeRegulador = document.getElementById('node-regulador');
      const nodeBateria = document.getElementById('node-bateria');
      const nodeHogar = document.getElementById('node-hogar');

      const descPaneles = document.getElementById('desc-paneles');
      const descRegulador = document.getElementById('desc-regulador');
      const descBateria = document.getElementById('desc-bateria');
      const descHogar = document.getElementById('desc-hogar');

      // Reset styles
      const inactiveClass = "px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-solaris-paperDim text-solaris-blue border border-solaris-line hover:border-solaris-blue/40 cursor-pointer transition-all duration-300";
      const activeClass = "px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-solaris-green text-white shadow-md shadow-solaris-green/30 cursor-pointer transition-all duration-300";

      [btnSol, btnCorte, btnNoche].forEach(b => {
        b.className = inactiveClass;
      });

      if (mode === 'sol') {
        btnSol.className = activeClass;
        descPaneles.textContent = "Generando potencia máxima en corriente continua (DC).";
        descRegulador.textContent = "Convierte y regula con eficiencia óptima hacia la vivienda.";
        descBateria.textContent = "Cargándose con el excedente energético limpio.";
        descHogar.textContent = "Alimentado por solar directa con red estable.";
      } else if (mode === 'corte') {
        btnCorte.className = activeClass;
        descPaneles.textContent = "Generando normalmente desde los módulos solares.";
        descRegulador.textContent = "Detecta el corte de red y activa el modo Back-Up en 0ms.";
        descBateria.textContent = "Sosteniendo los consumos críticos del hogar al instante.";
        descHogar.textContent = "Cero cortes: heladera y luces operando con normalidad.";
      } else {
        btnNoche.className = activeClass;
        descPaneles.textContent = "Sin radiación solar nocturna (Descanso).";
        descRegulador.textContent = "Inversor en modo inversor puro desde acumulación.";
        descBateria.textContent = "Entregando la energía almacenada durante el día.";
        descHogar.textContent = "Iluminación, heladera y confort nocturno asegurados.";
      }
    }

    // Carrito y Presupuesto (soporta U$S y AR$ por separado, nunca se mezclan en un mismo total)
    let cart = [];
    const cartDrawer = document.getElementById('cart-drawer');
    const cartCounter = document.getElementById('cart-counter');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');

    document.getElementById('cart-open-btn').addEventListener('click', () => toggleCart(true));

    function toggleCart(open) {
      if (open) {
        cartDrawer.classList.remove('hidden');
      } else {
        cartDrawer.classList.add('hidden');
      }
    }

    function currencySymbol(currency) {
      return currency === 'ARS' ? 'AR$' : 'U$S';
    }

    function formatMoney(amount, currency) {
      return `${currencySymbol(currency)} ${amount.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    function addToCart(name, price, code, currency) {
      currency = currency || 'USD';
      const existing = cart.find(i => i.code === code);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, code, currency, qty: 1 });
      }
      updateCartUI();
      toggleCart(true);
    }

    function removeFromCart(code) {
      cart = cart.filter(i => i.code !== code);
      updateCartUI();
    }

    function updateCartUI() {
      const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
      cartCounter.textContent = totalItems;

      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-solaris-ink/40 text-xs italic text-center py-8">Tu presupuesto está vacío. Agregá equipos desde el catálogo.</p>';
        cartTotalPrice.textContent = 'U$S 0';
        return;
      }

      let html = '';
      const totalsByCurrency = {};
      cart.forEach(item => {
        const subtotal = item.price * item.qty;
        totalsByCurrency[item.currency] = (totalsByCurrency[item.currency] || 0) + subtotal;
        html += `
          <div class="flex items-center justify-between p-3 rounded-xl bg-solaris-paperDim border border-solaris-line">
            <div>
              <h5 class="font-semibold text-solaris-ink text-[13px]">${item.name}</h5>
              <span class="text-[11px] text-solaris-ink/50">Cód: ${item.code} &bull; ${formatMoney(item.price, item.currency)} c/u</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold bg-white px-2.5 py-1 rounded-lg border border-solaris-line">x${item.qty}</span>
              <button onclick="removeFromCart('${item.code}')" class="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer">✕</button>
            </div>
          </div>
        `;
      });

      cartItemsContainer.innerHTML = html;

      const totalParts = Object.keys(totalsByCurrency).map(cur => formatMoney(totalsByCurrency[cur], cur));
      cartTotalPrice.textContent = totalParts.join(' + ');
    }

    function checkoutWhatsApp() {
      if (cart.length === 0) return;
      let text = "Hola Proyecto Solaris, quisiera solicitar un presupuesto formal con los siguientes equipos:\n\n";
      const totalsByCurrency = {};
      cart.forEach(item => {
        const sub = item.price * item.qty;
        totalsByCurrency[item.currency] = (totalsByCurrency[item.currency] || 0) + sub;
        text += `- ${item.qty}x ${item.name} (Cód: ${item.code}) - Subtotal: ${formatMoney(sub, item.currency)}\n`;
      });
      const totalLines = Object.keys(totalsByCurrency).map(cur => `Total ${cur === 'ARS' ? 'AR$' : 'U$S'}: ${formatMoney(totalsByCurrency[cur], cur)}`).join('\n');
      text += `\n*${totalLines}*\nQuedo a la espera de coordinar detalles e instalación.`;

      const encoded = encodeURIComponent(text);
      window.open(`https://wa.me/5492227563370?text=${encoded}`, '_blank');
    }

    // ============ Catálogo dinámico (382 productos, PRODUCTS viene de productos-data.js) ============
    const CATALOG_PAGE_SIZE = 24;
    let catalogCategory = 'todos';
    let catalogSearch = '';
    let catalogVisibleCount = CATALOG_PAGE_SIZE;

    const CATEGORY_LABELS = {
      backup: 'Back-Up & híbridos',
      baterias: 'Baterías litio / gel',
      paneles: 'Paneles solares',
      bombeo: 'Bombeo & térmico'
    };

    function normalizeText(str) {
      return (str || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function getFilteredProducts() {
      const term = normalizeText(catalogSearch.trim());
      return (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []).filter(p => {
        if (catalogCategory !== 'todos' && p.category !== catalogCategory) return false;
        if (!term) return true;
        const haystack = normalizeText(`${p.name} ${p.sku} ${p.brand}`);
        return haystack.includes(term);
      });
    }

    function productCardHTML(p) {
      const priceLabel = formatMoney(p.price, p.currency);
      const safeName = p.name.replace(/'/g, "\\'");
      return `
        <div class="product-card reveal-item hover-lift bg-white rounded-3xl p-6 border border-solaris-line flex flex-col justify-between" data-category="${p.category}">
          <div>
            <div class="rounded-2xl overflow-hidden h-48 mb-4 relative bg-solaris-paperDim border border-solaris-line">
              <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" loading="lazy">
              <span class="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-solaris-blue text-white text-[10px] font-semibold">${p.brand}</span>
            </div>
            <span class="text-xs font-semibold text-solaris-ink/40">${p.sku}</span>
            <h3 class="font-display font-semibold text-lg text-solaris-ink mt-1 mb-2">${p.name}</h3>
            <p class="text-[13px] text-solaris-ink/60 leading-relaxed mb-4">${CATEGORY_LABELS[p.category] || ''}</p>
          </div>
          <div class="pt-4 border-t border-solaris-line flex items-center justify-between gap-2">
            <span class="font-display text-lg font-bold text-solaris-blue tabular">${priceLabel}</span>
            <button onclick="addToCart('${safeName}', ${p.price}, '${p.sku}', '${p.currency}')" class="px-4 py-2.5 rounded-xl bg-solaris-green hover:bg-solaris-greenHover text-white font-semibold text-xs transition cursor-pointer">
              Agregar al presupuesto
            </button>
          </div>
        </div>
      `;
    }

    function renderCatalog() {
      const grid = document.getElementById('catalog-grid');
      const countEl = document.getElementById('catalog-count');
      const emptyEl = document.getElementById('catalog-empty');
      const loadMoreBtn = document.getElementById('catalog-load-more');
      if (!grid) return;

      const filtered = getFilteredProducts();
      const visible = filtered.slice(0, catalogVisibleCount);

      grid.innerHTML = visible.map(productCardHTML).join('');

      if (countEl) {
        countEl.textContent = filtered.length
          ? `Mostrando ${visible.length} de ${filtered.length} productos`
          : '';
      }

      if (emptyEl) emptyEl.classList.toggle('hidden', filtered.length !== 0);

      if (loadMoreBtn) {
        loadMoreBtn.classList.toggle('hidden', visible.length >= filtered.length);
      }

      // Revela con animación las tarjetas recién insertadas
      grid.querySelectorAll('.reveal-item').forEach(el => triggerReveal(el));
    }

    function loadMoreCatalog() {
      catalogVisibleCount += CATALOG_PAGE_SIZE;
      renderCatalog();
    }

    // Filtros de Catálogo
    function filterCatalog(category) {
      catalogCategory = category;
      catalogVisibleCount = CATALOG_PAGE_SIZE;

      document.querySelectorAll('.cat-btn').forEach(btn => {
        if (btn.getAttribute('data-cat') === category) {
          btn.className = "cat-btn px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm bg-solaris-blue text-white shadow-sm transition cursor-pointer";
        } else {
          btn.className = "cat-btn px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm bg-white text-solaris-ink/70 border border-solaris-line hover:border-solaris-blue/40 transition cursor-pointer";
        }
      });

      renderCatalog();
    }

    const catalogSearchInput = document.getElementById('catalog-search');
    if (catalogSearchInput) {
      let searchDebounce;
      catalogSearchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        const value = e.target.value;
        searchDebounce = setTimeout(() => {
          catalogSearch = value;
          catalogVisibleCount = CATALOG_PAGE_SIZE;
          renderCatalog();
        }, 150);
      });
    }

    renderCatalog();

    // ============ DIMENSIONADOR DE BOMBA SOLAR (línea Hiko Pump, lista Siltron Sep-2026) ============
    // Los códigos Hiko Pump codifican caudal nominal (m3/h), altura manométrica máxima (m),
    // tensión (V) y potencia (W) en el propio SKU. Por eso el caudal y la altura de cada
    // modelo salen directo del nombre de producto de la lista de precios, no son inventados.
    // OJO: esta es una PRE-selección automática a partir de 2 datos declarados por el cliente.
    // La selección final la debe confirmar un técnico considerando pérdidas de carga reales
    // (largo de cañería, codos, filtros) y el descenso dinámico real del pozo.
    //
    // "costProvider" = precio de costo de la lista de Siltron (proveedor), sin markup.
    // Precio de venta = costo x 1.10 x 1.50 (10% + 50% de ganancia, sucesivo = 65% total).
    // Para cambiar el margen en el futuro, solo hay que tocar MARKUP_PROVEEDOR / MARKUP_GANANCIA.
    const MARKUP_PROVEEDOR = 1.10;
    const MARKUP_GANANCIA = 1.50;

    const PUMPS_HIKO = [
      { code: 'HD-2SS1.2-56-24-120',        pozo: 2, headMax: 56,  flowM3h: 1.2,  watts: 120,  costProvider: 162 },
      { code: 'HD-2SS1.5-77-24-210',        pozo: 2, headMax: 77,  flowM3h: 1.5,  watts: 210,  costProvider: 164 },
      { code: 'HD-2SS1.7-100-48-500',       pozo: 2, headMax: 100, flowM3h: 1.7,  watts: 500,  costProvider: 206 },
      { code: 'HD-3SS1.2-56-24-120',        pozo: 3, headMax: 56,  flowM3h: 1.2,  watts: 120,  costProvider: 187 },
      { code: 'HD-3SS1.2-77-36-210',        pozo: 3, headMax: 77,  flowM3h: 1.2,  watts: 210,  costProvider: 191 },
      { code: 'HD-3SSC4-35-24-300',         pozo: 3, headMax: 35,  flowM3h: 4.0,  watts: 300,  costProvider: 195 },
      { code: 'HD-3SSC4-50-48-400',         pozo: 3, headMax: 50,  flowM3h: 4.0,  watts: 400,  costProvider: 212 },
      { code: 'HD-4SC7-45-72-600',          pozo: 4, headMax: 45,  flowM3h: 7.0,  watts: 600,  costProvider: 195 },
      { code: 'HD-3SSC4.5-80-48-600',       pozo: 3, headMax: 80,  flowM3h: 4.5,  watts: 600,  costProvider: 227 },
      { code: 'HD-4SC7-56-72-750',          pozo: 4, headMax: 56,  flowM3h: 7.0,  watts: 750,  costProvider: 202 },
      { code: 'HD-4SSC6.5-45-48-500',       pozo: 4, headMax: 45,  flowM3h: 6.5,  watts: 500,  costProvider: 213 },
      { code: 'HD-3SSC4.5-95-72-750',       pozo: 3, headMax: 95,  flowM3h: 4.5,  watts: 750,  costProvider: 258 },
      { code: 'HD-4SSC6.5-67-72-750',       pozo: 4, headMax: 67,  flowM3h: 6.5,  watts: 750,  costProvider: 231 },
      { code: 'HD-4SC7-86-110-1100',        pozo: 4, headMax: 86,  flowM3h: 7.0,  watts: 1100, costProvider: 216 },
      { code: 'HD-4SSC6.5-101-110-1100',    pozo: 4, headMax: 101, flowM3h: 6.5,  watts: 1100, costProvider: 256 },
      { code: 'HD-4SSC6-203-110-1500',      pozo: 4, headMax: 203, flowM3h: 6.0,  watts: 1500, costProvider: 317 },
      { code: 'HD-4SSC9-135-280-2200-AD',   pozo: 4, headMax: 135, flowM3h: 9.0,  watts: 2200, costProvider: 437 },
      { code: 'HD-4SSC18-137-300-3000-AD',  pozo: 4, headMax: 137, flowM3h: 18.0, watts: 3000, costProvider: 487 },
      { code: 'HD-4SSC22-115-530-4000-AD',  pozo: 4, headMax: 115, flowM3h: 22.0, watts: 4000, costProvider: 523 }
    ].map(p => ({ ...p, price: Math.round(p.costProvider * MARKUP_PROVEEDOR * MARKUP_GANANCIA * 100) / 100 }));

    const HORAS_SOL_PROMEDIO = 6;
    let pumpUnit = 'dia';

    function openPumpSizer() {
      document.getElementById('pump-sizer-modal').classList.remove('hidden');
      document.getElementById('pump-sizer-form').classList.remove('hidden');
      document.getElementById('pump-sizer-result').classList.add('hidden');
      document.getElementById('pump-sizer-error').classList.add('hidden');
    }

    function closePumpSizer() {
      document.getElementById('pump-sizer-modal').classList.add('hidden');
    }

    function setPumpUnit(unit) {
      pumpUnit = unit;
      const activeClass = "flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold bg-solaris-blue text-white transition cursor-pointer";
      const inactiveClass = "flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold bg-solaris-paperDim text-solaris-ink/70 border border-solaris-line transition cursor-pointer";
      document.getElementById('pump-unit-btn-dia').className = unit === 'dia' ? activeClass : inactiveClass;
      document.getElementById('pump-unit-btn-hora').className = unit === 'hora' ? activeClass : inactiveClass;
      const volInput = document.getElementById('pump-input-volume');
      const hint = document.getElementById('pump-unit-hint');
      if (unit === 'dia') {
        volInput.placeholder = 'Ej: 8000';
        hint.textContent = `Estimamos con un promedio de ${HORAS_SOL_PROMEDIO} horas de sol útil por día para el cálculo.`;
      } else {
        volInput.placeholder = 'Ej: 1300';
        hint.textContent = 'Caudal que necesitás entregar mientras la bomba está en marcha.';
      }
    }

    function pickPump(requiredHeadM, requiredFlowLh) {
      const candidatos = PUMPS_HIKO.filter(p => p.headMax >= requiredHeadM && (p.flowM3h * 1000) >= requiredFlowLh);
      if (candidatos.length === 0) return null;
      candidatos.sort((a, b) => a.price - b.price);
      return candidatos[0];
    }

    function calculatePumpSizing() {
      const errorEl = document.getElementById('pump-sizer-error');
      errorEl.classList.add('hidden');

      const depth = parseFloat(document.getElementById('pump-input-depth').value);
      const volume = parseFloat(document.getElementById('pump-input-volume').value);

      if (!depth || depth <= 0 || !volume || volume <= 0) {
        errorEl.textContent = 'Completá la profundidad y el consumo de agua para calcular.';
        errorEl.classList.remove('hidden');
        return;
      }

      const requiredHeadM = Math.ceil(depth * 1.15 + 5); // margen por pérdida de carga y descenso dinámico
      const requiredFlowLh = pumpUnit === 'dia' ? Math.ceil(volume / HORAS_SOL_PROMEDIO) : Math.ceil(volume);

      const pump = pickPump(requiredHeadM, requiredFlowLh);
      renderPumpResult(pump, depth, volume, requiredHeadM, requiredFlowLh);
    }

    function renderPumpResult(pump, depth, volume, requiredHeadM, requiredFlowLh) {
      document.getElementById('pump-sizer-form').classList.add('hidden');
      const resultEl = document.getElementById('pump-sizer-result');
      resultEl.classList.remove('hidden');

      const consumoTexto = pumpUnit === 'dia' ? `${volume.toLocaleString('es-AR')} L/día` : `${volume.toLocaleString('es-AR')} L/hora`;

      if (!pump) {
        resultEl.innerHTML = `
          <div class="text-center py-2">
            <div class="w-14 h-14 rounded-2xl bg-solaris-amberLight text-solaris-amberHover flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
            </div>
            <h4 class="font-display font-bold text-solaris-ink text-lg mb-2">Necesitás un sistema a medida</h4>
            <p class="text-sm text-solaris-ink/60 leading-relaxed mb-6">
              Con ${depth} m de profundidad y ${consumoTexto} declarados, ninguna bomba solar sumergible monofásica estándar de nuestro catálogo cubre ese requerimiento sin más datos. Puede resolverse con un equipo trifásico industrial (línea INVT) o un diseño con etapas adicionales. Contactanos y lo dimensionamos con un técnico.
            </p>
          </div>
          <button onclick="sendPumpQuoteWhatsApp(null, ${depth}, '${consumoTexto}')" class="btn btn-primary w-full mb-3">
            <span>Hablar con un técnico por WhatsApp</span>
          </button>
          <button onclick="openPumpSizer()" class="btn btn-outline w-full">Volver a calcular</button>
        `;
        return;
      }

      resultEl.innerHTML = `
        <div class="text-center mb-5">
          <span class="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-solaris-greenSubtle text-solaris-greenDeep mb-3">Recomendación preliminar</span>
          <h4 class="font-display font-bold text-2xl text-solaris-ink mb-1">${pump.code}</h4>
          <p class="text-sm text-solaris-ink/55">Bomba solar sumergible Hiko Pump — Pozo ${pump.pozo}"</p>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-5">
          <div class="p-3.5 rounded-xl bg-solaris-paperDim text-center">
            <span class="block font-display font-bold text-solaris-blue text-lg tabular">${pump.headMax} m</span>
            <span class="text-[11px] text-solaris-ink/50">Altura máx. de la bomba</span>
          </div>
          <div class="p-3.5 rounded-xl bg-solaris-paperDim text-center">
            <span class="block font-display font-bold text-solaris-green text-lg tabular">${pump.flowM3h} m³/h</span>
            <span class="text-[11px] text-solaris-ink/50">Caudal nominal</span>
          </div>
          <div class="p-3.5 rounded-xl bg-solaris-paperDim text-center">
            <span class="block font-display font-bold text-solaris-ink text-lg tabular">${pump.watts} W</span>
            <span class="text-[11px] text-solaris-ink/50">Potencia</span>
          </div>
          <div class="p-3.5 rounded-xl bg-solaris-paperDim text-center">
            <span class="block font-display font-bold text-solaris-ink text-lg tabular">U$S ${pump.price.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            <span class="text-[11px] text-solaris-ink/50">Precio de referencia</span>
          </div>
        </div>

        <p class="text-[11.5px] text-solaris-ink/50 leading-relaxed mb-5 p-3 rounded-xl bg-solaris-amberLight/60 border border-solaris-amber/20">
          Cálculo estimado para ${depth} m de profundidad y ${consumoTexto}. La confirmación final del modelo la hace nuestro equipo técnico, considerando el largo real de la cañería y el descenso dinámico del pozo.
        </p>

        <button onclick="sendPumpQuoteWhatsApp('${pump.code}', ${depth}, '${consumoTexto}')" class="btn btn-primary w-full mb-3">
          <span>Confirmar cotización por WhatsApp</span>
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771z"/></svg>
        </button>
        <button onclick="openPumpSizer()" class="btn btn-outline w-full">Volver a calcular</button>
      `;
    }

    function sendPumpQuoteWhatsApp(pumpCode, depth, consumoTexto) {
      let text = `Hola Proyecto Solaris, quisiera cotizar bombeo solar para el campo.\n\nProfundidad: ${depth} m\nConsumo declarado: ${consumoTexto}`;
      if (pumpCode) {
        text += `\n\nLa web me sugirió el modelo ${pumpCode}. Quisiera confirmar esta selección con un técnico.`;
      } else {
        text += `\n\nEs un caso que necesita diseño a medida (posible equipo trifásico industrial).`;
      }
      window.open(`https://wa.me/5492227563370?text=${encodeURIComponent(text)}`, '_blank');
    }

    // Acordeón FAQ
    function toggleFaq(id) {
      const body = document.getElementById(`faq-body-${id}`);
      const icon = document.getElementById(`faq-icon-${id}`);
      body.classList.toggle('hidden');
      icon.classList.toggle('rotate-180');
    }

    // === SISTEMA DE ANIMACIÓN AL HACER SCROLL (EFICIENTE, BASADO EN INTERSECTION OBSERVER) ===
    // Libera will-change una vez terminada la transición, para no mantener capas de
    // composición innecesarias en memoria (mejor rendimiento en páginas largas).
    function releaseWillChange(element) {
      const targets = [element, ...element.querySelectorAll('.split-line-child')];
      targets.forEach(t => {
        t.addEventListener('transitionend', function handler() {
          t.style.willChange = 'auto';
          t.removeEventListener('transitionend', handler);
        }, { once: true });
      });
    }

    function triggerReveal(element) {
      element.classList.add('is-revealed');
      releaseWillChange(element);
    }

    function initScrollAnimations() {
      const revealElements = document.querySelectorAll('.reveal-item, .split-line-mask');

      // 1. REVELACIÓN INMEDIATA DE ELEMENTOS VISIBLES EN PANTALLA INICIAL (ABOVE-THE-FOLD)
      const vh = window.innerHeight || document.documentElement.clientHeight;
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.92) {
          triggerReveal(el);
        }
      });

      // 2. INTERSECTION OBSERVER: único mecanismo de detección de scroll para las
      // animaciones de entrada. Cada elemento se observa una sola vez y se
      // deja de observar (unobserve) apenas se revela, para máxima eficiencia.
      if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              triggerReveal(entry.target);
              observer.unobserve(entry.target);
            }
          });
        }, {
          root: null,
          rootMargin: '0px 0px -20px 0px',
          threshold: 0.05
        });

        revealElements.forEach(el => {
          if (!el.classList.contains('is-revealed')) {
            revealObserver.observe(el);
          }
        });
      } else {
        // Fallback único (sin listeners continuos) para navegadores muy antiguos
        // sin soporte de IntersectionObserver: revela todo de una vez.
        revealElements.forEach(el => triggerReveal(el));
      }

      // 3. TIMEOUT DE SEGURIDAD (una sola vez, no es un listener continuo):
      // garantiza que nada quede oculto si algo impide que el observer dispare.
      setTimeout(() => {
        revealElements.forEach(el => {
          if (!el.classList.contains('is-revealed')) {
            triggerReveal(el);
          }
        });
      }, 1200);

      // === EFECTO PARALLAX SUTIL (GPU-ACCELERATED) ===
      const heroParallax = document.getElementById('hero-parallax-img');
      const simParallax = document.getElementById('sim-parallax-video');
      const systemsParallax = document.getElementById('systems-parallax-img');
      const bombeoParallax = document.getElementById('bombeo-parallax-img');

      if (simParallax) {
        simParallax.muted = true;
        simParallax.defaultMuted = true;
        const ensureVideoPlaying = () => {
          const promise = simParallax.play();
          if (promise !== undefined) {
            promise.catch(() => {
              const resume = () => {
                simParallax.play();
                window.removeEventListener('click', resume);
                window.removeEventListener('scroll', resume);
              };
              window.addEventListener('click', resume, { once: true });
              window.addEventListener('scroll', resume, { once: true });
            });
          }
        };
        ensureVideoPlaying();
      }

      let ticking = false;

      function updateParallax() {
        const viewHeight = window.innerHeight;

        // Hero Parallax
        if (heroParallax) {
          const heroSec = document.getElementById('inicio');
          if (heroSec) {
            const rect = heroSec.getBoundingClientRect();
            if (rect.top <= viewHeight && rect.bottom >= 0) {
              const offset = Math.round(rect.top * -0.08);
              heroParallax.style.transform = `scale(1.22) translate3d(0, ${offset}px, 0)`;
            }
          }
        }

        // Simulador Video Parallax
        if (simParallax) {
          const simSec = document.getElementById('simulador');
          if (simSec) {
            const rect = simSec.getBoundingClientRect();
            if (rect.top <= viewHeight && rect.bottom >= 0) {
              const offset = Math.round((rect.top - viewHeight * 0.25) * -0.05);
              simParallax.style.transform = `scale(1.08) translate3d(0, ${offset}px, 0)`;
            }
          }
        }

        // Sistemas Parallax
        if (systemsParallax) {
          const sysSec = document.getElementById('sistemas');
          if (sysSec) {
            const rect = sysSec.getBoundingClientRect();
            if (rect.top <= viewHeight && rect.bottom >= 0) {
              const offset = Math.round((rect.top - viewHeight * 0.25) * -0.05);
              systemsParallax.style.transform = `scale(1.05) translate3d(0, ${offset}px, 0)`;
            }
          }
        }

        // Bombeo Parallax
        if (bombeoParallax) {
          const bomSec = document.getElementById('campo-bombeo');
          if (bomSec) {
            const rect = bomSec.getBoundingClientRect();
            if (rect.top <= viewHeight && rect.bottom >= 0) {
              const offset = Math.round((rect.top - viewHeight * 0.25) * -0.05);
              bombeoParallax.style.transform = `scale(1.08) translate3d(0, ${offset}px, 0)`;
            }
          }
        }

        ticking = false;
      }

      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      }, { passive: true });

      updateParallax();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
      initScrollAnimations();
    }