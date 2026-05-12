// Esse arquivo é responsavel por lidar com a entradado do jogador, ou seja,
// as teclas que ele aperta para move o personagem, ataca e etc... 


// Const para o navegador saber que as teclas estão sendo pressionados
const teclasPressionadas = {}
// Quando apertar a tecla
window.addEventListener('keydown', (e) => {
    teclasPressionadas[e.key] = true;
});

// Quando soltar a tecla
window.addEventListener('keyup', (e) => {
    teclasPressionadas[e.key] = false;
});
