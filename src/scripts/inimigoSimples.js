const inimigo = {
    // Posição inicial do inimigo:
    x: 450,  // Posição horizontal inicial
    y: 121,  // Posição vertical inicial

    // Características do inimigo:
    largura: 40,  // Largura do inimigo
    altura: 40,  // Altura do inimigo
    cor: 'blue',  // Cor do inimigo

    // Movimentação do inimigo:
    velocidadeX: 2,  // Velocidade horizontal 
    direcao: 1, // 1 = direita, -1 = esquerda

    // Vida do inimigo:
    vida: 3, // Vida do inimigo

    // Estado do inimigo:
    fimPiscaAte: 0,
    ultimoAlternarPisca: 0,
    estaBrilhando: false,
    ultimoDanoRecebido: 0
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
    const agora = Date.now();
    const vivo = inimigo.vida > 0;

    if (vivo && agora < inimigo.fimPiscaAte) {
        if (agora - inimigo.ultimoAlternarPisca >= 40) {
            inimigo.estaBrilhando = !inimigo.estaBrilhando;
            inimigo.ultimoAlternarPisca = agora;
        }

        ctx.fillStyle = inimigo.estaBrilhando ? 'white' : inimigo.cor;
    } else if (!vivo) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    } else {
        inimigo.estaBrilhando = false;
        ctx.fillStyle = inimigo.cor;
    }

    ctx.fillRect(inimigo.x, inimigo.y, inimigo.largura, inimigo.altura);
};
