const jogador = {
    x: 300,  // Posição horizontal inicial
    y: 420,  // Posição vertical inicial

    // Tamanho do jogador
    largura: 40,
    altura: 40,

    cor: 'red', // Cor dele

    vidaMaxima: 3, // Vida máxima do jogador
    vida: 3, // Vida atual do Jogador
    tomouDano: false, // Se o jogador tomou dano recentemente, para controlar o efeito de piscar
    fimPiscaAte: 0, // Até quando o jogador deve continuar piscando
    ultimoAlternarPisca: 0, // Para controlar a frequência do piscar
    estaBrilhando: false, // Se o jogador está atualmente brilhando (parte do efeito de dano)
    ultimoDanoRecebido: 0, // Quanto dano ele recebeu no último ataque
    mostrarDanoAte: 0, // Até quando mostrar o texto de dano recebido
    temEspada: false,
    direcaoUltima: 1,
    direcaoAtaque: 'right',
    estaAtacando: false,
    fimAtaqueAte: 0,
    ataqueJaAcertou: false
};


// Carrega as imagens dos corações
const imagensCoracao = {
    1: new Image(),
    2: new Image(),
    3: new Image()
};

imagensCoracao[1].src = '/src/assets/img/coracao-1.png';
imagensCoracao[2].src = '/src/assets/img/coracao-2.png';
imagensCoracao[3].src = '/src/assets/img/coracao-3.png';


// Função de resetar o jogador para o estado inicial
function resetarJogador() {
    jogador.x = 300;
    jogador.y = 420;
    jogador.vida = jogador.vidaMaxima;
    jogador.tomouDano = false;
    jogador.fimPiscaAte = 0;
    jogador.ultimoAlternarPisca = 0;
    jogador.estaBrilhando = false;
    jogador.ultimoDanoRecebido = 0;
    jogador.mostrarDanoAte = 0;
    jogador.temEspada = false;
    jogador.direcaoUltima = 1;
    jogador.direcaoAtaque = 'right';
    jogador.estaAtacando = false;
    jogador.fimAtaqueAte = 0;
    jogador.ataqueJaAcertou = false;
}


// Função para desenhar um coração com proporção ajustada
function desenharCoracaoComProporcao(imagem, x, y, alturaDesejada) {
    if (!imagem.complete || imagem.naturalWidth === 0 || imagem.naturalHeight === 0) {
        return 0;
    }

    const proporcao = imagem.naturalWidth / imagem.naturalHeight;
    const largura = alturaDesejada * proporcao;

    ctx.drawImage(imagem, x, y, largura, alturaDesejada);
    return largura;
}


// Desenha o jogador
function desenharJogador() {
    // Função de desenhar o jogador
    const agora = Date.now();

    if (agora < jogador.fimPiscaAte) {
        if (agora - jogador.ultimoAlternarPisca >= 40) {
            jogador.estaBrilhando = !jogador.estaBrilhando;
            jogador.ultimoAlternarPisca = agora;
        }

        ctx.fillStyle = jogador.estaBrilhando ? 'white' : jogador.cor;
    } else {
        jogador.estaBrilhando = false;
        ctx.fillStyle = jogador.cor;
    }

    ctx.fillRect(jogador.x, jogador.y, jogador.largura, jogador.altura);
}


// Vida do jogador
function desenharVida() {
    const coracaoAtual = imagensCoracao[jogador.vida] || imagensCoracao[1];

    if (jogador.vida > 0) {
        desenharCoracaoComProporcao(coracaoAtual, 10, 10, 32);
    }

    if (Date.now() < jogador.mostrarDanoAte) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`-${jogador.ultimoDanoRecebido}`, canvas.width - 10, 26);
        ctx.textAlign = 'left';
    }
}


// Movimetação do jogador
const velocidade = 5; // Quantos pixels o jogador anda por frame

function moverJogador() {
    if (teclasPressionadas['ArrowUp'] && jogador.y > 0) {
        jogador.y -= velocidade; // Move para cima 
        jogador.direcaoAtaque = 'up';
    }
    if (teclasPressionadas['ArrowDown'] && jogador.y < canvas.height - jogador.altura) {
        jogador.y += velocidade; // Move para baixo
        jogador.direcaoAtaque = 'down';
    }
    if (teclasPressionadas['ArrowLeft'] && jogador.x > 0) {
        jogador.x -= velocidade; // Move para esquerda
        jogador.direcaoUltima = -1;
        jogador.direcaoAtaque = 'left';
    }
    if (teclasPressionadas['ArrowRight'] && jogador.x < canvas.width - jogador.largura) {
        jogador.x += velocidade; // Move para direita
        jogador.direcaoUltima = 1;
        jogador.direcaoAtaque = 'right';
    }
}

// Função de dano ao jogador
function tomarDano(valor) {
    jogador.vida -= valor;

    if (jogador.vida <= 0) {
        jogador.vida = 0;
    }

    const agora = Date.now();
    jogador.tomouDano = true;
    jogador.ultimoDanoRecebido = valor;
    jogador.mostrarDanoAte = agora + 700;
    jogador.fimPiscaAte = agora + 200;
    jogador.ultimoAlternarPisca = 0;
    jogador.estaBrilhando = true;
}


// Função de ataque do jogador
function atacar() {
    if (typeof iniciarAtaque === 'function') {
        iniciarAtaque();
    }
}