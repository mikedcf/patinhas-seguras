// const URL = "http://127.0.0.1:3000";
const URL = "https://patinhas-seguras-production.up.railway.app";




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
        const response = await fetch(`${URL}/api/v1/user/auth`, {
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
        const response = await fetch(`${URL}/api/v1/user/logout`, {

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
// ==================== [ CARREGAR CACHORROS DA API ] ====================

let todosCachorros = [];
let cachorrosFiltrados = [];

// Função para carregar cachorros da API
async function carregarCachorros() {
    try {
        const response = await fetch(`${URL}/api/v1/animal/cachorros`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const cachorros = await response.json();
        todosCachorros = cachorros;
        cachorrosFiltrados = [...cachorros];
        
        exibirCachorros(cachorrosFiltrados);
        
    } catch (error) {
        console.error('Erro ao carregar cachorros:', error);
        notify('Erro', 'Erro ao carregar cachorros. Tente novamente.', 3000, null, 'error');
    }
}

// Função para exibir cachorros no carrossel
function exibirCachorros(cachorros) {
    const carrossel = document.querySelector('#secao-cachorros .carrossel');
    
    if (!carrossel) return;
    
    carrossel.innerHTML = '';
    
    if (cachorros.length === 0) {
        carrossel.innerHTML = '<div class="loading-message"><p>Nenhum cachorro encontrado com os filtros aplicados.</p></div>';
        return;
    }
    
    cachorros.forEach(cachorro => {
        const card = criarCardCachorro(cachorro);
        carrossel.appendChild(card);
    });
}

// Função para criar card de cachorro (estilo igual ao home)
function criarCardCachorro(cachorro) {
    const card = document.createElement('div');
    card.className = 'card-dinamico';
    card.setAttribute('data-aos', 'zoom-in');
    
    // Usa a localização do banco de dados ou uma localização padrão
    const localizacao = cachorro.localizacao || 'Localização não informada';
    
    // Lista de imagens locais de cachorros (fallback)
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
    
    // Adiciona dados para o modal
    card.dataset.nome = cachorro.nome;
    card.dataset.sexo = cachorro.sexo;
    card.dataset.idade = cachorro.idade;
    card.dataset.porte = cachorro.porte;
    card.dataset.raca = cachorro.raca;
    card.dataset.local = localizacao;
    card.dataset.historia = cachorro.descricao || 'História não disponível';
    card.dataset.img = imagemValida;
    
    // Adiciona funcionalidade de clique
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        abrirModalDetalhes(card.dataset);
    });
    
    return card;
}

// Função para abrir modal de detalhes
function abrirModalDetalhes(dados) {
    const modal = document.getElementById('animal-modal');
    if (!modal) return;
    
    document.getElementById('modal-img').src = dados.img;
    document.getElementById('modal-img').alt = `Foto de ${dados.nome}`;
    document.getElementById('modal-nome').textContent = dados.nome;
    document.getElementById('modal-sexo').textContent = dados.sexo;
    document.getElementById('modal-idade').textContent = dados.idade;
    document.getElementById('modal-porte').textContent = dados.porte;
    document.getElementById('modal-raca').textContent = dados.raca;
    document.getElementById('modal-vacinado').textContent = dados.vacinado == '1' ? 'Sim' : 'Não';
    document.getElementById('modal-castrado').textContent = dados.castrado == '1' ? 'Sim' : 'Não';
    document.getElementById('modal-local').textContent = dados.local;
    document.getElementById('modal-historia').textContent = dados.historia;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// ===================================================================
// ==================== [ CARREGAR GATOS DA API ] ====================

let todosGatos = [];
let gatosFiltrados = [];

// Função para carregar gatos da API
async function carregarGatos() {
    try {
        const response = await fetch(`${URL}/api/v1/animal/gatos`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const gatos = await response.json();
        todosGatos = gatos;
        gatosFiltrados = [...gatos];
        
        exibirGatos(gatosFiltrados);
        
    } catch (error) {
        console.error('Erro ao carregar gatos:', error);
        notify('Erro', 'Erro ao carregar gatos. Tente novamente.', 3000, null, 'error');
    }
}

// Função para exibir gatos no carrossel
function exibirGatos(gatos) {
    const carrossel = document.querySelector('#secao-gatos .carrossel');
    
    if (!carrossel) return;
    
    carrossel.innerHTML = '';
    
    if (gatos.length === 0) {
        carrossel.innerHTML = '<div class="loading-message"><p>Nenhum gato encontrado com os filtros aplicados.</p></div>';
        return;
    }
    
    gatos.forEach(gato => {
        const card = criarCardGato(gato);
        carrossel.appendChild(card);
    });
}

// Função para criar card de gato (estilo igual ao home)
function criarCardGato(gato) {
    const card = document.createElement('div');
    card.className = 'card-dinamico-gato';
    card.setAttribute('data-aos', 'zoom-in');
    
    // Usa a localização do banco de dados ou uma localização padrão
    const localizacao = gato.localizacao || 'Localização não informada';
    
    // Lista de imagens locais de gatos (fallback)
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
    
    // Adiciona dados para o modal
    card.dataset.nome = gato.nome;
    card.dataset.sexo = gato.sexo;
    card.dataset.idade = gato.idade;
    card.dataset.porte = gato.porte;
    card.dataset.raca = gato.raca;
    card.dataset.local = localizacao;
    card.dataset.historia = gato.descricao || 'História não disponível';
    card.dataset.img = imagemValida;
    
    // Adiciona funcionalidade de clique
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        abrirModalDetalhes(card.dataset);
    });
    
    return card;
}

// ===================================================================
// ==================== [ SISTEMA DE FILTROS ] ====================

// Função para aplicar filtros
function aplicarFiltros() {
    const filtroIdade = document.getElementById('filtro-idade').value;
    const filtroSexo = document.getElementById('filtro-sexo').value;
    const filtroPorte = document.getElementById('filtro-porte').value;
    const filtroRaca = document.getElementById('filtro-raca').value;
    const filtroEstado = document.getElementById('filtro-estado').value;
    
    cachorrosFiltrados = todosCachorros.filter(cachorro => {
        // Filtro por idade
        if (filtroIdade && !verificarIdade(cachorro.idade, filtroIdade)) {
            return false;
        }
        
        // Filtro por sexo
        if (filtroSexo && cachorro.sexo.toLowerCase() !== filtroSexo.toLowerCase()) {
            return false;
        }
        
        // Filtro por porte
        if (filtroPorte && cachorro.porte.toLowerCase() !== filtroPorte.toLowerCase()) {
            return false;
        }
        
        // Filtro por raça
        if (filtroRaca && cachorro.raca !== filtroRaca) {
            return false;
        }
        
        // Filtro por estado
        if (filtroEstado && !cachorro.localizacao.includes(filtroEstado)) {
            return false;
        }
        
        return true;
    });
    
    exibirCachorros(cachorrosFiltrados);
    
    // Mostra notificação com resultado
    const total = cachorrosFiltrados.length;
    if (total === 0) {
        notify('Filtro', 'Nenhum cachorro encontrado com os critérios selecionados.', 3000, null, 'warning');
    } else {
        notify('Filtro', `${total} cachorro(s) encontrado(s).`, 2000, null, 'success');
    }
}

// Função para verificar idade
function verificarIdade(idade, filtro) {
    const idadeNum = parseInt(idade);
    
    switch (filtro) {
        case 'meses':
            return idadeNum < 1;
        case '1 ano':
            return idadeNum === 1;
        case '2 anos':
            return idadeNum === 2;
        case '3 anos+':
            return idadeNum >= 3;
        default:
            return true;
    }
}

// Função para aplicar filtros de gatos
function aplicarFiltrosGatos() {
    const filtroIdade = document.getElementById('filtro-idade-gatos').value;
    const filtroSexo = document.getElementById('filtro-sexo-gatos').value;
    const filtroPorte = document.getElementById('filtro-porte-gatos').value;
    const filtroRaca = document.getElementById('filtro-raca-gatos').value;
    const filtroEstado = document.getElementById('filtro-estado-gatos').value;
    
    gatosFiltrados = todosGatos.filter(gato => {
        // Filtro por idade
        if (filtroIdade && !verificarIdade(gato.idade, filtroIdade)) {
            return false;
        }
        
        // Filtro por sexo
        if (filtroSexo && gato.sexo.toLowerCase() !== filtroSexo.toLowerCase()) {
            return false;
        }
        
        // Filtro por porte
        if (filtroPorte && gato.porte.toLowerCase() !== filtroPorte.toLowerCase()) {
            return false;
        }
        
        // Filtro por raça
        if (filtroRaca && gato.raca !== filtroRaca) {
            return false;
        }
        
        // Filtro por estado
        if (filtroEstado && !gato.localizacao.includes(filtroEstado)) {
            return false;
        }
        
        return true;
    });
    
    exibirGatos(gatosFiltrados);
    
    // Mostra notificação com resultado
    const total = gatosFiltrados.length;
    if (total === 0) {
        notify('Filtro', 'Nenhum gato encontrado com os critérios selecionados.', 3000, null, 'warning');
    } else {
        notify('Filtro', `${total} gato(s) encontrado(s).`, 2000, null, 'success');
    }
}

// Função para limpar filtros
function limparFiltros() {
    document.getElementById('filtro-idade').value = '';
    document.getElementById('filtro-sexo').value = '';
    document.getElementById('filtro-porte').value = '';
    document.getElementById('filtro-raca').value = '';
    document.getElementById('filtro-estado').value = '';
    
    cachorrosFiltrados = [...todosCachorros];
    exibirCachorros(cachorrosFiltrados);
    
    notify('Filtros', 'Filtros limpos. Mostrando todos os cachorros.', 2000, null, 'success');
}

// Função para limpar filtros de gatos
function limparFiltrosGatos() {
    document.getElementById('filtro-idade-gatos').value = '';
    document.getElementById('filtro-sexo-gatos').value = '';
    document.getElementById('filtro-porte-gatos').value = '';
    document.getElementById('filtro-raca-gatos').value = '';
    document.getElementById('filtro-estado-gatos').value = '';
    
    gatosFiltrados = [...todosGatos];
    exibirGatos(gatosFiltrados);
    
    notify('Filtros', 'Filtros limpos. Mostrando todos os gatos.', 2000, null, 'success');
}



// ===================================================================
// ==================== [ INICIALIZAÇÃO E EVENT LISTENERS ] ====================

document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    verificarAuth();
    
    // Carregar cachorros da API
    carregarCachorros();
    
    // Event listeners para filtros de cachorros
    const btnBuscar = document.getElementById('btn-buscar-cachorros');
    const btnLimpar = document.getElementById('btn-limpar-filtros');
    
    if (btnBuscar) {
        btnBuscar.addEventListener('click', aplicarFiltros);
    }
    
    if (btnLimpar) {
        btnLimpar.addEventListener('click', limparFiltros);
    }
    
    // Event listeners para filtros de gatos
    const btnBuscarGatos = document.getElementById('btn-buscar-gatos');
    const btnLimparGatos = document.getElementById('btn-limpar-filtros-gatos');
    
    if (btnBuscarGatos) {
        btnBuscarGatos.addEventListener('click', aplicarFiltrosGatos);
    }
    
    if (btnLimparGatos) {
        btnLimparGatos.addEventListener('click', limparFiltrosGatos);
    }
    
    // Event listeners para filtros automáticos de cachorros
    const filtrosCachorros = ['filtro-idade', 'filtro-sexo', 'filtro-porte', 'filtro-raca', 'filtro-estado'];
    filtrosCachorros.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('change', aplicarFiltros);
        }
    });
    
    // Event listeners para filtros automáticos de gatos
    const filtrosGatos = ['filtro-idade-gatos', 'filtro-sexo-gatos', 'filtro-porte-gatos', 'filtro-raca-gatos', 'filtro-estado-gatos'];
    filtrosGatos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('change', aplicarFiltrosGatos);
        }
    });
});

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
                
                // Carrega cachorros se ainda não foram carregados
                if (todosCachorros.length === 0) {
                    carregarCachorros();
                }
            } else if (targetId === 'gatos') {
                secaoGatos.classList.remove('hidden');
                secaoCachorros.classList.add('hidden');
                btnGatos.classList.add('ativo');
                btnCachorros.classList.remove('ativo');
                
                // Carrega gatos se ainda não foram carregados
                if (todosGatos.length === 0) {
                    carregarGatos();
                }
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
                
                // Carrega cachorros se ainda não foram carregados
                if (todosCachorros.length === 0) {
                    carregarCachorros();
                }
            } else if (targetId === 'gatos') {
                secaoGatos.classList.remove('hidden');
                secaoCachorros.classList.add('hidden');
                btnGatos.classList.add('ativo');
                btnCachorros.classList.remove('ativo');
                
                // Carrega gatos se ainda não foram carregados
                if (todosGatos.length === 0) {
                    carregarGatos();
                }
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
        newCard.dataset.vacinado = data.vacinado || '0';
        newCard.dataset.castrado = data.castrado || '0';
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




// ===================================================================
// ==================== [ FORMULARIO DE CADASTRO DE ANIMAIS ] ====================

async function formularioAnimal(event){
    event.preventDefault();

    const tipo = document.getElementById('animal-especie').value;
    const nome = document.getElementById('animal-nome').value;
    const sexo = document.getElementById('animal-sexo').value;
    const vacinado = document.getElementById('animal-vacinado').value;
    const castrado = document.getElementById('animal-castrado').value;
    const idade = document.getElementById('animal-idade').value;
    const porte = document.getElementById('animal-porte').value;
    const raca = document.getElementById('animal-raca').value;
    const local = document.getElementById('animal-local').value;
    const historia = document.getElementById('animal-historia').value;
    // imagem: pega o arquivo e faz upload (Cloudinary)
    const imgInput = document.getElementById('animal-img-file');
    let img = '';
    if (imgInput && imgInput.files && imgInput.files[0]) {
        // Presume que uploadimagem(file) retorna a URL pública (string)
        img = await uploadimagem(imgInput.files[0]);
    } else {
        img = '';
    }

    

    const dados = {
        tipo: tipo,
        nome: nome,
        idade: idade,
        raca: raca,
        sexo: sexo,
        porte: porte,
        vacinado: vacinado,
        castrado: castrado,
        descricao: historia,
        foto_url: img,
        localizacao: local,
        status: 'disponivel'
    };

    console.log(dados)

    enviarDados(dados);

}



async function enviarDados(dados) {
    const response = await fetch(`${URL}/api/v1/animal`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    });

    if (response.ok) {
        notify('Sucesso!', 'Animal cadastrado com sucesso!', 3000, null, 'success');

            // Limpar o formulário
        document.getElementById('add-animal-form').reset();
        
        // Fechar o modal
        const modal = document.getElementById('add-animal-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

    } else {
        notify('Erro!', 'Erro ao cadastrar animal!', 3000, null, 'error');
    }
}




// ================================================
// ============== [UPLOAD IMAGEM] =============
// Configurações globais do Cloudinary (reutilizadas por todas as funções)
const cloudName = 'dbc822i55';
const uploadPreset = 'ml_default';

async function uploadImagemCloudinary(file) {
    // Retorna imediatamente se nenhum arquivo for fornecido
    if (!file) {
        return null;
    }

    // Validação do arquivo
    if (!file.type.startsWith('image/')) {
        // showNotification('error', 'Por favor, selecione apenas arquivos de imagem.');
        return null;
    }

    // Validação adicional de extensão
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        // showNotification('error', 'Formato de arquivo não suportado. Use: JPG, PNG, GIF ou WebP.');
        return null;
    }

    // Limita o tamanho do arquivo (5MB)
    if (file.size > 5 * 1024 * 1024) {
        // showNotification('error', 'A imagem deve ter menos de 5MB.');
        return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    // Adiciona apenas parâmetros permitidos para unsigned upload
    // Parâmetros permitidos: upload_preset, folder, tags, context, public_id, etc.
    formData.append('folder', 'mixcamp_uploads');

    try {
        // console.log('Iniciando upload para Cloudinary...');
        // console.log('Cloud Name:', cloudName);
        // console.log('Upload Preset:', uploadPreset);
        // console.log('Arquivo:', file.name, 'Tamanho:', file.size, 'Tipo:', file.type);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        console.log('Resposta do Cloudinary:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta de erro completa:', errorText);
            throw new Error(`Erro no upload para o Cloudinary: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Upload bem-sucedido:', data);

        // showNotification('success', `Upload de imagem ${file.name} concluído!`);
        return data.secure_url;
    } catch (error) {
        console.error('Erro no upload da imagem:', error);
        // showNotification('error', `Erro ao fazer upload da imagem: ${error.message}`);

        // Tenta com preset alternativo se o primeiro falhar
        if (uploadPreset === 'ml_default') {
            console.log('Tentando com preset alternativo...');
            return await uploadImagemCloudinaryComPresetAlternativo(file);
        }

        return null;
    }
}

// Função alternativa com preset diferente
async function uploadImagemCloudinaryComPresetAlternativo(file) {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'mixcamp_uploads'); // Preset alternativo
    formData.append('folder', 'mixcamp_uploads');

    try {
        console.log('Tentando upload com preset alternativo...');
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Erro com preset alternativo: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        // showNotification('success', `Upload com preset alternativo concluído: ${file.name}`);
        return data.secure_url;
    } catch (error) {
        console.error('Erro com preset alternativo:', error);
        // showNotification('error', 'Todos os presets falharam. Verifique a configuração do Cloudinary.');
        return null;
    }
}


async function uploadimagem(file) {
    if (!file) {
        return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro Cloudinary:', errorText);
            return null;
        }

        const data = await response.json();
        return data.secure_url || null;
    } catch (err) {
        console.error('Falha no upload Cloudinary:', err);
        return null;
    }
}
