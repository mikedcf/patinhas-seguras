// ===================================================================
// ==================== [ NOTIFICAÇÃO] ====================

function notify(title, message, duration = 3000, image = null, type = null) {
  const container = document.getElementById("notification-container");

  // Criar notificação
  const notification = document.createElement("div");
  notification.classList.add("notification");

  // Se tiver tipo de alerta
  if (!image && type) {
    notification.classList.add(type);
  }

  // Se tiver imagem, adiciona foto
  if (image) {
    const img = document.createElement("img");
    img.src = image;
    notification.appendChild(img);
  }

  // Texto
  const textDiv = document.createElement("div");
  textDiv.classList.add("text");

  const titleEl = document.createElement("div");
  titleEl.classList.add("title");
  titleEl.textContent = title;

  const messageEl = document.createElement("div");
  messageEl.classList.add("message");
  messageEl.textContent = message;

  textDiv.appendChild(titleEl);
  textDiv.appendChild(messageEl);
  notification.appendChild(textDiv);

  // Se for alerta sem imagem → progress bar
  if (!image && type) {
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");

    const progress = document.createElement("div");
    progress.classList.add("progress");
    progress.style.animation = `shrink ${duration}ms linear forwards`;

    progressBar.appendChild(progress);
    notification.appendChild(progressBar);
  }

  container.appendChild(notification);

  // Remover após o tempo
  setTimeout(() => {
    notification.style.animation = "slideOut 0.4s forwards";
    setTimeout(() => notification.remove(), 400);
  }, duration);
}



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

    notify('Sucesso!', 'Deslogado com sucesso.', 2000, null, 'success')

    setTimeout(async () => {
      await verificarAuth();
    }, 2000)
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
document.addEventListener('DOMContentLoaded', function () {
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
// ==================== [ MODAL DE PERFIL ] ====================

// Função para abrir o modal de perfil
function abrirModalPerfil() {
  const modal = document.getElementById('modalPerfil');
  if (modal) {
    carregarDadosPerfil();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Previne scroll da página
  }
}


// Função para fechar o modal de perfil
function fecharModalPerfil() {
  const modal = document.getElementById('modalPerfil');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaura scroll da página
  }
}

// Função para carregar dados do perfil
async function carregarDadosPerfil() {
  try {
    // Busca dados do usuário logado
    const response = await fetch('http://127.0.0.1:3000/api/v1/usuario/perfil', {
      method: 'GET',
      credentials: 'include'
    });

    if (response.ok) {
      const usuario = await response.json();

      // Preenche os campos do formulário
      document.getElementById('nomePerfil').value = usuario.nome || '';
      document.getElementById('emailPerfil').value = usuario.email || '';
      document.getElementById('telefonePerfil').value = usuario.telefone || '';
      document.getElementById('enderecoPerfil').value = usuario.endereco || '';
    } else {
      console.error('Erro ao carregar dados do perfil');
      mostrarNotificacao('Erro ao carregar dados do perfil', 'error');
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    mostrarNotificacao('Erro ao carregar dados do perfil', 'error');
  }
}

// Função para salvar alterações do perfil
async function salvarPerfil(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const dados = {
    telefone: formData.get('telefone'),
    endereco: formData.get('endereco')
  };

  try {
    const response = await fetch('http://127.0.0.1:3000/api/v1/usuario/perfil', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(dados)
    });

    if (response.ok) {
      mostrarNotificacao('Perfil atualizado com sucesso!', 'success');
      fecharModalPerfil();
    } else {
      const error = await response.json();
      mostrarNotificacao(error.message || 'Erro ao atualizar perfil', 'error');
    }
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    mostrarNotificacao('Erro ao atualizar perfil', 'error');
  }
}

// Função para formatar telefone
function formatarTelefone(input) {
  let value = input.value.replace(/\D/g, '');

  if (value.length <= 10) {
    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  input.value = value;
}

// Event listeners para o modal
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('modalPerfil');
  const closeBtn = document.getElementById('closeModalPerfil');
  const cancelBtn = document.getElementById('cancelarPerfil');
  const form = document.getElementById('formPerfil');
  const telefoneInput = document.getElementById('telefonePerfil');

  // Fechar modal ao clicar no X
  if (closeBtn) {
    closeBtn.addEventListener('click', fecharModalPerfil);
  }

  // Fechar modal ao clicar em cancelar
  if (cancelBtn) {
    cancelBtn.addEventListener('click', fecharModalPerfil);
  }

  // Fechar modal ao clicar fora dele
  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        fecharModalPerfil();
      }
    });
  }

  // Submeter formulário
  if (form) {
    form.addEventListener('submit', salvarPerfil);
  }

  // Formatar telefone em tempo real
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function () {
      formatarTelefone(this);
    });
  }

  // Fechar modal com ESC
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal && modal.style.display === 'block') {
      fecharModalPerfil();
    }
  });
});


