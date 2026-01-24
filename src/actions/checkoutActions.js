import api from '../utils/api';
import {
    checkOutRequest,
    checkOutSuccess,
    checkOutFail,
    verifyPaymentRequest,
    verifyPaymentSuccess,
    verifyPaymentFail,
    checkOutReset
} from '../slices/checkoutSlice';


// Method 1: WhatsApp + Razorpay Integration
export const createWhatsAppRazorpayOrder = (orderData) => async (dispatch, getState) => {
    try {
        dispatch(checkOutRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await api.post('/api/v1/checkout/whatsapp-razorpay', orderData, config);

        dispatch(checkOutSuccess(data));

        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create WhatsApp order';
        dispatch(checkOutFail(errorMessage));
        throw new Error(errorMessage);
    }
};

// Method 2: Direct Razorpay Payment
export const createDirectRazorpayOrder = (orderData) => async (dispatch, getState) => {
    try {
        dispatch(checkOutRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await api.post('/api/v1/checkout/direct-razorpay', orderData, config);

        dispatch(checkOutSuccess(data));

        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create Razorpay order';
        dispatch(checkOutFail(errorMessage));
        throw new Error(errorMessage);
    }
};

// Method 3: Cash on Delivery
export const createCODOrder = (orderData) => async (dispatch, getState) => {
    try {
        dispatch(checkOutRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await api.post('/api/v1/checkout/cod', orderData, config);

        dispatch(checkOutSuccess(data));

        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create COD order';
        dispatch(checkOutFail(errorMessage));
        throw new Error(errorMessage);
    }
};

// Method 4: WhatsApp Only Order
export const createWhatsAppOrder = (orderData) => async (dispatch, getState) => {
    try {
        dispatch(checkOutRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await api.post('/api/v1/checkout/whatsapp', orderData, config);

        dispatch(checkOutSuccess(data));

        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create WhatsApp order';
        dispatch(checkOutFail(errorMessage));
        throw new Error(errorMessage);
    }
};

// Verify Razorpay Payment
export const verifyPayment = (paymentData) => async (dispatch, getState) => {
    try {
        dispatch(verifyPaymentRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await api.post('/api/v1/payment/verify', paymentData, config);

        dispatch(verifyPaymentSuccess(data));

        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Payment verification failed';
        dispatch(verifyPaymentFail(errorMessage));
        throw new Error(errorMessage);
    }
};

// Verify Payment Link (for WhatsApp + Razorpay flow after redirect)
export const verifyPaymentLink = (paymentData) => async (dispatch, getState) => {
    try {
        dispatch(verifyPaymentRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await api.post('/api/v1/payment/verify-link', paymentData, config);

        dispatch(verifyPaymentSuccess(data));

        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Payment verification failed';
        dispatch(verifyPaymentFail(errorMessage));
        return { success: false, message: errorMessage };
    }
};

// Confirm WhatsApp Order
export const confirmWhatsAppOrder = (orderId) => async (dispatch, getState) => {
    try {
        dispatch(checkOutRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await api.post('/api/v1/whatsapp/confirm', { orderId }, config);

        dispatch(checkOutSuccess(data));

        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to confirm WhatsApp order';
        dispatch(checkOutFail(errorMessage));
        throw new Error(errorMessage);
    }
};

// Reset checkout state
export const resetCheckout = () => async (dispatch) => {
    dispatch(checkOutReset());
};