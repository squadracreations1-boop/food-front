import { createSlice } from "@reduxjs/toolkit";

const getInitialCartItems = () => {
    try {
        const cartItems = localStorage.getItem('cartItems');
        if (!cartItems) return [];

        const parsedItems = JSON.parse(cartItems);
        // Deduplicate initial items based on product ID
        const uniqueItems = [];
        const seen = new Set();

        for (const item of parsedItems) {
            const productId = item.product;
            if (!seen.has(productId)) {
                seen.add(productId);
                uniqueItems.push(item);
            }
        }
        return uniqueItems;
    } catch (error) {
        console.error('Error parsing cart items:', error);
        return [];
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: getInitialCartItems(),
        loading: false,
        error: null,
        shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {},
        dbSynced: false
    },
    reducers: {
        addCartItemRequest(state) {
            return {
                ...state,
                loading: true,
                error: null
            }
        },
        addCartItemSuccess(state, action) {
            const { updatedItems, dbSynced } = action.payload;

            // Deduplicate incoming items before saving
            const uniqueItems = [];
            const seen = new Set();

            for (const item of updatedItems) {
                const productId = item.product || item._id; // handle partial objects if any
                if (!seen.has(productId)) {
                    seen.add(productId);
                    uniqueItems.push(item);
                }
            }

            localStorage.setItem('cartItems', JSON.stringify(uniqueItems));

            return {
                ...state,
                items: uniqueItems,
                loading: false,
                dbSynced: dbSynced || false
            }
        },
        addCartItemFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        getCartRequest(state) {
            return {
                ...state,
                loading: true,
                error: null
            }
        },
        getCartSuccess(state, action) {
            const { items, shippingInfo } = action.payload;

            // Deduplicate backend items just in case
            const uniqueItems = [];
            const seen = new Set();

            for (const item of items) {
                const productId = item.product || item._id;
                if (!seen.has(productId)) {
                    seen.add(productId);
                    uniqueItems.push(item);
                }
            }

            localStorage.setItem('cartItems', JSON.stringify(uniqueItems));
            if (shippingInfo) {
                localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
            }

            return {
                ...state,
                items: uniqueItems,
                shippingInfo: shippingInfo || state.shippingInfo,
                loading: false,
                dbSynced: true
            }
        },
        getCartFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        updateCartItemSuccess(state, action) {
            localStorage.setItem('cartItems', JSON.stringify(action.payload));

            return {
                ...state,
                items: action.payload,
                loading: false
            }
        },
        removeCartItemSuccess(state, action) {
            localStorage.setItem('cartItems', JSON.stringify(action.payload));

            return {
                ...state,
                items: action.payload,
                loading: false
            }
        },
        saveShippingInfoSuccess(state, action) {
            localStorage.setItem('shippingInfo', JSON.stringify(action.payload));

            return {
                ...state,
                shippingInfo: action.payload,
                loading: false
            }
        },
        clearCartSuccess(state) {
            localStorage.removeItem('cartItems');

            return {
                ...state,
                items: [],
                loading: false,
                dbSynced: false
            }
        },
        clearCartError(state) {
            return {
                ...state,
                error: null
            }
        }
    }
});

const { actions, reducer } = cartSlice;

export const {
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
} = actions;

export default reducer;