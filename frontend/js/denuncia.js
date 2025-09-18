
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

// ================================================
// ============== [formulario de denuncia] =============

async function formularioDenuncia(event){
    event.preventDefault();
    
    const local = document.getElementById('denuncia-local').value;
    const descricao = document.getElementById('denuncia-descricao').value;
    const especie = document.getElementById('denuncia-especie').value;
    const provas = document.getElementById('denuncia-provas').value;
    const imgInput = document.getElementById('denuncia-provas');

    let img = '';
    if (imgInput && imgInput.files && imgInput.files[0]) {
        img = await uploadimagem(imgInput.files[0]);
    } else {
        img = '';
    }

    const dados = {
        local_ocorrencia: local,
        descricao_situacao: descricao,
        tipo_animal: especie,
        arquivo_prova : img,
    };
    console.log(dados);

    enviarDados(dados);
}


async function enviarDados(dados){
    const response = await fetch(`${URL}/api/v1/denuncia`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados),
        credentials: 'include',
    });

    if (response.ok) {
        notify('Sucesso!', 'Denúncia enviada com sucesso!', 3000, null, 'success');
        document.getElementById('denuncia-form').reset();
        document.getElementById('denuncia-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    } else {
        notify('Erro!', 'Erro ao enviar denúncia!', 3000, null, 'error');
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

// ===================================================================
// ==================== [ CHAMADAS DE FUNCTIONS] ====================

document.addEventListener('DOMContentLoaded', verificarAuth);
