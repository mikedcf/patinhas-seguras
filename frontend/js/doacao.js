// const URL = "http://127.0.0.1:3000";
const URL = "https://patinhas-seguras-production.up.railway.app";


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



document.addEventListener('DOMContentLoaded', () => {

    AOS.init({
        duration: 800,
        once: true,
    });

    // ==========================================================
    // ===========[ MODAL DE DENÚNCIA ]===========
    // ==========================================================
    const denunciaModal = document.getElementById('denuncia-modal');
    const btnAbrirModalDenuncia = document.getElementById('btnAbrirModalDenuncia');
    const denunciaForm = document.getElementById('denuncia-form');
    const closeDenunciaModalBtn = denunciaModal.querySelector('.modal-close-btn');

    if (denunciaModal && btnAbrirModalDenuncia && denunciaForm) {
        
        const openDenunciaModal = () => {
            denunciaModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };

        const closeDenunciaModal = () => {
            denunciaModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            denunciaForm.reset();
        };

        btnAbrirModalDenuncia.addEventListener('click', openDenunciaModal);
        closeDenunciaModalBtn.addEventListener('click', closeDenunciaModal);
        
        denunciaModal.addEventListener('click', (event) => {
            if (event.target === denunciaModal) {
                closeDenunciaModal();
            }
        });

        denunciaForm.addEventListener('submit', (event) => {
            event.preventDefault();
            // Aqui você adicionaria a lógica para enviar os dados do formulário
            // Por enquanto, vamos apenas simular o sucesso.
            
            closeDenunciaModal();
            notify('Denúncia Enviada!', 'Agradecemos sua colaboração. As autoridades competentes foram notificadas.', 4000, null, 'success');
        });
        
         // Fechar modal com a tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && denunciaModal.style.display === 'flex') {
                closeDenunciaModal();
            }
        });
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
    let slideIndex = 0;
    const slides = document.querySelectorAll(".slide");

    function showSlides() {
        if (slides.length === 0) return;
        slides.forEach(slide => slide.classList.remove('active'));
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1 }
        slides[slideIndex - 1].classList.add('active');
        setTimeout(showSlides, 4000); // Troca a cada 4 segundos
    }
    
    // ===================================================================
    // ==================== [ BOTÃO DE DOAÇÃO PIX ] ====================
    // ===================================================================
    const btnPix = document.getElementById("btn-pix");
    const qrContainer = document.getElementById("qrContainer");
    const btnCopiarPix = document.getElementById("btn-copiar-pix");
    const chavePix = "12.345.678/0001-99";

    btnPix.addEventListener('click', () => {
        const isVisible = qrContainer.style.display === "block";
        qrContainer.style.display = isVisible ? "none" : "block";
    });

    btnCopiarPix.addEventListener('click', () => {
        navigator.clipboard.writeText(chavePix).then(() => {
            notify('Sucesso!', 'Chave PIX copiada para a área de transferência!', 2000, null, 'success');
        }).catch(err => {
            console.error('Erro ao copiar chave PIX: ', err);
             notify('Erro!', 'Não foi possível copiar a chave.', 2000, null, 'error');
        });
    });


    // ===================================================================
    // ==================== [ INICIALIZAÇÃO ] ====================
    // ===================================================================
    if(slides.length > 0) {
       showSlides(); // Inicia o carrossel
    }
});


// ===================================================================
// ==================== [ CHAMADAS DE FUNCTIONS] ====================
document.addEventListener('DOMContentLoaded', verificarAuth);