// ====================================================================
// =================== [ CARROSSEL DE PARCEIROS ] ====================

function parceirosSwiper() {
  const parceirosSwiper = new Swiper('.parceirosSwiper', {
    loop: true,
    speed: 600,
    watchOverflow: true,
    allowTouchMove: true,
    centeredSlides: false,
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
      0:   { slidesPerView: 2,   spaceBetween: 56, centeredSlides: false },
      376: { slidesPerView: 2.1, spaceBetween: 56, centeredSlides: false },
      414: { slidesPerView: 2.2, spaceBetween: 56, centeredSlides: false },
      640: { slidesPerView: 3,   spaceBetween: 28 },
      1024:{ slidesPerView: 4,   spaceBetween: 36 },
    },
  });
}


// ===================================================================
// ==================== [ CARROSSEL DINÂMICO DE CACHORROS ] ====================
// Variáveis globais para o carrossel de cachorros
let cachorrosCarregados = [];
let indiceAtual = 0;
let carregando = false;
const CACHORROS_POR_VEZ = 4; // Quantos cachorros carregar por vez

// Função para carregar cachorros da API
async function carregarCachorros() {
  if (carregando) return;

  carregando = true;
  const carrossel = document.getElementById('carrosselCachorros');

  if (!carrossel) {
    carregando = false;
    return;
  }

  try {
    carrossel.innerHTML = '<div class="loading-message"><p>Carregando cachorros...</p></div>';

    const response = await fetch('http://127.0.0.1:3000/api/v1/animal/cachorros');

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const cachorros = await response.json();


    if (cachorros && cachorros.length > 0) {
      const cachorrosEmbaralhados = embaralharArray(cachorros);
      cachorrosCarregados = cachorrosEmbaralhados;

      carregarProximosCachorros();
    }
    else {
      carrossel.innerHTML = '<div class="loading-message"><p>Nenhum cachorro disponível no momento.</p></div>';
    }

  }
  catch (error) {
    console.error('Erro ao carregar cachorros:', error);
    carrossel.innerHTML = '<div class="loading-message"><p>Erro ao carregar cachorros. Tente novamente.</p></div>';

  }
  finally {
    carregando = false;
  }
}

// Função para embaralhar array
function embaralharArray(array) {
  const novoArray = [...array];
  for (let i = novoArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
  }
  return novoArray;
}


// Função para carregar os próximos cachorros no carrossel
function carregarProximosCachorros() {
  const carrossel = document.getElementById('carrosselCachorros');
  const cachorrosParaMostrar = cachorrosCarregados.slice(indiceAtual, indiceAtual + CACHORROS_POR_VEZ);

  if (cachorrosParaMostrar.length === 0) {
    carrossel.innerHTML = '<div class="loading-message"><p>Não há mais cachorros para mostrar.</p></div>';
    return;
  }

  // Limpa o carrossel
  carrossel.innerHTML = '';

  // Cria os cards para cada cachorro
  cachorrosParaMostrar.forEach(cachorro => {
    const card = criarCardCachorro(cachorro);
    carrossel.appendChild(card);
  });

  // Atualiza o índice
  indiceAtual += CACHORROS_POR_VEZ;

  // Atualiza o estado das setas
  atualizarSetasCachorros();
}


