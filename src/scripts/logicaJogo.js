// Arquivo 'logicaJogo.js' é responsavel por toda a logica do
// jogo, como movimentação, colisão, mudança de cenário, etc.

let ultimoDano = 0;
const intervaloDano = 500; // Tempo minimo entre danos (em ms)
let jogoAcabado = false;
let reinicioAgendado = false;
const tempoAntesDeReiniciar = 1500;

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

    resetarJogador();

    inimigo.x = 450;
    inimigo.y = 121;
    inimigo.direcao = 1;
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
        moverInimigo();

        // Colisão entre jogador e inimigo
        if (detectarColisao(jogador, inimigo)) {
            const agora = Date.now();

            if (agora - ultimoDano >= intervaloDano) {
                tomarDano(1); // Perde 1 ponto de vida
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
    }

    // 3. Redesenha tudo na tela
    desenharJogador();
    desenharInimigo();
    desenharVida();

    // Tela de Game Over
    if (jogoAcabado) {
        desenharGameOver();
    }

    // 4. Repete
    requestAnimationFrame(atualizar);
}
atualizar();