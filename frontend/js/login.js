// ===================================================================
// ==================== [ MODULE IMPORT] ====================
import { autenticacao } from './ultis.js';



// ===================================================================
// ==================== [ AUTENTICAÇÃO ] ====================

async function verificarAuth(){

    const dados = await autenticacao()
    if (dados.logado){
        window.location.href = 'home.html'
    }
}


// ===================================================================
// ================ [ AUTENTICAÇÃO ] ====================
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

    try{
        const response = await fetch('http://127.0.0.1:3000/api/v1/user/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            alert('Login realizado com sucesso!');
            setTimeout(() => { window.location.href = 'home.html'}, 2000)

        } else {
            const errorData = await response.json();
            alert(`Erro ao fazer login: ${errorData.message || 'Desconhecido'}`);
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

