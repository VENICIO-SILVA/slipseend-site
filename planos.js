const planos = [
    { id: 'essencial', mensal: '49,90', anual: '499,00', economia: '99,80' },
    { id: 'premium', mensal: '119,90', anual: '1.199,00', economia: '239,80' }
];
function atualizarPrecos() {
    const anual = document.querySelector('input[name="ciclo"]:checked').value === 'anual';
    document.querySelectorAll('.planos-grid .plano').forEach((card, i) => {
        const plano = planos[i];
        const preco = card.querySelector('.preco');
        preco.textContent = `R$ ${anual ? plano.anual : plano.mensal}`;
        const periodo = document.createElement('small');
        periodo.textContent = anual ? '/ano' : '/mês';
        preco.append(periodo);
        card.querySelector('.preco-legenda').textContent = anual
            ? `Pagamento anual. Economia de R$${plano.economia} por ano. Franquia renovada a cada mês.`
            : 'Pagamento mensal';
        card.querySelector('a').href = `/checkout/?plano=${plano.id}&ciclo=${anual ? 'anual' : 'mensal'}`;
    });
}
document.querySelectorAll('input[name="ciclo"]').forEach(input => input.addEventListener('change', atualizarPrecos));
atualizarPrecos();

