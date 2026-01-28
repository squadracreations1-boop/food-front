import {
    loginFail,
    loginRequest,
    loginSuccess,
    clearError,
    registerFail,
    registerRequest,
    registerSuccess,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutSuccess,
    logoutFail,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail,
    updatePasswordRequest,
    updatePasswordSuccess,
    updatePasswordFail,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    forgotPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFail
} from '../slices/authSlice';

import {
    usersRequest,
    usersSuccess,
    usersFail,
    userRequest,
    userSuccess,
    userFail,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFail,
    updateUserRequest,
    updateUserSuccess,
    updateUserFail

} from '../slices/userSlice'

import api from '../utils/api';





export const login = (formData) => async (dispatch) => {
    const { email, password } = formData;
    try {
        dispatch(loginRequest())
        const { data } = await api.post(`/api/v1/login`, { email, password });
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        dispatch(loginSuccess(data))
        return data
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            'Login failed'
        dispatch(loginFail(message))
        throw message
    }

}

export const clearAuthError = (dispatch) => {
    dispatch(clearError())
}

export const register = (userData) => async (dispatch) => {

    try {
        dispatch(registerRequest())
        const config = {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        }

        const { data } = await api.post(`/api/v1/register`, userData, config);
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        dispatch(registerSuccess(data))
        return data
    } catch (error) {
        dispatch(registerFail(error.response?.data?.message || error.message))
        throw error
    }

}

export const adminCreateUser = (userData) => async (dispatch) => {
    try {
        // We reuse registerRequest/Success for simplicity or create new ones if needed
        // For now, let's just make the API call directly as it doesn't need to change current user state
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const { data } = await api.post(`/api/v1/register`, userData, config);
        return data
    } catch (error) {
        throw error.response?.data?.message || error.message
    }
}

export const loadUser = () => async (dispatch) => {

    try {
        dispatch(loadUserRequest())


        const { data } = await api.get(`/api/v1/myprofile`);
        dispatch(loadUserSuccess(data))
        return data
    } catch (error) {
        dispatch(loadUserFail(error.response?.data?.message || error.message))
        throw error
    }

}

export const logout = () => async (dispatch) => {
    try {
        await api.get(`/api/v1/logout`);
        dispatch(logoutSuccess())
        localStorage.removeItem('token');
        localStorage.removeItem('authToken'); // Cleanup if exists under old name
    } catch (error) {
        dispatch(logoutFail(error.response?.data?.message || error.message))
        throw error
    }
}

export const updateProfile = (userData) => async (dispatch) => {

    try {
        dispatch(updateProfileRequest())
        const config = {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        }

        const { data } = await api.put(`/api/v1/update`, userData, config);
        dispatch(updateProfileSuccess(data))
        return data
    } catch (error) {
        dispatch(updateProfileFail(error.response?.data?.message || error.message))
        throw error
    }

}

export const updatePassword = (formData) => async (dispatch) => {

    try {
        dispatch(updatePasswordRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        await api.put(`/api/v1/password/change`, formData, config);
        dispatch(updatePasswordSuccess())
    } catch (error) {
        dispatch(updatePasswordFail(error.response?.data?.message || error.message))
        throw error
    }

}

export const forgotPassword = (formData) => async (dispatch) => {

    try {
        dispatch(forgotPasswordRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const { data } = await api.post(`/api/v1/password/forgot`, formData, config);
        dispatch(forgotPasswordSuccess(data))
        return data
    } catch (error) {
        dispatch(forgotPasswordFail(error.response?.data?.message || error.message))
        throw error
    }

}

export const resetPassword = (formData, token) => async (dispatch) => {

    try {
        dispatch(resetPasswordRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const { data } = await api.post(`/api/v1/password/reset/${token}`, formData, config);
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        dispatch(resetPasswordSuccess(data))
        return data
    } catch (error) {
        dispatch(resetPasswordFail(error.response?.data?.message || error.message))
        throw error
    }

}

export const getUsers = () => async (dispatch) => {

    try {
        dispatch(usersRequest())
        const { data } = await api.get(`/api/v1/admin/users`);
        dispatch(usersSuccess(data))
        return data
    } catch (error) {
        dispatch(usersFail(error.response?.data?.message || error.message))
        throw error
    }

}

export const getUser = (id) => async (dispatch) => {

    try {
        dispatch(userRequest())
        const { data } = await api.get(`/api/v1/admin/user/${id}`);
        dispatch(userSuccess(data))
        return data
    } catch (error) {
        dispatch(userFail(error.response?.data?.message || error.message))
        throw error
    }

}

export const deleteUser = (id) => async (dispatch) => {

    try {
        dispatch(deleteUserRequest())
        await api.delete(`/api/v1/admin/user/${id}`)
        dispatch(deleteUserSuccess())
    } catch (error) {
        dispatch(deleteUserFail(error.response?.data?.message || error.message))
        throw error
    }

}

export const updateUser = (id, formData) => async (dispatch) => {

    try {
        dispatch(updateUserRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const { data } = await api.put(`/api/v1/admin/user/${id}`, formData, config)
        dispatch(updateUserSuccess())
        return data
    } catch (error) {
        dispatch(updateUserFail(error.response?.data?.message || error.message))
        throw error
    }

}
