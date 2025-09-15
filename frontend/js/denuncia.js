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


// ================================================
// ============== [MODAL DE FORMULARIO] =============

function abrirFormulario() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = 'flex';
    } else {
        console.error('Elemento overlay não encontrado!');
    }
}


function fecharFormulario() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}

// Event listeners para os botões
document.addEventListener('DOMContentLoaded', function () {
    // Verificar autenticação
    verificarAuth();

    // Botão de abrir modal
    const btnDenunciar = document.getElementById('btnDenunciar');
    if (btnDenunciar) {
        btnDenunciar.addEventListener('click', function (e) {
            e.preventDefault();
            abrirFormulario();
        });
    }

    // Botão de fechar modal
    const btnFechar = document.getElementById('btn-fechar');
    if (btnFechar) {
        btnFechar.addEventListener('click', function (e) {
            e.preventDefault();
            fecharFormulario();
        });
    }

    // Botão de submit do formulário
    const btnSubmit = document.getElementById('submitbnt');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', function (e) {
            e.preventDefault();
            formularioget(e);
        });
    }

    // Radio buttons de provas
    const radioProvas = document.querySelectorAll('input[name="provas"]');
    radioProvas.forEach(radio => {
        radio.addEventListener('change', getcheckbox);
    });
});




// ================================================
// ============== [formulario] =============


// Fechar o formulário
function formularioget(event) {
    event.preventDefault()

    const nome = document.getElementById("nomeDenunciante").value
    const telefone = document.getElementById("telefone").value
    const email = document.getElementById("email").value
    const nomeVitima = document.getElementById("nomeVitima").value
    const idadeVitima = document.getElementById("idadeVitima").value
    const generoVitima = document.getElementById("generoVitima").value
    const enderecoVitima = document.getElementById("enderecoVitima").value
    const relacaoVitima = document.getElementById("relacaoVitima").value
    const nomeAgressor = document.getElementById("nomeAgressor").value
    const idadeAgressor = document.getElementById("idadeAgressor").value
    const relacaoAgressor = document.getElementById("relacaoAgressor").value
    const enderecoAgressor = document.getElementById("enderecoAgressor").value
    const localOcorrido = document.getElementById("localOcorrido").value
    const dataHoraFato = document.getElementById("dataHoraFato").value
    const descricao = document.getElementById("descricao").value
    const detalhesProvas = document.getElementById("detalhesProvas").value
    const informacoesAdicionais = document.getElementById("informacoesAdicionais").value
    const assinatura = document.getElementById("assinatura").value
    const valorSelecionado = document.querySelector('input[name="anonimato"]:checked').value
    const arquivosProvas = document.getElementById("arquivoProvas");

    const inputAvatar = arquivosProvas.files[0];
    // let avatarUrl = uploadimagem(inputAvatar)
    let avatarUrl ='teste';
    console.log('anonimato2',valorSelecionado)

    const dados = {
        nome: nome,
        telefone: telefone,
        email: email,
        anonimato: valorSelecionado,
        nomeVitima: nomeVitima,
        idadeVitima: idadeVitima,
        generoVitima: generoVitima,
        enderecoVitima: enderecoVitima,
        relacaoVitima: relacaoVitima,
        nomeAgressor: nomeAgressor,
        idadeAgressor: idadeAgressor,
        relacaoAgressor: relacaoAgressor,
        enderecoAgressor: enderecoAgressor,
        localOcorrido: localOcorrido,
        dataHoraFato: dataHoraFato,
        descricao: descricao,
        detalhesProvas: detalhesProvas,
        informacoesAdicionais: informacoesAdicionais,
        assinatura: assinatura,
        provas: avatarUrl
    }
    enviarDados(dados)
}

async function enviarDados(dados) {
    console.log(dados)

    try {
        const response = await fetch('http://127.0.0.1:3000/api/v1/denuncia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        })
        console.log('ok')
        alert('Denúncia enviada com sucesso!')

    } catch (error) {
        console.error('Erro ao enviar dados:', error)
    }
}


function getcheckbox() {
    const fotos = document.querySelector('input[name="provas"]:checked').value;
    if (fotos == `Sim`) {
        document.getElementById('uploadBox').style.display = 'flex'
    }
    else {
        document.getElementById('uploadBox').style.display = 'none'
    }
}


// ================================================
// ============== [UPLOAD IMAGEM] =============
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


function uploadimagem(file) {
    if (!file) {
        alert("Por favor, selecione uma imagem para enviar.");
        return;
    }

    // CONFIGURAÇÕES DO CLOUDINARY
    const uploadPreset = "ml_default"
    const cloudName = "dbc822i55"

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    fetch(url, {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log("Upload concluído com sucesso:", data);
            // URL da imagem hospedada:
            const imagemUrl = data.secure_url;
            console.log("Imagem hospedada em:", imagemUrl);

            // Aqui você pode continuar o envio do formulário com os outros dados + imagemUrl
        })
        .catch(err => {
            console.error("Erro ao fazer upload para o Cloudinary:", err);
        });
}


