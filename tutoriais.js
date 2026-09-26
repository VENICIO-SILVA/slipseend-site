// Tutoriais em video da pagina "Primeiros passos" (/comecar/), hospedados no YouTube.
// Para publicar um video: cole em youtubeId o trecho depois de "youtu.be/"
// (sem o "?si=..."). Com youtubeId vazio, o item aparece como "Em breve".
const tutoriais = [
    {
        titulo: 'Como comprar e ativar seu plano',
        descricao: 'Escolha do plano, pagamento e ativação da licença no programa.',
        youtubeId: '7a42r4zZyjw'
    },
    {
        titulo: 'Como usar o SlipSeend',
        descricao: 'Importar o PDF, gerar os boletos e enviar pelo WhatsApp.',
        youtubeId: ''
    }
];

(() => {
    const tela = document.getElementById('player-tutorial');
    const lista = document.getElementById('lista-tutoriais');
    if (!tela || !lista) return;

    const publicado = tutoriais.map(tutorial => YOUTUBE_ID_VALIDO.test(tutorial.youtubeId || ''));
    const rotulo = indice => `Tutorial ${indice + 1}: ${tutoriais[indice].titulo}`;

    function selecionar(indice, iniciar) {
        lista.querySelectorAll('.item-tutorial').forEach((item, posicao) => {
            item.setAttribute('aria-current', posicao === indice ? 'true' : 'false');
        });
        const youtubeId = tutoriais[indice].youtubeId;
        if (iniciar) {
            tocarYoutube(tela, youtubeId, rotulo(indice));
        } else {
            mostrarCapaYoutube(tela, youtubeId, rotulo(indice));
        }
    }

    tutoriais.forEach((tutorial, indice) => {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'item-tutorial';
        // Nao usa "tutorial-N" como id: o navegador pularia para o item da
        // lista (abaixo do player no celular) em vez do inicio da secao.
        botao.id = `item-tutorial-${indice + 1}`;

        const numero = document.createElement('span');
        numero.className = 'item-numero';
        numero.textContent = String(indice + 1);

        const texto = document.createElement('span');
        const titulo = document.createElement('span');
        titulo.className = 'item-titulo';
        titulo.textContent = tutorial.titulo;
        const descricao = document.createElement('span');
        descricao.className = 'item-descricao';
        descricao.textContent = tutorial.descricao;
        texto.append(titulo, descricao);

        if (publicado[indice]) {
            botao.addEventListener('click', () => selecionar(indice, true));
        } else {
            botao.disabled = true;
            const breve = document.createElement('span');
            breve.className = 'item-breve';
            breve.textContent = 'Em breve';
            texto.append(breve);
        }

        botao.append(numero, texto);
        const item = document.createElement('li');
        item.append(botao);
        lista.append(item);
    });

    const primeiro = publicado.indexOf(true);
    if (primeiro < 0) {
        const aviso = document.createElement('p');
        aviso.className = 'player-aviso';
        aviso.textContent = 'Os tutoriais em vídeo estarão disponíveis em breve.';
        tela.replaceChildren(aviso);
        return;
    }

    // Link direto para um video: /comecar/#tutorial-1, #tutorial-2...
    const pedido = /^#tutorial-(\d+)$/.exec(location.hash);
    const indicePedido = pedido ? Number(pedido[1]) - 1 : -1;
    selecionar(publicado[indicePedido] ? indicePedido : primeiro, false);
    if (pedido) {
        document.getElementById('tutoriais').scrollIntoView();
    }
})();
