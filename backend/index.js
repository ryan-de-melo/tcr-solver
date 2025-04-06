const express = require('express');
const cors = require('cors');
const path = require('path');
const { parseEquations, solveCRT } = require('./tcrSolver');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
