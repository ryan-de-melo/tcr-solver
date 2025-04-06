const { parseEquations, solveCRT } = require('./backend/tcrSolver');

const input = process.argv.slice(2).join(' ').replace(/\\n/g, '\n');

try {
  const parsed = parseEquations(input);
  const solution = solveCRT(parsed);

  console.log('\n=== Passos ===');
  console.log(solution.steps.join('\n'));
  console.log(`\nSolução final: x ≡ ${solution.result} mod ${solution.M}`);
} catch (err) {
  console.error('Erro:', err.message);
}
