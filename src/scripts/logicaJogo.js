// Arquivo 'logicaJogo.js' é responsavel por toda a logica do
// jogo, como movimentação, colisão, mudança de cenário, etc.

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
espada.imagem.src = './assets/img/espada.png';

// Função para detectar a colisão entre as entidades do jogo.
function detectarColisao(a, b) {
    return (
        a.x < b.x + b.largura &&
        a.x + a.largura > b.x &&
        a.y < b.y + b.altura &&
        a.y + a.altura > b.y
    );
}

// Função de desenhar a tela de Game Over.
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

// Verifica se todos os inimigos da lista estão mortos
function todosInimigosMortos() {
    if (!inimigos || inimigos.length === 0) return false;
    return inimigos.every(i => i.vida <= 0);
}

// Função de verificar se ainda há algum inimigo vivo.
function inimigoEstaVivo() {
    return !todosInimigosMortos();
}

// Função de reiniciar o jogo, resetando tudo para o estado inicial.
function reiniciarJogo() {
    jogoAcabado = false;
    reinicioAgendado = false;
    ultimoDano = 0;
    ultimoAtaque = 0;
    faseAtual = 1;

    resetarJogador();

    // Reinicia com apenas 1 inimigo azul para a Fase 1
    inimigos = [
        criarInimigo(450, 121, 'blue', 3, 350, 520)
    ];

    espada.pega = false;
    espada.y = espada.yBase;

    npc.visivel = false;
    npc.dialogando = false;
    npc.indiceDialogo = 0;
    porta.visivel = false;
}

// Função que desenha a espada no chão
function desenharEspada() {
    if (!espada.pega) {
        const flutuacao = Math.sin(Date.now() * 0.006) * 4;
        espada.y = espada.yBase + flutuacao;

        if (espada.imagem.complete) {
            ctx.drawImage(espada.imagem, espada.x, espada.y, espada.largura, espada.altura);
        }
    }
}

// Função que inicia o ataque do Jogador
function iniciarAtaque() {
    const agora = Date.now();

    if (jogoAcabado || !jogador.temEspada || !inimigoEstaVivo()) {
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

// Calcula a área da hitbox do ataque baseado na direção
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

// Função de tentativa de ataque do jogador
function tentarAtacar() {
    if (!jogador.estaAtacando || jogoAcabado || jogador.ataqueJaAcertou) {
        return false;
    }

    const hitboxAtaque = getHitboxAtaque();

    for (let inimigo of inimigos) {
        if (inimigo.vida > 0 && detectarColisao(hitboxAtaque, inimigo)) {
            inimigo.vida -= danoDoAtaque;

            if (inimigo.vida < 0) inimigo.vida = 0;

            inimigo.ultimoDanoRecebido = danoDoAtaque;
            inimigo.fimPiscaAte = Date.now() + 160;
            inimigo.ultimoAlternarPisca = 0;
            inimigo.estaBrilhando = true;
            jogador.ataqueJaAcertou = true;
            return true;
        }
    }

    return false;
}

// Função que realiza a ação (Z) principal do jogador
function acaoPrincipal() {
    if (npc.dialogando) {
        avancarDialogoNpc();
        return;
    }

    if (npc.visivel && jogadorPertoDoNpc()) {
        iniciarDialogoNpc();
        return;
    }

    if (inimigoEstaVivo()) {
        iniciarAtaque();
    }
}

// Desenha a animação da espada girando ao atacar
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

// Loop central do jogo
function atualizar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!jogoAcabado) {
        moverJogador();
        moverInimigos();

        // REGRAS DE FASE:
        if (faseAtual === 1) {
            mostrarNpcSeDerrotado();
        } else if (faseAtual === 2) {
            if (todosInimigosMortos()) {
                porta.visivel = true;
            }
        }

        if (jogador.estaAtacando) {
            tentarAtacar();

            if (Date.now() >= jogador.fimAtaqueAte) {
                jogador.estaAtacando = false;
                jogador.ataqueJaAcertou = false;
            }
        }

        inimigos.forEach(inimigo => {
            if (inimigo.vida > 0 && detectarColisao(jogador, inimigo)) {
                const agora = Date.now();

                if (agora - ultimoDano >= intervaloDano) {
                    tomarDano(1);
                    ultimoDano = agora;
                }
            }
        });

        if (jogador.vida <= 0) {
            jogoAcabado = true;

            if (!reinicioAgendado) {
                reinicioAgendado = true;
                setTimeout(reiniciarJogo, tempoAntesDeReiniciar);
            }
        }

        if (!espada.pega && detectarColisao(jogador, espada)) {
            jogador.temEspada = true;
            espada.pega = true;
        }

        if (porta.visivel && detectarColisao(jogador, porta)) {
            proximaFase();
        }
    }

    // Chamadas de desenho
    desenharJogador();
    desenharInimigos();
    desenharNpc();
    desenharPorta();
    desenharVida();
    desenharEspada();
    desenharAtaque();
    desenharCaixaDialogo();

    if (jogoAcabado) {
        desenharGameOver();
    }

    requestAnimationFrame(atualizar);
}

// Inicia o jogo
atualizar();