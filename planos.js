const planos = {
    essencial: { mensal: '49,90', anual: '499,00', economia: '99,80' },
    premium: { mensal: '119,90', anual: '1.199,00', economia: '239,80' }
};
// Mesma regua do servidor (PlanoLicenca): 10 a 140 boletos = R$ 14,90 + R$ 0,25 por boleto;
// 150 a 500 = R$ 49,90 + R$ 0,20 por boleto acima de 150. Anual = 10x o mensal.
function mensalCentavos(boletos) {
    return boletos < 150 ? 1490 + 25 * boletos : 4990 + 20 * (boletos - 150);
}
const reais = centavos => (centavos / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const cicloAnual = () => document.querySelector('input[name="ciclo"]:checked').value === 'anual';

function atualizarPrecos() {
    const anual = cicloAnual();
    document.querySelectorAll('.planos-grid .plano[data-plano]').forEach(card => {
        const plano = planos[card.dataset.plano];
        const preco = card.querySelector('.preco');
        preco.textContent = `R$ ${anual ? plano.anual : plano.mensal}`;
        const periodo = document.createElement('small');
        periodo.textContent = anual ? '/ano' : '/mês';
        preco.append(periodo);
        card.querySelector('.preco-legenda').textContent = anual
            ? `Pagamento anual. Economia de R$${plano.economia} por ano. Franquia renovada a cada mês.`
            : 'Pagamento mensal';
        card.querySelector('a').href = `/checkout/?plano=${card.dataset.plano}&ciclo=${anual ? 'anual' : 'mensal'}`;
    });
    atualizarPersonalizado();
}

function atualizarPersonalizado() {
    const card = document.getElementById('cardPersonalizado');
    if (!card) return;
    const anual = cicloAnual();
    const boletos = Number(document.getElementById('boletosPersonalizado').value);
    const mensal = mensalCentavos(boletos);
    const porBoleto = reais(Math.round(mensal / boletos));
    document.getElementById('boletosPersonalizadoValor').textContent = boletos;
    const preco = card.querySelector('.preco');
    preco.textContent = `R$ ${reais(anual ? mensal * 10 : mensal)}`;
    const periodo = document.createElement('small');
    periodo.textContent = anual ? '/ano' : '/mês';
    preco.append(periodo);
    card.querySelector('.preco-legenda').textContent = anual
        ? `Pagamento anual. Economia de R$${reais(mensal * 2)} por ano. R$ ${porBoleto} por boleto.`
        : `Pagamento mensal. R$ ${porBoleto} por boleto.`;
    card.querySelector('a').href = `/checkout/?plano=personalizado&boletos=${boletos}&ciclo=${anual ? 'anual' : 'mensal'}`;
}

document.querySelectorAll('input[name="ciclo"]').forEach(input => input.addEventListener('change', atualizarPrecos));
const controleBoletos = document.getElementById('boletosPersonalizado');
if (controleBoletos) controleBoletos.addEventListener('input', atualizarPersonalizado);
atualizarPrecos();
