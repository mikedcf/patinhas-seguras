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



// ===================================================================
// ==================== [ SLIDER] ====================

let slideIndex = 0;

function showSlides() {
  const slides = document.getElementsByClassName("slide");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1 }

  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 4000); // Troca a cada 4 segundos
}

// ===================================================================
// ==================== [ SISTEMA DE DOAÇÃO ] ====================

function mostrarQR() {
  const qr = document.getElementById("qrContainer");
  qr.style.display = qr.style.display === "block" ? "none" : "block";
}

// ===================================================================
// ==================== [ CHAMADAS DE FUNCTIONS] ====================
document.addEventListener('DOMContentLoaded', verificarAuth);


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

showSlides(); // Inicia o carrossel
AOS.init(); // footer




