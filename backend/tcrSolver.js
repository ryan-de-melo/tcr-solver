function mdc(a, b) {
  if (b === 0) {
    return a;
  }

  let resto = a % b;
  return mdc(b, resto);
}


function euclidesEstendido(a, b) {
  if (b === 0) {
    return { mdc: a, x: 1, y: 0 };
  }
  
  let resto = a % b;
  let resultado = euclidesEstendido(b, resto);

  let mdc = resultado.mdc;
  let x1 = resultado.x;
  let y1 = resultado.y;

  let x = y1;
  let y = x1 - Math.floor(a / b) * y1;

  return { mdc: mdc, x: x, y: y };
}


function inversoModular(a, m) {
  let resultado = euclidesEstendido(a, m);
  let mdc = resultado.mdc;
  let x = resultado.x;

  if (mdc !== 1) {
    return null; // Não existe inverso modular se o MDC não for 1
  }

  let inverso = (x % m + m) % m;
  return inverso;
}


function analisarEquacoes(entrada) {
  const passosCanonicos = [];

  // Troca todos os "=" por "≡"
  entrada = entrada.replace(/=/g, '≡');

  // Quebra a entrada por linhas, remove espaços e linhas vazias
  const linhas = entrada.split("\n").map(linha => linha.trim()).filter(l => l);

  const resultadoFinal = [];

  for (let linha of linhas) {
    // Verifica se tem mais de um símbolo de congruência
    let quantosSimbolos = linha.match(/≡/g);
    if (quantosSimbolos && quantosSimbolos.length > 1) {
      throw new Error(`Mais de uma congruência na mesma linha: "${linha}"`);
    }

    // Expressão regular para extrair coeficiente, constante e módulo
    let padrao = /(?:(\d*)x)?\s*≡\s*(-?\d+)\s*\(?(?:mod)?\s*(\d+)\)?/i;
    let partes = linha.match(padrao);

    if (!partes) {
      throw new Error(`Formato inválido: ${linha}`);
    }

    let coeficiente = parseInt(partes[1] || "1"); // se não tiver número antes do x, é 1
    let constante = parseInt(partes[2]);
    let modulo = parseInt(partes[3]);

    if (modulo <= 0) {
      throw new Error(`O módulo deve ser positivo: ${modulo}`);
    }

    let inverso = inversoModular(coeficiente, modulo);
    if (inverso === null) {
      throw new Error(`Não há inverso de ${coeficiente} módulo ${modulo}. Isso ocorre quando mdc(${coeficiente}, ${modulo}) ≠ 1.`);
    }

    let reduzido = (inverso * constante) % modulo;
    if (reduzido < 0) {
      reduzido += modulo;
    }

    // Adiciona passo a passo em LaTeX
    passosCanonicos.push(`
      \\text{Dada: } ${coeficiente === 1 ? '' : coeficiente}x \\equiv ${constante} \\mod ${modulo} \\\\
      \\text{Inverso de } ${coeficiente} \\mod ${modulo} = ${inverso} \\\\
      x \\equiv (${inverso} \\cdot ${constante}) \\mod ${modulo} = ${reduzido} \\mod ${modulo} \\\\
      x \\equiv ${reduzido} \\mod ${modulo}
    `);

    resultadoFinal.push({
      a: coeficiente,
      b: constante,
      m: modulo,
      reduced: reduzido
    });
  }

  return {
    parsed: resultadoFinal,
    canonicalSteps: passosCanonicos
  };
}



function solveTCR(equacoes) {
  const passos = [];

  // Mostra o sistema já na forma canônica
  const congruenciasCanonicas = equacoes.map(eq =>
    `x \\equiv ${eq.reduced} \\mod ${eq.m}`
  );

  passos.push("\\text{Sistema no formato canônico:}");
  congruenciasCanonicas.forEach(eq => passos.push(eq));
  passos.push("\\text{Resolução:}");

  // Extrai os módulos (m) e os valores reduzidos (a)
  const modulos = equacoes.map(eq => eq.m);
  const restos = equacoes.map(eq => eq.reduced);

  // Verifica se os módulos são coprimos entre si
  for (let i = 0; i < modulos.length; i++) {
    for (let j = i + 1; j < modulos.length; j++) {
      const m1 = modulos[i];
      const m2 = modulos[j];
      if (mdc(m1, m2) !== 1) {
        throw new Error(`Os módulos ${m1} e ${m2} não são primos entre si.`);
      }
    }
  }

  // Calcula o produto total dos módulos (M)
  const M = modulos.reduce((acc, m) => acc * m, 1);
  passos.push(`\\text{Produto dos módulos (M): } ${M}`);

  let resultadoParcial = 0;
  let partesDaFormula = [];

  for (let i = 0; i < restos.length; i++) {
    const mi = modulos[i];
    const ai = restos[i];
    const Mi = M / mi;
    const inverso = inversoModular(Mi, mi);

    passos.push(`M_{${i + 1}} = \\frac{${M}}{${mi}} = ${Mi}`);
    passos.push(`\\text{Inverso de } ${Mi} \\mod ${mi} = ${inverso}`);

    partesDaFormula.push(`${ai} \\cdot ${Mi} \\cdot ${inverso}`);
    resultadoParcial += ai * Mi * inverso;
  }

  // Mostra a expressão final para x antes do módulo
  const expressaoFinal = partesDaFormula.join(" + ");
  passos.push(`\\text{x = } ${expressaoFinal}`);

  const resultadoFinal = ((resultadoParcial % M) + M) % M;
  passos.push(`\\text{Resultado final: } x \\equiv ${resultadoParcial} \\equiv ${resultadoFinal} \\mod ${M}`);

  // Monta o LaTeX com todos os passos
  const latexComPassos = `
\\[
\\begin{array}{l}
${passos.join(" \\\\")}
\\end{array}
\\]
`.trim();

  const caixaResultado = `x \\equiv \\boxed{${resultadoFinal}} \\pmod{${M}}`;

  return {
    result: resultadoFinal,
    M: M,
    steps: latexComPassos,
    latexResult: caixaResultado
  };
}

module.exports = {
  analisarEquacoes,
  solveTCR,
};