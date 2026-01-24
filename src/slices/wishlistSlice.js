import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [], // Array of product objects
        loading: false,
        error: null,
        count: 0
    },
    reducers: {
        wishlistRequest(state) {
            return {
                ...state,
                loading: true,
                error: null
            }
        },
        addToWishlistSuccess(state, action) {
            return {
                ...state,
                loading: false,
                items: action.payload,
                count: action.payload.length
            }
        },
        removeFromWishlistSuccess(state, action) {
            return {
                ...state,
                loading: false,
                items: action.payload,
                count: action.payload.length
            }
        },
        getWishlistSuccess(state, action) {
            return {
                ...state,
                items: action.payload,
                count: action.payload.length,
                loading: false
            }
        },
        wishlistFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        clearWishlistError(state) {
            return {
                ...state,
                error: null
            }
        }
    }
});

const { actions, reducer } = wishlistSlice;

export const {
    wishlistRequest,
    addToWishlistSuccess,
    removeFromWishlistSuccess,
    getWishlistSuccess,
    wishlistFail,
    clearWishlistError
} = actions;

export default reducer;
