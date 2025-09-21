// Aguarda o DOM ser totalmente carregado para iniciar o script
document.addEventListener('DOMContentLoaded', () => {

    const productsData = [
        { id: 1, name: 'Notebook Pro', category: 'Eletrônicos', price: 4500.00, image: '/imagens/notebook.webp', description: 'Notebook de alta performance para profissionais.' },
        { id: 2, name: 'Smartphone Z', category: 'Eletrônicos', price: 2500.00, image: '/imagens/smartphone.webp', description: 'Smartphone com câmera de alta resolução e bateria duradoura.' },
        { id: 3, name: 'T-Shirt Básica', category: 'Vestuário', price: 80.00, image: '/imagens/camisa.webp', description: 'Camiseta de algodão, confortável e versátil.' },
        { id: 4, name: 'Calça Jeans Slim', category: 'Vestuário', price: 150.00, image: '/imagens/calça.webp', description: 'Calça jeans com corte moderno e caimento perfeito.' },
        { id: 5, name: 'Livro de Ficção', category: 'Livros', price: 40.00, image: '/imagens/livro.webp', description: 'Uma história envolvente de um autor renomado.' }
    ];

    class ECommerce {
        // Construtor
        constructor() {
            this.products = productsData;
            this.cart = []; // Formato: [{ id, name, price, quantity }]
            this.init();
        }

        // 1 - Inicia a montagem da página
        init() {
            this.renderProducts(this.products); // 1.2 - Chamada da primeira função
            this.populateCategoryFilter(); // 1.4 - Chamada da segunda função
            this.setupEventListeners(); // 1.6 - Chamada da terceira função
        }

        // 1.3 - Renderização do catálogo
        renderProducts(productsToRender) {
            const catalog = document.getElementById('product-catalog');
            catalog.innerHTML = ''; // Limpa o catálogo antes de renderizar

            // Laço que percorre cada produto da lista
            productsToRender.forEach(product => {
                //Monta a div de acordo com os atributos do produto
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">R$ ${product.price.toFixed(2)}</p>
                    <p><small>Categoria: ${product.category}</small></p>
                    <button class="add-to-cart-btn" data-id="${product.id}">Adicionar ao Carrinho</button>
                `;
                // Anexa a div montada no HTML
                catalog.appendChild(card);
            });
        }

        // 1.5 - Organiza os Filtros
        populateCategoryFilter() {
            const categoryFilter = document.getElementById('category-filter');
            // Cria uma lista com as categorias 
            const categories = [...new Set(this.products.map(p => p.category))];
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }

        // 1.7 - Verifica os filtros e organiza de acordo com o selecionado
        setupEventListeners() {
            // Filtros e ordenação
            document.getElementById('search-input').addEventListener('input', () => this.applyFilters());
            document.getElementById('category-filter').addEventListener('change', () => this.applyFilters());
            document.getElementById('sort-filter').addEventListener('change', () => this.applyFilters());

            // 2.1 - Botão de adicionar ao carrinho (usando delegação de eventos)
            document.getElementById('product-catalog').addEventListener('click', event => {
                const target = event.target; // Elemento que foi clicado
                // Verifica o ID do produto e adiciona no carrinho
                if (target.classList.contains('add-to-cart-btn')) {
                    this.addToCart(parseInt(target.dataset.id)); 
                }
            });
            
            // Eventos do carrinho (remover, alterar quantidade)
            document.getElementById('cart-items').addEventListener('click', event => {
                if (event.target.classList.contains('remove-from-cart-btn')) {
                    this.removeFromCart(parseInt(event.target.dataset.id));
                }
            });
            document.getElementById('cart-items').addEventListener('change', event => {
                if(event.target.classList.contains('cart-item-quantity')) {
                    this.updateCartQuantity(parseInt(event.target.dataset.id), parseInt(event.target.value));
                }
            });

            // 3.1 - Chamada do CEP
            const cepInput = document.getElementById('cep');
            cepInput.addEventListener('keyup', (event) => this.handleCepInput(event));
            
        }

        // 1.8 - Aplica o filtro caso seja acionado pela funcção setupEventListeners
        applyFilters() {
            let filteredProducts = [...this.products];

            // Filtro por nome
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            if (searchTerm) {
                filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
            }

            // Filtro por categoria
            const selectedCategory = document.getElementById('category-filter').value;
            if (selectedCategory !== 'all') {
                filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
            }

            // Ordenação
            const sortOrder = document.getElementById('sort-filter').value;
            if (sortOrder === 'price-asc') {
                filteredProducts.sort((a, b) => a.price - b.price);
            } else if (sortOrder === 'price-desc') {
                filteredProducts.sort((a, b) => b.price - a.price);
            }

            this.renderProducts(filteredProducts);
        }

        // 2.2 Adiciona um produto ao carrinho
        addToCart(productId) { 
            const product = this.products.find(p => p.id === productId); 
            const cartItem = this.cart.find(item => item.id === productId);

            if (cartItem) {
                cartItem.quantity++;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }
            this.renderCart();
        }

        // Remove um produto do carrinho
        removeFromCart(productId) {
            this.cart = this.cart.filter(item => item.id !== productId);
            this.renderCart();
        }

        // Atualiza a quantidade de um item no carrinho
        updateCartQuantity(productId, quantity) {
            const cartItem = this.cart.find(item => item.id === productId);
            if(cartItem && quantity > 0) {
                cartItem.quantity = quantity;
            } else {
                this.cart = this.cart.filter(item => item.id !== productId); // Remove se a quantidade for 0 ou inválida
            }
            this.renderCart();
        }

        // 2.3 - Renderiza o carrinho
        renderCart() {
            const cartItemsContainer = document.getElementById('cart-items');
            const totalPriceEl = document.getElementById('total-price');
            let total = 0;

            //Verifica se o carrinho está vazio
            if (this.cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            } else {
                // Se não estiver vazio, inicia um laço que percorre a lista do carrinho
                cartItemsContainer.innerHTML = '';
                this.cart.forEach(item => {
                    // Verifica o preço e quantidade e adiciona ao total
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;

                    // Monta a div no HTML de acordo com os itens selecionados
                    const cartItemEl = document.createElement('div');
                    cartItemEl.className = 'cart-item';
                    cartItemEl.innerHTML = `
                        <span>${item.name} (R$ ${item.price.toFixed(2)})</span>
                        <div>
                            <input type="number" class="cart-item-quantity" data-id="${item.id}" value="${item.quantity}" min="1">
                            <button class="remove-from-cart-btn" data-id="${item.id}">X</button>
                        </div>
                    `;
                    // Anexa a div montada no HTML
                    cartItemsContainer.appendChild(cartItemEl);
                });
            }
            totalPriceEl.textContent = total.toFixed(2);
        }

        // 3.2 - Manipulação do input de CEP
        handleCepInput(event) {
            const cepInput = event.target;
            let value = cepInput.value.replace(/\D/g, ''); // Remove tudo que não for dígito
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            cepInput.value = value;
            
            const cepMessage = document.getElementById('cep-message');

            // Se o CEP tem 8 dígitos, busca o endereço
            if (value.replace('-', '').length === 8) {
                this.fetchAddress(value);
            } else {
                 cepMessage.textContent = 'Digite 8 dígitos para buscar.';
            }
        }

        // 3.3 - Função da API para buscar o endereço via ViaCEP
        async fetchAddress(cep) {
            const cepMessage = document.getElementById('cep-message');
            cepMessage.textContent = 'Buscando...';

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                
                if (!response.ok) {
                    throw new Error('Falha na rede. Não foi possível buscar o CEP.');
                }
                
                const data = await response.json();

                // Retorno se CEP não for encontrado
                if (data.erro) {
                    cepMessage.textContent = 'CEP não encontrado. Preencha manualmente.';
                    this.clearAddressForm();
                } else {
                    // Retorno do CEP encontrado
                    cepMessage.textContent = 'Endereço encontrado!';
                    document.getElementById('rua').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('uf').value = data.uf;
                    document.getElementById('numero').focus(); 
                }
            // Retorno caso ocorra erro de rede 
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
                cepMessage.textContent = 'Erro ao buscar CEP. Tente novamente ou preencha manualmente.';
            }
        }
        
        clearAddressForm() {
            document.getElementById('rua').value = '';
            document.getElementById('bairro').value = '';
            document.getElementById('cidade').value = '';
            document.getElementById('uf').value = '';
        }
    }

    new ECommerce();
});