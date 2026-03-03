import { Navigate, useLocation } from "react-router-dom"
import { usePhoneNumberQuery } from "./app/services/authApi"

// PrivateRoute.jsx
export default function PrivateRoute({ children }) {
    const { data: phoneNumbers, isLoading } = usePhoneNumberQuery()
    const location = useLocation()

    const token = localStorage.getItem("pv_sessionId")
    const verified = localStorage.getItem("pv_verified")
    const userPhone = localStorage.getItem("pv_phone")

    // 1. Avtorizatsiyadan o'tmagan bo'lsa - srazu login/home ga
    if (!token || !verified) {
        return <Navigate to="/" replace />
    }

    // 2. MUHIM: Ma'lumotlar yuklanayotgan bo'lsa, hech narsa qilmay turamiz
    // Bu yerda Loading... o'rniga null yoki Spinner qaytarish mumkin
    if (isLoading) return null 

    const isAdmin = phoneNumbers?.some(
        item => item.phone === userPhone
    )

    // 3. Faqat admin sahifasiga kirmoqchi bo'lgandagina adminlikni tekshiramiz
    if (location.pathname.startsWith("/adm") && !isAdmin) {
        console.log("Admin emas, redirect bo'lyapti");
        return <Navigate to="/" replace />
    }

    return children
}