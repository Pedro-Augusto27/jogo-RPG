// Está é o arquivo 'config.js' é aqui que fica as Variáveis globais 
// e configurações.
const canvas = document.getElementById('jogo-RPG');

// Define o tamanho de desenho do canvas.
// Sem isso, o navegador usa o padrão de 300x150px, deixando a tela pequena.
canvas.width = 800;
canvas.height = 600;

// ctx = Contexto, é o que usamos para desenhar no canvas e o tipo de contexto.
const ctx = canvas.getContext('2d'); // 2d é o tipo de contexto para que possa desenhar.


// --- CONFIGURAÇÕES GLOBAIS ---
const MODO_DEBUG = false; // Altere para false para esconder a entidades "fantasmas".

let faseAtual = 1; // Controla em qual fase o jogador está
let jogoAcabado = false;
let reinicioAgendado = false;
const tempoAntesDeReiniciar = 1500;

// Variáveis de controle de tempo
let ultimoDano = 0;
const intervaloDano = 500; // Tempo mínimo entre danos (em ms)
let ultimoAtaque = 0;
const intervaloAtaque = 400;
const duracaoAtaque = 180;
const danoDoAtaque = 1;