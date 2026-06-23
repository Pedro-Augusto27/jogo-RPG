// Arquivo 'logicaJogo.js' é responsavel por toda a logica do
// jogo, como movimentação, colisão, mudança de cenário, etc.

/*
console.log("O Canvas foi encontrado?", canvas);

// Forçando o tamanho aqui dentro para testar
canvas.width = 800;
canvas.height = 600;

// Desenha um fundo preto para sabermos onde a tela está
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Desenha um quadrado vermelho no meio
ctx.fillStyle = "red";
ctx.fillRect(100, 100, 200, 200);


let ultimoDano = 0;
const intervaloDano = 500; // Tempo minimo entre danos (em ms)
let jogoAcabado = false;
let reinicioAgendado = false;
const tempoAntesDeReiniciar = 1500;
let ultimoAtaque = 0;
const intervaloAtaque = 400;
const duracaoAtaque = 180;
const danoDoAtaque = 1;
*/

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

// Função para detectar a colisao entre as entidades do jogo.
function detectarColisao(a, b) {
    return (
        a.x < b.x + b.largura &&
        a.x + a.largura > b.x &&
        a.y < b.y + b.altura &&
        a.y + a.altura > b.y
    );
}

/*
// Função para verificar se o inimigo ainda tem vida.
const npc = {
    x: 0,
    y: 0,
    largura: 28,
    altura: 42,
    cor: '#7d3cff',
    visivel: false,
    dialogando: false,
    indiceDialogo: 0
};
*/

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

// Função de reniciar o jogo, resetando tudo para o estado inicial.
function reiniciarJogo() {
    jogoAcabado = false;
    reinicioAgendado = false;
    ultimoDano = 0;
    ultimoAtaque = 0;
    faseAtual = 1;

    resetarJogador();

    inimigo.x = 450;
    inimigo.y = 121;
    inimigo.direcao = 1;
    inimigo.vida = 3;
    inimigo.fimPiscaAte = 0;
    inimigo.ultimoAlternarPisca = 0;
    inimigo.estaBrilhando = false;

    espada.pega = false;
    espada.y = espada.yBase;

    npc.visivel = false;
    npc.dialogando = false;
    npc.indiceDialogo = 0;
    porta.visivel = false;
}

/*
// Função de verificar se o inimigo está vivo.
function inimigoEstaVivo() {
    return inimigo.vida > 0;
}

//Função que ativa o NPC
function ativarNpc() {
    npc.visivel = true;
    npc.x = inimigo.x + inimigo.largura + 18;
    npc.y = inimigo.y - 4;
}

// Função que verifica se o jogador está perto do NPC
function jogadorPertoDoNpc() {
    return npc.visivel && detectarColisao(jogador, npc);
}

// Função que inicia o dialogo com o NPC
function iniciarDialogoNpc() {
    npc.dialogando = true;
    npc.indiceDialogo = 0;
}

// Função que avança o dialogo com o NPC
function avancarDialogoNpc() {
    npc.indiceDialogo += 1;

    if (npc.indiceDialogo >= dialogosNpc.length) {
        npc.dialogando = false;
        npc.indiceDialogo = 0;

        // Aparece a porta quando o dialogo acabar
        porta.visivel = true;
    }
}

// Função que desenha o texto quebrado ao falar com o NPC
function desenharTextoQuebrado(texto, x, y, maxWidth, lineHeight) {
    const palavras = texto.split(' ');
    let linha = '';
    let posicaoY = y;

    for (let i = 0; i < palavras.length; i += 1) {
        const testeLinha = linha + palavras[i] + ' ';
        const larguraLinha = ctx.measureText(testeLinha).width;

        if (larguraLinha > maxWidth && i > 0) {
            ctx.fillText(linha, x, posicaoY);
            linha = palavras[i] + ' ';
            posicaoY += lineHeight;
        } else {
            linha = testeLinha;
        }
    }

    ctx.fillText(linha, x, posicaoY);
}

// Função que desenha o NPC
function desenharNpc() {
    if (!npc.visivel) {
        return;
    }

    ctx.fillStyle = npc.cor;
    ctx.fillRect(npc.x, npc.y, npc.largura, npc.altura);

    
    ctx.fillRect(npc.x + 4, npc.y + 7, 5, 5);
    ctx.fillRect(npc.x + 19, npc.y + 7, 5, 5);
    ctx.fillRect(npc.x + 9, npc.y + 24, 10, 3);
}

// Função que desenha a caixa de dialogo do NPC
function desenharCaixaDialogo() {
    if (!npc.dialogando) {
        return;
    }

    const margem = 18;
    const altura = 118;
    const x = margem;
    const y = canvas.height - altura - margem;
    const largura = canvas.width - margem * 2;
    const texto = dialogosNpc[npc.indiceDialogo] || '';

    ctx.fillStyle = '#050505';
    ctx.fillRect(x, y, largura, altura);

    ctx.lineWidth = 4;
    ctx.strokeStyle = 'white';
    ctx.strokeRect(x, y, largura, altura);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Grande Mago', x + 18, y + 28);

    ctx.font = '16px Arial';
    desenharTextoQuebrado(texto, x + 18, y + 62, largura - 36, 20);

    ctx.font = 'bold 14px Arial';
    ctx.fillText('Z', x + largura - 28, y + altura - 18);
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
*/

