// ===============================================================
// ===============[ AUTENTICAÇÃO ]==================================

export async function autenticacao() {
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





