import { adminOrdersFail, adminOrdersRequest, adminOrdersSuccess, createOrderFail, createOrderRequest, createOrderSuccess, deleteOrderFail, deleteOrderRequest, deleteOrderSuccess, orderDetailFail, orderDetailRequest, orderDetailSuccess, updateOrderFail, updateOrderRequest, updateOrderSuccess, userOrdersFail, userOrdersRequest, userOrdersSuccess } from '../slices/orderSlice';
import api from '../utils/api';


export const createOrder = (order) => async (dispatch) => {
    try {
        dispatch(createOrderRequest())
        const { data } = await api.post(`/api/v1/order/new`, order)
        dispatch(createOrderSuccess(data))
        return data
    } catch (error) {
        dispatch(createOrderFail(error.response?.data?.message || error.message))
        throw error
    }
}

export const userOrders = () => async (dispatch) => {
    try {
        dispatch(userOrdersRequest())
        const { data } = await api.get(`/api/v1/myorders`)
        dispatch(userOrdersSuccess(data))
        return data
    } catch (error) {
        dispatch(userOrdersFail(error.response?.data?.message || error.message))
        throw error
    }
}

export const orderDetail = (id) => async (dispatch) => {
    try {
        dispatch(orderDetailRequest())
        const { data } = await api.get(`/api/v1/order/${id}`)
        dispatch(orderDetailSuccess(data))
        return data
    } catch (error) {
        dispatch(orderDetailFail(error.response?.data?.message || error.message))
        throw error
    }
}

export const adminOrderDetail = (id) => async (dispatch) => {
    try {
        dispatch(orderDetailRequest())
        const { data } = await api.get(`/api/v1/admin/order/${id}`)
        dispatch(orderDetailSuccess(data))
        return data
    } catch (error) {
        dispatch(orderDetailFail(error.response?.data?.message || error.message))
        throw error
    }
}

export const adminOrders = (page = 1, limit = 12) => async (dispatch) => {
    try {
        dispatch(adminOrdersRequest())
        const { data } = await api.get(`/api/v1/admin/orders?page=${page}&limit=${limit}`)
        dispatch(adminOrdersSuccess(data))
        return data
    } catch (error) {
        dispatch(adminOrdersFail(error.response?.data?.message || error.message))
        throw error
    }
}

export const deleteOrder = (id) => async (dispatch) => {
    try {
        dispatch(deleteOrderRequest())
        await api.delete(`/api/v1/admin/order/${id}`)
        dispatch(deleteOrderSuccess())
    } catch (error) {
        dispatch(deleteOrderFail(error.response?.data?.message || error.message))
        throw error
    }
}

export const updateOrder = (id, orderData) => async (dispatch) => {
    try {
        dispatch(updateOrderRequest())
        const { data } = await api.put(`/api/v1/admin/order/${id}`, orderData)
        dispatch(updateOrderSuccess(data))
        return data
    } catch (error) {
        dispatch(updateOrderFail(error.response?.data?.message || error.message))
        throw error
    }
}
