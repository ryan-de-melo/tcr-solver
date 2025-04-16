const { parseEquations, solveCRT } = require('./backend/tcrSolver');

const input = process.argv.slice(2).join(' ').replace(/\\n/g, '\n');

try {
  const parsed = parseEquations(input);
  const solution = solveCRT(parsed);

  console.log('\n=== Passos ===');
  console.log(solution.steps); // steps já está em string formatada em LaTeX
  console.log(`\nSolução final: ${solution.latexResult}`);
} catch (err) {
  console.error('Erro:', err.message);
}