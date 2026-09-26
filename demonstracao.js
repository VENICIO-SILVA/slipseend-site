// Video de apresentacao no topo da pagina inicial ("o que e o SlipSeend e
// para quem ele e"), hospedado no YouTube. Cole em youtubeId o trecho depois
// de "youtu.be/" (sem o "?si="). Enquanto estiver vazio, a secao fica escondida.
// Os tutoriais de uso ficam na pagina /comecar/ (lista em /tutoriais.js).
const apresentacao = {
    titulo: 'O que é o SlipSeend e para quem ele é',
    youtubeId: ''
};

(() => {
    const secao = document.getElementById('demonstracao');
    const tela = document.getElementById('player-apresentacao');
    if (!secao || !tela || !YOUTUBE_ID_VALIDO.test(apresentacao.youtubeId || '')) return;

    mostrarCapaYoutube(tela, apresentacao.youtubeId, apresentacao.titulo);
    secao.hidden = false;

    // Com o video publicado, o botao do topo leva a apresentacao.
    const chamada = document.getElementById('botao-conhecer');
    if (chamada) {
        chamada.href = '#apresentacao';
        chamada.textContent = 'Ver o que é o SlipSeend';
    }
})();
