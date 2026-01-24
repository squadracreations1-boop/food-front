import { createSlice } from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        loading: false,
        verifyingPayment: false,
        checkoutSession: null,
        error: null,
        paymentLink: null,
        currentOrder: null,
        paymentVerified: false,
        success: false
    },
    reducers: {
        checkOutRequest(state) {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        checkOutSuccess(state, action) {
            state.loading = false;
            state.checkoutSession = action.payload;
            state.paymentLink = action.payload.paymentLink || action.payload.whatsappMessage?.paymentLink;
            state.currentOrder = action.payload.order;
            state.error = null;
            state.success = true;
        },
        checkOutFail(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.checkoutSession = null;
            state.paymentLink = null;
            state.currentOrder = null;
            state.success = false;
        },
        verifyPaymentRequest(state) {
            state.verifyingPayment = true;
            state.error = null;
        },
        verifyPaymentSuccess(state, action) {
            state.verifyingPayment = false;
            state.paymentVerified = true;
            state.currentOrder = action.payload.order;
            state.error = null;
        },
        verifyPaymentFail(state, action) {
            state.verifyingPayment = false;
            state.paymentVerified = false;
            state.error = action.payload;
        },
        checkOutReset(state) {
            state.loading = false;
            state.verifyingPayment = false;
            state.checkoutSession = null;
            state.paymentLink = null;
            state.currentOrder = null;
            state.paymentVerified = false;
            state.error = null;
            state.success = false;
        },
        setPaymentLink(state, action) {
            state.paymentLink = action.payload;
        }
    }
});

export const { 
    checkOutRequest, 
    checkOutSuccess, 
    checkOutFail, 
    verifyPaymentRequest,
    verifyPaymentSuccess,
    verifyPaymentFail,
    checkOutReset,
    setPaymentLink 
} = checkoutSlice.actions;

export default checkoutSlice.reducer;