const URL = "http://127.0.0.1:3000";
// const URL = "https://patinhas-seguras-production.up.railway.app";


// ===================================================================
// ==================== [ SISTEMA DE NOTIFICAÇÃO ] ====================
// ===================================================================
function notify(title, message, duration = 3000, image = null, type = 'info') {
    const container = document.getElementById("notification-container");
    if(!container) return;

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
    progressBar.style.position = 'absolute';
    progressBar.style.bottom = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '4px';
    progressBar.style.width = '100%';
    progressBar.style.backgroundColor = 'rgba(0,0,0,0.1)';
    
    const progress = document.createElement('div');
    progress.style.height = '100%';
    
    let progressColor = '#1976d2'; // info
    if (type === 'success') progressColor = '#16a34a';
    if (type === 'error') progressColor = '#d32f2f';

    progress.style.backgroundColor = progressColor;
    progress.style.transition = `width ${duration}ms linear`;
    
    progressBar.appendChild(progress);
    notification.appendChild(progressBar);
    
    container.appendChild(notification);
    
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


document.addEventListener("DOMContentLoaded", () => {
        
    // ===================================================================
    // ==================== [ ANIMAÇÃO NA ROLAGEM (AOS) ] ====================
    // ===================================================================
    AOS.init({
        duration: 800, // Duração da animação
        once: true, // Animar apenas uma vez
    });
    
    

    // ===================================================================
    // ==================== [ ANIMAÇÃO DAS BARRAS DE PROGRESSO ] ==================
    // ===================================================================

    const progressBars = document.querySelectorAll('.progress');

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const animateProgress = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('data-width');
                progressBar.style.width = targetWidth;
                observer.unobserve(progressBar);
            }
        });
    };

    const observer = new IntersectionObserver(animateProgress, options);

    progressBars.forEach(bar => {
        observer.observe(bar);
    });

});



// ===================================================================
// ==================== [ CHAMADAS DE FUNCTIONS] ====================
document.addEventListener('DOMContentLoaded', verificarAuth);