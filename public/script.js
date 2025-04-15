async function solve() {
  const input = document.getElementById('input').value.trim();
  const output = document.getElementById('output');
  output.innerHTML = `
    <div class="output-steps">
      <p id="resolvendo-text">Resolvendo<span class="dots"></span></p>
    </div>
  `;

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const fetchStart = Date.now();

  try {
    const res = await fetch('/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    const elapsed = Date.now() - fetchStart;

    // Aguarda o tempo restante para completar 1.5 segundos
    if (elapsed < 1500) {
      await wait(1500 - elapsed);
    }

    if (res.ok) {
      // Gerando os passos
      output.innerHTML = `
        <div class="output-steps">
          ${data.steps.map(s => `<p>${s}</p>`).join('')}
        </div>
        <hr>
        <div class="output-final">
          <strong>Solução:</strong> 
          <span style="font-size: 1.3rem;">
            x ≡ <strong>${data.result}</strong> mod ${data.M}
          </span>
        </div>
      `;
    } else {
      output.innerHTML = `<p style="color:red;">Erro: ${data.error}</p>`;
    }
  } catch (err) {
    output.innerHTML = `<p style="color:red;">Erro na requisição</p>`;
  }

  // Fazendo scroll até o final da resposta
  output.scrollIntoView({ behavior: 'smooth' });
}

// Alternância de tema
const toggleBtn = document.getElementById('toggle-theme');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  document.body.classList.toggle('dark');

  // Altera o ícone do botão
  if (document.body.classList.contains('dark')) {
    toggleBtn.textContent = '☀️';
  } else {
    toggleBtn.textContent = '🌙';
  }
});

// Autoajuste do textarea ao digitar
const textarea = document.getElementById('input');

function autoResizeTextarea(el) {
  el.style.height = 'auto';

  // Garante altura mínima
  const newHeight = Math.max(el.scrollHeight, 120);
  el.style.height = Math.min(newHeight, 300) + 'px';
}

textarea.addEventListener('input', function () {
  autoResizeTextarea(this);
});

// Garante altura mínima inicial mesmo se vazio
window.addEventListener('DOMContentLoaded', () => {
  autoResizeTextarea(textarea);
});
