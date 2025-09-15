function validarEmail(email) {

    if (email.includes("@") && email.includes(".")) {
        return true
    }
    else {
        return false
    }
}

function validarSenha(senha) {

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,12}$/;
    let validacao = regex.test(senha)

    if (validacao == true) {
        return true
    }
    else {
        return false
    }
}

function validarCaracteres(username, email, senha) {

    let verificacao = true;
    
    const padroesPerigosos = [
        "'", '"', ';', '--', '#', '/*', '*/', '\\',
        'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP',
        'ALTER', 'UNION', 'EXEC', 'CREATE', 'TRUNCATE',
        'INTO', 'TABLE', 'DATABASE'
    ];


    for (let i = 0; i < padroesPerigosos.length; i++) {
        if (username.includes(padroesPerigosos[i])) {
            return true
        }
        else {
            verificacao = false
        }
    }

    if (verificacao == false) {
        for (let i = 0; i < padroesPerigosos.length; i++) {
            if (email.includes(padroesPerigosos[i])) {
                return true

            }
            else {
                verificacao = false
            }
        }

    }

    if (verificacao == false) {
        for (let i = 0; i < padroesPerigosos.length; i++) {
            if (senha.includes(padroesPerigosos[i])) {
                return true

            }
            else {
                return false
            }
        }
    }





}

function validarTelefone(telefone) {
    const regex = /^\d{11}$/;
    let validacao = regex.test(telefone)
    if (validacao == true) {
        return true
    }
}


module.exports = { validarEmail, validarSenha, validarCaracteres, validarTelefone}



