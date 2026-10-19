import { useEffect, useMemo, useRef, useState } from "react";
import { catalogProducts, type CatalogProduct } from "./products";

type IconName =
  | "arrow"
  | "back"
  | "brush"
  | "cart"
  | "chevron"
  | "close"
  | "filter"
  | "kit"
  | "mail"
  | "map"
  | "menu"
  | "minus"
  | "plus"
  | "roller"
  | "search"
  | "spray"
  | "surface"
  | "tool"
  | "trash";

type Route =
  | { view: "home" }
  | { view: "catalog" }
  | { view: "category"; category: string }
  | { view: "detail"; productId: string };

const assets = "/assets/attachments/";
const categories = [
  { name: "Brochas", key: "Brocha", icon: "brush" as IconName, copy: "27 productos en 6 líneas especializadas." },
  { name: "Fundas y Rodillos", key: "Fundas", icon: "roller" as IconName, copy: "12 opciones para acabados precisos." },
  {
    name: "Herramientas y Accesorios",
    key: "Herramientas",
    icon: "tool" as IconName,
    copy: "23 soluciones para preparar y ejecutar.",
  },
  { name: "Kits y Sets", key: "Kit", icon: "kit" as IconName, copy: "11 combinaciones listas para trabajar." },
  {
    name: "Esmalte Acrílico en Aerosol",
    key: "Esmalte acrilico en aerosol",
    icon: "spray" as IconName,
    copy: "14 colores de acabado profesional.",
  },
  {
    name: "Preparación y Superficies",
    key: "Preparación",
    icon: "surface" as IconName,
    copy: "11 lijas profesionales para cada preparación.",
  },
];

const imageByProduct: Record<string, string> = {
  "FX2-402157": `${assets}cdba3b5a-8ec1-45a5-bf5d-797d80bdfac6`,
  "FX1-264274": `${assets}15a1826f-5a76-48e2-8a94-44b492a3679f`,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="m9 18 6-6-6-6M4 12h11" />,
    back: <path d="m15 18-6-6 6-6M20 12H9" />,
    brush: <path d="M14 3 4 13l7 7 10-10-7-7ZM4 13c-2 2-2 5-2 7 2 0 5 0 7-2m6-11 2 2" />,
    cart: <path d="M3 3h2l2.5 11h9l2-7H6M9 19.5h.01M16 19.5h.01" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
    kit: <path d="M4 9h16v11H4V9Zm4 0V6h8v3M4 14h16M10 12h4v4h-4v-4Z" />,
    mail: <path d="M3 5h18v14H3V5Zm0 1 9 7 9-7" />,
    map: <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Zm-8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    minus: <path d="M5 12h14" />,
    plus: <path d="M12 5v14M5 12h14" />,
    roller: <path d="M3 5h14v6H3V5Zm14 3h3v5h-8v8M12 21h-3v-8h3" />,
    search: <path d="m20 20-4.5-4.5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />,
    spray: <path d="M8 7h9l2 4-2 10H7L5 11l3-4Zm2 0V3h5v4M4 5H2M5 2 3 1m2 7L3 9" />,
    surface: <path d="m3 17 9 4 9-4-9-4-9 4Zm0-5 9 4 9-4M3 7l9 4 9-4-9-4-9 4Z" />,
    tool: <path d="M14 6a4 4 0 0 0-5-4l3 3-3 3-3-3a4 4 0 0 0 5 5L4 17l3 3 7-7a4 4 0 0 0 5-5l-3 3-3-3 3-3" />,
    trash: <path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6" />,
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function Mascot() {
  return (
    <span className="mascot" aria-hidden="true">
      <svg viewBox="0 0 64 64">
        <circle cx="13" cy="20" r="9" fill="#8c552f" />
        <circle cx="51" cy="20" r="9" fill="#8c552f" />
        <circle cx="32" cy="31" r="24" fill="#b77442" />
        <ellipse cx="32" cy="39" rx="16" ry="14" fill="#efd0a7" />
        <circle cx="23" cy="27" r="3" fill="#1a1a1a" />
        <circle cx="41" cy="27" r="3" fill="#1a1a1a" />
        <ellipse cx="32" cy="35" rx="5" ry="4" fill="#1a1a1a" />
        <path d="M25 42c4 4 10 4 14 0" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M28 43v7h4v-6m4-1v7h-4v-6" fill="#fff" stroke="#1a1a1a" strokeWidth="1.5" />
        <path d="M16 13c7-8 25-9 34 0" fill="none" stroke="#e31e24" strokeWidth="7" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Logo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const image = new Image();
    image.src = "/assets/cerdex-logo";
    image.onload = () => {
      const source = document.createElement("canvas");
      source.width = image.naturalWidth;
      source.height = image.naturalHeight;
      const context = source.getContext("2d", { willReadFrequently: true });
      const target = canvasRef.current;
      if (!context || !target) return;

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, source.width, source.height);
      const { data } = imageData;
      const visited = new Uint8Array(source.width * source.height);
      const queue = new Int32Array(source.width * source.height);
      let head = 0;
      let tail = 0;

      const addPixel = (index: number) => {
        if (index < 0 || index >= visited.length || visited[index]) return;
        const offset = index * 4;
        const isBackground = data[offset] > 225 && data[offset + 1] > 225 && data[offset + 2] > 225;
        if (!isBackground) return;
        visited[index] = 1;
        queue[tail++] = index;
      };

      for (let x = 0; x < source.width; x += 1) {
        addPixel(x);
        addPixel((source.height - 1) * source.width + x);
      }
      for (let y = 0; y < source.height; y += 1) {
        addPixel(y * source.width);
        addPixel(y * source.width + source.width - 1);
      }

      while (head < tail) {
        const index = queue[head++];
        const x = index % source.width;
        const y = Math.floor(index / source.width);
        data[index * 4 + 3] = 0;
        if (x > 0) addPixel(index - 1);
        if (x < source.width - 1) addPixel(index + 1);
        if (y > 0) addPixel(index - source.width);
        if (y < source.height - 1) addPixel(index + source.width);
      }

      context.putImageData(imageData, 0, 0);
      let left = source.width;
      let top = source.height;
      let right = 0;
      let bottom = 0;
      for (let y = 0; y < source.height; y += 1) {
        for (let x = 0; x < source.width; x += 1) {
          if (data[(y * source.width + x) * 4 + 3] > 0) {
            left = Math.min(left, x);
            right = Math.max(right, x);
            top = Math.min(top, y);
            bottom = Math.max(bottom, y);
          }
        }
      }
      const padding = 3;
      const width = right - left + 1 + padding * 2;
      const height = bottom - top + 1 + padding * 2;
      target.width = width;
      target.height = height;
      target.getContext("2d")?.drawImage(source, left, top, width - padding * 2, height - padding * 2, padding, padding, width - padding * 2, height - padding * 2);
    };
  }, []);

  return <canvas ref={canvasRef} className="official-logo" role="img" aria-label="Cerdex" />;
}

function AppButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`button ${className}`} {...props}>
      {children}
    </button>
  );
}

function categoryIcon(category: string): IconName {
  return categories.find((item) => item.key === category)?.icon ?? "tool";
}

function ProductVisual({ product, large = false }: { product: CatalogProduct; large?: boolean }) {
  const image = imageByProduct[product.material];
  if (image) {
    return <img className={large ? "detail-photo" : ""} src={image} alt={product.descripcion} />;
  }
  return (
    <div className={`product-illustration ${large ? "visual-large" : ""}`}>
      <Icon name={categoryIcon(product.categoriaVista)} size={large ? 150 : 86} />
      <Logo />
    </div>
  );
}

function parseRoute(): Route {
  const hash = decodeURIComponent(window.location.hash);
  if (hash.startsWith("#producto/")) return { view: "detail", productId: hash.replace("#producto/", "") };
  if (hash.startsWith("#categoria/")) return { view: "category", category: hash.replace("#categoria/", "") };
  if (hash === "#catalogo") return { view: "catalog" };
  return { view: "home" };
}

function navigate(hash: string) {
  window.location.hash = hash;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function HomeView() {
  return (
    <>
      <section className="hero">
        <img src="/assets/cerdex-factory-hero" alt="Planta industrial y oficinas de Cerdex en Valencia" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <div className="eyebrow">Fabricación venezolana · Desde 1988</div>
          <h1>
            Herramientas que dejan
            <br />
            <strong>huella en cada proyecto.</strong>
          </h1>
          <p>CERDEX: Innovando tu espacio con cada trazo.</p>
          <AppButton className="primary-cta" onClick={() => navigate("#catalogo")}>
            Explorar catálogo <Icon name="arrow" size={19} />
          </AppButton>
        </div>
        <div className="hero-stat">
          <strong>+144</strong>
          <span>PRODUCTOS PARA SU ELECCIÓN</span>
        </div>
      </section>

      <section className="home-intro" id="nosotros">
        <div className="home-logo-panel">
          <Logo />
        </div>
        <div>
          <span className="section-kicker">Hecho para durar</span>
          <h2>Calidad que se siente desde el primer trazo.</h2>
        </div>
        <p>
          Diseñamos accesorios de pintura y herramientas para profesionales que exigen precisión, resistencia y un
          acabado impecable. Nuestro catálogo ahora te permite explorar cada familia por separado.
        </p>
      </section>

      <section className="home-catalog-cta">
        <div>
          <span>Catálogo Cerdex</span>
          <h2>Encuentra la herramienta exacta para tu próximo proyecto.</h2>
        </div>
        <AppButton onClick={() => navigate("#catalogo")}>
          Ver todas las categorías <Icon name="arrow" />
        </AppButton>
      </section>

      <ContactSection />
    </>
  );
}

function CatalogView() {
  return (
    <section className="page catalog-home">
      <div className="page-heading">
        <span className="section-kicker">Catálogo de productos</span>
        <h1>¿Qué estás buscando?</h1>
        <p>Selecciona una categoría para abrir su catálogo completo en una vista dedicada.</p>
      </div>
      <div className="catalog-category-grid">
        {categories.map((item, index) => (
          <AppButton className="catalog-category-card" key={item.key} onClick={() => navigate(`#categoria/${item.key}`)}>
            <span className="catalog-card-number">0{index + 1}</span>
            <span className="catalog-card-icon">
              <Icon name={item.icon} size={46} />
            </span>
            <span className="catalog-card-title">{item.name}</span>
            <span className="catalog-card-copy">{item.copy}</span>
            <span className="catalog-card-link">
              Explorar categoría <Icon name="arrow" size={17} />
            </span>
          </AppButton>
        ))}
      </div>
    </section>
  );
}

function CategoryView({
  category,
  onOpenProduct,
  onAdd,
}: {
  category: string;
  onOpenProduct: (id: string) => void;
  onAdd: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [line, setLine] = useState("Todas");
  const categoryData = categories.find((item) => item.key === category) ?? categories[0];
  const categoryProducts = catalogProducts.filter((product) => product.categoriaVista === categoryData.key);
  const availableLines = ["Todas", ...Array.from(new Set(categoryProducts.map((product) => product.line))).sort()];
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return categoryProducts.filter(
      (product) =>
        (line === "Todas" || product.line === line) &&
        (!query ||
          `${product.descripcion} ${product.material} ${product.line} ${product.tipo}`.toLowerCase().includes(query)),
    );
  }, [categoryProducts, line, search]);

  return (
    <section className="page category-page">
      <div className="category-hero">
        <AppButton className="back-button" onClick={() => navigate("#catalogo")}>
          <Icon name="back" size={18} /> Todas las categorías
        </AppButton>
        <div className="category-hero-main">
          <span className="category-hero-icon">
            <Icon name={categoryData.icon} size={48} />
          </span>
          <div>
            <span>Catálogo Cerdex</span>
            <h1>{categoryData.name}</h1>
            <p>{categoryData.copy}</p>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-label">
          <Icon name="filter" size={18} />
          <span>Filtrar catálogo</span>
        </div>
        <label className="select-field">
          <span>Línea</span>
          <select value={line} onChange={(event) => setLine(event.target.value)}>
            {availableLines.map((item, index) => (
              <option key={`${categoryData.key}-line-${item || "sin-linea"}-${index}`}>{item}</option>
            ))}
          </select>
        </label>
        <label className="catalog-search">
          <Icon name="search" size={20} />
          <input
            aria-label="Buscar productos"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre, código o tipo..."
          />
        </label>
        <span className="results-count">{visible.length} resultados</span>
      </div>

      <div className="listing-grid">
        {visible.map((product, index) => (
          <article
            className="listing-card"
            key={`${categoryData.key}-${product.material}-${product.codigoLinea}-${index}`}
          >
            <AppButton className="product-open-area" onClick={() => onOpenProduct(product.material)}>
              <div className="listing-media">
                <ProductVisual product={product} />
                <span>{product.material}</span>
              </div>
              <div className="listing-copy">
                <span className="line-tag">
                  Línea {product.line}
                  {product.calidad ? ` · ${product.calidad}` : ""}
                </span>
                <h2>{product.descripcion}</h2>
                <div className="listing-specs">
                  {product.uso && <span>{product.uso}</span>}
                  {product.superficie && <span>{product.superficie}</span>}
                </div>
                <span className="view-detail">
                  Ver información completa <Icon name="chevron" size={16} />
                </span>
              </div>
            </AppButton>
            <div className="listing-footer">
              <div>
                <small>Precio</small>
                <strong>{product.precioVenta || "Consultar"}</strong>
              </div>
              <AppButton onClick={() => onAdd(product.material)}>
                <Icon name="cart" size={17} /> Agregar al carrito
              </AppButton>
            </div>
          </article>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="empty-state">
          <Icon name="search" size={38} />
          <strong>No encontramos productos</strong>
          <span>Cambia el filtro o prueba con otra búsqueda.</span>
        </div>
      )}
    </section>
  );
}

const fieldLabels: Array<[keyof CatalogProduct, string]> = [
  ["material", "Material"],
  ["marca", "Marca"],
  ["linea", "Línea"],
  ["codigoLinea", "Código de línea"],
  ["prioridad", "Prioridad"],
  ["tipo", "Tipo"],
  ["descripcion", "Descripción"],
  ["uv", "U.V."],
  ["calidad", "Calidad"],
  ["categoria", "Categoría"],
  ["sugerencia", "Sugerencia"],
  ["uso", "Uso"],
  ["superficie", "Superficie"],
  ["detalles", "Detalles"],
  ["precioVenta", "Precio Venta"],
  ["precioMin", "Precio mínimo"],
  ["precioMax", "Precio máximo"],
  ["imagenColor", "Imagen color"],
  ["fichaTecnica", "Ficha técnica"],
];

function DetailView({ product, onAdd }: { product: CatalogProduct; onAdd: (id: string) => void }) {
  const categoryName = categories.find((item) => item.key === product.categoriaVista)?.name ?? product.categoriaVista;
  return (
    <section className="page detail-page">
      <div className="breadcrumbs">
        <AppButton onClick={() => navigate("#catalogo")}>Catálogo</AppButton>
        <Icon name="chevron" size={14} />
        <AppButton onClick={() => navigate(`#categoria/${product.categoriaVista}`)}>{categoryName}</AppButton>
        <Icon name="chevron" size={14} />
        <span>{product.material}</span>
      </div>

      <div className="detail-layout">
        <div className="detail-media">
          <ProductVisual product={product} large />
          <span className="detail-code">{product.material}</span>
        </div>
        <div className="detail-summary">
          <span className="line-tag">
            Línea {product.line}
            {product.calidad ? ` · ${product.calidad}` : ""}
          </span>
          <h1>{product.descripcion}</h1>
          <p className="detail-intro">{product.detalles || "Consulta todos los datos técnicos de este producto Cerdex."}</p>
          <div className="detail-highlights">
            <div>
              <small>Uso recomendado</small>
              <strong>{product.uso || "No indicado"}</strong>
            </div>
            <div>
              <small>Superficie</small>
              <strong>{product.superficie || "No indicada"}</strong>
            </div>
            <div>
              <small>Tipo</small>
              <strong>{product.tipo || "No indicado"}</strong>
            </div>
          </div>
          <div className="detail-buy">
            <div>
              <small>Precio de venta</small>
              <strong>{product.precioVenta || "Consultar"}</strong>
            </div>
            <AppButton onClick={() => onAdd(product.material)}>
              <Icon name="cart" size={20} /> Agregar al carrito
            </AppButton>
          </div>
          <span className="quote-note">El archivo Excel no especifica precios para este producto.</span>
        </div>
      </div>

      <div className="excel-detail">
        <div className="excel-detail-heading">
          <span>Ficha técnica · {product.material}</span>
          <h2>Información del producto</h2>
          <p>Todos los datos del registro original, organizados en una lista clara y fácil de consultar.</p>
        </div>
        <dl className="excel-fields">
          {fieldLabels.map(([field, label]) => (
            <div key={field}>
              <dt>{label}</dt>
              <dd>{product[field] || "No indicado"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const nextMessage = draft.trim();
    if (!nextMessage) return;
    setMessages((current) => [...current, nextMessage]);
    setDraft("");
  };

  return (
    <div className="chat-wrap">
      {open && (
        <section className="chat-card" aria-label="Chat con DEX">
          <div className="chat-header">
            <Mascot />
            <div>
              <strong>DEX</strong>
              <span>
                <i /> Asistente Cerdex en línea
              </span>
            </div>
            <AppButton className="chat-close" aria-label="Cerrar asistente" onClick={() => setOpen(false)}>
              <Icon name="close" size={17} />
            </AppButton>
          </div>
          <div className="chat-messages">
            <span className="chat-time">Hoy</span>
            <div className="message-row dex-message">
              <Mascot />
              <div>
                <p>¡Hola! Soy DEX, tu asistente virtual de Cerdex.</p>
                <p>Cuéntame qué proyecto tienes y te ayudo a encontrar el producto indicado.</p>
                <small>Ahora</small>
              </div>
            </div>
            {messages.map((message, index) => (
              <div className="message-row user-message" key={`${message}-${index}`}>
                <div>
                  <p>{message}</p>
                  <small>Ahora</small>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-suggestions">
            <AppButton onClick={() => setDraft("Necesito una brocha")}>Necesito una brocha</AppButton>
            <AppButton onClick={() => setDraft("Quiero preparar una superficie")}>Preparar superficie</AppButton>
          </div>
          <form className="chat-composer" onSubmit={sendMessage}>
            <input
              aria-label="Escribe tu mensaje"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Escribe tu mensaje..."
            />
            <AppButton type="submit" aria-label="Enviar mensaje">
              <Icon name="arrow" size={18} />
            </AppButton>
          </form>
          <span className="chat-powered">Asistente virtual Cerdex</span>
        </section>
      )}
      <AppButton className="chat-bubble" aria-label="Abrir asistente DEX" onClick={() => setOpen((current) => !current)}>
        <Mascot />
        <span className="online-dot" />
      </AppButton>
    </div>
  );
}

function ContactSection() {
  const [subscribed, setSubscribed] = useState(false);
  return (
    <section className="connect" id="contacto">
      <div className="connect-main">
        <span className="section-kicker light">Mantente conectado</span>
        <h2>Cerdex Connect</h2>
        <p>Suscríbete y recibe novedades, lanzamientos y consejos para llevar cada proyecto más lejos.</p>
        <form
          className="subscribe"
          onSubmit={(event) => {
            event.preventDefault();
            setSubscribed(true);
          }}
        >
          <input type="email" required aria-label="Correo electrónico" placeholder="Ingresa tu correo electrónico" />
          <AppButton type="submit">{subscribed ? "¡Suscrito!" : "Suscribirse"}</AppButton>
        </form>
      </div>
      <div className="contact-card">
        <div className="contact-item">
          <span>
            <Icon name="mail" />
          </span>
          <div>
            <small>Escríbenos</small>
            <a href="mailto:ventas@cerdex.com">ventas@cerdex.com</a>
            <a href="mailto:info@cerdex.com">info@cerdex.com</a>
          </div>
        </div>
        <div className="contact-item">
          <span>
            <Icon name="map" />
          </span>
          <div>
            <small>Visítanos</small>
            <p>Avenida Central, Parque Industrial, Valencia, Carabobo, Venezuela.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    const updateRoute = () => setRoute(parseRoute());
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  const cartProducts = Object.entries(cart)
    .map(([id, quantity]) => ({ product: catalogProducts.find((item) => item.material === id), quantity }))
    .filter((item): item is { product: CatalogProduct; quantity: number } => Boolean(item.product));
  const cartCount = cartProducts.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (id: string) => {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    setCartOpen(true);
  };

  const changeQuantity = (id: string, change: number) => {
    setCart((current) => {
      const next = (current[id] || 0) + change;
      if (next <= 0) {
        const copy = { ...current };
        delete copy[id];
        return copy;
      }
      return { ...current, [id]: next };
    });
  };

  const selectedProduct =
    route.view === "detail" ? catalogProducts.find((product) => product.material === route.productId) : undefined;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="nav-wrap">
          <AppButton className="brand-link" onClick={() => navigate("#inicio")} aria-label="Ir al inicio">
            <Logo />
          </AppButton>
          <nav className={mobileOpen ? "nav-links nav-open" : "nav-links"} aria-label="Navegación principal">
            <AppButton
              className={route.view === "home" ? "active" : ""}
              onClick={() => {
                navigate("#inicio");
                setMobileOpen(false);
              }}
            >
              Inicio
            </AppButton>
            <AppButton
              className={route.view !== "home" ? "active" : ""}
              onClick={() => {
                navigate("#catalogo");
                setMobileOpen(false);
              }}
            >
              Catálogo
            </AppButton>
            <AppButton
              onClick={() => {
                navigate("#inicio");
                setMobileOpen(false);
                setTimeout(() => document.querySelector("#nosotros")?.scrollIntoView({ behavior: "smooth" }), 50);
              }}
            >
              Quiénes Somos
            </AppButton>
            <AppButton
              onClick={() => {
                navigate("#inicio");
                setMobileOpen(false);
                setTimeout(() => document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" }), 50);
              }}
            >
              Contacto
            </AppButton>
          </nav>
          <div className="nav-actions">
            <AppButton className="cart-trigger" aria-label="Abrir carrito" onClick={() => setCartOpen(true)}>
              <Icon name="cart" size={23} />
              <span className="cart-count">{cartCount}</span>
            </AppButton>
            <AppButton className="mobile-trigger" aria-label="Abrir menú" onClick={() => setMobileOpen((open) => !open)}>
              <Icon name={mobileOpen ? "close" : "menu"} size={24} />
            </AppButton>
          </div>
        </div>
      </header>

      <main>
        {route.view === "home" && <HomeView />}
        {route.view === "catalog" && <CatalogView />}
        {route.view === "category" && (
          <CategoryView
            category={route.category}
            onOpenProduct={(id) => navigate(`#producto/${id}`)}
            onAdd={addToCart}
          />
        )}
        {route.view === "detail" && selectedProduct && <DetailView product={selectedProduct} onAdd={addToCart} />}
        {route.view === "detail" && !selectedProduct && (
          <section className="page empty-state">
            <strong>Producto no encontrado</strong>
            <AppButton onClick={() => navigate("#catalogo")}>Volver al catálogo</AppButton>
          </section>
        )}
      </main>

      <footer>
        <div className="footer-inner">
          <Logo />
          <p>Accesorios y herramientas para construir mejores resultados.</p>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Cerdex. Todos los derechos reservados.</span>
          <span>Fabricado con orgullo en Venezuela</span>
        </div>
      </footer>

      <div className={`drawer-backdrop ${cartOpen ? "visible" : ""}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? "open" : ""}`} aria-hidden={!cartOpen}>
        <div className="drawer-head">
          <div>
            <span>Tu selección</span>
            <h2>Carrito de Compras</h2>
          </div>
          <AppButton aria-label="Cerrar carrito" onClick={() => setCartOpen(false)}>
            <Icon name="close" size={22} />
          </AppButton>
        </div>
        <div className="cart-items">
          {cartProducts.map(({ product, quantity }) => (
            <div className="cart-item" key={product.material}>
              <div className="cart-thumb">
                <ProductVisual product={product} />
              </div>
              <div className="cart-info">
                <small>{product.line}</small>
                <strong>{product.descripcion}</strong>
                <span>{product.material}</span>
                <div className="quantity">
                  <AppButton aria-label="Restar unidad" onClick={() => changeQuantity(product.material, -1)}>
                    <Icon name="minus" size={14} />
                  </AppButton>
                  <span>{quantity}</span>
                  <AppButton aria-label="Sumar unidad" onClick={() => changeQuantity(product.material, 1)}>
                    <Icon name="plus" size={14} />
                  </AppButton>
                  <AppButton
                    className="delete"
                    aria-label="Eliminar"
                    onClick={() => changeQuantity(product.material, -quantity)}
                  >
                    <Icon name="trash" size={16} />
                  </AppButton>
                </div>
              </div>
            </div>
          ))}
          {!cartProducts.length && <div className="cart-empty">Tu carrito está vacío.</div>}
        </div>
        <div className="cart-summary">
          <div className="total-row">
            <span>Total</span>
            <strong>Cotización</strong>
          </div>
          <AppButton className="checkout">
            Solicitar Cotización <Icon name="arrow" size={18} />
          </AppButton>
          <small>Un asesor confirmará disponibilidad y precios vigentes.</small>
        </div>
      </aside>

      <ChatWidget />
    </div>
  );
}
