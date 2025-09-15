// ===================================================================
// ==================== [ MODULE IMPORT] ====================



// ===================================================================
// ==================== [ AUTENTICAÇÃO ] ====================

async function autenticacao() {
  try {
    const response = await fetch(`http://127.0.0.1:3000/api/v1/user/auth`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await response.json();

    return data

  } catch (error) {
    console.error('Erro na inicialização:', error);
  }
}

async function verificarAuth() {

  try {
    const dados = await autenticacao();

    // userMenu

    if (dados.logado) {

      document.getElementById('boxLogin').style.display = 'none'
      document.getElementById('userMenu').style.display = 'flex'
      document.getElementById('nomeperfil').innerText = dados.usuario.nome
      document.getElementById('avatarimg').src = dados.usuario.foto_url
    }
    else {
      document.getElementById('boxLogin').style.display = 'flex'
      document.getElementById('userMenu').style.display = 'none'
    }


  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
  }
}

async function logout() {

  try {
    const response = await fetch('http://127.0.0.1:3000/api/v1/user/logout', {

      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)

    }

    const data = await response.json();
    alert('Deslogando...')
    await verificarAuth();
  }
  catch (error) {
    console.error('Erro na requisição:', error)
    alert('Erro ao deslogar.')
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500)
  }
}


// ===================================================================
// ==================== [ MENU SUSPENSO ] ====================

let menuTimeout = null;

// Função para abrir o menu suspenso
function abrirMenuSuspenso() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    // Cancela qualquer timeout de fechamento
    if (menuTimeout) {
      clearTimeout(menuTimeout);
      menuTimeout = null;
    }
    dropdown.style.display = 'flex';
  }
}

// Função para fechar o menu suspenso
function fecharMenuSuspenso() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.style.display = 'none';
  }
}

// Função para fechar o menu com delay
function fecharMenuComDelay() {
  menuTimeout = setTimeout(fecharMenuSuspenso, 150); // 150ms de delay
}

// Event listeners para hover no menu do usuário
document.addEventListener('DOMContentLoaded', function() {
  const userMenu = document.getElementById('userMenu');
  const dropdown = document.getElementById('userDropdown');
  
  if (userMenu && dropdown) {
    // Abre o menu quando o mouse entra na div userMenu
    userMenu.addEventListener('mouseenter', abrirMenuSuspenso);
    
    // Fecha o menu com delay quando o mouse sai da div userMenu
    userMenu.addEventListener('mouseleave', fecharMenuComDelay);
    
    // Mantém o menu aberto quando o mouse está sobre o dropdown
    dropdown.addEventListener('mouseenter', abrirMenuSuspenso);
    
    // Fecha o menu com delay quando o mouse sai do dropdown
    dropdown.addEventListener('mouseleave', fecharMenuComDelay);
  }
});


// ====================================================================
// =================== [ CARROSSEL DE PARCEIROS ] ====================

function parceirosSwiper() {
  const parceirosSwiper = new Swiper('.parceirosSwiper', {
    loop: true,
    speed: 600,
    spaceBetween: 24,
    slidesPerView: 4,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    breakpoints: {
      0: { slidesPerView: 2, spaceBetween: 12 },
      640: { slidesPerView: 3, spaceBetween: 16 },
      1024: { slidesPerView: 4, spaceBetween: 24 },
    },
  });
}

// ====================================================================
// =================== [ CARROSSEL DE ANIMAIS ] ====================

