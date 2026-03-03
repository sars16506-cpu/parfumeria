export function getCart() {
    try {
        const cart = localStorage.getItem("pv_cart")
        return cart ? JSON.parse(cart) : []
    } catch {
        return []
    }
}

export function addToCart(item) {
    const cart = getCart()
    const existing = cart.find(i =>
        i.product_id === item.product_id &&
        String(i.ml_sizes) === String(item.ml_sizes)
    )
    if (existing) {
        existing.quantity += 1
    } else {
        cart.push({ ...item, quantity: 1 })
    }
    localStorage.setItem("pv_cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cart-updated"));

    console.log("Cart updated:", cart) // проверка
}

export function removeFromCart(product_id, ml_sizes) {
    const cart = getCart().filter(i =>
        !(i.product_id === product_id && String(i.ml_sizes) === String(ml_sizes))
    )
    localStorage.setItem("pv_cart", JSON.stringify(cart))
}


