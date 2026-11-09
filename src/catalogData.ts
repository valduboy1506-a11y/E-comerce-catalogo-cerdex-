import { catalogProducts, type CatalogProduct } from "./products";

export type ProductVariant = CatalogProduct & {
  optionLabel: string;
  optionImage?: string;
};

export type CatalogGroup = {
  id: string;
  isGroup: boolean;
  title: string;
  linea: string;
  calidad: string;
  categoria: string;
  categoriaVista: string;
  tipo: string;
  uso: string;
  superficie: string;
  detalles: string;
  precioVenta: string;
  optionType: "Medida" | "Color" | "Grano" | "Largo" | "Modelo" | "Combinación" | "Opción" | "";
  mainImage: string;
  baseProduct: CatalogProduct;
  variants: ProductVariant[];
};

export const imageByProduct: Record<string, string> = {
  // Herramientas & Sets de attachments
  "FX2-402157": "/assets/attachments/cdba3b5a-8ec1-45a5-bf5d-797d80bdfac6",
  "FX1-264274": "/assets/attachments/15a1826f-5a76-48e2-8a94-44b492a3679f",
  "group-sets-rodillo-bandeja": "/assets/attachments/15a1826f-5a76-48e2-8a94-44b492a3679f",

  // Brochas Picasso
  "group-brocha-picasso": "/assets/picasso/picasso-family",
  "picasso-group": "/assets/picasso/picasso-family",
  "FX2-128101": "/assets/picasso/picasso-1",
  "FX2-128200": "/assets/picasso/picasso-2",
  "FX2-128309": "/assets/picasso/picasso-3",
  "FX2-128408": "/assets/picasso/picasso-4",

  // Brochas Popular
  "group-brocha-popular": "/assets/popular/brocha-popular-1.jpg",
  "FX1-125100": "/assets/popular/brocha-popular-1.jpg",
  "FX1-125209": "/assets/popular/brocha-popular-2.jpg",
  "FX1-125308": "/assets/popular/brocha-popular-3.jpg",
  "FX1-125407": "/assets/popular/brocha-popular-4.jpg",

  // Brochas Rubí
  "group-brocha-rubi": "/assets/rubi/rubi-family.png",
  "FX1-143104": "/assets/rubi/rubi-family.png",
};

function getGroupMeta(p: CatalogProduct): {
  id: string;
  title: string;
  linea: string;
  categoria: string;
  categoriaVista: string;
  tipo: string;
  optionType: CatalogGroup["optionType"];
} {
  // 1. Brochas agrupadas por línea comercial
  if (p.categoriaVista === "Brocha") {
    const lineName = p.linea ? p.linea.trim().toUpperCase() : "GENERAL";
    let title = `BROCHA ${lineName}`;
    if (lineName === "RUBI") title = "BROCHA PROFESIONAL RUBÍ";
    if (lineName === "ZAFIRO") title = "BROCHA ZAFIRO RENDIDORA";

    return {
      id: `group-brocha-${lineName.toLowerCase()}`,
      title,
      linea: lineName,
      categoria: "Brocha",
      categoriaVista: "Brocha",
      tipo: "Brocha",
      optionType: "Medida",
    };
  }

  // 2. Esmaltes acrílicos en aerosol (Deco Spray)
  if (
    p.categoriaVista === "Esmalte acrilico en aerosol" ||
    (p.tipo && p.tipo.toLowerCase().includes("spray")) ||
    (p.descripcion && p.descripcion.toUpperCase().includes("DECO SPRAY"))
  ) {
    return {
      id: "group-deco-spray",
      title: "DECO SPRAY ESMALTE ACRÍLICO EN AEROSOL 225 ML",
      linea: "DECO SPRAY",
      categoria: "Esmalte acrilico en aerosol",
      categoriaVista: "Esmalte acrilico en aerosol",
      tipo: "Esmalte en aerosol",
      optionType: "Color",
    };
  }

  // 3. Preparación / Lijas de agua
  if (p.categoriaVista === "Preparación" && p.descripcion.toUpperCase().includes("LIJA DE AGUA")) {
    return {
      id: "group-lija-agua-idhea",
      title: "LIJA DE AGUA IDHEA",
      linea: "IDHEA",
      categoria: "Preparación",
      categoriaVista: "Preparación",
      tipo: "Lija de agua",
      optionType: "Grano",
    };
  }

  // 4. Fundas Thermo Fusion
  if (p.categoriaVista === "Fundas" && p.descripcion.toUpperCase().includes("THERMO FUSION")) {
    return {
      id: "group-fundas-thermo-fusion",
      title: "FUNDAS THERMO FUSION",
      linea: "Termofusión",
      categoria: "Fundas",
      categoriaVista: "Fundas",
      tipo: "Fundas para rodillo",
      optionType: "Medida",
    };
  }

  // 5. Herramientas: Extensiones telescópicas
  if (p.descripcion.toUpperCase().includes("EXTENSION TELESCOPICA")) {
    return {
      id: "group-extension-telescopica",
      title: "EXTENSIÓN TELESCÓPICA DE ALUMINIO",
      linea: "Herramientas",
      categoria: "Herramientas",
      categoriaVista: "Herramientas",
      tipo: "Extensión telescópica",
      optionType: "Largo",
    };
  }

  // 6. Herramientas: Mangos metálicos
  if (p.descripcion.toUpperCase().includes("MANGO METALICO")) {
    return {
      id: "group-mango-metalico",
      title: "MANGO METÁLICO PARA RODILLO",
      linea: "Herramientas",
      categoria: "Herramientas",
      categoriaVista: "Herramientas",
      tipo: "Mango para rodillo",
      optionType: "Medida",
    };
  }

  // 7. Herramientas: Bandejas de polipropileno
  if (p.categoriaVista === "Herramientas" && p.descripcion.toUpperCase().includes("BANDEJA")) {
    return {
      id: "group-bandejas-polipropileno",
      title: "BANDEJA DE POLIPROPILENO CERDEX",
      linea: "Herramientas",
      categoria: "Herramientas",
      categoriaVista: "Herramientas",
      tipo: "Bandeja",
      optionType: "Modelo",
    };
  }

  // 8. Kits y Sets
  if (p.categoriaVista === "Kit") {
    return {
      id: "group-sets-rodillo-bandeja",
      title: "SET DE BANDEJA Y RODILLO THERMO FUSION",
      linea: "Kits y Sets",
      categoria: "Kit",
      categoriaVista: "Kit",
      tipo: "Set de pintura",
      optionType: "Combinación",
    };
  }

  // Producto individual (sin variantes agrupadas)
  return {
    id: p.material,
    title: p.descripcion,
    linea: p.linea || "Cerdex",
    categoria: p.categoria || p.categoriaVista,
    categoriaVista: p.categoriaVista,
    tipo: p.tipo || "Herramienta",
    optionType: "",
  };
}

