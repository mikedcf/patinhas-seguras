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

    if(dados.logado){

      document.getElementById('boxLogin').style.display = 'none'
      document.getElementById('userMenu').style.display = 'flex'
      document.getElementById('nomeperfil').innerText = dados.usuario.nome
      document.getElementById('avatarimg').src = dados.usuario.foto_url
      window.location.href = 'home.html';
    }
    else{
      document.getElementById('boxLogin').style.display = 'flex'
      document.getElementById('userMenu').style.display = 'none'
    }

    
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
  }
}

// ===================================================================
// ==================== [ UPLOAD DE IMAGEM ] ====================

// Função mínima: clicar na área de preview abre o seletor de arquivo
function initOpenImageClick() {
    const fileInput = document.getElementById('foto-perfil');
    const imagePreview = document.getElementById('image-preview');
    if (!fileInput || !imagePreview) return;

    imagePreview.addEventListener('click', () => {
        fileInput.click();
    });
}

// ---- CLOUDINARY UPLOAD IMAGE/VIDEO

async function uploadImage(file) {
    const CloudName = 'dbc822i55';
    const UploadPreset = 'ml_default';

    if (file) {
        // --- Validações ---
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 5MB.');
            return;
        }

        // --- Enviar para Cloudinary ---
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UploadPreset); // agora usa a constante correta

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CloudName}/image/upload`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            // Aqui você pode salvar `data.secure_url` no banco ou usar no front
            return data.secure_url;
        } catch (err) {
            console.error("Erro no upload:", err);
        }
    }
}


// ===================================================================
// ==================== [ VALIDAÇÃO DE SENHA ] ====================

function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[@$!%*?&]/.test(password)
    };
    
    return requirements;
}

function updatePasswordRequirements(password) {
    const requirements = validatePassword(password);
    
    // Atualizar cada requisito
    Object.keys(requirements).forEach(req => {
        const element = document.getElementById(`req-${req}`);
        const icon = element.querySelector('.requirement-icon');
        const text = element.querySelector('.requirement-text');
        
        if (requirements[req]) {
            icon.textContent = '✅';
            element.classList.add('valid');
            element.classList.remove('invalid');
        } else {
            icon.textContent = '❌';
            element.classList.add('invalid');
            element.classList.remove('valid');
        }
    });
    
    // Verificar se todos os requisitos foram atendidos
    const allValid = Object.values(requirements).every(req => req);
    const passwordInput = document.getElementById('password');
    
    if (allValid) {
        passwordInput.classList.add('password-valid');
        passwordInput.classList.remove('password-invalid');
    } else {
        passwordInput.classList.add('password-invalid');
        passwordInput.classList.remove('password-valid');
    }
    
    return allValid;
}

function initPasswordValidation() {
    const passwordInput = document.getElementById('password');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            updatePasswordRequirements(e.target.value);
        });
        
        // Validar senha inicial se já tiver valor
        if (passwordInput.value) {
            updatePasswordRequirements(passwordInput.value);
        }
    }
}

// ===================================================================
// ==================== [ FORMULARIO DE CADASTRO ] ====================

async function cadastro(event) {
    event.preventDefault();

    const nome = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    const confirmarSenha = document.getElementById('confirm-password').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;

    const fileInput = document.getElementById("foto-perfil");
    const file = fileInput.files[0];

    let foto_url = null; 
    if (file) {
        foto_url = await uploadImage(file); // se tiver arquivo, faz upload
    }

    // Validar se a senha atende todos os requisitos
    const isPasswordValid = updatePasswordRequirements(senha);
    if (!isPasswordValid) {
        notify('Erro!', 'A senha não atende todos os requisitos de segurança.', 3000, null, 'error');
        return;
    }

    if (senha !== confirmarSenha) {
        notify('Erro!', 'As senhas não coincidem!', 3000, null, 'error');
        return;
    }
    
    const dados = {
        nome,
        email,
        senha,
        telefone,
        endereco,
        foto_url
    };
    
    registrar_cadastro(dados)
}


async function registrar_cadastro(dados) {
    console.log(dados)
    try {
        const response = await fetch(`${URL}/api/v1/user/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            notify('Sucesso!', 'Cadastro realizado com sucesso.', 2000, null, 'success')
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            
        } else {
            const errorData = await response.json();
            notify('Error!', `Erro ao cadastrar: ${errorData.message || 'Desconhecido'}`, 2000, null, 'error')
        }
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        notify('Error!', 'Erro ao cadastrar!', 2000, null, 'error')
    }

}


function watchImageUpload() {
    const fileInput = document.getElementById('foto-perfil');
    const imagePreview = document.getElementById('image-preview');

    function updatePreview(file) {
        if (!file) return;

        // Validações
        if (!file.type.startsWith('image/')) {
            console.log('Arquivo não é uma imagem');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            console.log('Arquivo muito grande');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.innerHTML = '';

            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Preview da foto de perfil';
            img.style.cssText = 'width: 200px !important; height: 200px !important; object-fit: contain; border-radius: 8px; display: block; margin: 0 auto;';

            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.className = 'remove-image';
            removeBtn.title = 'Remover imagem';
            removeBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                fileInput.value = '';
                imagePreview.innerHTML = `
                    <div class="upload-placeholder">
                        <span class="upload-icon">📷</span>
                        <span class="upload-text">Clique para adicionar foto</span>
                    </div>
                `;
                imagePreview.classList.remove('has-image');
            });

            imagePreview.appendChild(img);
            imagePreview.appendChild(removeBtn);
            imagePreview.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }

    // Checa a cada 500ms se um arquivo foi inserido
    setInterval(() => {
        const file = fileInput.files[0];
        if (file && imagePreview.querySelector('img') === null) {
            updatePreview(file);
            
            
            
        }
    }, 500);

    
}


// ===================================================================
// ==================== [ CHAMADAS DE FUNCTIONS] ====================

document.addEventListener('DOMContentLoaded', verificarAuth);

// Inicializar upload de imagem
document.addEventListener('DOMContentLoaded', () => {
    // Apenas abrir o seletor ao clicar no preview
    initOpenImageClick();
    
    // Inicializar o preview de imagem
    watchImageUpload();

    // Inicializar validação de senha
    initPasswordValidation();

    // Conectar formulário
    const form = document.querySelector('.register-form');
    if (form) {
        form.addEventListener('submit', cadastro);
    }
});

AOS.init();