function criarCardCachorro(cachorro) {
  const card = document.createElement('div');
  card.className = 'card-dinamico';
  card.setAttribute('data-aos', 'zoom-in');

  // Usa a localização do banco de dados ou uma localização padrão
  const localizacoes = ['São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Salvador, BA', 'Fortaleza, CE'];
  const localizacao = cachorro.localizacao || localizacoes[Math.floor(Math.random() * localizacoes.length)];


  // Lista de imagens locais de cachorros
  const imagensCachorros = [
    '../img/bingo.jpg',
    '../img/alfredo.jpg',
    '../img/apolo.jpg',
    '../img/arrascaeta.jpg',
    '../img/bart.jpg',
    '../img/baruk.jpg',
    '../img/gorete.jpg',
    '../img/guinho.jpg',
    '../img/izye.jpg',
    '../img/jack.jpg',
    '../img/jean.jpg',
    '../img/raj.jpg',
    '../img/tigresa.jpg',
    '../img/Negao.jpeg'
  ];

  // Seleciona uma imagem aleatória se a URL do banco for inválida
  const imagemValida = cachorro.foto_url && !cachorro.foto_url.includes('exemplo.com')
    ? cachorro.foto_url
    : imagensCachorros[Math.floor(Math.random() * imagensCachorros.length)];

  const htmlContent = `
                <img src="${imagemValida}"
                     alt="${cachorro.nome}"
                     onerror="this.src='../img/bingo.jpg'">
                <h3>${cachorro.nome}</h3>
                <div class="info-animal">
                    <span class="info-item">
                        <img src="../img/pets.png" alt="idade" class="info-icon">
                        ${cachorro.idade} anos
                    </span>
                    <span class="info-item">
                        <img src="../img/dog.png" alt="raça" class="info-icon">
                        ${cachorro.raca}
                    </span>
                    <span class="info-item">
                        <img src="../img/dogl.png" alt="porte" class="info-icon">
                        ${cachorro.porte}
                    </span>
                </div>
                <div class="localizacao">
                    <img src="../img/local.png" alt="local" class="localizacao-icon">
                    <span>${localizacao}</span>
                </div>
            `;

  card.innerHTML = htmlContent;


  return card;
}

// Função para atualizar o estado das setas do carrossel
function atualizarSetasCachorros() {
  const setaEsquerda = document.getElementById('setaEsquerdaCachorros');
  const setaDireita = document.getElementById('setaDireitaCachorros');
  const carrossel = document.getElementById('carrosselCachorros');

  if (!setaEsquerda || !setaDireita || !carrossel) return;

  // Verifica se pode ir para a esquerda (voltar)
  setaEsquerda.disabled = indiceAtual <= CACHORROS_POR_VEZ;

  // Verifica se pode ir para a direita (avançar)
  const totalCachorros = cachorrosCarregados.length;
  setaDireita.disabled = indiceAtual >= totalCachorros;

  // Adiciona classes CSS para indicar estado desabilitado
  if (setaEsquerda.disabled) {
    setaEsquerda.classList.add('disabled');
  } else {
    setaEsquerda.classList.remove('disabled');
  }

  if (setaDireita.disabled) {
    setaDireita.classList.add('disabled');
  } else {
    setaDireita.classList.remove('disabled');
  }
}

// Função para navegar para a esquerda (cachorros anteriores)
function navegarEsquerdaCachorros() {
  if (indiceAtual <= CACHORROS_POR_VEZ) return;

  indiceAtual -= CACHORROS_POR_VEZ;
  // Volta para mostrar os cachorros anteriores
  const carrossel = document.getElementById('carrosselCachorros');
  const cachorrosParaMostrar = cachorrosCarregados.slice(indiceAtual - CACHORROS_POR_VEZ, indiceAtual);

  carrossel.innerHTML = '';
  cachorrosParaMostrar.forEach(cachorro => {
    const card = criarCardCachorro(cachorro);
    carrossel.appendChild(card);
  });

  atualizarSetasCachorros();
}

// Função para navegar para a direita (próximos cachorros)
function navegarDireitaCachorros() {
  const totalCachorros = cachorrosCarregados.length;
  if (indiceAtual >= totalCachorros) return;

  carregarProximosCachorros();
}

// Função para inicializar os event listeners do carrossel
function inicializarCarrosselCachorros() {
  const setaEsquerda = document.getElementById('setaEsquerdaCachorros');
  const setaDireita = document.getElementById('setaDireitaCachorros');

  if (setaEsquerda) {
    setaEsquerda.addEventListener('click', navegarEsquerdaCachorros);
  }

  if (setaDireita) {
    setaDireita.addEventListener('click', navegarDireitaCachorros);
  }
}


// ===================================================================
// ==================== [ INICIALIZAÇÃO DO CARROSSEL ] ====================

// Função principal para inicializar o carrossel de cachorros
async function inicializarCarrosselDinamico() {
  try {
    // Inicializa os event listeners
    inicializarCarrosselCachorros();

    // Carrega os cachorros da API
    await carregarCachorros();

  } catch (error) {
    console.error('Erro ao inicializar carrossel de cachorros:', error);
  }
}

// ---- CARROSSEL DINÂMICO DE CACHORROS
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o carrossel dinâmico de cachorros
  inicializarCarrosselDinamico();
});

window.addEventListener('load', () => {
  // Verifica se o carrossel já foi inicializado
  const carrossel = document.getElementById('carrosselCachorros');
  if (carrossel && carrossel.innerHTML.includes('Carregando cachorros...')) {
    inicializarCarrosselDinamico();
  }
});

