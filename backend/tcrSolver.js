function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function extendedEuclidean(a, b) {
  if (b === 0) return { gcd: a, x: 1, y: 0 };
  const { gcd, x: x1, y: y1 } = extendedEuclidean(b, a % b);
  return { gcd, x: y1, y: x1 - Math.floor(a / b) * y1 };
}

function modInverse(a, m) {
  const { gcd, x } = extendedEuclidean(a, m);
  if (gcd !== 1) return null;
  return ((x % m) + m) % m;
}

function parseEquations(input) {
  const lines = input.split("\n").map(line => line.trim()).filter(l => l);
  const parsed = [];

  for (let line of lines) {
    const regex = /(?:(\d*)x)?\s*≡\s*(-?\d+)\s*\(?(?:mod)?\s*(\d+)\)?/i;
    const match = line.match(regex);
    if (!match) throw new Error(`Formato inválido: ${line}`);

    let [, a, b, m] = match;
    a = parseInt(a || "1");
    b = parseInt(b);
    m = parseInt(m);

    const inv = modInverse(a, m);
    if (inv === null) throw new Error(`Não há inverso de ${a} módulo ${m}, sistema impossível.`);
    
    parsed.push({ a, b, m, reduced: (inv * b) % m });
  }

  return parsed;
}

function solveCRT(equations) {
  const steps = [];
  const mods = equations.map(eq => eq.m);
  const reduced = equations.map(eq => eq.reduced);

  for (let i = 0; i < mods.length; i++) {
    for (let j = i + 1; j < mods.length; j++) {
      if (gcd(mods[i], mods[j]) !== 1) {
        throw new Error(`Os módulos ${mods[i]} e ${mods[j]} não são primos entre si.`);
      }
    }
  }

  const M = mods.reduce((acc, m) => acc * m, 1);
  steps.push(`Produto dos módulos (M): ${M}`);

  let x = 0;
  for (let i = 0; i < reduced.length; i++) {
    const mi = mods[i];
    const ai = reduced[i];
    const Mi = M / mi;
    const inv = modInverse(Mi, mi);

    steps.push(`M${i + 1} = M / m${i + 1} = ${Mi}`);
    steps.push(`Inverso de ${Mi} mod ${mi} = ${inv}`);

    x += ai * Mi * inv;
  }

  const result = ((x % M) + M) % M;
  steps.push(`Resultado final: x ≡ ${result} mod ${M}`);

  return { result, M, steps };
}

module.exports = {
  parseEquations,
  solveCRT,
};