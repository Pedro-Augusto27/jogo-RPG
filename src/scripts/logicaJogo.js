// Arquivo 'logicaJogo.js' é responsavel por toda a logica do
// jogo, como movimentação, colisão, mudança de cenário, etc.

let ultimoDano = 0;
const intervaloDano = 500; // Tempo minimo entre danos (em ms)
let jogoAcabado = false;
let reinicioAgendado = false;
const tempoAntesDeReiniciar = 1500;
let ultimoAtaque = 0;
const intervaloAtaque = 400;
const duracaoAtaque = 180;
const danoDoAtaque = 1;

// Espada para o jogador pegar
const espada = {
    x: 150,
    y: 300,
    yBase: 300,
    largura: 56,
    altura: 56,
    imagem: new Image(),
    pega: false
};
espada.imagem.src = '/src/assets/img/espada.png';

// Função para detectar a colisao entre dois objetos (jogador e inimigo)
function detectarColisao(a, b) {
    return (
        a.x < b.x + b.largura &&
        a.x + a.largura > b.x &&
        a.y < b.y + b.altura &&
        a.y + a.altura > b.y
    );
}

// Função de desenhar a tela de Game Over
function desenharGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = 'bold 42px Arial';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);

    ctx.font = 'bold 18px Arial';
    ctx.fillText('Reiniciando...', canvas.width / 2, canvas.height / 2 + 28);
    ctx.textAlign = 'left';
}

// Função de reniciar o jogo, resetando tudo para o estado inicial
function reiniciarJogo() {
    jogoAcabado = false;
    reinicioAgendado = false;
    ultimoDano = 0;
    ultimoAtaque = 0;

    resetarJogador();

    inimigo.x = 450;
    inimigo.y = 121;
    inimigo.direcao = 1;
    inimigo.vida = 3;

    espada.pega = false;
}

// Função para verificar se o inimigo ainda tem vida
function inimigoEstaVivo() {
    return inimigo.vida > 0;
}

// Função de desenhar a espada
function desenharEspada() {
    if (!espada.pega && espada.imagem.complete) {
        const flutuacao = Math.sin(Date.now() * 0.006) * 4;
        espada.y = espada.yBase + flutuacao;

        ctx.drawImage(espada.imagem, espada.x, espada.y, espada.largura, espada.altura);
    }
}

// Função para o jogador atacar
function iniciarAtaque() {
    const agora = Date.now();

    if (jogoAcabado || !jogador.temEspada) {
        return;
    }

    if (agora - ultimoAtaque < intervaloAtaque) {
        return;
    }

    jogador.estaAtacando = true;
    jogador.fimAtaqueAte = agora + duracaoAtaque;
    jogador.ataqueJaAcertou = false;
    ultimoAtaque = agora;
}


function getHitboxAtaque() {
    const tamanhoAtaque = 38;

    if (jogador.direcaoAtaque === 'up') {
        return {
            x: jogador.x - 2,
            y: jogador.y - tamanhoAtaque,
            largura: jogador.largura + 4,
            altura: tamanhoAtaque
        };
    }

    if (jogador.direcaoAtaque === 'down') {
        return {
            x: jogador.x - 2,
            y: jogador.y + jogador.altura,
            largura: jogador.largura + 4,
            altura: tamanhoAtaque
        };
    }

    if (jogador.direcaoAtaque === 'left') {
        return {
            x: jogador.x - tamanhoAtaque,
            y: jogador.y - 2,
            largura: tamanhoAtaque,
            altura: jogador.altura + 4
        };
    }

    return {
        x: jogador.x + jogador.largura,
        y: jogador.y - 2,
        largura: tamanhoAtaque,
        altura: jogador.altura + 4
    };
}


function tentarAtacar() {
    if (!jogador.estaAtacando || jogoAcabado || jogador.ataqueJaAcertou) {
        return false;
    }

    if (!inimigoEstaVivo()) {
        return false;
    }

    const hitboxAtaque = getHitboxAtaque();

    if (detectarColisao(hitboxAtaque, inimigo)) {
        inimigo.vida -= danoDoAtaque;

        if (inimigo.vida < 0) {
            inimigo.vida = 0;
        }
        inimigo.ultimoDanoRecebido = danoDoAtaque;
        inimigo.fimPiscaAte = Date.now() + 160;
        inimigo.ultimoAlternarPisca = 0;
        inimigo.estaBrilhando = true;
        jogador.ataqueJaAcertou = true;
        return true;
    }

    return false;
}


