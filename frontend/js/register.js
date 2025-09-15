// ===================================================================
// ==================== [ MODULE IMPORT] ====================
import { autenticacao } from './ultis.js';



// ===================================================================
// ==================== [ AUTENTICAÇÃO ] ====================

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

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
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

    try {
        const response = await fetch('http://127.0.0.1:3000/api/v1/user/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            
        } else {
            const errorData = await response.json();
            alert(`Erro ao cadastrar: ${errorData.message || 'Desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        alert('Erro ao cadastrar!');
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

    // Conectar formulário
    const form = document.querySelector('.register-form');
    if (form) {
        form.addEventListener('submit', cadastro);
    }
});

AOS.init();