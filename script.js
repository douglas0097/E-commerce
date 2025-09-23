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
        constructor() {
            this.products = productsData;
            this.cart = []; // Formato: [{ id, name, price, quantity }]
            this.init();
        }

        init() {
            this.renderProducts(this.products);
            this.populateCategoryFilter();
            this.setupEventListeners();
        }

        renderProducts(productsToRender) {
            const catalog = document.getElementById('product-catalog');
            catalog.innerHTML = ''; 

            productsToRender.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">R$ ${product.price.toFixed(2)}</p>
                    <p><small>Categoria: ${product.category}</small></p>
                    <button class="add-to-cart-btn" data-id="${product.id}">Adicionar ao Carrinho</button>
                `;
                catalog.appendChild(card);
            });
        }

        populateCategoryFilter() {
            const categoryFilter = document.getElementById('category-filter');
            const categories = [...new Set(this.products.map(p => p.category))];
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }

        setupEventListeners() {
            // Filtros e ordenação
            document.getElementById('search-input').addEventListener('input', () => this.applyFilters());
            document.getElementById('category-filter').addEventListener('change', () => this.applyFilters());
            document.getElementById('sort-filter').addEventListener('change', () => this.applyFilters());

            // Botão de adicionar ao carrinho
            document.getElementById('product-catalog').addEventListener('click', event => {
                if (event.target.classList.contains('add-to-cart-btn')) {
                    this.addToCart(parseInt(event.target.dataset.id));
                }
            });
            
            // Eventos do carrinho
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

            // CEP
            const cepInput = document.getElementById('cep');
            cepInput.addEventListener('keyup', (event) => this.handleCepInput(event));

            // Abrir e fechar carrinho
            const cartIcon = document.getElementById('cart-icon');
            cartIcon.addEventListener('click', () => {
                this.hideSuccessMessage();
                this.toggleCart()
            });
            document.getElementById('close-cart-btn').addEventListener('click', () => this.closeCart());
            
            // Finalizar compra
            document.getElementById('checkout-form').addEventListener('submit', (event) => this.finalizePurchase(event));

            // Botão "Comprar Novamente"
            document.getElementById('new-purchase-btn').addEventListener('click', () => this.hideSuccessMessage());

        }

        applyFilters() {
            let filteredProducts = [...this.products];

            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            if (searchTerm) {
                filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
            }

            const selectedCategory = document.getElementById('category-filter').value;
            if (selectedCategory !== 'all') {
                filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
            }

            const sortOrder = document.getElementById('sort-filter').value;
            if (sortOrder === 'price-asc') {
                filteredProducts.sort((a, b) => a.price - b.price);
            } else if (sortOrder === 'price-desc') {
                filteredProducts.sort((a, b) => b.price - a.price);
            }

            this.renderProducts(filteredProducts);
        }

        addToCart(productId) {
            const product = this.products.find(p => p.id === productId);
            const cartItem = this.cart.find(item => item.id === productId);

            if (cartItem) {
                cartItem.quantity++;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }
            this.renderCart();
            this.openCart(); // Abre o carrinho ao adicionar um item
        }

        removeFromCart(productId) {
            this.cart = this.cart.filter(item => item.id !== productId);
            this.renderCart();
        }

        updateCartQuantity(productId, quantity) {
            const cartItem = this.cart.find(item => item.id === productId);
            if(cartItem && quantity > 0) {
                cartItem.quantity = quantity;
            } else {
                this.cart = this.cart.filter(item => item.id !== productId);
            }
            this.renderCart();
        }

        renderCart() {
            const cartItemsContainer = document.getElementById('cart-items');
            const totalPriceEl = document.getElementById('total-price');
            const cartItemCountEl = document.getElementById('cart-item-count');
            let total = 0;
            let totalItems = 0;

            if (this.cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            } else {
                cartItemsContainer.innerHTML = '';
                this.cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    totalItems += item.quantity;

                    const cartItemEl = document.createElement('div');
                    cartItemEl.className = 'cart-item';
                    cartItemEl.innerHTML = `
                        <span>${item.name} (R$ ${item.price.toFixed(2)})</span>
                        <div>
                            <input type="number" class="cart-item-quantity" data-id="${item.id}" value="${item.quantity}" min="1">
                            <button class="remove-from-cart-btn" data-id="${item.id}">X</button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItemEl);
                });
            }
            totalPriceEl.textContent = total.toFixed(2);
            cartItemCountEl.textContent = totalItems;
        }

        // Funções para controlar o carrinho
        toggleCart() {
            const cartSidebar = document.getElementById('cart-sidebar');
            cartSidebar.classList.toggle('open');
            document.body.classList.toggle('cart-open');
        }
        
        openCart() {
            const cartSidebar = document.getElementById('cart-sidebar');
            cartSidebar.classList.add('open');
            document.body.classList.add('cart-open');
        }

        closeCart() {
            const cartSidebar = document.getElementById('cart-sidebar');
            cartSidebar.classList.remove('open');
            document.body.classList.remove('cart-open');
        }


        handleCepInput(event) {
            const cepInput = event.target;
            let value = cepInput.value.replace(/\D/g, '');
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            cepInput.value = value;
            
            const cepMessage = document.getElementById('cep-message');

            if (value.replace('-', '').length === 8) {
                this.fetchAddress(value);
            } else {
                 cepMessage.textContent = 'Digite 8 dígitos para buscar.';
            }
        }

        async fetchAddress(cep) {
            const cepMessage = document.getElementById('cep-message');
            cepMessage.textContent = 'Buscando...';

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                
                if (!response.ok) {
                    throw new Error('Falha na rede. Não foi possível buscar o CEP.');
                }
                
                const data = await response.json();

                if (data.erro) {
                    cepMessage.textContent = 'CEP não encontrado. Preencha manualmente.';
                    this.clearAddressForm();
                } else {
                    cepMessage.textContent = 'Endereço encontrado!';
                    document.getElementById('rua').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('uf').value = data.uf;
                    document.getElementById('numero').focus(); 
                }
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
            document.getElementById('cep').value = '';
        }

        // Novas funções para a finalização da compra
        finalizePurchase(event) {
            event.preventDefault(); // Previne o recarregamento da página

            if (this.cart.length === 0) {
                alert("Seu carrinho está vazio!");
                return;
            }

            this.showSuccessMessage();
            this.closeCart();

            // Limpa o carrinho e o formulário
            this.cart = [];
            this.renderCart();
            document.getElementById('checkout-form').reset();
            this.clearAddressForm();
        }

        showSuccessMessage() {
            document.getElementById('purchase-success-overlay').classList.remove('hidden');
        }

        hideSuccessMessage() {
            document.getElementById('purchase-success-overlay').classList.add('hidden');
        }

    }

    new ECommerce();
});