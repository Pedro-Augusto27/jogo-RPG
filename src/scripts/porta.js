// Arquivo porta.js - Define a porta para  entrar na próxima fase.

const porta = {
    // Posição da porta no mapa:
    x: 375,         // Posição X no mapa (perto do Mago)
    y: 20,           // Posição Y (mais para cima, simulando uma saída)

    // Características da porta:
    largura: 50,    // Largura do quadro amarelado
    altura: 50,     // Altura do quadro amarelado
    cor: '#ffeb3b', // Amarelo bem brilhante/luz

    // Estado da porta:
    visivel: false  // Começa invisível até falar com o mago
};

// Função de desenhar a porta na tela
function desenharPorta() {
    if (!porta.visivel && !MODO_DEBUG) {
        return;
    }

    // Se o debug estiver ativo e ela estiver oculta, desenha transparente
    if (!porta.visivel && MODO_DEBUG) {
        ctx.globalAlpha = 0.3;
    }

    // Desenha o fundo amarelo
    ctx.fillStyle = porta.cor;
    ctx.fillRect(porta.x, porta.y, porta.largura, porta.altura);

    // Borda de luz
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ff9800';
    ctx.strokeRect(porta.x, porta.y, porta.largura, porta.altura);

    // Texto de ajuda do Debug
    if (MODO_DEBUG) {
        ctx.fillStyle = 'yellow';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`Porta X:${porta.x} Y:${porta.y}`, porta.x - 10, porta.y - 8);
    }

    ctx.globalAlpha = 1.0;
}

// Função para verificar se o jogador está perto da porta
function proximaFase() {
    faseAtual += 1;

    porta.visivel = false;
    npc.visivel = false;

    // Reseta a posição do jogador para o início do mapa
    jogador.x = 300;
    jogador.y = 420;

    // -- CONFIGURAÇÃO DAS FASES --

    // -- FASE 2
    if (faseAtual === 2) {
        // Criamos 3 inimigos roxos espalhados pela tela com limites diferentes!
        inimigos = [
            criarInimigo(150, 150, 'purple', 3, 50, 300),
            criarInimigo(450, 220, 'purple', 3, 350, 600),
            criarInimigo(300, 100, 'orange', 4, 200, 450) // Esse tem 4 de vida!
        ];
    }

    // -- FASE 3: Chefão Vermelho + 2 Ajudantes Verdes! --
    else if (faseAtual === 3) {
        inimigos = [
            criarInimigo(100, 150, 'green', 2, 50, 250),              // Minion 1
            criarInimigo(600, 150, 'green', 2, 500, 700),             // Minion 2
            criarInimigo(380, 80, 'red', 10, 200, 550)                // CHEFÃO (10 de vida!)
        ];
    }

    // -- FIM DO JOGO / VITÓRIA (Ganha ao sair da Fase 3) --
    else if (faseAtual === 4) {
        jogoAcabado = true;
        alert("Parabéns! Você derrotou o Chefão e completou o jogo!");
        reiniciarJogo();
    }
}