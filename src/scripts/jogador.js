const jogador = {
    x: 300,  // Posição horizontal inicial
    y: 420,  // Posição vertical inicial

    // Tamanho do jogador
    largura: 40,
    altura: 40,

    cor: 'red'// Cor dele
};

// Desenha o jogador
function desenharJogador() {
    // Função de desenhar o jogador
    ctx.fillStyle = jogador.cor;
    ctx.fillRect(jogador.x, jogador.y, jogador.largura, jogador.altura);
}


// Movimetação do jogador
const velocidade = 5; // Quantos pixels o jogador anda por frame

function moverJogador() {
    if (teclasPressionadas['ArrowUp'] && jogador.y > 0) {
        jogador.y -= velocidade; // Move para cima 
    }
    if (teclasPressionadas['ArrowDown'] && jogador.y < canvas.height - jogador.altura) {
        jogador.y += velocidade; // Move para baixo
    }
    if (teclasPressionadas['ArrowLeft'] && jogador.x > 0) {
        jogador.x -= velocidade; // Move para esquerda
    }
    if (teclasPressionadas['ArrowRight'] && jogador.x < canvas.width - jogador.largura) {
        jogador.x += velocidade; // Move para direita
    }
}