// ===================== [ CARROSSEL DINÂMICO DE GATOS ] =====================

// Variáveis globais para gatos
let gatosCarregados = [];
let indiceAtualGatos = 0;
let carregandoGatos = false;
const GATOS_POR_VEZ = 4;

// Função para carregar gatos da API
async function carregarGatos() {
  if (carregandoGatos) return;

  carregandoGatos = true;

  try {
    const response = await fetch('http://127.0.0.1:3000/api/v1/animal/gatos');
    if (!response.ok) {
      throw new Error('Erro ao carregar gatos');
    }

    const gatos = await response.json();
    gatosCarregados = embaralharArray(gatos);
    indiceAtualGatos = 0;

    carregarProximosGatos();
  } catch (error) {
    console.error('Erro ao carregar gatos:', error);
    const carrosselGatos = document.getElementById('carrosselGatos');
    if (carrosselGatos) {
      carrosselGatos.innerHTML = '<div class="loading-message"><p>Erro ao carregar gatos. Tente novamente.</p></div>';
    }
  } finally {
    carregandoGatos = false;
  }
}

// Função para carregar próximos gatos no carrossel
function carregarProximosGatos() {
  const carrosselGatos = document.getElementById('carrosselGatos');
  if (!carrosselGatos || gatosCarregados.length === 0) return;

  const gatosParaMostrar = gatosCarregados.slice(indiceAtualGatos, indiceAtualGatos + GATOS_POR_VEZ);

  carrosselGatos.innerHTML = '';

  gatosParaMostrar.forEach(gato => {
    const card = criarCardGato(gato);
    carrosselGatos.appendChild(card);
  });

  indiceAtualGatos += GATOS_POR_VEZ;
  atualizarSetasGatos();
}

// Função para criar card de gato
function criarCardGato(gato) {
  const card = document.createElement('div');
  card.className = 'card-dinamico-gato';
  card.setAttribute('data-aos', 'zoom-in');

  // Usa a localização do banco de dados ou uma localização padrão
  const localizacoes = ['São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Salvador, BA', 'Fortaleza, CE'];
  const localizacao = gato.localizacao || localizacoes[Math.floor(Math.random() * localizacoes.length)];

  // Lista de imagens locais de gatos
  const imagensGatos = [
    '../img/g3.jpg',
    '../img/g4.jpg',
    '../img/g5.jpeg',
    '../img/filipa.jpg',
    '../img/frajola.jpg'
  ];

  // Seleciona uma imagem aleatória se a URL do banco for inválida
  const imagemValida = gato.foto_url && !gato.foto_url.includes('exemplo.com')
    ? gato.foto_url
    : imagensGatos[Math.floor(Math.random() * imagensGatos.length)];

  const htmlContent = `
        <img src="${imagemValida}"
             alt="${gato.nome}"
             onerror="this.src='../img/g3.jpg'">
        <h3>${gato.nome}</h3>
        <div class="info-animal">
            <span class="info-item">
                <img src="../img/pets.png" alt="idade" class="info-icon">
                ${gato.idade} anos
            </span>
            <span class="info-item">
                <img src="../img/dog.png" alt="raça" class="info-icon">
                ${gato.raca}
            </span>
            <span class="info-item">
                <img src="../img/dogl.png" alt="porte" class="info-icon">
                ${gato.porte}
            </span>
        </div>
        <div class="localizacao">
            <img src="../img/local.png" alt="local" class="localizacao-icon">
            <span>${localizacao}</span>
        </div>
    `;

  card.innerHTML = htmlContent;

  return card;
}

// Função para atualizar estado das setas de gatos
function atualizarSetasGatos() {
  const setaEsquerda = document.getElementById('setaEsquerdaGatos');
  const setaDireita = document.getElementById('setaDireitaGatos');
  const carrossel = document.getElementById('carrosselGatos');

  if (!setaEsquerda || !setaDireita || !carrossel) return;

  // Verifica se pode ir para a esquerda (voltar)
  setaEsquerda.disabled = indiceAtualGatos <= GATOS_POR_VEZ;

  // Verifica se pode ir para a direita (avançar)
  const totalGatos = gatosCarregados.length;
  setaDireita.disabled = indiceAtualGatos >= totalGatos;

  // Adiciona classes CSS para indicar estado desabilitado
  if (setaEsquerda.disabled) {
    setaEsquerda.classList.add('disabled');
  } else {
    setaEsquerda.classList.remove('disabled');
  }

  if (setaDireita.disabled) {
    setaDireita.classList.add('disabled');
  } else {
    setaDireita.classList.remove('disabled');
  }
}

