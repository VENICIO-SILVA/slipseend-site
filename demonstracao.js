// After uploading the final video, set this to '/videos/slipseend-demo.mp4'.
// Leave empty until the video is ready. No media request is made while empty.
const videoDemonstracao = '';
if (videoDemonstracao) {
    const video = document.getElementById('video-demo');
    const espera = document.getElementById('demo-espera');
    video.addEventListener('loadedmetadata', () => {
        video.hidden = false;
        espera.hidden = true;
    });
    video.addEventListener('error', () => {
        video.hidden = true;
        espera.hidden = false;
        document.getElementById('demo-status').textContent = 'O vídeo está indisponível no momento. Confira abaixo como funciona o SlipSeend.';
    });
    video.src = videoDemonstracao;
}
