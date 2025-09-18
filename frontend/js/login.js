const URL = "http://127.0.0.1:3000";
// const URL = "https://patinhas-seguras-production.up.railway.app";

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

    const dados = await autenticacao()
    if (dados.logado) {
        window.location.href = 'home.html'
    }
}


// ===================================================================
// ================ [ SISTEMA DE LOGIN ] ====================
const formulario = document.querySelector('form');
formulario.addEventListener('submit', login);
async function login(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    console.log(email, senha)

    const dados = {
        email,
        senha
    };

    try {
        const response = await fetch(`${URL}/api/v1/user/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            const dados = await autenticacao()
            notify('Sucesso!', 'Login realizado com sucesso.', 2000, dados.usuario.foto_url, 'success')
            setTimeout(() => { window.location.href = 'home.html' }, 2000)

        } else {
            const errorData = await response.json();
            notify('Error!', `Erro ao fazer login: ${errorData.message || 'Desconhecido'}`, 2000, null, 'error')
        }
    }
    catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login!');
    }
}

// ===================================================================
// ================ [ CHAMADAS DE FUNCTIONS] ====================

document.addEventListener('DOMContentLoaded', verificarAuth);
AOS.init();

