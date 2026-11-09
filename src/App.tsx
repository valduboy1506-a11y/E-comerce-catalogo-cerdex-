import { useEffect, useMemo, useRef, useState } from "react";
import { catalogProducts, type CatalogProduct } from "./products";
import {
  catalogGroups,
  findCatalogGroup,
  type CatalogGroup,
  type ProductVariant,
  imageByProduct,
} from "./catalogData";

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
      <img
        src="/assets/dex-avatar"
        alt="Dex"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </span>
  );
}

let processedLogoCanvas: HTMLCanvasElement | null = null;
let isProcessingLogo = false;
const logoListeners: (() => void)[] = [];

function Logo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const target = canvasRef.current;
    if (!target) return;

    if (processedLogoCanvas) {
      target.width = processedLogoCanvas.width;
      target.height = processedLogoCanvas.height;
      const ctx = target.getContext("2d");
      if (ctx) ctx.drawImage(processedLogoCanvas, 0, 0);
      return;
    }

    const onProcessed = () => {
      if (!processedLogoCanvas || !canvasRef.current) return;
      canvasRef.current.width = processedLogoCanvas.width;
      canvasRef.current.height = processedLogoCanvas.height;
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) ctx.drawImage(processedLogoCanvas, 0, 0);
    };

    logoListeners.push(onProcessed);

    if (isProcessingLogo) return;
    isProcessingLogo = true;

    const source = new Image();
    source.src = "/assets/cerdex-logo";
    source.onload = () => {
      const helper = document.createElement("canvas");
      helper.width = source.naturalWidth;
      helper.height = source.naturalHeight;
      const ctx = helper.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(source, 0, 0);
      const { data, width: imgW, height: imgH } = ctx.getImageData(0, 0, helper.width, helper.height);
      let top = imgH;
      let left = imgW;
      let right = 0;
      let bottom = 0;

      for (let y = 0; y < imgH; y += 1) {
        for (let x = 0; x < imgW; x += 1) {
          const index = (y * imgW + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];
          const isWhite = r > 242 && g > 242 && b > 242;
          if (a > 20 && !isWhite) {
            top = Math.min(top, y);
            left = Math.min(left, x);
            right = Math.max(right, x);
            bottom = Math.max(bottom, y);
          }
        }
      }
      const padding = 3;
      const width = right - left + 1 + padding * 2;
      const height = bottom - top + 1 + padding * 2;

      const cachedCanvas = document.createElement("canvas");
      cachedCanvas.width = width;
      cachedCanvas.height = height;
      cachedCanvas.getContext("2d")?.drawImage(
        source,
        left,
        top,
        width - padding * 2,
        height - padding * 2,
        padding,
        padding,
        width - padding * 2,
        height - padding * 2
      );

      processedLogoCanvas = cachedCanvas;
      logoListeners.forEach((cb) => cb());
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

function ProductVisual({
  imageSrc,
  fallbackCategory = "tool",
  alt = "Cerdex",
  large = false,
}: {
  imageSrc?: string;
  fallbackCategory?: string;
  alt?: string;
  large?: boolean;
}) {
  if (imageSrc) {
    const className = [large ? "detail-photo" : "", "family-product-image"].filter(Boolean).join(" ");
    return <img className={className} src={imageSrc} alt={alt} />;
  }
  return (
    <div className={`product-illustration ${large ? "visual-large" : ""}`}>
      <Icon name={categoryIcon(fallbackCategory)} size={large ? 150 : 86} />
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
  window.scrollTo(0, 0);
}

function CategorySelectionView() {
  return (
    <section className="page category-selection-page">
      <div className="selection-brand">
        <Logo />
        <span className="section-kicker">Catálogo Cerdex</span>
      </div>
      <div className="page-heading">
        <h1>¿Qué producto estás buscando?</h1>
        <p>Selecciona una categoría para abrir el catálogo completo con el filtro correspondiente aplicado.</p>
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
              Ver productos <Icon name="arrow" size={17} />
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
  onAdd: (id: string, quantity?: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [line, setLine] = useState("Todas");
  const [selectedCategory, setSelectedCategory] = useState(
    categories.some((item) => item.key === category) ? category : "Todas"
  );

  useEffect(() => {
    setSelectedCategory(categories.some((item) => item.key === category) ? category : "Todas");
    setLine("Todas");
  }, [category]);

  const groupsForCategory = useMemo(() => {
    return selectedCategory === "Todas"
      ? catalogGroups
      : catalogGroups.filter((g) => g.categoriaVista === selectedCategory);
  }, [selectedCategory]);

  const availableLines = useMemo(() => {
    const lines = Array.from(new Set(groupsForCategory.map((g) => g.linea))).filter(Boolean).sort();
    return ["Todas", ...lines];
  }, [groupsForCategory]);

  const visibleGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    return catalogGroups.filter((g) => {
      if (!query) return true;
      const variantKeywords = g.variants.map((v) => `${v.descripcion} ${v.optionLabel}`).join(" ");
      const fullText = `${g.title} ${g.linea} ${g.tipo} ${g.uso} ${g.superficie} ${variantKeywords}`.toLowerCase();
      return fullText.includes(query);
    });
  }, [search]);

  const prioritized = visibleGroups.filter(
    (g) =>
      (selectedCategory === "Todas" || g.categoriaVista === selectedCategory) &&
      (line === "Todas" || g.linea === line)
  );

  const prioritizedIds = new Set(prioritized.map((g) => g.id));
  const remaining = visibleGroups.filter((g) => !prioritizedIds.has(g.id));

  const renderGroupCards = (groups: CatalogGroup[], keyPrefix: string) => {
    return (
      <div className="listing-grid">
        {groups.map((group, index) => {
          return (
            <article
              className={`listing-card ${
                selectedCategory !== "Todas" && group.categoriaVista === selectedCategory ? "prioritized-card" : ""
              }`}
              key={`${keyPrefix}-${group.id}-${index}`}
            >
              <AppButton className="product-open-area" onClick={() => onOpenProduct(group.id)}>
                <div className="listing-media">
                  <ProductVisual
                    imageSrc={group.mainImage}
                    fallbackCategory={group.categoriaVista}
                    alt={group.title}
                  />
                </div>
                <div className="listing-copy">
                  <span className="line-tag">
                    Línea {group.linea}
                    {group.calidad ? ` · ${group.calidad}` : ""}
                  </span>
                  <h2>{group.title}</h2>
                  <div className="listing-specs">
                    {group.uso && <span>{group.uso}</span>}
                    {group.superficie && <span>{group.superficie}</span>}
                  </div>
                  <span className="view-detail">
                    Ver información completa <Icon name="chevron" size={16} />
                  </span>
                </div>
              </AppButton>
              <div className="listing-footer">
                <div>
                  <small>Precio</small>
                  <strong>{group.precioVenta || "Consultar"}</strong>
                </div>
                <AppButton
                  onClick={() =>
                    group.isGroup ? onOpenProduct(group.id) : onAdd(group.variants[0].material)
                  }
                >
                  <Icon name={group.isGroup ? "arrow" : "cart"} size={17} />
                  {group.isGroup
                    ? group.optionType === "Medida"
                      ? "Ver tamaños"
                      : group.optionType === "Color"
                      ? "Ver colores"
                      : group.optionType === "Grano"
                      ? "Ver granos"
                      : "Ver opciones"
                    : "Añadir a cotización"}
                </AppButton>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <section className="page category-page">
      <div className="catalog-nav-header">
        <AppButton className="back-to-categories-btn" onClick={() => navigate("#")}>
          <Icon name="back" size={18} />
          <span>Volver a Categorías</span>
        </AppButton>
        {selectedCategory !== "Todas" && (
          <div className="current-view-badge">
            Categoría: <strong>{categories.find((c) => c.key === selectedCategory)?.name || selectedCategory}</strong>
          </div>
        )}
      </div>

      <div className="catalog-brand-row">
        <Logo />
        <div>
          <span className="section-kicker">Catálogo de productos</span>
          <h1>Catálogo de Productos</h1>
          <p>
            Filtra por categoría o línea y encuentra rápidamente la herramienta adecuada para tu proyecto.
          </p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-label">
          <Icon name="filter" size={18} />
          <span>Filtrar catálogo</span>
        </div>
        <label className="select-field">
          <span>Categoría prioritaria</span>
          <select
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setLine("Todas");
            }}
          >
            <option value="Todas">Todas</option>
            {categories.map((item) => (
              <option value={item.key} key={item.key}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="select-field">
          <span>Línea</span>
          <select value={line} onChange={(event) => setLine(event.target.value)}>
            {availableLines.map((item, index) => (
              <option key={`${selectedCategory}-line-${item || "sin-linea"}-${index}`}>{item}</option>
            ))}
          </select>
        </label>
        <label className="catalog-search">
          <Icon name="search" size={20} />
          <input
            aria-label="Buscar productos"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre, línea o tipo..."
          />
        </label>
      </div>

      <div className="catalog-results-heading">
        <div>
          <span>Mostrando primero</span>
          <h2>
            {selectedCategory === "Todas"
              ? "Todos los productos"
              : categories.find((item) => item.key === selectedCategory)?.name}
          </h2>
        </div>
        <strong>{prioritized.length} productos</strong>
      </div>
      {renderGroupCards(prioritized, "prioritized")}

      {remaining.length > 0 && (selectedCategory !== "Todas" || line !== "Todas") && (
        <div className="remaining-products">
          <div className="catalog-results-heading">
            <div>
              <span>Continúa explorando</span>
              <h2>Resto del catálogo</h2>
            </div>
            <strong>{remaining.length} productos</strong>
          </div>
          {renderGroupCards(remaining, "remaining")}
        </div>
      )}

      {visibleGroups.length === 0 && (
        <div className="empty-state">
          <Icon name="search" size={38} />
          <strong>No encontramos productos</strong>
          <span>Cambia el filtro o prueba con otra búsqueda.</span>
        </div>
      )}
    </section>
  );
}

function ProductInformationCards({ product }: { product: CatalogProduct }) {
  const classificationFields: [string, string][] = [
    ["Marca", product.marca],
    ["Línea", product.linea],
    ["Categoría", product.categoria],
    ["Tipo", product.tipo],
    ["Calidad", product.calidad],
    ["Unidad de empaque", product.uv ? `${product.uv} unidad(es)` : ""],
  ].filter(([, val]) => Boolean(val && val.trim())) as [string, string][];

  const applicationFields: [string, string][] = [
    ["Uso recomendado", product.uso],
    ["Superficie", product.superficie],
    ["Sugerencia de aplicación", product.sugerencia],
  ].filter(([, val]) => Boolean(val && val.trim())) as [string, string][];

  const descriptionFields: [string, string][] = [
    ["Producto", product.descripcion],
    ["Detalles", product.detalles],
  ].filter(([, val]) => Boolean(val && val.trim())) as [string, string][];

  const informationGroups = [
    {
      title: "Clasificación",
      icon: "filter" as IconName,
      fields: classificationFields,
    },
    {
      title: "Aplicación",
      icon: "brush" as IconName,
      fields: applicationFields,
    },
    {
      title: "Descripción",
      icon: "tool" as IconName,
      fields: descriptionFields,
    },
  ].filter((group) => group.fields.length > 0);

  return (
    <div className="product-info-groups">
      {informationGroups.map((group) => (
        <article className="product-info-card" key={group.title}>
          <span className="info-card-icon">
            <Icon name={group.icon} size={25} />
          </span>
          <h3>{group.title}</h3>
          <dl>
            {group.fields.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}

function GroupedProductDetailView({
  group,
  initialVariantId = null,
  onAdd,
}: {
  group: CatalogGroup;
  initialVariantId?: string | null;
  onAdd: (id: string, quantity?: number) => void;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(() => {
    if (initialVariantId) return initialVariantId;
    if (!group.isGroup && group.variants.length === 1) {
      return group.variants[0].material;
    }
    return null;
  });

  const selectedVariant = selectedVariantId
    ? group.variants.find((v) => v.material === selectedVariantId)
    : (!group.isGroup && group.variants.length === 1 ? group.variants[0] : undefined);

  const [selectedImage, setSelectedImage] = useState<string>(() => {
    if (selectedVariant?.optionImage) return selectedVariant.optionImage;
    return group.mainImage || "";
  });

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (initialVariantId) {
      setSelectedVariantId(initialVariantId);
      const v = group.variants.find((item) => item.material === initialVariantId);
      if (v?.optionImage) setSelectedImage(v.optionImage);
      else setSelectedImage(group.mainImage || "");
    } else if (!group.isGroup && group.variants.length === 1) {
      setSelectedVariantId(group.variants[0].material);
      if (group.variants[0].optionImage) setSelectedImage(group.variants[0].optionImage);
      else setSelectedImage(group.mainImage || "");
    } else {
      setSelectedVariantId(null);
      setSelectedImage(group.mainImage || "");
    }
    setQuantity(1);
  }, [group, initialVariantId]);

  const displayProduct = selectedVariant ?? group.baseProduct;
  const categoryName = categories.find((c) => c.key === group.categoriaVista)?.name || group.categoriaVista;

  const optionPromptText =
    group.optionType === "Medida"
      ? "Selecciona una medida"
      : group.optionType === "Color"
      ? "Selecciona un color"
      : group.optionType === "Grano"
      ? "Selecciona un grano"
      : "Selecciona una opción";

  return (
    <section className="page detail-page picasso-detail-page">
      <div className="breadcrumbs">
        <AppButton onClick={() => navigate("#catalogo")}>Catálogo</AppButton>
        <Icon name="chevron" size={14} />
        <AppButton onClick={() => navigate(`#categoria/${group.categoriaVista}`)}>{categoryName}</AppButton>
        <Icon name="chevron" size={14} />
        <span>{group.title}</span>
      </div>

      <div className="detail-layout">
        <div className="variant-gallery">
          <div className="detail-media picasso-main-media">
            <ProductVisual
              imageSrc={selectedImage}
              fallbackCategory={group.categoriaVista}
              alt={selectedVariant ? selectedVariant.descripcion : group.title}
              large
            />
          </div>

          {group.isGroup && (
            <div className="variant-thumbnails" aria-label={`Seleccionar ${group.optionType || "opción"}`}>
              {group.variants.map((variant) => {
                const isSelected = selectedVariantId === variant.material;
                const vImg = variant.optionImage || group.mainImage;
                return (
                  <AppButton
                    className={`variant-option-btn ${isSelected ? "active" : ""}`}
                    key={variant.material}
                    onClick={() => {
                      setSelectedVariantId(variant.material);
                      if (variant.optionImage) setSelectedImage(variant.optionImage);
                      else if (group.mainImage) setSelectedImage(group.mainImage);
                      setQuantity(1);
                    }}
                    aria-label={`Seleccionar ${variant.optionLabel}`}
                  >
                    {vImg ? (
                      <img src={vImg} alt={variant.optionLabel} />
                    ) : (
                      <div className="variant-placeholder-icon">
                        <Icon name={categoryIcon(group.categoriaVista)} size={24} />
                      </div>
                    )}
                    <span>{variant.optionLabel}</span>
                  </AppButton>
                );
              })}
            </div>
          )}
        </div>

        <div className="detail-summary">
          <span className="line-tag">
            Línea {group.linea}
            {group.calidad ? ` · ${group.calidad}` : ""}
          </span>
          <h1>
            {selectedVariant
              ? group.optionType === "Medida" && !group.title.includes(selectedVariant.optionLabel)
                ? `${group.title} ${selectedVariant.optionLabel}`
                : `${group.title} (${selectedVariant.optionLabel})`
              : group.title}
          </h1>
          <p className="detail-intro">
            {displayProduct.detalles || "Herramienta Cerdex para acabados precisos, alta durabilidad y máximo rendimiento."}
          </p>

          {group.isGroup && (
            <div className="selected-variant">
              <span>{group.optionType || "Opción"} seleccionada</span>
              <strong>
                {selectedVariant ? selectedVariant.optionLabel : optionPromptText}
              </strong>
            </div>
          )}

          <div className="features-heading">
            <span>Características destacadas</span>
          </div>
          <ul className="characteristics-list">
            <li>
              <span>
                <Icon name="brush" size={19} />
              </span>
              <div>
                <strong>Uso recomendado</strong>
                <p>{displayProduct.uso || "Consulta con nuestro equipo técnico"}</p>
              </div>
            </li>
            <li>
              <span>
                <Icon name="surface" size={19} />
              </span>
              <div>
                <strong>Superficie</strong>
                <p>{displayProduct.superficie || "Maderas, metales y superficies en general"}</p>
              </div>
            </li>
            <li>
              <span>
                <Icon name="tool" size={19} />
              </span>
              <div>
                <strong>Tipo de producto</strong>
                <p>{group.tipo || displayProduct.tipo || "Producto Cerdex"}</p>
              </div>
            </li>
          </ul>

          <div className="variant-purchase">
            <div className="variant-quantity">
              <span>Cantidad</span>
              <div>
                <AppButton
                  aria-label="Restar cantidad"
                  disabled={group.isGroup && !selectedVariant}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                >
                  <Icon name="minus" size={16} />
                </AppButton>
                <strong>{quantity}</strong>
                <AppButton
                  aria-label="Sumar cantidad"
                  disabled={group.isGroup && !selectedVariant}
                  onClick={() => setQuantity((current) => current + 1)}
                >
                  <Icon name="plus" size={16} />
                </AppButton>
              </div>
            </div>

            <AppButton
              className="variant-add-button"
              disabled={group.isGroup && !selectedVariant}
              onClick={() => {
                if (selectedVariant) {
                  onAdd(selectedVariant.material, quantity);
                }
              }}
            >
              <Icon name="cart" size={20} />
              {selectedVariant ? "Añadir a cotización" : "Selecciona una opción"}
            </AppButton>
          </div>
        </div>
      </div>

      <div className="excel-detail">
        <div className="excel-detail-heading">
          <h2>Información del producto</h2>
          <p className="product-info-description">
            {group.isGroup
              ? `La información técnica se actualiza automáticamente al elegir la ${group.optionType.toLowerCase() || "opción"} deseada.`
              : "Todos los datos y especificaciones organizados para una consulta rápida y clara."}
          </p>
        </div>
        <ProductInformationCards product={displayProduct} />
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
            <div>
              <strong>DEX Asistente Cerdex</strong>
              <span>¿En qué puedo ayudarte hoy?</span>
            </div>
            <AppButton aria-label="Cerrar chat" onClick={() => setOpen(false)}>
              <Icon name="close" size={18} />
            </AppButton>
          </div>
          <div className="chat-messages">
            <div className="chat-bubble-system">
              ¡Hola! Soy Dex. Cuéntame qué superficie vas a pintar o qué proyecto tienes en mente y te recomendaré la
              herramienta Cerdex perfecta.
            </div>
            {messages.map((message, index) => (
              <div className="chat-bubble-user" key={`${message}-${index}`}>
                {message}
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
        <h2>Mantente conectado</h2>
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
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quote, setQuote] = useState<Record<string, number>>({});

  useEffect(() => {
    const updateRoute = () => setRoute(parseRoute());
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  const quoteProducts = Object.entries(quote)
    .map(([id, quantity]) => ({ product: catalogProducts.find((item) => item.material === id), quantity }))
    .filter((item): item is { product: CatalogProduct; quantity: number } => Boolean(item.product));
  const quoteCount = quoteProducts.reduce((total, item) => total + item.quantity, 0);

  const addToQuote = (id: string, quantity = 1) => {
    setQuote((current) => ({ ...current, [id]: (current[id] || 0) + quantity }));
    setQuoteOpen(true);
  };

  const changeQuantity = (id: string, change: number) => {
    setQuote((current) => {
      const next = (current[id] || 0) + change;
      if (next <= 0) {
        const copy = { ...current };
        delete copy[id];
        return copy;
      }
      return { ...current, [id]: next };
    });
  };

  // Resolve group for detail view
  const activeProductId = route.view === "detail" ? route.productId : null;
  const activeGroup = activeProductId ? findCatalogGroup(activeProductId) : undefined;
  const initialVariantId =
    activeGroup && activeProductId && activeGroup.variants.some((v) => v.material === activeProductId)
      ? activeProductId
      : null;

  return (
    <div className="app-shell">
      <main>
        {route.view === "home" && <CategorySelectionView />}
        {route.view === "catalog" && (
          <CategoryView
            category="Todas"
            onOpenProduct={(id) => navigate(`#producto/${id}`)}
            onAdd={addToQuote}
          />
        )}
        {route.view === "category" && (
          <CategoryView
            category={route.category}
            onOpenProduct={(id) => navigate(`#producto/${id}`)}
            onAdd={addToQuote}
          />
        )}
        {route.view === "detail" && activeGroup && (
          <GroupedProductDetailView
            group={activeGroup}
            initialVariantId={initialVariantId}
            onAdd={addToQuote}
          />
        )}
        {route.view === "detail" && !activeGroup && (
          <section className="page empty-state">
            <strong>Producto no encontrado</strong>
            <AppButton onClick={() => navigate("#catalogo")}>Volver al catálogo</AppButton>
          </section>
        )}
      </main>

      <ContactSection />

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

      <AppButton className="quote-fab" onClick={() => setQuoteOpen(true)}>
        <Icon name="cart" size={19} />
        <span>Mi cotización</span>
        <strong>{quoteCount}</strong>
      </AppButton>

      <div className={`drawer-backdrop ${quoteOpen ? "visible" : ""}`} onClick={() => setQuoteOpen(false)} />
      <aside className={`cart-drawer ${quoteOpen ? "open" : ""}`} aria-hidden={!quoteOpen}>
        <div className="drawer-head">
          <div>
            <span>Tu selección</span>
            <h2>Mi cotización</h2>
          </div>
          <AppButton aria-label="Cerrar cotización" onClick={() => setQuoteOpen(false)}>
            <Icon name="close" size={22} />
          </AppButton>
        </div>
        <div className="cart-items">
          {quoteProducts.map(({ product, quantity }) => {
            const img = imageByProduct[product.material] || imageByProduct[product.codigoLinea];
            return (
              <div className="cart-item" key={product.material}>
                <div className="cart-thumb">
                  {img ? (
                    <img src={img} alt={product.descripcion} style={{ width: "100%", height: "100%", objectFit: "contain", background: "#fff" }} />
                  ) : (
                    <ProductVisual fallbackCategory={product.categoriaVista} alt={product.descripcion} />
                  )}
                </div>
                <div className="cart-info">
                  <small>{product.linea}</small>
                  <strong>{product.descripcion}</strong>
                  <div className="quantity">
                    <AppButton aria-label="Restar unidad" onClick={() => changeQuantity(product.material, -1)}>
                      <Icon name="minus" size={14} />
                    </AppButton>
                    <span>{quantity}</span>
                    <AppButton aria-label="Sumar unidad" onClick={() => changeQuantity(product.material, 1)}>
                      <Icon name="plus" size={14} />
                    </AppButton>
                    <AppButton
                      className="trash-btn"
                      aria-label="Eliminar producto"
                      onClick={() => changeQuantity(product.material, -quantity)}
                    >
                      <Icon name="trash" size={14} />
                    </AppButton>
                  </div>
                </div>
              </div>
            );
          })}
          {quoteProducts.length === 0 && (
            <div className="empty-cart">
              <Icon name="cart" size={36} />
              <span>Tu cotización está vacía</span>
              <small>Explora el catálogo y añade los productos que necesitas cotizar.</small>
            </div>
          )}
        </div>
        {quoteProducts.length > 0 && (
          <div className="cart-footer">
            <AppButton
              className="primary-cta checkout-btn"
              onClick={() => {
                const productList = quoteProducts
                  .map(({ product, quantity }) => `• ${product.descripcion} (Cantidad: ${quantity})`)
                  .join("%0A");
                const message = `Hola Cerdex, deseo solicitar una cotización para los siguientes productos:%0A${productList}`;
                window.open(`https://wa.me/?text=${message}`, "_blank");
              }}
            >
              Solicitar Cotización por WhatsApp <Icon name="arrow" size={16} />
            </AppButton>
          </div>
        )}
      </aside>

      <ChatWidget />
    </div>
  );
}
