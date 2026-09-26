// Tutoriais em video, hospedados no YouTube (nenhum video fica no site).
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

    const ID_VALIDO = /^[A-Za-z0-9_-]{11}$/;
    const publicado = tutoriais.map(tutorial => ID_VALIDO.test(tutorial.youtubeId || ''));

    // Capa + botao de play. O player do YouTube so carrega depois do clique:
    // a pagina fica leve e o YouTube nao grava cookies de quem nao assistiu.
    function mostrarCapa(indice) {
        const tutorial = tutoriais[indice];
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'player-capa';
        botao.setAttribute('aria-label', `Assistir ao tutorial ${indice + 1}: ${tutorial.titulo}`);

        const imagem = document.createElement('img');
        imagem.alt = '';
        imagem.width = 1280;
        imagem.height = 720;
        imagem.src = `https://i.ytimg.com/vi/${tutorial.youtubeId}/maxresdefault.jpg`;
        // Nem todo video tem capa em alta resolucao.
        imagem.addEventListener('error', () => {
            imagem.src = `https://i.ytimg.com/vi/${tutorial.youtubeId}/hqdefault.jpg`;
        }, { once: true });

        const play = document.createElement('span');
        play.className = 'player-play';
        play.setAttribute('aria-hidden', 'true');
        play.textContent = '▶';

        botao.append(imagem, play);
        botao.addEventListener('click', () => tocar(indice));
        tela.replaceChildren(botao);
    }

    function tocar(indice) {
        const tutorial = tutoriais[indice];
        const quadro = document.createElement('iframe');
        quadro.src = `https://www.youtube-nocookie.com/embed/${tutorial.youtubeId}?autoplay=1&rel=0`;
        quadro.title = `Tutorial ${indice + 1}: ${tutorial.titulo}`;
        quadro.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        quadro.referrerPolicy = 'strict-origin-when-cross-origin';
        quadro.allowFullscreen = true;
        tela.replaceChildren(quadro);
    }

    function selecionar(indice, iniciar) {
        lista.querySelectorAll('.item-tutorial').forEach((item, posicao) => {
            item.setAttribute('aria-current', posicao === indice ? 'true' : 'false');
        });
        if (iniciar) {
            tocar(indice);
        } else {
            mostrarCapa(indice);
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

    // Link direto para um video: /#tutorial-1, /#tutorial-2...
    const pedido = /^#tutorial-(\d+)$/.exec(location.hash);
    const indicePedido = pedido ? Number(pedido[1]) - 1 : -1;
    selecionar(publicado[indicePedido] ? indicePedido : primeiro, false);
    if (pedido) {
        document.getElementById('tutoriais').scrollIntoView();
    }
})();