function iniciarCarrossel(seletorCarrossel, seletorSetaEsquerda, seletorSetaDireita, seletorCard) {
  const carrossel = document.querySelector(seletorCarrossel);
  const setaEsquerda = document.querySelector(seletorSetaEsquerda);
  const setaDireita = document.querySelector(seletorSetaDireita);
  const card = carrossel.querySelector(seletorCard);
  const cardWidth = card.offsetWidth + 90; // card + gap

  function atualizarSetas() {
    setaEsquerda.disabled = carrossel.scrollLeft === 0;
    const scrollMax = carrossel.scrollWidth - carrossel.clientWidth;
    setaDireita.disabled = carrossel.scrollLeft >= scrollMax - 5;
  }

  setaDireita.addEventListener('click', () => {
    carrossel.scrollBy({
      left: cardWidth,
      behavior: 'smooth'
    });
  });

  setaEsquerda.addEventListener('click', () => {
    carrossel.scrollBy({
      left: -cardWidth,
      behavior: 'smooth'
    });
  });

  carrossel.addEventListener('scroll', atualizarSetas);
  window.addEventListener('load', atualizarSetas);

  // chama de início também
  atualizarSetas();
}

function iniciarCarrossel2(seletorCarrossel, seletorSetaEsquerda, seletorSetaDireita, seletorCard) {
  const carrossel2 = document.querySelector(seletorCarrossel);
  const setaEsquerda2 = document.querySelector(seletorSetaEsquerda);
  const setaDireita2 = document.querySelector(seletorSetaDireita);
  const card2 = carrossel2.querySelector(seletorCard);
  const cardWidth2 = card2.offsetWidth + 90; // card + gap

  function atualizarSetas2() {
    setaEsquerda2.disabled = carrossel2.scrollLeft === 0;
    const scrollMax2 = carrossel2.scrollWidth - carrossel2.clientWidth;
    setaDireita2.disabled = carrossel2.scrollLeft >= scrollMax2 - 5;
  }

  setaDireita2.addEventListener('click', () => {
    carrossel2.scrollBy({
      left: cardWidth2,
      behavior: 'smooth'
    });
  });

  setaEsquerda2.addEventListener('click', () => {
    carrossel2.scrollBy({
      left: -cardWidth2,
      behavior: 'smooth'
    });
  });

  carrossel2.addEventListener('scroll', atualizarSetas2);
  window.addEventListener('load', atualizarSetas2);

  // chama de início
  atualizarSetas2();
}

iniciarCarrossel('.carrossel', '.seta.esquerda', '.seta.direita', '.card');
iniciarCarrossel2('.carrossel2', '.seta2.esquerda2', '.seta2.direita2', '.card2');

// ====================================================================
// =================== [ COMENTARIOS ] ====================

let index = 0;
function mostrarComentario() {
  const comentarios = document.querySelectorAll('.box_comentarios .comentario');
  comentarios.forEach((el, i) => {
    el.classList.toggle('ativo', i === index);
  });
  index = (index + 1) % comentarios.length;
}

setInterval(mostrarComentario, 5000); // Troca a cada 4 segundos

// ===================================================================
// ==================== [ CHAMADAS DE FUNCTIONS] ====================
document.addEventListener('DOMContentLoaded', verificarAuth);
// ---- CARROSSEL PARCEIROS
window.addEventListener('load', parceirosSwiper);

// ---- PRELOADER
window.addEventListener("load", () => {
  const preloader = document.querySelector(".preloader");
  const preloaderLogo = document.getElementById("preloaderLogo");
  const headerLogo = document.getElementById("headerLogo");

  const delayBeforeSlide = 1000;

  setTimeout(() => {
    const headerRect = headerLogo.getBoundingClientRect();
    const targetTop = headerRect.top + headerRect.height / 2;
    const targetLeft = headerRect.left + headerRect.width / 2;

    preloaderLogo.classList.add("slide-to-header");
    preloaderLogo.style.top = `${targetTop}px`;
    preloaderLogo.style.left = `${targetLeft}px`;
    preloaderLogo.style.transform = "translate(-50%, -50%)";

    document.body.classList.add("show-content");

    setTimeout(() => {
      preloader.style.display = "none";
      document.body.style.overflow = "auto";
    }, 1350);
  }, delayBeforeSlide);
});

AOS.init();


