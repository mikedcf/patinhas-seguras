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

        // Estado inicial: Verifica se há âncora na URL ou mostra cachorros por padrão
        const hash = window.location.hash;
        if (hash === '#gatos') {
            showSection('gatos');
        } else {
            showSection('cachorros');
        }
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


document.addEventListener('DOMContentLoaded', () => {

    AOS.init();

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

        // Estado inicial: Verifica se há âncora na URL ou mostra cachorros por padrão
        const hash = window.location.hash;
        if (hash === '#gatos') {
            showSection('gatos');
        } else {
            showSection('cachorros');
        }
    }

    // ==========================================================
    // ===========[ CÓDIGO PARA O MODAL DE DETALHES ]============
    // ==========================================================
    const detailsModal = document.getElementById('animal-modal');
    if (detailsModal) {
        const closeDetailsModalBtn = detailsModal.querySelector('.modal-close-btn');

        const openDetailsModal = (cardData) => {
            document.getElementById('modal-img').src = cardData.img;
            document.getElementById('modal-img').alt = `Foto de ${cardData.nome}`;
            document.getElementById('modal-nome').textContent = cardData.nome;
            document.getElementById('modal-sexo').textContent = cardData.sexo;
            document.getElementById('modal-idade').textContent = cardData.idade;
            document.getElementById('modal-porte').textContent = cardData.porte;
            document.getElementById('modal-raca').textContent = cardData.raca;
            document.getElementById('modal-local').textContent = cardData.local;
            document.getElementById('modal-historia').textContent = cardData.historia;

            detailsModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };

        const closeDetailsModal = () => {
            detailsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        const setupCardEventListeners = () => {
            const animalCards = document.querySelectorAll('.card, .card2');
            animalCards.forEach(card => {
                card.style.cursor = 'pointer';
                // Remove listener antigo para evitar duplicação
                card.removeEventListener('click', handleCardClick);
                card.addEventListener('click', handleCardClick);
            });
        }

        function handleCardClick(event) {
            const data = event.currentTarget.dataset;
            openDetailsModal(data);
        }

        setupCardEventListeners(); // Configura os listeners para os cards existentes

        closeDetailsModalBtn.addEventListener('click', closeDetailsModal);

        detailsModal.addEventListener('click', (event) => {
            if (event.target === detailsModal) {
                closeDetailsModal();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && detailsModal.style.display === 'flex') {
                closeDetailsModal();
            }
        });
    }

    // ==========================================================
    // ===========[ CÓDIGO PARA O MODAL DE ADICIONAR ]===========
    // ==========================================================
    const addAnimalModal = document.getElementById('add-animal-modal');
    const btnOpenAddModal = document.getElementById('btn-open-add-modal');
    const addAnimalForm = document.getElementById('add-animal-form');

    if (addAnimalModal && btnOpenAddModal && addAnimalForm) {
        const closeAddModalBtn = addAnimalModal.querySelector('.modal-close-btn');

        const openAddModal = () => {
            addAnimalModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };

        const closeAddModal = () => {
            addAnimalModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            addAnimalForm.reset();
        };

        btnOpenAddModal.addEventListener('click', openAddModal);
        closeAddModalBtn.addEventListener('click', closeAddModal);

        addAnimalModal.addEventListener('click', (event) => {
            if (event.target === addAnimalModal) {
                closeAddModal();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && addAnimalModal.style.display === 'flex') {
                closeAddModal();
            }
        });

        addAnimalForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(addAnimalForm);
            const fileInput = document.getElementById('animal-img-upload');
            const file = fileInput.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const imgUrl = e.target.result;
                    const animalData = {
                        especie: formData.get('especie'),
                        nome: formData.get('nome'),
                        sexo: formData.get('sexo'),
                        idade: formData.get('idade'),
                        porte: formData.get('porte'),
                        raca: formData.get('raca'),
                        local: formData.get('local'),
                        historia: formData.get('historia'),
                        img: imgUrl
                    };
                    criarCardAnimal(animalData);
                    closeAddModal();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    function criarCardAnimal(data) {
        const isCachorro = data.especie === 'cachorro';
        const carrosselContainer = isCachorro ? document.querySelector('#secao-cachorros .carrossel') : document.querySelector('#secao-gatos .carrossel2');
        const cardClass = isCachorro ? 'card' : 'card2';
        const localizacaoClass = isCachorro ? 'localizacao' : 'localizacao2';

        const newCard = document.createElement('div');
        newCard.className = cardClass;

        // Atribuindo os data attributes
        newCard.dataset.nome = data.nome;
        newCard.dataset.sexo = data.sexo;
        newCard.dataset.idade = data.idade;
        newCard.dataset.porte = data.porte;
        newCard.dataset.raca = data.raca;
        newCard.dataset.local = data.local;
        newCard.dataset.historia = data.historia;
        newCard.dataset.img = data.img;

        // Construindo o HTML interno do card
        newCard.innerHTML = `
            <img src="${data.img}" alt="Foto de ${data.nome}">
            <h3>${data.nome}</h3>
            <div class="${localizacaoClass}">
                <img src="../img/local.png" alt="local">
                <span>${data.local}</span>
            </div>
        `;

        if (carrosselContainer) {
            carrosselContainer.appendChild(newCard);

            // Adiciona a funcionalidade de abrir o modal de detalhes no novo card
            newCard.style.cursor = 'pointer';
            newCard.addEventListener('click', () => {
                // Reutiliza a função openDetailsModal
                if (detailsModal) {
                    const detailsModal = document.getElementById('animal-modal');
                    document.getElementById('modal-img').src = newCard.dataset.img;
                    document.getElementById('modal-img').alt = `Foto de ${newCard.dataset.nome}`;
                    document.getElementById('modal-nome').textContent = newCard.dataset.nome;
                    document.getElementById('modal-sexo').textContent = newCard.dataset.sexo;
                    document.getElementById('modal-idade').textContent = newCard.dataset.idade;
                    document.getElementById('modal-porte').textContent = newCard.dataset.porte;
                    document.getElementById('modal-raca').textContent = newCard.dataset.raca;
                    document.getElementById('modal-local').textContent = newCard.dataset.local;
                    document.getElementById('modal-historia').textContent = newCard.dataset.historia;

                    detailsModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        }
    }
});

AOS.init();