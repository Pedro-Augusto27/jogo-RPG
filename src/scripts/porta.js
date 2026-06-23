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

    // -- CONFIGURAÇÃO DA FASE 2 --
    if (faseAtual === 2) {
        inimigo.x = 200;
        inimigo.y = 150;
        inimigo.vida = 5; // Mais vida na fase 2
        inimigo.cor = 'purple'; // Inimigo roxo agora
    }
}