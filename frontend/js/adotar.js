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
// ==================== [ CHAMADAS DE FUNCTIONS] ====================
document.addEventListener('DOMContentLoaded', verificarAuth);

document.addEventListener('DOMContentLoaded', () => {
    // --- Referências para as seções ---
    const secaoCachorros = document.getElementById('secao-cachorros');
    const secaoGatos = document.getElementById('secao-gatos');

    // --- Referências para os botões de navegação de seção ---
    const btnCachorros = document.querySelector('.btn-navegacao-cachorro');
    const btnGatos = document.querySelector('.btn-navegacao-gato');

    // --- FUNCIONALIDADE DOS BOTÕES DE NAVEGAÇÃO ENTRE SEÇÕES ---
    if (btnCachorros && btnGatos && secaoCachorros && secaoGatos) {

        const showSection = (targetId) => {
            if (targetId === 'cachorros') {
                secaoCachorros.classList.remove('hidden');
                secaoGatos.classList.add('hidden');
                btnCachorros.classList.add('ativo');
                btnGatos.classList.remove('ativo');
            } else if (targetId === 'gatos') {
                secaoGatos.classList.remove('hidden');
                secaoCachorros.classList.add('hidden');
                btnGatos.classList.add('ativo');
                btnCachorros.classList.remove('ativo');
            }
        };

        btnCachorros.addEventListener('click', () => showSection('cachorros'));
        btnGatos.addEventListener('click', () => showSection('gatos'));

        // Estado inicial: Mostra cachorros por padrão ao carregar
        showSection('cachorros');
    }

    // =================================================
    // ===========[ CÓDIGO PARA O MODAL ]===============
    // =================================================

    const modal = document.getElementById('animal-modal');
    if (modal) { // Verifica se o modal existe na página
        const closeModalBtn = document.querySelector('.modal-close-btn');
        const animalCards = document.querySelectorAll('.card, .card2'); // Pega todos os cards

        // Função para abrir o modal e preencher com dados
        const openModal = (cardData) => {
            document.getElementById('modal-img').src = cardData.img;
            document.getElementById('modal-img').alt = `Foto de ${cardData.nome}`;
            document.getElementById('modal-nome').textContent = cardData.nome;
            document.getElementById('modal-sexo').textContent = cardData.sexo;
            document.getElementById('modal-idade').textContent = cardData.idade;
            document.getElementById('modal-porte').textContent = cardData.porte;
            document.getElementById('modal-raca').textContent = cardData.raca;
            document.getElementById('modal-local').textContent = cardData.local;
            document.getElementById('modal-historia').textContent = cardData.historia;

            modal.style.display = 'flex'; // Mostra o modal
            document.body.style.overflow = 'hidden'; // Impede o scroll da página principal
        };

        // Adiciona o evento de clique a cada card de animal
        animalCards.forEach(card => {
            card.style.cursor = 'pointer'; // Muda o cursor para indicar que é clicável
            card.addEventListener('click', () => {
                const data = card.dataset; // Pega todos os atributos data-* do card clicado
                openModal(data);
            });
        });

        // Função para fechar o modal
        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Libera o scroll da página principal
        };

        // Eventos para fechar o modal
        closeModalBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (event) => {
            // Fecha o modal se o clique for no fundo cinza (overlay)
            if (event.target === modal) {
                closeModal();
            }
        });

        // Fecha o modal se a tecla 'Escape' for pressionada
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    }
});

AOS.init();