function extractOptionLabel(p: CatalogProduct, optionType: CatalogGroup["optionType"]): string {
  const desc = p.descripcion.toUpperCase();

  if (optionType === "Medida") {
    const tfMatch = desc.match(/(\d+(?:[.,]\d+)?")\s*(?:x\s*(\d+\s*mm))?/i);
    if (tfMatch && tfMatch[2]) {
      return `${tfMatch[1]} × ${tfMatch[2]}`;
    }
    const inchMatch = desc.match(/(?:DE\s+)?(\d+(?:[.,]\d+)?|\d+\/\d+)"/i);
    if (inchMatch) return `${inchMatch[1]}"`;
    return p.descripcion;
  }

  if (optionType === "Grano") {
    const gMatch = desc.match(/GRANO\s+(\d+)/i);
    if (gMatch) return `Grano ${gMatch[1]}`;
    return p.descripcion;
  }

  if (optionType === "Color") {
    const colorMatch = desc.match(/DECO SPRAY\s+(.*?)\s+CONTENIDO/i);
    if (colorMatch) {
      const c = colorMatch[1].trim();
      return c.charAt(0) + c.slice(1).toLowerCase();
    }
    return p.descripcion;
  }

  if (optionType === "Largo") {
    const lMatch = desc.match(/DE\s+([\d.]+\s+A\s+[\d.]+\s+METROS?)/i);
    if (lMatch) return lMatch[1].toLowerCase();
    return p.descripcion;
  }

  if (optionType === "Modelo") {
    if (desc.includes("MINI BANDEJA")) return 'Mini 6" Roja';
    if (desc.includes("MED.") && desc.includes("BLACK")) return 'Mediana 9" Black';
    if (desc.includes("GDE.") && desc.includes("BLACK")) return 'Grande 9" Black';
    if (desc.includes("MED.") && desc.includes("ROJA")) return 'Mediana 9" Roja';
    if (desc.includes("GDE.") && desc.includes("ROJA")) return 'Grande 9" Roja';
    if (desc.includes("GDE.") && desc.includes("AMARILLA")) return 'Grande 9" Amarilla';
    return p.descripcion;
  }

  if (optionType === "Combinación") {
    const m = desc.match(/SET\s+([^\s]+)\s+BANDEJA\s+([^\s]+)\s+Y\s+RODILLO\s+([^\s]+)(?:\s+DE\s+(\d+"(?:\s*x\s*\d+\s*mm)?))?/i);
    if (m) {
      return `${m[1]} (${m[2]} / ${m[4] || ""})`.trim();
    }
    return p.descripcion;
  }

  return p.descripcion;
}

export function buildCatalogGroups(products: CatalogProduct[]): CatalogGroup[] {
  const groupsMap = new Map<string, CatalogGroup>();

  products.forEach((p) => {
    const meta = getGroupMeta(p);

    if (!groupsMap.has(meta.id)) {
      const mainImage = imageByProduct[meta.id] || imageByProduct[p.material] || "";
      groupsMap.set(meta.id, {
        id: meta.id,
        isGroup: meta.optionType !== "",
        title: meta.title,
        linea: meta.linea,
        categoria: meta.categoria,
        categoriaVista: meta.categoriaVista,
        tipo: meta.tipo,
        optionType: meta.optionType,
        calidad: p.calidad,
        uso: p.uso,
        superficie: p.superficie,
        detalles: p.detalles,
        precioVenta: p.precioVenta,
        mainImage,
        baseProduct: p,
        variants: [],
      });
    }

    const group = groupsMap.get(meta.id)!;
    const optionLabel = extractOptionLabel(p, meta.optionType);
    const optionImage = imageByProduct[p.material];

    group.variants.push({
      ...p,
      optionLabel,
      optionImage,
    });
  });

  return Array.from(groupsMap.values());
}

export const catalogGroups: CatalogGroup[] = buildCatalogGroups(catalogProducts);

export function findCatalogGroup(id: string): CatalogGroup | undefined {
  // 1. Direct group ID match
  const direct = catalogGroups.find((g) => g.id === id);
  if (direct) return direct;

  // 2. Legacy alias match (e.g. picasso-group)
  if (id === "picasso-group") {
    return catalogGroups.find((g) => g.id === "group-brocha-picasso");
  }

  // 3. Variant material ID match (e.g. FX2-128101)
  return catalogGroups.find((g) => g.variants.some((v) => v.material === id));
}