// função que inicia o ataque do Jogador
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

// Função de tentiva de ataque do jogador
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

// Função que realiza a ação(Z) principal do jogador, como atacar ou interagir com o NPC
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

/*
// Função que mostra o NPC se o inimigo foi derrotado
function mostrarNpcSeDerrotado() {
    if (!inimigoEstaVivo() && !npc.visivel) {
        ativarNpc();
    }
}

// Função para desenhar o quadrado amarelo da porta
function desenharPorta() {
    if (!porta.visivel) {
        return;
    }

    // Desenha o fundo amarelho
    ctx.fillStyle = porta.cor;
    ctx.fillRect(porta.x, porta.y, porta.largura, porta.altura);

    // Borda laranja. Efeito de luz
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ff9800';
    ctx.strokeRect(porta.x, porta.y, porta.largura, porta.altura);
}

function proximaFase() {
    faseAtual += 1;

    // Some com a porta e com NPC para preparar o novo mapa
    porta.visivel = false;
    npc.visivel = false;

    // Reseta a posição do jogador para o inicio do mapa
    jogador.x = 300;
    jogador.y = 420;

    // -- CONFIGURAÇÃO DA FASE 2 --
    if (faseAtual === 2) {
        // inimigo.x = 200;
        inimigo.y = 150;
        inimigo.vida = 5; // Mais vida na fase 2
        inimigo.cor = 'purple'; // Inimigo roxo agora
        
        // Você também pode mudar a cor do jogador ou criar novos desafios aqui
    }
}
*/


/** 
 * Função para atualizar o jogo, onde faz com o navegador redesenhe a tela
 * muitas vezes por segundo. 
 * 
 * Ele limpa a tela, atualiza a posição do jogador e desenha novamente.
 * 
 * Essa função gerencia tudo o que acontece no jogo.
*/

// Loop central do jogo
function atualizar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!jogoAcabado) {
        moverJogador();

        if (inimigoEstaVivo()) {
            moverInimigo();
        }

        mostrarNpcSeDerrotado();

        if (jogador.estaAtacando) {
            tentarAtacar();

            if (Date.now() >= jogador.fimAtaqueAte) {
                jogador.estaAtacando = false;
                jogador.ataqueJaAcertou = false;
            }
        }

        if (inimigoEstaVivo() && detectarColisao(jogador, inimigo)) {
            const agora = Date.now();

            if (agora - ultimoDano >= intervaloDano) {
                tomarDano(1);
                ultimoDano = agora;
            }
        }

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

    // Chamadas de desenho ordenadas
    desenharJogador();
    desenharInimigo();
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

// Inicia o ciclo do motor
atualizar();