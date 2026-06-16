// Arquivo 'logicaJogo.js' é responsavel por toda a logica do

// jogo, como movimentação, colisão, mudança de cenário, etc.
const obstaculo = { x: 200, y: 200, largura: 50, altura: 50, cor: 'black' };

function desenharCenario() {
    ctx.fillStyle = obstaculo.cor;
    ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
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

    // 2. Atualiza a logica de cada objeto
    moverJogador();
    moverInimigo();

    // 3. Redesenha tudo na tela
    desenharJogador();
    desenharInimigo();

    // 4. Repete
    requestAnimationFrame(atualizar);
}
atualizar();