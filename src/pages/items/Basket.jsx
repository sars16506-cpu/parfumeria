import React from 'react'
import Header from '../home/Header'
import Items from './Items'
import OrderButton from '../../ui/order/Order'

function Basket() {
    return (
        <>
            <Header />
            <Items />
            <OrderButton />
        </>
    )
}

export default Basket