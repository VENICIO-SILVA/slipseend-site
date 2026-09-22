const form = document.getElementById('formCheckout');
const botao = document.getElementById('botaoComprar');
const mensagem = document.getElementById('mensagem');
const plano = document.getElementById('plano');
const precos = { essencial: '49,90', premium: '119,90' };
const ciclo = document.getElementById('ciclo');
const anuais = { essencial: '499,00', premium: '1.199,00' };
const params = new URLSearchParams(location.search);
if (Object.hasOwn(precos, params.get('plano'))) plano.value = params.get('plano');
if (params.get('ciclo') === 'anual') ciclo.value = 'anual';
function atualizarPlano() {
    document.getElementById('precoPlano').textContent = ciclo.value === 'anual' ? `Preço previsto: R$${anuais[plano.value]} pagos por ano, com franquia mensal. A cobrança anual ainda não está disponível. Neste teste: assinatura mensal de R$5.` : `Preço previsto: R$${precos[plano.value]}/mês. Neste teste: R$5/mês.`;
    const url = new URL(location.href);
    url.searchParams.set('plano', plano.value);
    url.searchParams.set('ciclo', ciclo.value);
    history.replaceState(null, '', url);
}
plano.addEventListener('change', atualizarPlano);
ciclo.addEventListener('change', atualizarPlano);
atualizarPlano();
const retornos = {
    sucesso: 'Você voltou do pagamento. A ativação depende da confirmação; confira seu e-mail antes de iniciar outra assinatura.',
    cancelada: 'O checkout foi cancelado. Isso não confirma o cancelamento de uma assinatura já existente.',
    expirada: 'A sessão de pagamento expirou. Você pode iniciar uma nova tentativa.'
};
if (Object.hasOwn(retornos, params.get('assinatura'))) {
    const retorno = document.getElementById('retorno');
    retorno.className = 'mensagem sucesso';
    retorno.textContent = retornos[params.get('assinatura')];
    if (params.get('assinatura') === 'sucesso') form.hidden = true;
}
form.addEventListener('submit', async event => {
    event.preventDefault();
    if (botao.disabled || !form.reportValidity()) return;
    mensagem.className = 'mensagem';
    const nome = document.getElementById('nome').value.trim();
    const cpfCnpj = document.getElementById('cpfCnpj').value.replace(/\D/g, '');
    const email = document.getElementById('email').value.trim();
    if (nome.length < 3 || ![11, 14].includes(cpfCnpj.length)) {
        mensagem.className = 'mensagem erro';
        mensagem.textContent = 'Confira seu nome e informe um CPF de 11 dígitos ou CNPJ de 14 dígitos.';
        return;
    }
    botao.disabled = true;
    botao.textContent = 'Preparando pagamento…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
        // The current server offers only the monthly test subscription.
        // A plan selection must not be mistaken for a server-side entitlement.
        const resposta = await fetch('https://servidorboletosautomacao-production.up.railway.app/api/checkout/assinatura', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, cpfCnpj, email }), signal: controller.signal
        });
        const dados = await resposta.json().catch(() => ({}));
        if (!resposta.ok || !dados.ok) throw new Error(dados.mensagem || 'Não foi possível iniciar a assinatura. Confira se já existe uma assinatura ativa ou fale com o suporte.');
        const destino = new URL(dados.checkoutUrl);
        if (destino.protocol !== 'https:' || !['www.asaas.com', 'asaas.com'].includes(destino.hostname)) throw new Error('O link de pagamento retornado é inválido. Fale com o suporte.');
        mensagem.className = 'mensagem sucesso';
        mensagem.textContent = 'Assinatura iniciada. Abrindo o pagamento no Asaas…';
        location.assign(destino.href);
    } catch (erro) {
        mensagem.className = 'mensagem erro';
        mensagem.textContent = erro.name === 'AbortError' || erro instanceof TypeError
            ? 'Não recebemos a confirmação do servidor. Confira seu e-mail e suas assinaturas antes de tentar novamente.' : erro.message;
        botao.disabled = false;
        botao.textContent = 'Continuar para pagamento';
    } finally { clearTimeout(timer); }
});
