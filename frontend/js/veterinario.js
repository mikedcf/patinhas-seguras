// const URL = "http://127.0.0.1:3000";
const URL = "https://patinhas-seguras-production.up.railway.app";


// ===================================================================
// ==================== [ SISTEMA DE NOTIFICAÇÃO ] ====================
// ===================================================================
function notify(title, message, duration = 3000, image = null, type = 'info') {
    const container = document.getElementById("notification-container");

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    
    let content = '';
    if (image) {
        content += `<img src="${image}" alt="Notificação">`;
    }
    content += `
        <div class="text">
            <div class="title">${title}</div>
            <div class="message">${message}</div>
        </div>
    `;
    notification.innerHTML = content;
    
    const progressBar = document.createElement('div');
    progressBar.style.height = '4px';
    progressBar.style.width = '100%';
    progressBar.style.backgroundColor = 'rgba(255,255,255,0.3)';
    progressBar.style.position = 'absolute';
    progressBar.style.bottom = '0';
    progressBar.style.left = '0';

    const progress = document.createElement('div');
    progress.style.height = '100%';
    progress.style.width = '100%';
    progress.style.backgroundColor = 'white';
    progress.style.transition = `width ${duration}ms linear`;
    
    progressBar.appendChild(progress);
    notification.appendChild(progressBar);
    
    container.appendChild(notification);
    
    // Inicia a animação da barra
    setTimeout(() => {
        progress.style.width = '0%';
    }, 10);


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

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        once: true,
    });
    


    // ===================================================================
    // ==================== [ SLIDER DE IMAGENS ] ====================
    // ===================================================================
    const slidesData = [
        {
            img: "https://images.pexels.com/photos/6235116/pexels-photo-6235116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            alt: "Veterinária examinando um cachorro"
        },
        {
            img: "https://i.ibb.co/TVhSfym/Gemini-Generated-Image-b35zkeb35zkeb35z-1.png",
            alt: "Gato recebendo carinho em uma clínica"
        },
        {
            img: "https://i.ibb.co/zWmxnYHG/Gemini-Generated-Image-4aavsm4aavsm4aav.png",
            alt: "Veterinário cuidando de um filhote de cachorro"
        }
    ];

    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        slidesData.forEach(slideData => {
            const slideEl = document.createElement('div');
            slideEl.className = 'slide fade';
            slideEl.innerHTML = `<img src="${slideData.img}" alt="${slideData.alt}" />`;
            sliderContainer.appendChild(slideEl);
        });
    }


    let slideIndex = 0;
    const slides = document.querySelectorAll(".slide");

    function showSlides() {
        if (slides.length === 0) return;
        slides.forEach(slide => slide.classList.remove('active'));
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1 }
        slides[slideIndex - 1].classList.add('active');
        setTimeout(showSlides, 4000);
    }
    
    // ===================================================================
    // ==================== [ SERVIÇOS ] ====================
    // ===================================================================
    const servicos = [
        { icon: "https://i.ibb.co/BRztXYB/animal.png", title: "Consultas Gerais", text: "Check-ups completos para monitorar a saúde e o bem-estar do seu pet." },
        { icon: "https://api.iconify.design/healthicons:syringe-outline.svg?color=%23f97316", title: "Vacinação", text: "Proteção essencial contra doenças graves com um calendário de vacinas atualizado." },
        { icon: "https://i.ibb.co/PZvxtzRk/cachorro.png", title: "Castração", text: "Procedimento seguro para controle populacional e prevenção de doenças." },
        { icon: "https://i.ibb.co/qMTKRCLT/jaleco.png", title: "Exames Laboratoriais", text: "Diagnósticos precisos para um tratamento eficaz e direcionado." },
        { icon: "https://api.iconify.design/material-symbols:emergency-home-outline.svg?color=%23f97316", title: "Atendimento de Emergência", text: "Suporte rápido e eficiente para os momentos em que seu pet mais precisa." },
        { icon: "https://i.ibb.co/Ld9WC2tZ/icons8-chip-card-50.png", title: "Microchipagem", text: "Uma forma segura de identificar seu animal e garantir sua volta para casa." }
    ];

    const servicosGrid = document.querySelector('.servicos-grid');
    if(servicosGrid){
        servicos.forEach(servico => {
            const cardEl = document.createElement('div');
            cardEl.className = 'servico-card';
            cardEl.innerHTML = `
                <img src="${servico.icon}" alt="Ícone de ${servico.title}">
                <h3>${servico.title}</h3>
                <p>${servico.text}</p>
            `;
            servicosGrid.appendChild(cardEl);
        });
    }


    // ===================================================================
    // ==================== [ DICAS VETERINÁRIAS ] ====================
    // ===================================================================
    const dicas = [
        {
            titulo: "Como saber se o pet está com dor?",
            texto: "Mudanças no comportamento, como apatia, agressividade, falta de apetite ou dificuldade para se movimentar, podem ser sinais de que algo está errado. Fique atento e procure um veterinário.",
            img: "https://images.pexels.com/photos/4588037/pexels-photo-4588037.jpeg?auto=compress&cs=tinysrgb&w=600"
        },
        {
            titulo: "Vacinas obrigatórias para cães e gatos",
            texto: "A vacinação é essencial. Para cães, as vacinas V10 e antirrábica são cruciais. Para gatos, a V4 (ou V5) e a antirrábica são fundamentais. Siga sempre o calendário de vacinação com um veterinário.",
            img: "https://images.pexels.com/photos/6235233/pexels-photo-6235233.jpeg?auto=compress&cs=tinysrgb&w=600"
        },
        {
            titulo: "Cuidados pós-castração",
            texto: "Após a castração, o pet precisa de um ambiente tranquilo. Evite que ele lamba os pontos, use o colar elizabetano e siga as instruções do veterinário sobre medicação e alimentação para uma recuperação segura.",
            img: "https://images.pexels.com/photos/8434679/pexels-photo-8434679.jpeg?auto=compress&cs=tinysrgb&w=600"
        },
        {
            titulo: "A importância da alimentação adequada",
            texto: "A alimentação correta é a base da saúde. Rações de qualidade, específicas para a idade e porte, previnem doenças. Evite dar comida de humanos, especialmente alimentos tóxicos como chocolate, uva e cebola.",
            img: "https://images.pexels.com/photos/5999335/pexels-photo-5999335.jpeg?auto=compress&cs=tinysrgb&w=600"
        }
    ];

    const dicasContainer = document.querySelector('.dicas-container');
    const botoesDicasContainer = document.querySelector('.botoes_dicas');
    
    if (dicasContainer && botoesDicasContainer) {
        dicas.forEach((dica, index) => {
            const dicaEl = document.createElement('div');
            dicaEl.className = 'dica';
            dicaEl.id = `dica${index}`;
            dicaEl.innerHTML = `
                <div class="dica_texto">
                    <h3>${dica.titulo}</h3>
                    <p>${dica.texto}</p>
                </div>
                <div class="dica_imagem">
                    <img src="${dica.img}" alt="${dica.titulo}">
                </div>
            `;
            dicasContainer.appendChild(dicaEl);

            const botaoEl = document.createElement('button');
            botaoEl.className = 'bt_dica';
            botaoEl.dataset.dica = index;
            botoesDicasContainer.appendChild(botaoEl);
        });

        const botoes = document.querySelectorAll('.bt_dica');
        const dicaElements = document.querySelectorAll('.dica');

        function mostrarDica(index) {
            dicaElements.forEach(d => d.classList.remove('ativa'));
            botoes.forEach(b => b.classList.remove('selecionado'));
            
            document.getElementById(`dica${index}`).classList.add('ativa');
            botoes[index].classList.add('selecionado');
        }

        botoes.forEach(botao => {
            botao.addEventListener('click', () => {
                mostrarDica(botao.dataset.dica);
            });
        });

        mostrarDica(0);
    }
    
    // ===================================================================
    // ==================== [ PARCEIROS ] ====================
    // ===================================================================
    const parceiros = [
        { nome: "Centro Veterinário Seres", endereco: "Av. Babita Camargos, 1295 - Cidade Industrial, Contagem - MG", telefone: "03130797389", logo: "https://i.ibb.co/spMnJ9ZG/Copilot-20250917-232014.png" },
        { nome: "Dognostic", endereco: "R. Padre Adelino, 1811 - Quarta Parada, São Paulo - SP", telefone: "01126051126", logo: "https://i.ibb.co/ymyycd9W/logo.png" },
        { nome: "Centro Veterinário Alpha Conde", endereco: "R. Capricórnio, 64 - Alphaville Conde I, Barueri - SP", telefone: "01141938231", logo: "https://i.ibb.co/KB9513s/Copilot-20250917-232636.png" }
    ];

    const parceirosGrid = document.querySelector('.parceiros-grid');
    if (parceirosGrid) {
        parceiros.forEach(parceiro => {
            const cardEl = document.createElement('div');
            cardEl.className = 'parceiro-card';
            cardEl.innerHTML = `
                <div class="parceiro-logo">
                    <img src="${parceiro.logo}" alt="Logo ${parceiro.nome}">
                </div>
                <div class="parceiro-info">
                    <h3>${parceiro.nome}</h3>
                    <p>${parceiro.endereco}<br><strong>☎: ${parceiro.telefone}</strong></p>
                    <button class="contato">Entrar em Contato</button>
                </div>
            `;
            parceirosGrid.appendChild(cardEl);
        });
    }

    // ===================================================================
    // ==================== [ INICIALIZAÇÃO GERAL ] ====================
    // ===================================================================
    verificarAuth();
    if(slides.length > 0) {
       showSlides(); // Inicia o carrossel
    }
});