// Função de desenhar o ataque do jogador
function desenharAtaque() {
    if (!jogador.estaAtacando || jogoAcabado || !jogador.temEspada) {
        return;
    }

    const agora = Date.now();

    if (agora >= jogador.fimAtaqueAte) {
        jogador.estaAtacando = false;
        jogador.ataqueJaAcertou = false;
        return;
    }

    const progresso = 1 - ((jogador.fimAtaqueAte - agora) / duracaoAtaque);
    const curva = Math.sin(progresso * Math.PI);
    const escala = 0.9 + curva * 0.25;
    const distancia = 10 + curva * 14;
    const centroX = jogador.x + jogador.largura / 2;
    const centroY = jogador.y + jogador.altura / 2;

    let baseX = centroX;
    let baseY = centroY;
    let rotacaoBase = 0;

    if (jogador.direcaoAtaque === 'up') {
        baseY -= distancia;
        rotacaoBase = -Math.PI / 2 - 0.55 + curva * 0.35;
    } else if (jogador.direcaoAtaque === 'down') {
        baseY += distancia;
        rotacaoBase = Math.PI / 2 + 0.55 - curva * 0.35;
    } else if (jogador.direcaoAtaque === 'left') {
        baseX -= distancia;
        rotacaoBase = Math.PI - 0.55 + curva * 0.35;
    } else {
        baseX += distancia;
        rotacaoBase = -0.55 + curva * 0.35;
    }

    ctx.save();
    ctx.translate(baseX, baseY);
    ctx.rotate(rotacaoBase);
    ctx.scale(escala, escala);

    if (espada.imagem.complete && espada.imagem.naturalWidth > 0) {
        ctx.drawImage(espada.imagem, -18, -18, 36, 36);
    } else {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(-16, -4, 28, 6);
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(10, -2, 8, 2);
    }

    ctx.restore();
}


/** 
 * Função para atualizar o jogo, onde faz com o navegador redesenhe a tela
 * muitas vezes por segundo. 
 * 
 * Ele limpa a tela, atualiza a posição do jogador e desenha novamente.
 * 
 * Essa função gerencia tudo o que acontece no jogo.
*/
function atualizar() {
    // 1. Limpa o canvas inteiro (da posição 0, 0 até o fim)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!jogoAcabado) {
        // 2. Atualiza a logica de cada objeto
        moverJogador();
        if (inimigoEstaVivo()) {
            moverInimigo();
        }

        if (jogador.estaAtacando) {
            tentarAtacar();

            if (Date.now() >= jogador.fimAtaqueAte) {
                jogador.estaAtacando = false;
                jogador.ataqueJaAcertou = false;
            }
        }

        // 3.Colisão:
        // Colisão entre jogador e inimigo apenas enquanto ele estiver vivo
        if (inimigoEstaVivo() && detectarColisao(jogador, inimigo)) {
            const agora = Date.now();

            if (agora - ultimoDano >= intervaloDano) {
                tomarDano(1); // Perde 1 ponto de vida
                ultimoDano = agora;
            }
        }

        // 
        if (jogador.vida <= 0) {
            jogoAcabado = true;

            if (!reinicioAgendado) {
                reinicioAgendado = true;
                setTimeout(reiniciarJogo, tempoAntesDeReiniciar);
            }
        }

        // Colisão entre jogador e espada
        if (!espada.pega && detectarColisao(jogador, espada)) {
            jogador.temEspada = true;
            espada.pega = true;
        }
    }

    // 4. Redesenha tudo na tela
    desenharJogador();
    desenharInimigo();
    desenharVida();
    desenharEspada();
    desenharAtaque();

    // Tela de Game Over
    if (jogoAcabado) {
        desenharGameOver();
    }

    // 5. Repete
    requestAnimationFrame(atualizar);
}
atualizar();