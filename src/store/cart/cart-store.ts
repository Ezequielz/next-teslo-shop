import { create } from 'zustand';
import { CartProduct } from "@/interfaces";
import { persist } from 'zustand/middleware';


interface State {
    cart: CartProduct[];


    // Methods
    getTotalItems: () => number;
    addProductToCart: (product: CartProduct) => void;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProduct: (product: CartProduct) => void;
    

}

export const useCartStore = create<State>()(

    persist(
        (set, get) => ({
            cart: [],

            //Methods
            getTotalItems: () => {
                const { cart } = get();
                return cart.reduce((total, item) => total + item.quantity, 0);

            },
            addProductToCart: (product: CartProduct) => {
                const { cart } = get();


                //1.revisar si el producto existe en la talla seleccionada
                const productInCart = cart.some(
                    item => (item.id === product.id && item.size === product.size)
                );

                if (!productInCart) {
                    set({
                        cart: [...cart, product]
                    });
                    return;
                };

                //2. se que el producto existe en la talla seleccionada, tengo que incrementar
                const updateCartProducts = cart.map(item => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: item.quantity + product.quantity };
                    }

                    return item;
                });


                set({ cart: updateCartProducts });

            },
            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();

                const updateCartProducts = cart.map(item => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: quantity };
                    }

                    return item;
                });


                set({ cart: updateCartProducts });

            },
            removeProduct: (product: CartProduct) => {
                const { cart } = get();

                const removeCartProducts = cart.filter(item => item.id !== product.id || item.size !== product.size );


                set({ cart: removeCartProducts });
            }
        })
        , {
            name: 'shopping-cart',
        }
    )


);