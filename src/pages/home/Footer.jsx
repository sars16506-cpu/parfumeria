import { useState } from "react";
import "./Footer.css";

const navLinks = {
  Каталог: ["Мужская парфюмерия", "Женская парфюмерия", "Унисекс", "Нишевая парфюмерия", "Подарочные наборы", "Новинки", "Акции"],
  Бренды: ["Chanel", "Gucci", "Tom Ford", "Maison Margiela", "Byredo", "Le Labo", "Все бренды →"],
};

const contacts = [
  { text: "Москва, Тверская ул., 12" },
  { text: "+7 (495) 123-45-67", href: "tel:+74951234567" },
  { text: "info@you.ru", href: "mailto:info@you.ru" },
  { text: "Пн–Вс: 10:00 – 22:00" },
];

const trustItems = [
  { title: "Быстрая доставка", desc: "По Москве за 1–2 дня" },
  { title: "100% оригинал", desc: "Гарантия подлинности" },
  { title: "Возврат 14 дней", desc: "Без лишних вопросов" },
  { title: "Безопасная оплата", desc: "Visa, Mastercard, СБП" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe() {
    if (email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSubscribe();
  }

  return (
    <div id="foot" className="footer-wrap">

      {/* NEWSLETTER */}
      <div className="newsletter">
        <div>
          <h3 className="nl-title">Будьте первыми среди избранных</h3>
          <p className="nl-sub">Новинки, акции и эксклюзивные предложения — прямо на почту</p>
        </div>
        {subscribed ? (
          <div className="nl-success">✓ Вы успешно подписаны</div>
        ) : (
          <div className="nl-form">
            <input
              type="email"
              value={email}
              onChange={function(e) { setEmail(e.target.value); }}
              onKeyDown={handleKey}
              placeholder="Ваш email адрес"
            />
            <button onClick={handleSubscribe}>Подписаться</button>
          </div>
        )}
      </div>

      {/* MAIN FOOTER */}
      <footer className="footer">

        <div className="footer-grid">

          {/* BRAND */}
          <div className="brand footer-col">
            <span className="logo">YOU</span>
            <span className="logo-sub">Perfumery · Community</span>
            <p>Интернет-магазин нишевой и люксовой парфюмерии. Только оригинальные ароматы от ведущих мировых брендов.</p>
            <div className="socials">
              <a href="#">IG</a>
              <a href="#">TG</a>
              <a href="#">VK</a>
              <a href="#">YT</a>
            </div>
          </div>

          {/* NAV COLUMNS */}
          {Object.entries(navLinks).map(function([title, links]) {
            return (
              <div key={title} className="footer-col">
                <h4 className="col-title">{title}</h4>
                <ul>
                  {links.map(function(link) {
                    return <li key={link}><a href="#">{link}</a></li>;
                  })}
                </ul>
              </div>
            );
          })}

          {/* CONTACTS */}
          <div className="footer-col">
            <h4 className="col-title">Контакты</h4>
            <ul>
              {contacts.map(function(item) {
                return (
                  <li key={item.text}>
                    {item.href
                      ? <a href={item.href}>{item.text}</a>
                      : <span>{item.text}</span>
                    }
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

        {/* TRUST BADGES */}
        <div className="trust">
          {trustItems.map(function(item) {
            return (
              <div key={item.title} className="trust-item">
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </div>
            );
          })}
        </div>


        {/* BOTTOM */}
        <div className="bottom">
          <p>© 2024 YOU Community. Все права защищены.</p>
          <div className="bottom-links">
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Условия использования</a>
            <a href="#">Оферта</a>
          </div>
          <div className="pay-badges">
            {["Visa", "MC", "МИР", "СБП"].map(function(p) {
              return <span key={p}>{p}</span>;
            })}
          </div>
        </div>

      </footer>
    </div>
  );
}
