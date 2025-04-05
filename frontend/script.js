async function solve() {
  const input = document.getElementById('input').value;
  const output = document.getElementById('output');
  output.innerHTML = 'Resolvendo...';

  try {
    const res = await fetch('http://localhost:3000/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();

    if (res.ok) {
      output.innerHTML = data.steps.map(s => `<p>${s}</p>`).join('');
      output.innerHTML += `<hr><strong>Solução: x ≡ ${data.result} mod ${data.M}</strong>`;
    } else {
      output.innerHTML = `<p style="color:red;">Erro: ${data.error}</p>`;
    }
  } catch (err) {
    output.innerHTML = `<p style="color:red;">Erro na requisição</p>`;
  }
}