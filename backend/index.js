const express = require('express');
const cors = require('cors');
const path = require('path');

const {
  analisarEquacoes,
  solveTCR
} = require('./tcrSolver'); 

const app = express();
const PORTA = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ROTA PARA GERAR ARQUIVO LATEX 
app.post('/latex', (req, res) => {
  try {
    const nomeDoArquivo = gerarLatex(); 
    const url = `/${nomeDoArquivo}`;
    res.json({ url });
  } catch (erro) {
    console.error('Erro ao gerar LaTeX:', erro);
    res.status(500).json({ error: 'Erro ao gerar LaTeX' });
  }
});

// SERVE OS ARQUIVOS ESTÁTICOS DA PASTA PUBLIC =
app.use(express.static(path.join(__dirname, '..', 'public')));

// ROTA PRINCIPAL PARA RESOLVER SISTEMA DE CONGRUÊNCIAS 
app.post('/solve', (req, res) => {
  try {
    const entradaTexto = req.body.input;

    console.log('\n--- Entrada recebida do usuário ---\n', entradaTexto);

    // Etapa 1: transformar as equações na forma canônica
    const {
      parsed: equacoesCanonicas,
      canonicalSteps: passosCanonicos
    } = analisarEquacoes(entradaTexto);

    // Etapa 2: resolver o sistema com TCR
    const {
      result: resultadoFinal,
      M: produtoModulos,
      steps: passosLatexTCR,
      latexResult: caixaFinalLatex
    } = solveTCR(equacoesCanonicas);

    // Etapa 3: combinar todos os passos LaTeX
    const parteInternaTCR = passosLatexTCR
      .replace(/\\\[|\\\]/g, '')                             // remove \[ \]
      .replace(/\\begin\{array\}\{l\}|\\end\{array\}/g, ''); // remove begin/end

    const latexCompleto = `
\\[
\\begin{array}{l}
\\text{Transformando para forma canônica:} \\\\
${passosCanonicos.join(' \\\\')}
\\\\ \\hline \\\\
${parteInternaTCR}
\\end{array}
\\]
`.trim();

    // Resposta enviada para o frontend
    res.json({
      steps: latexCompleto,
      latexResult: caixaFinalLatex,
      result: resultadoFinal,
      M: produtoModulos
    });

  } catch (erro) {
    res.status(400).json({ error: erro.message });
  }
});

// ROTA PADRÃO PARA O FRONTEND 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// INICIAR SERVIDOR
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});