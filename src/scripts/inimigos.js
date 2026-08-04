// Arquivo: inimigos.js - cria inimigos costomizados.

// Uma array para guardar inimigos.
let inimigos = [];

// Função criadora de inimigos
function criarInimigo(x, y, cor, vida, limiteEsq, limiteDir) {
    return {
        x: x,
        y: y,
        largura: 40,
        altura: 40,
        cor: cor,
        velocidadeX: 2,
        direcao: 1,
        vida: vida,
        limiteEsquerdo: limiteEsq,
        limiteDireito: limiteDir,
        fimPiscaAte: 0,
        ultimoAlternarPisca: 0,
        estaBrilhando: false,
        ultimoDanoRecebido: 0
    };
}

// Já inicia com o inimigo da Fase 1 carregado
inimigos = [
    criarInimigo(450, 121, 'blue', 3, 350, 520)
];

// Move todos os inimigos da lista
function moverInimigos() {
    inimigos.forEach(inimigo => {
        if (inimigo.vida <= 0) return;

        inimigo.x += inimigo.velocidadeX * inimigo.direcao;

        if (inimigo.x + inimigo.largura >= inimigo.limiteDireito) {
            inimigo.x = inimigo.limiteDireito - inimigo.largura;
            inimigo.direcao = -1;
        }

        if (inimigo.x <= inimigo.limiteEsquerdo) {
            inimigo.x = inimigo.limiteEsquerdo;
            inimigo.direcao = 1;
        }
    });
}

// Desenha todos os inimigos da lista
function desenharInimigos() {
    const agora = Date.now();

    inimigos.forEach(inimigo => {
        const vivo = inimigo.vida > 0;

        if (vivo && agora < inimigo.fimPiscaAte) {
            if (agora - inimigo.ultimoAlternarPisca >= 40) {
                inimigo.estaBrilhando = !inimigo.estaBrilhando;
                inimigo.ultimoAlternarPisca = agora;
            }
            ctx.fillStyle = inimigo.estaBrilhando ? 'white' : inimigo.cor;
        } else if (!vivo) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        } else {
            inimigo.estaBrilhando = false;
            ctx.fillStyle = inimigo.cor || 'blue';
        }

        ctx.fillRect(inimigo.x, inimigo.y, inimigo.largura, inimigo.altura);
    });
}