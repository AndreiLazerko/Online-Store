
const cart = function(){
    const cartBtn = document.querySelector('.button-cart');
    const cart = document.getElementById('modal-cart');
    const closeBtn = cart.querySelector('.modal-close');
    const goodsContainer = document.querySelector('.long-goods-list');
    const cartTable = document.querySelector('.cart-table__goods');
    const modalForm = document.querySelector('.modal-form');
    const cartTotal = document.querySelector('.card-table__total');


    const deleteCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.filter(good => {
            return good.id !==id;
        })

        localStorage.setItem('cart', JSON.stringify(newCart));
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }

    const plusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart =  cart.map(good => {
            if(good.id === id){
                good.count++
            }
            return good;
        })

        localStorage.setItem('cart', JSON.stringify(newCart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }

    const minusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart =  cart.map(good => {
            if(good.id === id){
                if(good.count> 0){
                    good.count--   
                }
            }
            return good;
        })

        localStorage.setItem('cart', JSON.stringify(newCart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }

    const addToCart = (id)=> {
        const goods = JSON.parse(localStorage.getItem('goods'));
        const clickGood = goods.find(good => good.id === id);
        const cart = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : [];

            if(cart.some(good => good.id === clickGood.id)){
                console.log('Увеличить ');
                cart.map(good => {
                    if(good.id === clickGood.id){
                        good.count++
                    }
                    return good;
                })
            }else{
                console.log('Добавить ');
                clickGood.count = 1;
                cart.push(clickGood)
            }

            localStorage.setItem('cart', JSON.stringify(cart))
    }

    const renderCartGoods = (goods) => {
        cartTable.innerHTML = '';
        cartTotal.innerHTML = '';

        goods.forEach(good => {
            const tr = document.createElement('tr');
           
            tr.innerHTML = `
                <td>${good.name}</td>
                <td>${good.price}</td>
                <td><button class="cart-btn-minus"">-</button></td>
                <td>${good.count}</td>
                <td><button class=" cart-btn-plus"">+</button></td>
                <td>${+good.price * +good.count}$</td>
                <td><button class="cart-btn-delete"">x</button></td>
               
            `   

            function sumSalaries(goods) {

                let sum = 0;
                for (let good of Object.values(goods)) {
                    a = +good.price;
                    b = +good.count
                  sum += (a*b);
                }
              
                return sum; // 650
              }
              
             cartTotal.innerHTML = sumSalaries(goods);
            

            cartTable.append(tr);
             
            
            tr.addEventListener('click', (e) => {
                if(e.target.classList.contains('cart-btn-minus')){
                    minusCartItem(good.id)
                }else if(e.target.classList.contains('cart-btn-plus')){
                    plusCartItem(good.id)
                }else if(e.target.classList.contains('cart-btn-delete')){
                    deleteCartItem(good.id);

                }
            
            })
        })
        
    }

    const sentForm = () => {
        const cartArray = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : [];

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                cart: cart,
                name: '',
                phone: ''
            })
        }).then(() => {
            cart.style.display ='';
            localStorage.removeItem('cart');
        })
    }

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sentForm()
    })

    cartBtn.addEventListener('click',  function(){
        const cartArray = localStorage.getItem('cart') ?
        JSON.parse(localStorage.getItem('cart')) : [];
        
        renderCartGoods(cartArray);

        cart.style.display ="flex";
    });

    closeBtn.addEventListener('click', function(){
        cart.style.display = '';
    }) 

    cart.addEventListener('click', (event) => {
        if(!event.target.closest('.modal') && event.target.classList.contains('overlay')){
            cart.style.display = ''
        }
    })

    if(goodsContainer){
        goodsContainer.addEventListener('click', (event) =>{
            
            if(event.target.closest('.add-to-cart')){
                const buttonToCart = event.target.closest('.add-to-cart');
                const goodId = buttonToCart.dataset.id;

                addToCart(goodId);
            }
        })
    }
}

cart();