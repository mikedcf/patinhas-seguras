document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('paymentForm');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardIcon = document.getElementById('cardIcon');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');

    // Função para identificar a bandeira do cartão
    const getCardType = (number) => {
        // remove espaços e não-dígitos
        const cleanNumber = number.replace(/\D/g, '');
        if (/^4/.test(cleanNumber)) return 'visa';
        if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
        if (/^3[47]/.test(cleanNumber)) return 'amex';
        if (/^(6011|65|64[4-9]|622)/.test(cleanNumber) || /^35/.test(cleanNumber) || /^50/.test(cleanNumber)) return 'elo'; // Elo e outros
        return 'generic';
    };

    // Máscara e identificação do cartão
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '').substring(0, 16);
        let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = formattedValue;
        
        const cardType = getCardType(value);
        cardIcon.className = 'card-icon ' + cardType + '-icon';
    });

    // Máscara para data de validade
    expiryDateInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        e.target.value = value;
    });

    // Limita o CVV
    cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });

    // Simulação de envio
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const button = e.target.querySelector('button[type="submit"]');
        button.disabled = true;
        button.innerHTML = 'Processando...';

        setTimeout(() => {
            alert('Pagamento simulado com sucesso! Nenhuma cobrança real foi efetuada.');
            button.disabled = false;
            button.innerHTML = `
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Pagar R$ 42,50`;
            paymentForm.reset();
            cardIcon.className = 'card-icon generic-icon';
        }, 2000);
    });
});