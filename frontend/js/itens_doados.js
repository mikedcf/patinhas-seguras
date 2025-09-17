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

    if(dados.logado){

      document.getElementById('boxLogin').style.display = 'none'
      document.getElementById('userMenu').style.display = 'flex'
      document.getElementById('nomeperfil').innerText = dados.usuario.nome
      document.getElementById('avatarimg').src = dados.usuario.foto_url
    }
    else{
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

    setTimeout( async()  => {
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
// ==================== [ CHAMADAS DE FUNCTIONS] ====================
document.addEventListener('DOMContentLoaded', verificarAuth);





document.addEventListener("DOMContentLoaded", () => {
    // Seleciona todas as barras de progresso
    const progressBars = document.querySelectorAll('.progress');

    // Opções para o Intersection Observer
    const options = {
        root: null, // observa a viewport
        rootMargin: '0px',
        threshold: 0.5 // aciona quando 50% do elemento está visível
    };

    // Função que será chamada quando um elemento observado entrar na tela
    const animateProgress = (entries, observer) => {
        entries.forEach(entry => {
            // Se o elemento está visível
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('data-width');
                
                // Aplica a largura alvo para iniciar a animação CSS
                progressBar.style.width = targetWidth;

                // Para de observar o elemento após a animação para não repetir
                observer.unobserve(progressBar);
            }
        });
    };

    // Cria um novo observer
    const observer = new IntersectionObserver(animateProgress, options);

    // Pede ao observer para observar cada barra de progresso
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
});
