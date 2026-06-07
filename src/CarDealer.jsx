import { useState, useEffect } from "react";
import carsData from "./cars.json";

// ─── DATA ──────────────────────────────────────────────────────────────────
const CATEGORIES = ["Todos", "Hipercarro", "Superesportivo", "Esportivo", "Sedan"];

// ─── ICONS (inline SVG) ──────────────────────────────────────────────────────
const IconCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);
const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#f59e0b" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const IconArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const IconMap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const BADGE_COLOR = {
  DESTAQUE: "bg-yellow-500 text-black",
  NOVO: "bg-green-500 text-black",
  OFERTA: "bg-red-500 text-white",
  EXCLUSIVO: "bg-purple-600 text-white",
};

// ─── STYLES ─────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&display=swap');
  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #18181f;
    --border: #2a2a35;
    --accent: #e8ff00;
    --accent2: #ff3c00;
    --text: #f0f0f5;
    --muted: #7a7a90;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Barlow', sans-serif; }
  .font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
  .neon-line { box-shadow: 0 0 8px var(--accent); }
  .neon-text { text-shadow: 0 0 18px var(--accent), 0 0 40px var(--accent); }
  .card-hover { transition: transform .25s ease, box-shadow .25s ease; }
  .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(232,255,0,.12); }
  .btn-accent { background: var(--accent); color: #000; font-weight: 700; transition: filter .2s; }
  .btn-accent:hover { filter: brightness(1.15); }
  .btn-ghost { border: 1px solid var(--border); color: var(--text); transition: border-color .2s, color .2s; }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .cart-slide { animation: slideIn .3s ease; }
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .hero-grain::after {
    content: ''; position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 1;
  }
  input, textarea { outline: none; }
  input:focus, textarea:focus { border-color: var(--accent) !important; }
  @keyframes pulse-accent { 0%,100% { opacity:1; } 50% { opacity:.6; } }
  .pulse { animation: pulse-accent 2s infinite; }
  .privacy-section { margin-bottom: 36px; }
  .privacy-section h2 { font-family: 'Bebas Neue', sans-serif; font-size: 26px; color: var(--accent); margin-bottom: 12px; letter-spacing: .04em; }
  .privacy-section p, .privacy-section li { color: var(--muted); font-size: 15px; line-height: 1.8; margin-bottom: 10px; }
  .privacy-section ul { padding-left: 20px; }
  .privacy-section li { list-style: disc; }
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Header({ page, setPage, cartCount, setCartOpen }) {
  const nav = [
    { label: "Início", key: "home" },
    { label: "Catálogo", key: "catalog" },
    { label: "Sobre", key: "about" },
    { label: "Contato", key: "contact" },
  ];
  return (
    <header style={{ background: "rgba(10,10,15,.95)", borderBottom: "1px solid #2a2a35", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "var(--accent)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: "#000", lineHeight: 1 }}>LS</span>
          </div>
          <span className="font-display" style={{ fontSize: 22, color: "var(--text)", letterSpacing: ".08em" }}>
            LOS SANTOS <span style={{ color: "var(--accent)" }}>AUTO</span>
          </span>
        </button>

        <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {nav.map(n => (
            <button key={n.key} onClick={() => setPage(n.key)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: ".06em", textTransform: "uppercase", color: page === n.key ? "var(--accent)" : "var(--muted)", transition: "color .2s", padding: "4px 0", borderBottom: page === n.key ? "2px solid var(--accent)" : "2px solid transparent" }}>
              {n.label}
            </button>
          ))}
        </nav>

        <button onClick={() => setCartOpen(true)}
          style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "var(--text)", display: "flex", alignItems: "center", gap: 8, position: "relative", transition: "border-color .2s" }}
          className="btn-ghost">
          <IconCart />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Carrinho</span>
          {cartCount > 0 && (
            <span style={{ position: "absolute", top: -8, right: -8, background: "var(--accent2)", color: "#fff", borderRadius: "50%", width: 20, height: 20, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", paddingTop: 60, paddingBottom: 32, marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <div className="font-display" style={{ fontSize: 26, marginBottom: 12 }}>
              LOS SANTOS <span style={{ color: "var(--accent)" }}>AUTO</span>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>
              Os melhores carros usados das ruas de Los Santos. Qualidade, velocidade e estilo garantidos.
            </p>
          </div>
          <div>
            <div className="font-display" style={{ fontSize: 18, marginBottom: 16, color: "var(--accent)" }}>Páginas</div>
            {[["Início","home"],["Catálogo","catalog"],["Sobre","about"],["Contato","contact"]].map(([l,k]) => (
              <button key={k} onClick={() => setPage(k)} style={{ display: "block", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 14, marginBottom: 10, fontFamily: "'Barlow',sans-serif", textAlign: "left", transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = "var(--accent)"}
                onMouseLeave={e => e.target.style.color = "var(--muted)"}>
                {l}
              </button>
            ))}
          </div>
          <div>
            <div className="font-display" style={{ fontSize: 18, marginBottom: 16, color: "var(--accent)" }}>Categorias</div>
            {["Hipercarro","Superesportivo","Esportivo","Sedan"].map(c => (
              <div key={c} style={{ color: "var(--muted)", fontSize: 14, marginBottom: 10 }}>{c}</div>
            ))}
          </div>
          <div>
            <div className="font-display" style={{ fontSize: 18, marginBottom: 16, color: "var(--accent)" }}>Contato</div>
            {[["(11) 9 9999-0000","phone"],["losSantos@lsauto.com","mail"],["Av. Del Perro, 4200 – LS","map"]].map(([t, i]) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 14, marginBottom: 12 }}>
                {i === "phone" && <IconPhone />}{i === "mail" && <IconMail />}{i === "map" && <IconMap />}
                {t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <span style={{ color: "var(--muted)", fontSize: 13 }}>© 2024 Los Santos Auto. Todos os direitos reservados.</span>
          {/* ── NOVO: link Política de Privacidade no rodapé ── */}
          <button onClick={() => setPage("privacy")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 13, fontFamily: "'Barlow',sans-serif", textDecoration: "underline" }}
            onMouseEnter={e => e.target.style.color = "var(--accent)"}
            onMouseLeave={e => e.target.style.color = "var(--muted)"}>
            Política de Privacidade
          </button>
          <span style={{ color: "var(--muted)", fontSize: 13 }}>Inspired by GTA V — Ficção apenas 🎮</span>
        </div>
      </div>
    </footer>
  );
}

function ProductCard({ car, onDetails, onAddCart }) {
  return (
    <div className="card-hover" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={car.img} alt={car.name} style={{ width: "100%", height: 210, objectFit: "cover", display: "block", transition: "transform .4s" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"} />
        {car.badge && (
          <span className={`font-display ${BADGE_COLOR[car.badge]}`} style={{ position: "absolute", top: 14, left: 14, padding: "3px 10px", borderRadius: 4, fontSize: 13 }}>
            {car.badge}
          </span>
        )}
        <span style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(10,10,15,.85)", color: "var(--accent)", padding: "3px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700, backdropFilter: "blur(6px)" }}>
          {car.category}
        </span>
      </div>
      <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div style={{ color: "var(--muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>{car.brand} · {car.year}</div>
          <div className="font-display" style={{ fontSize: 22 }}>{car.name}</div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[`${car.hp} cv`, car.trans, car.fuel].map(t => (
            <span key={t} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 8px", fontSize: 12, color: "var(--muted)" }}>{t}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>{[1,2,3,4,5].map(s => <IconStar key={s} />)}</div>
        <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "var(--muted)", fontSize: 11, marginBottom: 2 }}>a partir de</div>
            <div className="font-display" style={{ fontSize: 24, color: "var(--accent)" }}>{fmt(car.price)}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onDetails(car)} className="btn-ghost" style={{ background: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              Detalhes
            </button>
            <button onClick={() => onAddCart(car)} className="btn-accent" style={{ border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <IconCart /> Reservar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPanel({ cart, setCart, open, setOpen }) {
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const removeItem = (id) => setCart(c => c.filter(i => i.id !== id));
  const changeQty = (id, d) => setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));

  if (!open) return null;
  return (
    <>
      <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 200, backdropFilter: "blur(4px)" }} />
      <div className="cart-slide" style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px,100vw)", background: "var(--surface)", borderLeft: "1px solid var(--border)", zIndex: 201, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="font-display" style={{ fontSize: 24 }}>Carrinho de Reserva</span>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4 }}><IconX /></button>
        </div>
        {cart.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--muted)", gap: 12 }}>
            <div style={{ fontSize: 48, opacity: .3 }}>🚗</div>
            <div style={{ fontSize: 14 }}>Seu carrinho está vazio</div>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            {cart.map(item => (
              <div key={item.id} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", display: "flex" }}>
                <img src={item.img} alt={item.name} style={{ width: 90, height: 80, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ padding: "10px 12px", flex: 1 }}>
                  <div className="font-display" style={{ fontSize: 16 }}>{item.name}</div>
                  <div style={{ color: "var(--accent)", fontSize: 14, fontWeight: 700, margin: "4px 0" }}>{fmt(item.price)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => changeQty(item.id, -1)} style={{ background: "var(--border)", border: "none", borderRadius: 4, width: 24, height: 24, cursor: "pointer", color: "var(--text)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontSize: 14, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)} style={{ background: "var(--border)", border: "none", borderRadius: 4, width: 24, height: 24, cursor: "pointer", color: "var(--text)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    <button onClick={() => removeItem(item.id)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}><IconX /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {cart.length > 0 && (
          <div style={{ padding: 24, borderTop: "1px solid var(--border)" }}>
            {/* Resumo do pedido */}
            <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div className="font-display" style={{ fontSize: 16, marginBottom: 12, color: "var(--muted)" }}>Resumo do Pedido</div>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>
                  <span>{item.name} × {item.qty}</span>
                  <span>{fmt(item.price * item.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--border)", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span className="font-display" style={{ fontSize: 20, color: "var(--accent)" }}>{fmt(total)}</span>
              </div>
            </div>
            <button className="btn-accent" onClick={() => { alert("✅ Reserva enviada! Nossa equipe entrará em contato."); setCart([]); setOpen(false); }}
              style={{ width: "100%", border: "none", borderRadius: 10, padding: "14px", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: ".06em" }}>
              Confirmar Reserva
            </button>
            <button onClick={() => setCart([])} style={{ width: "100%", marginTop: 8, background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 13 }}>
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

function HomePage({ setPage, onAddCart, cars }) {
  const featured = cars.filter(c => c.badge === "DESTAQUE" || c.badge === "EXCLUSIVO" || c.badge === "NOVO").slice(0, 3);
  return (
    <div>
      <div className="hero-grain" style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&q=80') center/cover", filter: "brightness(.25) saturate(.6)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,10,15,.9) 40%, rgba(232,255,0,.04) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, var(--bg), transparent)" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%" }}>
          <div style={{ maxWidth: 700 }}>
            <div className="pulse" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(232,255,0,.1)", border: "1px solid rgba(232,255,0,.3)", borderRadius: 50, padding: "6px 16px", marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, background: "var(--accent)", borderRadius: "50%", display: "inline-block" }} />
              <span style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, letterSpacing: ".06em" }}>LOS SANTOS AUTO · ABERTO AGORA</span>
            </div>
            <h1 className="font-display" style={{ fontSize: "clamp(52px, 9vw, 110px)", lineHeight: .95, marginBottom: 24 }}>
              VELOCIDADE<br />
              <span className="neon-text" style={{ color: "var(--accent)" }}>SEM LIMITES</span>
            </h1>
            <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.7, marginBottom: 36, maxWidth: 520 }}>
              Os carros mais cobiçados das ruas de Los Santos agora à venda. Do clássico ao hipercarro, encontre seu próximo parceiro de estrada.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button className="btn-accent" onClick={() => setPage("catalog")} style={{ border: "none", borderRadius: 10, padding: "14px 32px", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: ".06em", display: "flex", alignItems: "center", gap: 8 }}>
                Ver Catálogo <IconArrow />
              </button>
              <button className="btn-ghost" onClick={() => setPage("contact")} style={{ borderRadius: 10, padding: "14px 32px", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: ".06em", background: "none" }}>
                Falar Conosco
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--accent)", padding: "28px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
          {[["500+","Veículos Vendidos"],["12","Anos no Mercado"],["98%","Clientes Satisfeitos"],["24h","Suporte"]].map(([n,l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div className="font-display" style={{ fontSize: 38, color: "#000", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,.6)", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "72px auto 0", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
          <div>
            <div style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Em Destaque</div>
            <h2 className="font-display" style={{ fontSize: 42 }}>Escolhas da Semana</h2>
          </div>
          <button className="btn-ghost" onClick={() => setPage("catalog")} style={{ background: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            Ver Todos <IconArrow />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {featured.map(car => (
            <ProductCard key={car.id} car={car} onDetails={() => {}} onAddCart={onAddCart} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "80px auto 0", padding: "0 24px" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "56px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 28, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 240, height: 240, background: "radial-gradient(circle, rgba(232,255,0,.08), transparent 70%)", pointerEvents: "none" }} />
          <div style={{ flex: 1, minWidth: 240 }}>
            <h3 className="font-display" style={{ fontSize: 38, marginBottom: 12 }}>Não encontrou o que procura?</h3>
            <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6 }}>Nossa equipe de especialistas está pronta para ajudar a localizar o carro dos seus sonhos.</p>
          </div>
          <button className="btn-accent" onClick={() => setPage("contact")} style={{ border: "none", borderRadius: 10, padding: "14px 32px", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: ".06em", flexShrink: 0 }}>
            Falar com Especialista
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Catálogo: consome `cars` via prop (do JSON) ──
function CatalogPage({ cars, setDetailCar, setPage, onAddCart }) {
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  let filtered = cars.filter(c =>
    (category === "Todos" || c.category === category) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.brand.toLowerCase().includes(search.toLowerCase()))
  );
  if (sort === "price_asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price_desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "hp") filtered = [...filtered].sort((a, b) => b.hp - a.hp);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Frota Completa</div>
        <h1 className="font-display" style={{ fontSize: 52, marginBottom: 8 }}>Catálogo de Veículos</h1>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>{filtered.length} veículos disponíveis · Atualizado hoje</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por modelo ou marca…"
          style={{ flex: "1 1 220px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 16px", color: "var(--text)", fontSize: 14, fontFamily: "'Barlow',sans-serif" }} />
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 16px", color: "var(--text)", fontSize: 14, cursor: "pointer", fontFamily: "'Barlow',sans-serif" }}>
          <option value="default">Ordenar por…</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
          <option value="hp">Mais potente</option>
        </select>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ border: `1px solid ${category === cat ? "var(--accent)" : "var(--border)"}`, background: category === cat ? "var(--accent)" : "var(--surface)", color: category === cat ? "#000" : "var(--muted)", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all .2s", fontFamily: "'Barlow',sans-serif" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: .3 }}>🔍</div>
          <div style={{ fontSize: 16 }}>Nenhum veículo encontrado</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {filtered.map(car => (
            <ProductCard key={car.id} car={car}
              onDetails={(c) => { setDetailCar(c); setPage("detail"); }}
              onAddCart={onAddCart} />
          ))}
        </div>
      )}
    </div>
  );
}

function DetailPage({ car, onAddCart, setPage }) {
  const [added, setAdded] = useState(false);
  if (!car) return null;
  const handleAdd = () => { onAddCart(car); setAdded(true); setTimeout(() => setAdded(false), 2000); };
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
      <button onClick={() => setPage("catalog")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 32, fontFamily: "'Barlow',sans-serif" }}>
        ← Voltar ao Catálogo
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48 }}>
        <div>
          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", position: "relative" }}>
            <img src={car.img} alt={car.name} style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }} />
            {car.badge && (
              <span className={`font-display ${BADGE_COLOR[car.badge]}`} style={{ position: "absolute", top: 18, left: 18, padding: "4px 12px", borderRadius: 4, fontSize: 14 }}>
                {car.badge}
              </span>
            )}
          </div>
          <div style={{ marginTop: 20, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
            <div className="font-display" style={{ fontSize: 18, marginBottom: 14, color: "var(--muted)" }}>Especificações</div>
            {[["Marca",car.brand],["Ano",car.year],["Potência",`${car.hp} cv`],["Transmissão",car.trans],["Combustível",car.fuel],["Cor",car.color],["Quilometragem",`${car.mileage.toLocaleString()} km`]].map(([k,v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
                <span style={{ color: "var(--muted)" }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ color: "var(--muted)", fontSize: 13, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>{car.brand} · {car.category}</div>
          <h1 className="font-display" style={{ fontSize: 54, lineHeight: .95, marginBottom: 20 }}>{car.name}</h1>
          <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
            {[1,2,3,4,5].map(s => <IconStar key={s} />)}
            <span style={{ color: "var(--muted)", fontSize: 13, marginLeft: 6 }}>5.0 (47 avaliações)</span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.75, marginBottom: 28 }}>{car.desc}</p>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 28 }}>
            <div style={{ color: "var(--muted)", fontSize: 12, marginBottom: 4 }}>Preço de Venda</div>
            <div className="font-display neon-text" style={{ fontSize: 46, color: "var(--accent)" }}>{fmt(car.price)}</div>
            <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>ou em até 60x sem juros*</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {["Garantia de 1 ano inclusa","Histórico de revisões verificado","Teste drive disponível","Financiamento facilitado"].map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                <IconCheck /> {b}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={handleAdd} className="btn-accent" style={{ flex: "1 1 160px", border: "none", borderRadius: 10, padding: "15px", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: ".06em", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {added ? <><IconCheck /> Adicionado!</> : <><IconCart /> Reservar Agora</>}
            </button>
            <button onClick={() => setPage("contact")} className="btn-ghost" style={{ flex: "1 1 140px", background: "none", borderRadius: 10, padding: "15px", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: ".06em" }}>
              Falar c/ Vendedor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>Nossa História</div>
          <h1 className="font-display" style={{ fontSize: "clamp(38px,6vw,72px)", marginBottom: 20 }}>A Lenda por Trás<br /><span style={{ color: "var(--accent)" }}>dos Motores</span></h1>
          <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.8 }}>
            Fundada em 2012 nas ruas de Los Santos, a LS Auto nasceu da paixão por máquinas excepcionais. Começamos com 5 carros numa garagem da Vespucci Beach. Hoje somos a maior revendedora premium da cidade.
          </p>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: "72px auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, marginBottom: 72 }}>
          {[
            { icon: "🏆", title: "Excelência", text: "Cada veículo passa por inspeção técnica de 150 pontos antes de entrar no estoque." },
            { icon: "🔒", title: "Confiança", text: "Histórico completo, sem surpresas. Transparência em cada negociação." },
            { icon: "⚡", title: "Velocidade", text: "Processo de compra ágil. Documentação em 24h, entrega em até 3 dias." },
            { icon: "🎯", title: "Resultado", text: "+500 clientes satisfeitos nas ruas de Los Santos. Reputação que fala por si." },
          ].map(c => (
            <div key={c.title} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{c.icon}</div>
              <div className="font-display" style={{ fontSize: 22, marginBottom: 10, color: "var(--accent)" }}>{c.title}</div>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>{c.text}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 className="font-display" style={{ fontSize: 42, marginBottom: 8 }}>Nossa Equipe</h2>
          <p style={{ color: "var(--muted)" }}>Especialistas que vivem para o mundo automotivo</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
          {[
            { name: "Trevor Philips", role: "Fundador & CEO", emoji: "😤" },
            { name: "Michael De Santa", role: "Diretor Comercial", emoji: "🕶️" },
            { name: "Franklin Clinton", role: "Chefe de Vendas", emoji: "😎" },
            { name: "Lamar Davis", role: "Avaliador Técnico", emoji: "🔧" },
          ].map(p => (
            <div key={p.name} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, textAlign: "center" }}>
              <div style={{ width: 70, height: 70, background: "var(--surface2)", borderRadius: "50%", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, border: "2px solid var(--border)" }}>{p.emoji}</div>
              <div className="font-display" style={{ fontSize: 18, marginBottom: 4 }}>{p.name}</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>{p.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", msg: "" });
  const handleSubmit = () => {
    if (!form.name || !form.email) { alert("Preencha nome e e-mail."); return; }
    setSent(true);
  };
  if (sent) return (
    <div style={{ maxWidth: 500, margin: "100px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
      <h2 className="font-display" style={{ fontSize: 38, marginBottom: 12, color: "var(--accent)" }}>Mensagem Enviada!</h2>
      <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Nossa equipe retornará em até 2 horas.</p>
      <button onClick={() => setSent(false)} className="btn-accent" style={{ border: "none", borderRadius: 10, padding: "12px 28px", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, marginTop: 28, letterSpacing: ".06em" }}>
        Nova Mensagem
      </button>
    </div>
  );
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: 48, maxWidth: 500 }}>
        <div style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Fale Conosco</div>
        <h1 className="font-display" style={{ fontSize: 52, marginBottom: 12 }}>Entre em Contato</h1>
        <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.7 }}>Seja para dúvidas, test drive ou negociação — nossa equipe está pronta.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 32 }}>
          <div className="font-display" style={{ fontSize: 24, marginBottom: 24, color: "var(--accent)" }}>Envie uma Mensagem</div>
          {[["Nome completo","name","text","Seu nome"],["E-mail","email","email","seu@email.com"],["Telefone","phone","tel","(00) 00000-0000"]].map(([l,k,t,ph]) => (
            <div key={k} style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--muted)" }}>{l}</label>
              <input type={t} placeholder={ph} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "11px 14px", color: "var(--text)", fontSize: 14, fontFamily: "'Barlow',sans-serif", transition: "border-color .2s" }} />
            </div>
          ))}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--muted)" }}>Mensagem</label>
            <textarea placeholder="Qual veículo te interessa?" rows={4} value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })}
              style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "11px 14px", color: "var(--text)", fontSize: 14, fontFamily: "'Barlow',sans-serif", resize: "vertical", transition: "border-color .2s" }} />
          </div>
          <button className="btn-accent" onClick={handleSubmit} style={{ width: "100%", border: "none", borderRadius: 10, padding: "14px", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: ".06em" }}>
            Enviar Mensagem
          </button>
        </div>
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
            {[
              { icon: <IconPhone />, label: "Telefone", val: "(11) 9 9999-0000", sub: "Seg–Sáb, 9h–19h" },
              { icon: <IconMail />, label: "E-mail", val: "losSantos@lsauto.com", sub: "Resposta em até 2h" },
              { icon: <IconMap />, label: "Endereço", val: "Av. Del Perro, 4200", sub: "Los Santos, CA · LS 90210" },
            ].map(c => (
              <div key={c.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, display: "flex", gap: 16 }}>
                <div style={{ color: "var(--accent)", marginTop: 2 }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 2 }}>{c.label}</div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{c.val}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
            <div className="font-display" style={{ fontSize: 20, marginBottom: 16, color: "var(--accent)" }}>Horário de Funcionamento</div>
            {[["Segunda – Sexta","9h às 19h"],["Sábado","9h às 17h"],["Domingo","Fechado"]].map(([d,h]) => (
              <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
                <span style={{ color: "var(--muted)" }}>{d}</span>
                <span style={{ fontWeight: 600 }}>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── NOVO: Página de Política de Privacidade ──
function PrivacyPage() {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "56px 24px" }}>
      <div style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>Legal</div>
      <h1 className="font-display" style={{ fontSize: 52, marginBottom: 8 }}>Política de Privacidade</h1>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 48 }}>Última atualização: junho de 2024</p>

      <div className="privacy-section">
        <h2>1. Informações que Coletamos</h2>
        <p>Ao utilizar o site Los Santos Auto, podemos coletar as seguintes informações:</p>
        <ul>
          <li>Nome completo, e-mail e telefone fornecidos em formulários de contato ou reserva.</li>
          <li>Dados de navegação como páginas visitadas, tempo de sessão e dispositivo utilizado.</li>
          <li>Preferências de veículos registradas durante a navegação no catálogo.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>2. Como Usamos suas Informações</h2>
        <p>As informações coletadas são utilizadas para:</p>
        <ul>
          <li>Processar reservas e responder solicitações de contato.</li>
          <li>Melhorar a experiência de navegação e recomendar veículos relevantes.</li>
          <li>Enviar comunicações sobre ofertas e novidades, caso você opte por recebê-las.</li>
          <li>Cumprir obrigações legais e regulatórias aplicáveis.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>3. Compartilhamento de Dados</h2>
        <p>Não vendemos nem alugamos seus dados pessoais a terceiros. Podemos compartilhar informações apenas com:</p>
        <ul>
          <li>Parceiros de financiamento, mediante seu consentimento expresso.</li>
          <li>Autoridades competentes, quando exigido por lei.</li>
          <li>Prestadores de serviços que auxiliam na operação do site, sob acordos de confidencialidade.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>4. Cookies</h2>
        <p>Utilizamos cookies para melhorar a funcionalidade do site. Você pode desativá-los nas configurações do seu navegador, mas isso pode impactar algumas funcionalidades da plataforma.</p>
      </div>

      <div className="privacy-section">
        <h2>5. Seus Direitos</h2>
        <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
        <ul>
          <li>Acessar, corrigir ou excluir seus dados pessoais.</li>
          <li>Revogar consentimentos fornecidos anteriormente.</li>
          <li>Solicitar a portabilidade dos seus dados.</li>
          <li>Ser informado sobre o uso de seus dados.</li>
        </ul>
        <p>Para exercer esses direitos, entre em contato pelo e-mail <strong style={{ color: "var(--text)" }}>privacidade@lsauto.com</strong>.</p>
      </div>

      <div className="privacy-section">
        <h2>6. Segurança</h2>
        <p>Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, perda ou divulgação indevida.</p>
      </div>

      <div className="privacy-section">
        <h2>7. Contato</h2>
        <p>Dúvidas sobre esta política? Fale conosco:</p>
        <ul>
          <li>E-mail: privacidade@lsauto.com</li>
          <li>Telefone: (11) 9 9999-0000</li>
          <li>Endereço: Av. Del Perro, 4200 – Los Santos, CA</li>
        </ul>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  // ── Carrega produtos do JSON (simulando fetch/import dinâmico) ──
  const [cars, setCars] = useState([]);
  useEffect(() => {
    setCars(carsData);
  }, []);

  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [detailCar, setDetailCar] = useState(null);

  const addCart = (car) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === car.id);
      if (ex) return prev.map(i => i.id === car.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...car, qty: 1 }];
    });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header page={page} setPage={setPage} cartCount={cartCount} setCartOpen={setCartOpen} />
        <main style={{ flex: 1 }}>
          {page === "home"    && <HomePage    setPage={setPage} onAddCart={addCart} cars={cars} />}
          {page === "catalog" && <CatalogPage cars={cars} setDetailCar={setDetailCar} setPage={setPage} onAddCart={addCart} />}
          {page === "detail"  && <DetailPage  car={detailCar} onAddCart={addCart} setPage={setPage} />}
          {page === "about"   && <AboutPage />}
          {page === "contact" && <ContactPage />}
          {page === "privacy" && <PrivacyPage />}
        </main>
        <Footer setPage={setPage} />
        <CartPanel cart={cart} setCart={setCart} open={cartOpen} setOpen={setCartOpen} />
      </div>
    </>
  );
}
