import { useOrderProductsMutation } from "../../app/services/authApi";
import { getCart } from "../../utils/cart";
import { useMemo, useState, useEffect } from "react";
import styles from "./OrderButton.module.css";

function money(n, c = "USD") {
    const num = Number(n || 0);
    try {
        return new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: c,
            maximumFractionDigits: c === "UZS" ? 0 : 2,
        }).format(num);
    } catch {
        return `${num.toLocaleString()} ${c}`;
    }
}

/* ─── Cart Summary ─────────────────────────────────────────────── */
function CartSummary({ total, totalQuantity, currency, cart }) {
    return (
        <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
                <div className={styles.summaryTitleBox}>
                    <span className={styles.summaryLabel}>Ваш заказ</span>
                    <span className={styles.summaryHint}>
                        Проверьте позиции перед оформлением
                    </span>
                </div>
                <span className={styles.badge}>{totalQuantity} шт.</span>
            </div>

            <div className={styles.itemList}>
                {cart.map((item, i) => {
                    const title = item.title || item.name || `Товар #${i + 1}`;
                    const sub = [
                        item.brand || null,
                        item.ml_sizes ? `${item.ml_sizes} мл` : null,
                    ]
                        .filter(Boolean)
                        .join(" • ");
                    const rowSum = Number(item.price) * Number(item.quantity);

                    return (
                        <div
                            key={`${item.product_id || i}-${item.ml_sizes || "x"}`}
                            className={styles.itemRow}
                        >
                            <div className={styles.itemLeft}>
                                <span className={styles.itemName}>{title}</span>
                                {sub && <span className={styles.itemSub}>{sub}</span>}
                            </div>

                            <div className={styles.itemMeta}>
                                <span className={styles.qtyPill}>×{item.quantity}</span>
                                <span className={styles.itemPrice}>
                                    {money(rowSum, item.valute || currency)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Итого</span>
                <span className={styles.totalAmount}>
                    {money(total, currency)}{" "}
                    <span className={styles.currency}>{currency}</span>
                </span>
            </div>
        </div>
    );
}

/* ─── Phone Row ───────────────────────────────────────────────── */
function PhoneRow({ phone }) {
    return (
        <div className={styles.phoneRow}>
            <div className={styles.phoneIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
            </div>

            {phone ? (
                <span className={styles.phoneNumber}>{phone}</span>
            ) : (
                <span className={styles.phoneWarning}>Номер не подтверждён</span>
            )}

            {phone && (
                <span className={styles.phoneCheck}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </span>
            )}
        </div>
    );
}

/* ─── Button ───────────────────────────────────────────────────── */
function SubmitButton({ onClick, isLoading, disabled }) {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={[
                styles.submitBtn,
                hovered && !disabled && !isLoading ? styles.submitBtnHovered : "",
                disabled ? styles.submitBtnDisabled : "",
            ].join(" ")}
        >
            {isLoading ? (
                <span className={styles.loadingContent}>
                    <span className={styles.spinner} />
                    Оформление...
                </span>
            ) : (
                <span className={styles.btnContent}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    Оформить заказ
                </span>
            )}
        </button>
    );
}

/* ─── Main ─────────────────────────────────────────────────────── */
function OrderButton() {
    const [orderProducts, { isLoading }] = useOrderProductsMutation();

    // Реактивная корзина — обновляется при любом изменении в Items.jsx
    const [cart, setCart] = useState(getCart);

    useEffect(() => {
        const sync = () => setCart(getCart());
        window.addEventListener("cart-updated", sync);
        return () => window.removeEventListener("cart-updated", sync);
    }, []);

    const verified = localStorage.getItem("pv_verified") === "true";
    const phone = verified ? localStorage.getItem("pv_phone") || "" : "";

    const { total, totalQuantity, currency } = useMemo(() => {
        const totalSum = cart.reduce(
            (sum, i) => sum + Number(i.price) * Number(i.quantity),
            0
        );
        const qty = cart.reduce((sum, i) => sum + Number(i.quantity), 0);
        return {
            total: totalSum,
            totalQuantity: qty,
            currency: cart[0]?.valute || "USD",
        };
    }, [cart]);

    const handleOrder = async () => {
        if (!phone) { alert("Подтвердите номер"); return; }
        if (cart.length === 0) { alert("Корзина пустая"); return; }

        try {
            await orderProducts({
                customer_phone: phone,
                items: cart,
                total,
                valute: currency,
                notified: false,
            }).unwrap();

            localStorage.removeItem("pv_cart");
            alert("Заказ оформлен ✅");
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Ошибка при оформлении заказа");
        }
    };

    const canOrder = !!phone && cart.length > 0;

    return (
        <div className={styles.wrapper}>
            {cart.length > 0 ? (
                <CartSummary
                    total={total}
                    totalQuantity={totalQuantity}
                    currency={currency}
                    cart={cart}
                />
            ) : (
                <div className={styles.emptyCart}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                    </svg>
                    <span className={styles.emptyText}>Корзина пустая</span>
                </div>
            )}

            <PhoneRow phone={phone} />

            <div className={styles.stickyBtn}>
                <SubmitButton onClick={handleOrder} isLoading={isLoading} disabled={!canOrder} />
            </div>
        </div>
    );
}

export default OrderButton;