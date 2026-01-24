import api from '../utils/api';
import {
    addCartItemRequest,
    addCartItemSuccess,
    addCartItemFail,
    getCartRequest,
    getCartSuccess,
    getCartFail,
    updateCartItemSuccess,
    removeCartItemSuccess,
    saveShippingInfoSuccess,
    clearCartSuccess,
    clearCartError
} from '../slices/cartSlice';


// Add item to cart
export const addCartItem = (id, quantity) => async (dispatch, getState) => {
    try {
        dispatch(addCartItemRequest());

        const { data } = await api.get(`/api/v1/product/${id}`);
        const newItem = {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].image,
            stock: data.product.stock,
            quantity
        };

        const { cart, auth } = getState();
        const currentItems = [...cart.items];

        const existingItemIndex = currentItems.findIndex(i => i.product === id);
        let updatedItems;

        if (existingItemIndex >= 0) {
            // INCREASE quantity when item already exists (clicking add to cart multiple times)
            updatedItems = [...currentItems];
            updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                quantity: updatedItems[existingItemIndex].quantity + quantity
            };
        } else {
            // Add new item with initial quantity
            updatedItems = [...currentItems, newItem];
        }

        let dbSynced = false;

        if (auth.isAuthenticated) {
            try {
                // Send to backend to update cart
                await api.post('/api/v1/cart/add', {
                    productId: id,
                    quantity: updatedItems[existingItemIndex >= 0 ? existingItemIndex : updatedItems.length - 1].quantity
                });

                const cartResponse = await api.get('/api/v1/cart');
                updatedItems = cartResponse.data.cart.items;
                dbSynced = true;
            } catch (syncError) {
                console.warn('DB update failed:', syncError.message);
            }
        }

        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        dispatch(addCartItemSuccess({
            updatedItems,
            dbSynced
        }));

    } catch (error) {
        // Handle stale product case
        if (error.response && error.response.status === 404) {
            // Remove the stale item from local state if it exists
            const { cart } = getState();
            const filteredItems = cart.items.filter(i => i.product !== id);
            localStorage.setItem('cartItems', JSON.stringify(filteredItems));
            dispatch(addCartItemFail('Product no longer available'));

            // Force refresh cart from just what's valid
            dispatch(getCartSuccess({ items: filteredItems }));
            return;
        }

        dispatch(addCartItemFail(error.response?.data?.message || 'Failed to add item to cart'));
    }
};

// Sync guest cart to database (Merge on login)
export const syncGuestCart = (localItems) => async (dispatch) => {
    try {
        dispatch({ type: 'cart/syncRequest' }); // Optional loading state

        // Use sequential execution to prevent race conditions on the backend (since backend does findOne -> save)
        // Parallel execution causes overwrite/data-loss because requests load the same 'stale' cart state before saving.
        const validItems = [...localItems];

        for (const item of localItems) {
            try {
                await api.post('/api/v1/cart/add', {
                    productId: item.product,
                    quantity: item.quantity
                });
            } catch (err) {
                console.warn(`Failed to sync item ${item.name}:`, err.message);

                // If product not found (stale ID), remove from local cart to prevent future 404s
                if (err.response && (err.response.status === 404 || err.response.status === 400)) {
                    const index = validItems.findIndex(i => i.product === item.product);
                    if (index > -1) {
                        validItems.splice(index, 1);
                    }
                }
            }
        }

        // Update local storage with only valid items
        localStorage.setItem('cartItems', JSON.stringify(validItems));

        /* 
        const syncPromises = localItems.map(item => 
            api.post('/api/v1/cart/add', {
                productId: item.product,
                quantity: item.quantity
            }).catch(err => console.warn(`Failed to sync item ${item.name}:`, err.message))
        );

        await Promise.all(syncPromises); 
        */

        // After syncing, fetch the authoritative cart from DB
        dispatch(getCart());

    } catch (error) {
        console.error('Guest cart sync failed:', error);
        // Fallback to getting whatever is in DB
        dispatch(getCart());
    }
};

// Get user's cart from database
export const getCart = () => async (dispatch) => {
    try {
        dispatch(getCartRequest());
        const { data } = await api.get('/api/v1/cart');

        localStorage.setItem('cartItems', JSON.stringify(data.cart.items));
        if (data.cart.shippingInfo) {
            localStorage.setItem('shippingInfo', JSON.stringify(data.cart.shippingInfo));
        }

        dispatch(getCartSuccess({
            items: data.cart.items,
            shippingInfo: data.cart.shippingInfo
        }));

    } catch (error) {
        dispatch(getCartFail(error.response?.data?.message || 'Failed to load cart'));
    }
};



