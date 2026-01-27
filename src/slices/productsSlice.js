import { createSlice } from "@reduxjs/toolkit";


const productsSlice = createSlice({
    name: 'products',
    initialState: {
        loading: false,
        products: [],
        productsCount: 0,
        filteredProductsCount: 0,
        resPerPage: 6,
        totalPages: 1,
        stats: {
            featuredCount: 0,
            lowStockCount: 0,
            outOfStockCount: 0
        }
    },
    reducers: {
        productsRequest(state, action) {
            return {
                loading: true
            }
        },
        productsSuccess(state, action) {
            const count = action.payload.count || 0
            const resPerPage = action.payload.resPerPage || state.resPerPage || 1
            return {
                loading: false,
                products: action.payload.products,
                productsCount: count,
                resPerPage: resPerPage,
                totalPages: Math.max(1, Math.ceil(count / resPerPage))
            }
        },
        productsFail(state, action) {
            return {
                loading: false,
                error: action.payload
            }
        },
        adminProductsRequest(state, action) {
            return {
                loading: true
            }
        },
        adminProductsSuccess(state, action) {
            const count = action.payload.totalProductsCount || 0
            const filteredCount = action.payload.filteredProductsCount || count
            const resPerPage = action.payload.resPerPage || 1
            return {
                loading: false,
                products: action.payload.products,
                productsCount: count,
                filteredProductsCount: filteredCount,
                resPerPage: resPerPage,
                totalPages: Math.max(1, Math.ceil(filteredCount / resPerPage)),
                stats: action.payload.stats || state.stats
            }
        },
        adminProductsFail(state, action) {
            return {
                loading: false,
                error: action.payload
            }
        },
        clearError(state, action) {
            return {
                ...state,
                error: null
            }
        }
    }
});

const { actions, reducer } = productsSlice;

export const {
    productsRequest,
    productsSuccess,
    productsFail,
    adminProductsFail,
    adminProductsRequest,
    adminProductsSuccess

} = actions;

export default reducer;

