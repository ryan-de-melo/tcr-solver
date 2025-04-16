# TCR Solver

O TCR Solver é um sistema web para resolver sistemas de congruências lineares, fazendo uso do Teorema Chinês do Resto (TCR). Feito para estudantes de exatas, especialmente de computação, que precisam de um meio rápido e eficaz de resolver sistemas de congruências. O intuito do TCR Solver é que estudantes
o usem como forma de corrigir suas atividades relacionadas a congruências.

## Sistemas de congruências

Um sistema de congruência é do tipo:

$$
x \equiv 2 \pmod{3} \\
x \equiv 3 \pmod{5} \\
x \equiv 2 \pmod{7}
$$

## Teorema Chinês do Resto (TCR)

O TCR é um teorema que possibilita uma resolução mais rápida de sistemas de congruências.
Para a aplicação do TCR é necessário que o sistema esteja com todas as expressões no formato
x ≡ a (mod m). Além disso, é obrigatório que os módulos m sejam coprimos par a par.

Cumprindo essas requisições o programa calcula o produto dos módulos m e obtém um M, a partir do M são
calculados m1, m2, etc. referentes a cada expressão, após isso é calculado o inverso de cada módulo e por fim calcula o valor final de x, obtido pela soma das multiplicações de inverso, módulo m obtido e congruêncial inicial. 


## Ferramentas utilizadas

- **Frontend:** HTML, CSS e JavaScript
- **Backend:** Node.js (Express)
- **Lógica matemática:** Implementação manual (sem uso de LLMs)

## Como rodar localmente

É necessário ter o Node.js instalado na sua máquina.

1. Clone o repositório:
    ```bash
    git clone https://github.com/ryan-de-melo/tcr-solver
    ```
2. Iniciar localmente:
    ```bash
    npm start
    ```
3. Acessar a página:
    Acesse em seu navegador a página http://localhost:3000