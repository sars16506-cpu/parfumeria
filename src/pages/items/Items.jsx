import React, { useState } from 'react'
import like from "../../images/like.svg"
import x from "../../images/x.svg"
import "./Items.css"
import { getCart, removeFromCart } from '../../utils/cart'

function saveCart(updated) {
    localStorage.setItem("pv_cart", JSON.stringify(updated))
    window.dispatchEvent(new Event("cart-updated")) // уведомляем OrderButton
}

function Items() {
    const [products, setProducts] = useState(getCart())

    function increase(key) {
        setProducts(prev => {
            const updated = prev.map(el => {
                const k = `${el.product_id}-${el.ml_sizes}`
                if (k === key) return { ...el, quantity: el.quantity + 1 }
                return el
            })
            saveCart(updated)
            return updated
        })
    }

    function decrease(key) {
        setProducts(prev => {
            const updated = prev.map(el => {
                const k = `${el.product_id}-${el.ml_sizes}`
                if (k === key) return { ...el, quantity: el.quantity > 1 ? el.quantity - 1 : 1 }
                return el
            })
            saveCart(updated)
            return updated
        })
    }

    function remove(product_id, ml_sizes) {
        removeFromCart(product_id, ml_sizes)
        window.dispatchEvent(new Event("cart-updated")) // уведомляем OrderButton
        setProducts(getCart())
    }

    return (
        <section className='basket'>
            <div className="container">
                <h2 className='basket__title'>Моя корзина</h2>
                <hr style={{ marginBottom: "25px" }} />
                {products.length === 0 && <p>Корзина пуста</p>}
                <ul className="basket__list">
                    {products.map((el) => {
                        const key = `${el.product_id}-${el.ml_sizes}`
                        return (
                            <li key={key} className="basket__items">
                                <div className="basket__content">
                                    <div className="basket__photo">
                                        <img width={220} height={190} src={el.image} alt={el.title} />
                                    </div>
                                    <div className="basket__inner">
                                        <p className='basket__ml'>Парфюмерная вода, спрей {el.ml_sizes} мл</p>
                                        <h3 className='basket__brand'>{el.brand}</h3>
                                        <h4 className='basket__name'>{el.title}</h4>
                                    </div>
                                </div>

                                <div className="basket__order">
                                    <div className="basket__pc">
                                        <p className="basket__how-many">Цена за 1 шт.</p>
                                        <p className='basket__money'>{el.price} {el.valute === "USD" ? "$" : "СОМ"}</p>
                                    </div>
                                    <div className="basket__count">
                                        <div className='basket__counter'>
                                            <div className="basket__inner-counter">
                                                <button onClick={() => decrease(key)}>-</button>
                                                <input
                                                    type="number"
                                                    value={el.quantity}
                                                    onChange={(e) => {
                                                        const qty = Number(e.target.value)
                                                        setProducts(prev => {
                                                            const updated = prev.map(item => {
                                                                const k = `${item.product_id}-${item.ml_sizes}`
                                                                if (k === key) return { ...item, quantity: qty > 0 ? qty : 1 }
                                                                return item
                                                            })
                                                            saveCart(updated)
                                                            return updated
                                                        })
                                                    }}
                                                />
                                                <button onClick={() => increase(key)}>+</button>
                                            </div>
                                            <div className="basket__del-or-like">
                                                <button><img src={like} alt="" /></button>
                                                <button onClick={() => remove(el.product_id, el.ml_sizes)}>
                                                    <img src={x} alt="" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className='basket__new-money'>
                                            {el.price * el.quantity} {el.valute === "USD" ? "$" : "СОМ"}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}

export default Items