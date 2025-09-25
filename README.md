# 🛒 Ludomi E-commerce

Um e-commerce simples e responsivo construído com **HTML, CSS e
JavaScript.
Este projeto simula uma loja virtual com catálogo de produtos, carrinho
de compras, checkout com preenchimento automático de endereço via API
ViaCEP, e mensagem de sucesso após a compra.

## 📂 Estrutura do Projeto
    /
    ├── index.html   → Estrutura principal da página
    ├── style.css    → Estilização do layout
    ├── script.js    → Lógica do e-commerce
    └── /imagens     → Imagens dos produtos e banner

## ⚙️ Funcionalidades

-   **Catálogo de Produtos**
    -   Lista dinâmica com nome, preço, categoria e imagem.
    -   Filtro por nome, categoria e ordenação por preço.
-   **Carrinho de Compras**
    -   Adicionar produtos diretamente do catálogo.
    -   Alterar quantidades ou remover itens.
    -   Total automático do carrinho.
    -   Ícone com contagem de itens no header.
-   **Checkout com CEP**
    -   Preenchimento automático de rua, bairro, cidade e UF usando
        **API ViaCEP**.
    -   Validação básica do CEP.
-   **Tela de Sucesso da Compra**
    -   Mensagem modal confirmando a compra.
    -   Botão "Comprar Novamente" para resetar.
-   **Layout Responsivo**
    -   Sidebar do carrinho com animação de abrir/fechar.
    -   Grid de produtos responsivo.
    -   Banner promocional com sobreposição escura.

## 🖥️ Tecnologias Utilizadas

-   **HTML5**
-   **CSS3** (Flexbox, Grid, responsividade e transições)
-   **JavaScript ES6+** (classes, eventos, fetch API)
-   **Font Awesome** para ícones

## 🌐 API Utilizada

-   [ViaCEP](https://viacep.com.br/) -- para preencher endereço
    automaticamente a partir do CEP.

## 📝 Licença

Este projeto é de uso livre para fins educacionais ou pessoais.
