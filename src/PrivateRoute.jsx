import { Navigate, useLocation } from "react-router-dom"
import { usePhoneNumberQuery } from "./app/services/authApi"

export default function PrivateRoute({ children }) {
    const { data: phoneNumbers, isLoading } = usePhoneNumberQuery()
    const location = useLocation()

    const token = localStorage.getItem("pv_sessionId")
    const verified = localStorage.getItem("pv_verified")
    const userPhone = localStorage.getItem("pv_phone")

   

    if (!token || !verified) {
        return <Navigate to="/" replace />
    }

    const isAdmin = phoneNumbers?.some(
        item => item.phone === userPhone
    )

    if (location.pathname.startsWith("/adm") && !isAdmin) {
        return <Navigate to="/" replace />
    }

    if (isAdmin && !location.pathname.startsWith("/adm")) {
        return <Navigate to="/adm" replace />
    }

    return children
}