// Increase cart item quantity
export const increaseCartItemQtyAction = (productId) => async (dispatch, getState) => {
    try {
        const { cart, auth } = getState();
        const item = cart.items.find(item => item.product === productId);

        if (!item) return;

        const newQuantity = item.quantity + 1;

        if (auth.isAuthenticated) {
            // Use specific increase endpoint
            await api.put(`/api/v1/cart/increase/${productId}`);
        }

        const updatedItems = cart.items.map(item => {
            if (item.product === productId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        dispatch(updateCartItemSuccess(updatedItems));

    } catch (error) {
        console.warn('Failed to increase quantity:', error.message);
    }
};

// Decrease cart item quantity
export const decreaseCartItemQtyAction = (productId) => async (dispatch, getState) => {
    try {
        const { cart, auth } = getState();
        const item = cart.items.find(item => item.product === productId);

        if (!item || item.quantity <= 1) return;

        const newQuantity = item.quantity - 1;

        if (auth.isAuthenticated) {
            // Use specific decrease endpoint
            await api.put(`/api/v1/cart/decrease/${productId}`);
        }

        const updatedItems = cart.items.map(item => {
            if (item.product === productId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        dispatch(updateCartItemSuccess(updatedItems));

    } catch (error) {
        console.warn('Failed to decrease quantity:', error.message);
    }
};

// Update cart item quantity (Manual Input)
export const updateCartItemQty = (productId, quantity) => async (dispatch, getState) => {
    try {
        const { cart, auth } = getState();
        const item = cart.items.find(item => item.product === productId);

        if (!item) return;

        // Optimistic update
        const updatedItems = cart.items.map(item => {
            if (item.product === productId) {
                return { ...item, quantity: parseInt(quantity) };
            }
            return item;
        });

        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        dispatch(updateCartItemSuccess(updatedItems));

        if (auth.isAuthenticated) {
            // Use add endpoint which sets quantity
            await api.post('/api/v1/cart/add', {
                productId,
                quantity: parseInt(quantity)
            });
        }

    } catch (error) {
        console.warn('Failed to update quantity:', error.message);
        dispatch(getCart()); // Revert on failure
        dispatch(addCartItemFail('Failed to update quantity'));
    }
};

// Remove item from cart
export const removeCartItemAction = (productId) => async (dispatch, getState) => {
    try {
        const { cart, auth } = getState();
        const filteredItems = cart.items.filter(item => item.product !== productId);

        if (auth.isAuthenticated) {
            await api.delete(`/api/v1/cart/remove/${productId}`);
        }

        localStorage.setItem('cartItems', JSON.stringify(filteredItems));
        dispatch(removeCartItemSuccess(filteredItems));

    } catch (error) {
        console.warn('Failed to remove item from DB:', error.message);
        const { cart } = getState();
        const filteredItems = cart.items.filter(item => item.product !== productId);
        localStorage.setItem('cartItems', JSON.stringify(filteredItems));
        dispatch(removeCartItemSuccess(filteredItems));
    }
};

// Clear cart
export const clearCartAction = () => async (dispatch, getState) => {
    try {
        const { auth } = getState();

        if (auth.isAuthenticated) {
            await api.delete('/api/v1/cart/clear');
        }

        localStorage.removeItem('cartItems');
        dispatch(clearCartSuccess());

    } catch (error) {
        console.warn('Failed to clear cart from DB:', error.message);
        localStorage.removeItem('cartItems');
        dispatch(clearCartSuccess());
    }
};

// Save shipping information
export const saveShippingInfoAction = (shippingData) => async (dispatch, getState) => {
    try {
        const { auth } = getState();

        if (auth.isAuthenticated) {
            await api.post('/api/v1/cart/shipping', shippingData);
        }

        localStorage.setItem('shippingInfo', JSON.stringify(shippingData));
        dispatch(saveShippingInfoSuccess(shippingData));

    } catch (error) {
        console.warn('Failed to save shipping info to DB:', error.message);
        localStorage.setItem('shippingInfo', JSON.stringify(shippingData));
        dispatch(saveShippingInfoSuccess(shippingData));
    }
};

// Clear cart error
export const clearCartErrorAction = () => (dispatch) => {
    dispatch(clearCartError());
};