import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    phone: localStorage.getItem("pv_phone") || null,
    verified: localStorage.getItem("pv_verified") === "true",
    sessionId: localStorage.getItem("pv_sessionId") || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Вызывается после успешной верификации телефона
        setVerifiedPhone(state, action) {
            state.phone = action.payload.phone;
            state.sessionId = action.payload.sessionId ?? state.sessionId;
            state.verified = true;
            // Синхронизируем с localStorage
            localStorage.setItem("pv_phone", action.payload.phone);
            localStorage.setItem("pv_verified", "true");
        },

        // Выход / сброс верификации
        clearAuth(state) {
            state.phone = null;
            state.verified = false;
            state.sessionId = null;
            localStorage.removeItem("pv_phone");
            localStorage.removeItem("pv_verified");
            localStorage.removeItem("pv_sessionId");
            localStorage.removeItem("pv_secretCode");
        },
    },
});

export const { setVerifiedPhone, clearAuth } = authSlice.actions;

// Селекторы
export const selectPhone = (state) => state.auth.phone;
export const selectIsVerified = (state) => state.auth.verified;
export const selectSessionId = (state) => state.auth.sessionId;

export default authSlice.reducer;