// Player leve do YouTube usado no site. Mostra so a capa do video; o player
// (youtube-nocookie) carrega depois do clique: a pagina fica rapida e o
// YouTube nao grava cookies de quem nao assistiu.
const YOUTUBE_ID_VALIDO = /^[A-Za-z0-9_-]{11}$/;

function tocarYoutube(tela, youtubeId, rotulo) {
    const quadro = document.createElement('iframe');
    quadro.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`;
    quadro.title = rotulo;
    quadro.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    quadro.referrerPolicy = 'strict-origin-when-cross-origin';
    quadro.allowFullscreen = true;
    tela.replaceChildren(quadro);
}

function mostrarCapaYoutube(tela, youtubeId, rotulo) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'player-capa';
    botao.setAttribute('aria-label', `Assistir: ${rotulo}`);

    const imagem = document.createElement('img');
    imagem.alt = '';
    imagem.width = 1280;
    imagem.height = 720;
    imagem.src = `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
    // Nem todo video tem capa em alta resolucao.
    imagem.addEventListener('error', () => {
        imagem.src = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
    }, { once: true });

    const play = document.createElement('span');
    play.className = 'player-play';
    play.setAttribute('aria-hidden', 'true');
    play.textContent = '▶';

    botao.append(imagem, play);
    botao.addEventListener('click', () => tocarYoutube(tela, youtubeId, rotulo));
    tela.replaceChildren(botao);
}
