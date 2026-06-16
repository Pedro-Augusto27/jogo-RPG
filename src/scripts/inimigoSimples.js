const inimigo = {
    x: 450,  // Posição horizontal inicial
    y: 121,  // Posição vertical inicial
    largura: 40,  // Largura do inimigo
    altura: 40,  // Altura do inimigo
    cor: 'blue',  // Cor do inimigo

    velocidadeX: 2,  // Velocidade horizontal 
    direcao: 1 // 1 = direita, -1 = esquerda
};

// Limites de patrulhamento horizontal
const limiteEsquerdo = 350;
const limiteDireito = 520;

// Função para mover o inimigo
function moverInimigo() {
    // Anda no eixo X conforme direção
    inimigo.x += inimigo.velocidadeX * inimigo.direcao;

    // Se bater no limite direiro, inverte para esquerda
    if (inimigo.x + inimigo.largura >= limiteDireito) {
        inimigo.x = limiteDireito - inimigo.largura;
        inimigo.direcao = -1;
    }

    // Se bater no inimigo esquerdo, inverte para direita
    if (inimigo.x <= limiteEsquerdo) {
        inimigo.x = limiteEsquerdo;
        inimigo.direcao = 1;
    }
}

// Desenha o inimigo
function desenharInimigo() {
    ctx.fillStyle = inimigo.cor;
    ctx.fillRect(inimigo.x, inimigo.y, inimigo.largura, inimigo.altura);
};
