function mdc(a, b) {
  return b === 0 ? a : mdc(b, a % b);
}

function extendedEuclidean(a, b) {
  if (b === 0) return { mdc: a, x: 1, y: 0 };
  const { mdc, x: x1, y: y1 } = extendedEuclidean(b, a % b);
  return { mdc, x: y1, y: x1 - Math.floor(a / b) * y1 };
}

function modInverse(a, m) {
  const { mdc, x } = extendedEuclidean(a, m);
  if (mdc !== 1) return null;
  return ((x % m) + m) % m;
}

function parseEquations(input) {
  // Substitui todos os "=" por "≡"
  input = input.replace(/=/g, '≡');

  const lines = input.split("\n").map(line => line.trim()).filter(l => l);
  const parsed = [];

  for (let line of lines) {
    const congruencias = line.match(/≡/g);
    if (congruencias && congruencias.length > 1) {
      throw new Error(`Mais de uma congruência na mesma linha: "${line}"`);
    }
    
    const regex = /(?:(\d*)x)?\s*≡\s*(-?\d+)\s*\(?(?:mod)?\s*(\d+)\)?/i;
    const match = line.match(regex);
    if (!match) throw new Error(`Formato inválido: ${line}`);

    let [, a, b, m] = match;
    a = parseInt(a || "1");
    b = parseInt(b);
    m = parseInt(m);

    if (m <= 0) throw new Error(`O módulo deve ser positivo: ${m}`);

    const inv = modInverse(a, m);
    if (inv === null) throw new Error(`Não há inverso de ${a} módulo ${m}. Isso ocorre quando mdc(${a}, ${m}) ≠ 1.`);
    
    parsed.push({ a, b, m, reduced: ((inv * b) % m + m) % m });
  }

  return parsed;
}


function parseEquations(input) {
  // Substitui todos os "=" por "≡"
  input = input.replace(/=/g, '≡');

  const lines = input.split("\n").map(line => line.trim()).filter(l => l);
  const parsed = [];

  for (let line of lines) {
    const congruencias = line.match(/≡/g);
    if (congruencias && congruencias.length > 1) {
      throw new Error(`Mais de uma congruência na mesma linha: "${line}"`);
    }
    
    const regex = /(?:(\d*)x)?\s*≡\s*(-?\d+)\s*\(?(?:mod)?\s*(\d+)\)?/i;
    const match = line.match(regex);
    if (!match) throw new Error(`Formato inválido: ${line}`);

    let [, a, b, m] = match;
    a = parseInt(a || "1");
    b = parseInt(b);
    m = parseInt(m);

    if (m <= 0) throw new Error(`O módulo deve ser positivo: ${m}`);

    const inv = modInverse(a, m);
    if (inv === null) throw new Error(`Não há inverso de ${a} módulo ${m}. Isso ocorre quando mdc(${a}, ${m}) ≠ 1.`);
    
    parsed.push({ a, b, m, reduced: ((inv * b) % m + m) % m });
  }

  return parsed;
}

function solveCRT(equations) {
  const steps = [];
  steps.push(`\\text{Resolução:}`);

  const mods = equations.map(eq => eq.m);
  const reduced = equations.map(eq => eq.reduced);

  for (let i = 0; i < equations.length; i++) {
    for (let j = i + 1; j < equations.length; j++) {
      const m1 = equations[i].m;
      const m2 = equations[j].m;
      if (mdc(m1, m2) !== 1) {
        throw new Error(`Os módulos ${mods[i]} e ${mods[j]} não são primos entre si.`);
      }
    }
  }

  const M = mods.reduce((acc, m) => acc * m, 1);
  steps.push(`\\text{Produto dos módulos:}\\quad M = ${mods.join(' \\cdot ')} = ${M}`);

  let x = 0;
  let termosFormula = [];

  for (let i = 0; i < reduced.length; i++) {
    const mi = mods[i];
    const ai = reduced[i];
    const Mi = M / mi;
    const inv = modInverse(Mi, mi);

    steps.push(`M_{${i + 1}} = \\frac{${M}}{${mi}} = ${Mi}`);
    steps.push(`y_{${i + 1}} = ${inv} \\quad \\text{(inverso de } ${Mi} \\mod ${mi})`);

    x += ai * Mi * inv;
    termosFormula.push(`(${ai} \\cdot ${Mi} \\cdot ${inv})`);
  }

  steps.push(`x = ${termosFormula.join(' + ')}`);
  const result = ((x % M) + M) % M;
  steps.push(`x \\equiv ${x} \\equiv ${result} \\pmod{${M}}`);

  const latexSteps = `\\[\n\\begin{aligned}\n${steps.join(' \\\\\n')}\n\\end{aligned}\n\\]`;
  const latexResult = `\\(x \\equiv \\boxed{${result}} \\pmod{${M}}\\)`;

  return { result, M, steps: latexSteps, latexResult };
}


module.exports = {
  parseEquations,
  solveCRT,
};