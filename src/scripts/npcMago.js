const npcMago = {
    // Posição inicial do NPC Mago:
    x: 380,
    y: 120,

    // Características do NPC Mago:
    largura: 40,
    altura: 40,
    cor: 'purple',

    // Estado do NPC Mago:
    visivel: false,
    conversando: false,
    dialogando: false,
    indiceFrase: 0
};

let caixaDialogoAberta = false;

// Const para o navegador saber que as teclas estão sendo pressionadas
const dialogosNpc = [
    'Olá, jovem guerreiro, vejo que conseguiu derrotar aquela criatura.',
    'Eu sou um mago e vi sua luta. Você é muito habilidoso!',
    'Agora eu posso falar com você!',
    "Apenas pressione 'Z' para continuar.",
    'Agora, guerriero, você precisa ir derrotar a grande criatura.',
    "Para isso, siga reto para quela direção seta para cima ⬆️.",
];

// Função para ativar o NPC Mago
function ativarNpc() {
    npc.visivel = true;
    npc.x = inimigo.x + inimigo.largura + 18;
    npc.y = inimigo.y - 4;
}

// Função para verificar se o jogador está perto do NPC Mago
function jogadorPertoDoNpc() {
    return npc.visivel && detectarColisao(jogador, npc);
}

// Função para iniciar o diálogo com o NPC Mago
function iniciarDialogoNpc() {
    npc.dialogando = true;
    npc.indiceDialogo = 0;
}

// Função para avançar o diálogo com o NPC Mago
function avancarDialogoNpc() {
    npc.indiceDialogo += 1;

    if (npc.indiceDialogo >= dialogosNpc.length) {
        npc.dialogando = false;
        npc.indiceDialogo = 0;

        // Ativa a porta amarela quando o diálogo com o mago termina
        if (typeof porta !== 'undefined') {
            porta.visivel = true;
        }
    }
}

// Função para mostrar o NPC Mago quando o inimigo for derrotado
function mostrarNpcSeDerrotado() {
    if (!inimigoEstaVivo() && !npc.visivel) {
        ativarNpc();
    }
}

// Função para verificar se o inimigo está vivo
function desenharTextoQuebrado(texto, x, y, maxWidth, lineHeight) {
    const palavras = texto.split(' ');
    let linha = '';
    let posicaoY = y;

    for (let i = 0; i < palavras.length; i += 1) {
        const testeLinha = curve = linha + palavras[i] + ' ';
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

// Função que desenha o NPC Mago na tela
function desenharNpc() {
    if (!npc.visivel && !MODO_DEBUG) {
        return;
    }

    // Se o debug estiver ativo e ele estiver oculto, desenha transparente
    if (!npc.visivel && MODO_DEBUG) {
        ctx.globalAlpha = 0.4;
    }

    ctx.fillStyle = npc.cor;
    ctx.fillRect(npc.x, npc.y, npc.largura, npc.altura);


    // Texto de ajuda do Debug
    if (MODO_DEBUG) {
        ctx.fillStyle = 'cyan';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`Mago X:${npc.x} Y:${npc.y}`, npc.x - 12, npc.y - 8);
    }

    ctx.globalAlpha = 1.0;
}

// Função para desenhar a caixa de diálogo do NPC Mago
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
