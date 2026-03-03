import "./Brands.css"


import React from 'react'

import img1 from "../../images/vuitton.png"
// import img2 from "../../images/tom.jpg"
import img3 from "../../images/channel.png"
import img4 from "../../images/dior.png"
import img5 from "../../images/clive.png"
import img6 from "../../images/versace.png"
import img7 from "../../images/aramani.png"
import img8 from "../../images/valentini.png"

function Brands() {
    const brandse = [img1,  img3, img4, img5, img6, img7, img8]

    return (
        <>
            <section className="brands">
                <div className="container">
                    <div className="brands__box">
                        <div className="brands__track">
                            {
                                brandse.map((el, index) => (
                                    <img width={150} key={index} src={el} alt="" />
                                ))
                            }
                            {
                                brandse.map((el, index) => (
                                    <img width={150} key={index} src={el} alt="" />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Brands