// Função para navegar para esquerda (gatos)
function navegarEsquerdaGatos() {
  if (indiceAtualGatos <= GATOS_POR_VEZ) return;

  indiceAtualGatos -= GATOS_POR_VEZ;
  // Volta para mostrar os gatos anteriores
  const carrossel = document.getElementById('carrosselGatos');
  const gatosParaMostrar = gatosCarregados.slice(indiceAtualGatos - GATOS_POR_VEZ, indiceAtualGatos);

  carrossel.innerHTML = '';
  gatosParaMostrar.forEach(gato => {
    const card = criarCardGato(gato);
    carrossel.appendChild(card);
  });

  atualizarSetasGatos();
}

// Função para navegar para direita (gatos)
function navegarDireitaGatos() {
  const totalGatos = gatosCarregados.length;
  if (indiceAtualGatos >= totalGatos) return;

  carregarProximosGatos();
}

// Função para inicializar carrossel de gatos
function inicializarCarrosselGatos() {
  const setaEsquerda = document.getElementById('setaEsquerdaGatos');
  const setaDireita = document.getElementById('setaDireitaGatos');

  if (setaEsquerda) {
    setaEsquerda.addEventListener('click', navegarEsquerdaGatos);
  }

  if (setaDireita) {
    setaDireita.addEventListener('click', navegarDireitaGatos);
  }
}

// Função para inicializar carrossel dinâmico de gatos
function inicializarCarrosselDinamicoGatos() {
  inicializarCarrosselGatos();
  carregarGatos();
}

// Inicializar carrossel dinâmico de gatos
document.addEventListener('DOMContentLoaded', () => {
  inicializarCarrosselDinamicoGatos();
});

window.addEventListener('load', () => {
  // Verifica se o carrossel de gatos já foi inicializado
  const carrosselGatos = document.getElementById('carrosselGatos');
  if (carrosselGatos && carrosselGatos.innerHTML.includes('Carregando gatos...')) {
    inicializarCarrosselDinamicoGatos();
  }
});


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
function esconderPreloader() {
  const preloader = document.querySelector(".preloader");
  const preloaderLogo = document.getElementById("preloaderLogo");
  const headerLogo = document.getElementById("headerLogo");

  if (preloader) {
    // Esconde o preloader imediatamente
    preloader.style.display = "none";
    document.body.style.overflow = "auto";
    document.body.classList.add("show-content");
    console.log("Preloader escondido com sucesso");
  }
}

// Função para verificar se é a primeira visita
function verificarPrimeiraVisita() {
  const jaVisitou = localStorage.getItem('patinhas_visitou');
  
  if (!jaVisitou) {
    // Primeira visita - mostra o preloader
    localStorage.setItem('patinhas_visitou', 'true');
    return true;
  } else {
    // Já visitou antes - esconde o preloader imediatamente
    const preloader = document.querySelector(".preloader");
    if (preloader) {
      preloader.classList.add('visitante-retornando');
    }
    esconderPreloader();
    return false;
  }
}

// Função para resetar a primeira visita (útil para testes)
function resetarPrimeiraVisita() {
  localStorage.removeItem('patinhas_visitou');
  console.log('Primeira visita resetada. Recarregue a página para ver o preloader novamente.');
}

// Disponibiliza a função globalmente para testes (pode ser chamada no console)
window.resetarPrimeiraVisita = resetarPrimeiraVisita;

// Inicialização do preloader baseada na primeira visita
document.addEventListener('DOMContentLoaded', () => {
  const ehPrimeiraVisita = verificarPrimeiraVisita();
  
  if (ehPrimeiraVisita) {
    // Primeira visita - mostra o preloader por 2 segundos
    setTimeout(esconderPreloader, 2000);
  }
  // Se não for primeira visita, o preloader já foi escondido na verificação
});

// Fallback para primeira visita: esconde o preloader quando a página carregar completamente
window.addEventListener("load", () => {
  const ehPrimeiraVisita = !localStorage.getItem('patinhas_visitou');
  
  if (ehPrimeiraVisita) {
    setTimeout(esconderPreloader, 1000); // 1 segundo de delay
  }
});

// Fallback adicional para primeira visita: esconde após 5 segundos independente de qualquer coisa
setTimeout(() => {
  const ehPrimeiraVisita = !localStorage.getItem('patinhas_visitou');
  if (ehPrimeiraVisita) {
    esconderPreloader();
  }
}, 5000);



AOS.init();


