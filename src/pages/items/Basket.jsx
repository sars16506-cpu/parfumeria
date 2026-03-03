import React from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Header from '../home/Header'
import Items from './Items'
import OrderButton from '../../ui/order/Order'

function Basket() {
    const phone = localStorage.getItem("pv_phone") || ""
    const verified = localStorage.getItem("pv_verified") === "true"
console.log(phone, verified);

    if (!verified || !phone) {
        return <Navigate to="/" replace />
    }

    return (
        <>
            <Header />
            <Items />
            <OrderButton />
        </>
    )
}

export default Basket