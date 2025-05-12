let noticiasData = [];
let currentMode = null;

// Función para formatear la fecha a "3 MAIG"
function formatearFecha(fecha) {
  const meses = [
    'Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
    'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'
  ];
  
  const date = new Date(fecha);
  const dia = date.getDate();
  const mes = meses[date.getMonth()].toUpperCase();
  
  return `${dia} ${mes}`;
}

function generarCarrusel() {
  const carouselInner = document.getElementById('carouselInnerNoticias');
  carouselInner.innerHTML = '';

  const isMobile = window.innerWidth < 768;
  const mode = isMobile ? 'mobile' : 'desktop';

  if (mode === currentMode) return;
  currentMode = mode;

  const groupSize = isMobile ? 1 : 4;

  for (let i = 0; i < noticiasData.length; i += groupSize) {
    const noticiasGrupo = noticiasData.slice(i, i + groupSize);
    const item = document.createElement('div');
    item.className = 'carousel-item' + (i === 0 ? ' active' : '');

    const row = document.createElement('div');
    row.className = 'row';

    noticiasGrupo.forEach(noticia => {
      const col = document.createElement('div');
      col.className = isMobile ? 'col-12' : 'col-md-3';

      col.innerHTML = `
        <div class="card h-100 border-warning shadow-sm">
          <img src="${noticia.imagen}" class="card-img-top" alt="Imatge de la notícia">
          <div class="card-body">
            <h6 class="card-title">${noticia.titulo}</h6>
          </div>
          <div class="card-footer text-muted text-center"><i class="bi bi-calendar2-date"></i>  ${formatearFecha(noticia.fecha)}</div>
        </div>
      `;

      row.appendChild(col);
    });

    item.appendChild(row);
    carouselInner.appendChild(item);
  }

  new bootstrap.Carousel(document.querySelector('#noticiesCarousel'), {
    interval: false,
    ride: false
  });
}

function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(func, delay);
  };
}

function cargarNoticias() {
  fetch('noticias.json')
    .then(response => response.json())
    .then(data => {
      // Ordenar las noticias de más recientes a más antiguas
      noticiasData = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Ordenar por fecha descendente
      generarCarrusel();
    })
    .catch(error => {
      console.error('Error al cargar las noticias:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  cargarNoticias();
});

window.addEventListener('resize', debounce(generarCarrusel, 300));
