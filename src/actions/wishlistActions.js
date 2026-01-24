import api from '../utils/api';
import {
    wishlistRequest,
    getWishlistSuccess,
    addToWishlistSuccess,
    removeFromWishlistSuccess,
    wishlistFail,
    clearWishlistError
} from '../slices/wishlistSlice';


// Get User Wishlist
export const getWishlist = () => async (dispatch) => {
    try {
        dispatch(wishlistRequest());
        const { data } = await api.get('/api/v1/wishlist');
        dispatch(getWishlistSuccess(data.wishlist));
    } catch (error) {
        dispatch(wishlistFail(error.response?.data?.message || 'Failed to fetching wishlist'));
    }
};

// Add to Wishlist
export const addToWishlist = (productId) => async (dispatch) => {
    try {
        dispatch(wishlistRequest());
        const { data } = await api.post('/api/v1/wishlist/add', { productId });
        dispatch(addToWishlistSuccess(data.wishlist));
    } catch (error) {
        dispatch(wishlistFail(error.response?.data?.message || 'Failed to add to wishlist'));
    }
};

// Remove from Wishlist
export const removeFromWishlist = (productId) => async (dispatch) => {
    try {
        dispatch(wishlistRequest());
        const { data } = await api.delete(`/api/v1/wishlist/remove/${productId}`);
        dispatch(removeFromWishlistSuccess(data.wishlist));
    } catch (error) {
        dispatch(wishlistFail(error.response?.data?.message || 'Failed to remove from wishlist'));
    }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch(clearWishlistError());
};
