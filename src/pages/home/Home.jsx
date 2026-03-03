import React from 'react'
import { useGetProductsQuery } from '../../app/services/authApi'
import Header from './Header'
import Hero from '../Hero'
import Brands from './Brands'
import NewArrivals from './NewArrivals'
import Footer from './Footer'

function Home() {
    const { data, isLoading, error } = useGetProductsQuery()
    return (
        <>
            <Header />
            <main>

                <Hero />
                <Brands />
                <NewArrivals />
            </main>
            {/* <Footer /> */}
        </>
    )
}

export default Home