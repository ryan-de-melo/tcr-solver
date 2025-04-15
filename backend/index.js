const express = require('express');
const cors = require('cors');
const path = require('path');
const { parseEquations, solveCRT } = require('./tcrSolver');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota para gerar o arquivo LaTeX
app.post('/latex', (req, res) => {
  try {
    const nomeArquivo = gerarLatex(); // Gera o saida.tex
    const url = `/${nomeArquivo}`;    // Link acessível via /public
    res.json({ url });
  } catch (err) {
    console.error('Erro ao gerar LaTeX:', err);
    res.status(500).json({ error: 'Erro ao gerar LaTeX' });
  }
});

// Servir arquivos estáticos (HTML, CSS, JS) da pasta public (um nível acima)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rota para resolver as equações
app.post('/solve', (req, res) => {
  try {
    const { input } = req.body;
    console.log('Recebido:', input);
    const parsed = parseEquations(input);
    const solution = solveCRT(parsed);
    res.json(solution);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Rota padrão para carregar o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
