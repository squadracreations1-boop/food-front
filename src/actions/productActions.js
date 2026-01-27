import api from '../utils/api';
import {
    productsRequest,
    productsSuccess,
    productsFail,
    adminProductsFail,
    adminProductsRequest,
    adminProductsSuccess
} from '../slices/productsSlice';
import {
    productRequest,
    productSuccess,
    productFail,
    createReviewRequest,
    createReviewSuccess,
    createReviewFail,
    newProductRequest,
    newProductSuccess,
    newProductFail,
    deleteProductRequest,
    deleteProductSuccess,
    deleteProductFail,
    updateProductRequest,
    updateProductSuccess,
    updateProductFail,
    reviewsRequest,
    reviewsSuccess,
    reviewsFail,
    deleteReviewRequest,
    deleteReviewSuccess,
    deleteReviewFail
} from '../slices/productSlice';


export const getProducts = (keyword, price, category, rating, currentPage) => async (dispatch) => {

    try {
        dispatch(productsRequest())
        let link = `/api/v1/products?page=${currentPage}`;

        if (keyword || category) {
            link += `&keyword=${keyword || category}`
        }
        if (price) {
            link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`
        }
        if (rating) {
            link += `&ratings[gte]=${rating}`
        }

        const { data } = await api.get(link);
        dispatch(productsSuccess(data))
    } catch (error) {
        dispatch(productsFail(error.response?.data?.message || error.message))
    }

}


export const getProduct = id => async (dispatch) => {

    try {
        dispatch(productRequest())
        const { data } = await api.get(`/api/v1/product/${id}`);
        dispatch(productSuccess(data))
    } catch (error) {
        dispatch(productFail(error.response?.data?.message || error.message))
    }

}

export const createReview = reviewData => async (dispatch) => {

    try {
        dispatch(createReviewRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const { data } = await api.put(`/api/v1/review`, reviewData, config);

        // Fetch updated product to get latest reviews and ratings in real-time
        if (reviewData.productId) {
            const updatedProduct = await api.get(`/api/v1/product/${reviewData.productId}`);
            dispatch(productSuccess(updatedProduct.data));
        }

        dispatch(createReviewSuccess(data))
    } catch (error) {
        dispatch(createReviewFail(error.response?.data?.message || error.message))
        throw error
    }

}

export const getAdminProducts = (page = 1, keyword = '', category = '') => async (dispatch) => {

    try {
        dispatch(adminProductsRequest())
        let link = `/api/v1/admin/products?page=${page}`;
        if (keyword) link += `&keyword=${keyword}`;
        if (category && category !== 'all') link += `&category=${category}`;

        const { data } = await api.get(link);
        dispatch(adminProductsSuccess(data))
    } catch (error) {
        dispatch(adminProductsFail(error.response?.data?.message || error.message))
    }

}

export const createNewProduct = (productData) => async (dispatch) => {
    try {
        dispatch(newProductRequest())
        const { data } = await api.post(`/api/v1/admin/product/new`, productData)
        dispatch(newProductSuccess(data))
        return data
    } catch (error) {
        dispatch(newProductFail(error.response?.data?.message || error.message))
        throw error
    }
}

export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch(deleteProductRequest())
        await api.delete(`/api/v1/admin/product/${id}`)
        dispatch(deleteProductSuccess())
    } catch (error) {
        dispatch(deleteProductFail(error.response?.data?.message || error.message))
        throw error
    }
}

export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch(updateProductRequest())
        const { data } = await api.put(`/api/v1/admin/product/${id}`, productData)
        dispatch(updateProductSuccess(data))
        return data
    } catch (error) {
        dispatch(updateProductFail(error.response?.data?.message || error.message))
        throw error
    }
}


export const getReviews = (id) => async (dispatch) => {

    try {
        dispatch(reviewsRequest())
        const { data } = await api.get(`/api/v1/admin/reviews`, { params: { id } });
        dispatch(reviewsSuccess(data))
    } catch (error) {
        dispatch(reviewsFail(error.response?.data?.message || error.message))
    }

}

export const deleteReview = (productId, id) => async (dispatch) => {

    try {
        dispatch(deleteReviewRequest())
        await api.delete(`/api/v1/admin/review`, { params: { productId, id } });
        dispatch(deleteReviewSuccess())
    } catch (error) {
        dispatch(deleteReviewFail(error.response?.data?.message || error.message))
    }

}
