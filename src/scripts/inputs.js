// Esse arquivo é responsavel por lidar com a entradado do jogador, ou seja,
// as teclas que ele aperta para move o personagem, ataca e etc... 


// Const para o navegador saber que as teclas estão sendo pressionados
const teclasPressionadas = {}
// Quando apertar a tecla
window.addEventListener('keydown', (e) => {
    if (e.repeat) {
        return;
    }

    teclasPressionadas[e.key] = true;

    if (e.key === 'z' || e.key === 'Z') {
        atacar();
    }
});

// Quando soltar a tecla
window.addEventListener('keyup', (e) => {
    teclasPressionadas[e.key] = false;
});
