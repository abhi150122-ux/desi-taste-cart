import oils from "@/assets/cat-oils.jpg";
import atta from "@/assets/cat-atta.jpg";
import dals from "@/assets/cat-dals.jpg";
import rice from "@/assets/cat-rice.jpg";
import spices from "@/assets/cat-spices.jpg";
import pickles from "@/assets/cat-pickles.jpg";
import papad from "@/assets/cat-papad.jpg";
import dryfruits from "@/assets/cat-dryfruits.jpg";
import seeds from "@/assets/cat-seeds.jpg";
import snacks from "@/assets/cat-snacks.jpg";
import ghee from "@/assets/cat-ghee.jpg";
import cookies from "@/assets/cat-cookies.jpg";

const API_BASE_URL = "https://admin.jaindesipure.co.in/api/v1";
const API_ORIGIN = new URL(API_BASE_URL).origin;

export const CATEGORY_IMAGES: Record<string, string> = {
  "cold-pressed-oils": oils,
  "atta-flours": atta,
  "dals-pulses": dals,
  "rice-grains": rice,
  "spices-masalas": spices,
  "pickles-chutneys": pickles,
  "papad-badi": papad,
  "dry-fruits-nuts": dryfruits,
  seeds: seeds,
  "healthy-snacks": snacks,
  "cookies-rusks": cookies,
  "traditional-sweets": cookies,
  "ghee-dairy": ghee,
  "salt-sweeteners": spices,
  "breakfast-healthy": rice,
  "namkeen-snacks": snacks,
  "natural-herbal": seeds,
  "cooking-essentials": oils,
};

// API Response Types (flexible)
type ApiCategory = Record<string, any>;
type ApiProduct = Record<string, any>;

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  products_count?: number;
};

export const normalizeImageUrl = (value: unknown): string => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return trimmed;

  try {
    const imageUrl = new URL(trimmed, API_ORIGIN);
    if (imageUrl.origin === API_ORIGIN && imageUrl.pathname.startsWith("/storage/")) {
      imageUrl.pathname = `/media/${imageUrl.pathname.slice("/storage/".length)}`;
    }
    return imageUrl.toString();
  } catch {
    return trimmed;
  }
};

const mapApiCategory = (apiCat: ApiCategory): Category => {
  const slug = ((apiCat['slug'] as string) || (apiCat['name'] as string) || "")
    .toLowerCase()
    .replace(/\s+/g, "-");
  return {
    id: (apiCat['id'] as string) || slug,
    name: (apiCat['name'] as string) || "",
    slug: slug,
    description: (apiCat['description'] as string) || "",
    image: normalizeImageUrl(apiCat['image_url'] ?? apiCat['image']) || CATEGORY_IMAGES[slug] || oils,
    products_count: Number(apiCat['products_count'] ?? 0),
  };
};

// Fetch all categories from API
export const fetchCategories = async (limit = 30): Promise<Category[]> => {
  try {
    const url = `${API_BASE_URL}/categories?limit=${Math.min(30, Math.max(1, limit))}`;
    console.log(`[API] Fetching categories from: ${url}`);
    const response = await fetch(url, { cache: "no-store" });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[API] Categories response:`, data);
    
    // Handle array response (list of categories)
    let categoryList: any[] = [];
    
    if (Array.isArray(data)) {
      categoryList = data;
    } else if (data.data && Array.isArray(data.data)) {
      categoryList = data.data;
    } else if (data.categories && Array.isArray(data.categories)) {
      categoryList = data.categories;
    } else if (data.category) {
      categoryList = [data.category];
    }
    
    console.log(`[API] Found ${categoryList.length} categories`);
    
    const categories = categoryList.map(mapApiCategory);
    console.log(`[API] Mapped categories:`, categories);
    
    return categories;
  } catch (error) {
    console.error("[API] Error fetching categories:", error);
    throw error;
  }
};

export const getCategories = async (limit = 30): Promise<Category[]> => fetchCategories(limit);

export const categoryBySlug = async (slug: string) => {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug);
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  description: string;
  price: number;
  mrp: number;
  discount: number;
  unit: string;
  image: string;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  badge?: string | undefined;
  bestseller: boolean;
  featured: boolean;
  brand: string;
};

export type HomeBanner = {
  id: string | number;
  image_url: string;
  target_url?: string;
  title?: string;
  text?: string;
  cta?: string;
};

export type HomeSection = {
  title: string;
  slug: string;
  items: Product[];
  productsCount: number;
};

export type HomePage = {
  popularProducts: Product[];
  categories: Category[];
  sections: HomeSection[];
  hasMoreCategories: boolean;
  nextCategoryPage: number | null;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Map API product response to Product type
const mapApiProduct = (apiProduct: ApiProduct, categoryName: string = ""): Product => {
  // Flexible field mapping - try multiple possible field names
  const name = ((apiProduct['name'] as string) || 
               (apiProduct['product_name'] as string) || 
               (apiProduct['title'] as string) || "");
  const price = Number(
    (apiProduct['display_price'] as any) ||
    (apiProduct['discount_price'] as any) ||
    (apiProduct['price'] as any) || 
    (apiProduct['selling_price'] as any) || 
    (apiProduct['sale_price'] as any) || 0
  );
  const mrp = Number(
    (apiProduct['mrp'] as any) || 
    (apiProduct['original_price'] as any) || 
    (apiProduct['list_price'] as any) || price
  );
  const stock = Number(
    (apiProduct['stock'] as any) || 
    (apiProduct['quantity'] as any) || 
    (apiProduct['inventory'] as any) || 0
  );
  const rating = Number(
    (apiProduct['rating'] as any) || 
    (apiProduct['average_rating'] as any) || 0
  );
  const reviewCount = Number(
    (apiProduct['review_count'] as any) || 
    (apiProduct['reviews_count'] as any) || 
    (apiProduct['num_reviews'] as any) || 0
  );
  const image = normalizeImageUrl((apiProduct['image'] as string) || 
                (apiProduct['image_url'] as string) || 
                (apiProduct['photo'] as string) || "");
  
  // Category can be: string slug, object with slug, object with id.
  // Some APIs only return category_id, which is not the slug used in frontend routes.
  let category = "";
  let categoryLabel = "";
  if (typeof apiProduct['category'] === 'string') {
    category = apiProduct['category'];
  } else if (apiProduct['category'] && typeof apiProduct['category'] === 'object') {
    category = (apiProduct['category']['slug'] as string) || "";
    categoryLabel = (apiProduct['category']['name'] as string) || "";
  }

  if (!category) {
    category = (apiProduct['category_slug'] as string) || "";
  }

  const unit = ((apiProduct['unit'] as string) || 
               (apiProduct['size'] as string) || 
               (apiProduct['variant'] as string) || "");
  const badge = ((apiProduct['badge'] as string) || 
                (apiProduct['badge_name'] as string) || undefined);
  const tagsRaw = apiProduct['tags'];
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw
    : typeof tagsRaw === "string"
      ? tagsRaw.split(",").map((t: string) => t.trim())
      : [];

  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return {
    id: String(apiProduct['id'] ?? slugify(name)),
    name,
    slug: slugify(`${name}-${unit}`),
    category,
    categoryName: categoryName || categoryLabel || (apiProduct['category_name'] as string) || "",
    description: ((apiProduct['description'] as string) || 
                 (apiProduct['long_description'] as string) || ""),
    price,
    mrp,
    discount,
    unit,
    image,
    stock,
    rating,
    reviewCount,
    tags,
    badge,
    bestseller: badge === "Bestseller" || (apiProduct['is_bestseller'] as boolean) === true,
    featured: (apiProduct['is_featured'] as boolean) === true || (apiProduct['featured'] as boolean) === true,
    brand: ((apiProduct['brand'] as string) || 
           (apiProduct['brand_name'] as string) || "Jain Desi and Pure"),
  };
};

// Fetch products for a specific category
export const fetchProductsByCategory = async (
  categorySlug: string,
  page: number = 1,
  pageSize: number = 30,
): Promise<Product[]> => {
  try {
    // Try the direct endpoint first
    let url = `${API_BASE_URL}/categories/${categorySlug}/products?page=${page}&page_size=${pageSize}`;
    console.log(`[API] Fetching products for category: ${url}`);
    
    let response = await fetch(url, { cache: "no-store" });
    
    // If that fails, try the products endpoint
    if (!response.ok) {
      url = `${API_BASE_URL}/products?category_slug=${categorySlug}&page=${page}&page_size=${pageSize}`;
      console.log(`[API] Trying alternate endpoint: ${url}`);
      response = await fetch(url, { cache: "no-store" });
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[API] Products response for ${categorySlug}:`, data);

    // Handle various response structures
    let productList: any[] = [];
    
    if (Array.isArray(data)) {
      productList = data;
    } else if (data.data && Array.isArray(data.data)) {
      productList = data.data;
    } else if (data.products && Array.isArray(data.products)) {
      productList = data.products;
    } else if (data.items && Array.isArray(data.items)) {
      productList = data.items;
    }
    
    console.log(`[API] Found ${productList.length} products in category ${categorySlug}`);
    
    // Get category name for mapping
    const category = await categoryBySlug(categorySlug);
    const categoryName = category?.name || categorySlug;

    const mappedProducts = productList.map((p: ApiProduct) => {
      const mapped = mapApiProduct(p, categoryName);
      mapped.category = categorySlug;
      mapped.categoryName = categoryName;
      return mapped;
    });
    console.log(`[API] Mapped ${mappedProducts.length} products`);
    
    return mappedProducts;
  } catch (error) {
    console.error(`[API] Error fetching products for category ${categorySlug}:`, error);
    return [];
  }
};

// Fetch all products from all categories
export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    console.log("[API] Fetching all products...");
    const [categories, response] = await Promise.all([
      getCategories(),
      fetch(`${API_BASE_URL}/products`, { cache: "no-store" }),
    ]);

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const data = await response.json();
    const productList = Array.isArray(data)
      ? data
      : Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data?.data)
          ? data.data
          : [];
    const categoryNames = new Map(categories.map((category) => [category.slug, category.name]));
    const allProducts = productList.map((product: ApiProduct) => {
      const productCategory = product['category'];
      const categorySlug = typeof productCategory === "object" && productCategory
        ? productCategory['slug']
        : product['category_slug'];
      const mapped = mapApiProduct(product, categoryNames.get(categorySlug) ?? "");
      return mapped;
    });
    console.log(`[API] Total products fetched: ${allProducts.length}`);
    return allProducts;
  } catch (error) {
    console.error("[API] Error fetching all products:", error);
    throw error;
  }
};

export const getProducts = async (_forceRefresh = false): Promise<Product[]> => fetchAllProducts();

// Product lookup functions
export const productBySlug = async (slug: string) => {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
};

export const productById = async (id: string) => {
  const products = await getProducts();
  return products.find((p) => p.id === id);
};

export const productsByCategory = async (slug: string) => {
  const products = await getProducts();
  return products.filter((p) => p.category === slug);
};

export const categoryCountsMap = async (): Promise<Record<string, number>> => {
  const products = await getProducts();
  const counts: Record<string, number> = {};

  for (const product of products) {
    const key = product.category || product.categoryName;
    if (!key) continue;
    counts[key] = (counts[key] ?? 0) + 1;
  }

  return counts;
};

export const searchProducts = async (query: string) => {
  const products = await getProducts();
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q)),
  );
};

export const getPopularProducts = async (): Promise<Product[]> => {
  const products = await getProducts();
  return products
    .slice()
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 12);
};

export const getHomeBanners = async (): Promise<HomeBanner[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banners`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const data = await response.json();
    const banners = Array.isArray(data) ? data : Array.isArray(data?.banners) ? data.banners : [];

    return banners
      .filter((banner: any) => banner && banner.image_url)
      .slice(0, 5)
      .map((banner: any) => ({
        id: banner.id ?? banner.slug ?? Math.random().toString(36).slice(2),
        image_url: normalizeImageUrl(banner.image_url),
        target_url: banner.target_url ?? "",
        title: banner.title ?? banner.name ?? "Featured",
        text: banner.text ?? "Fresh picks for your pantry",
        cta: banner.cta ?? "Shop now",
      }));
  } catch (error) {
    console.error("[HOME] Error loading banners:", error);
    return [];
  }
};

export const fetchHomePage = async (categoryPage = 1): Promise<HomePage> => {
  const response = await fetch(
    `${API_BASE_URL}/home?category_page=${categoryPage}&category_limit=15&products_per_category=10`,
    { cache: "no-store" },
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

  const data = await response.json();
  const categoryList = Array.isArray(data?.categories) ? data.categories : [];
  const categories: Category[] = categoryList.map((item: ApiCategory) => mapApiCategory(item));
  const categoryById = new Map<string, Category>(categories.map((category: Category) => [String(category.id), category]));
  const sections = categories.map((category: Category, index: number) => {
    const apiCategory = categoryList[index] ?? {};
    const products = Array.isArray(apiCategory.products)
      ? apiCategory.products.map((product: ApiProduct) => mapApiProduct(product, category.name))
      : [];
    return {
      title: category.name,
      slug: category.slug,
      items: products,
      productsCount: category.products_count ?? 0,
    };
  });

  const popularProducts = Array.isArray(data?.popular_products)
    ? data.popular_products.map((product: ApiProduct) => {
        const categoryId = product['category'] && typeof product['category'] === "object"
          ? String(product['category']['id'] ?? "")
          : "";
        return mapApiProduct(product, categoryById.get(categoryId)?.name ?? "");
      })
    : [];

  return {
    popularProducts,
    categories,
    sections,
    hasMoreCategories: data?.has_more_categories === true,
    nextCategoryPage: typeof data?.next_category_page === "number" ? data.next_category_page : null,
  };
};

export const getHomeSections = async () => {
  const page = await fetchHomePage(1);
  return [{ title: "Popular Products", slug: "", items: page.popularProducts }, ...page.sections];
};

// Legacy exports retained for callers that still import the old synchronous API.
export const products: Product[] = [];
export const categories: Category[] = [];

export const productBySlugSync = (_slug: string) => undefined;
export const productByIdSync = (_id: string) => undefined;
export const productsByCategorySync = (_slug: string) => [] as Product[];

export const popularProducts: Product[] = [];
export const homeSections: any[] = [];

export const megaMenu = [
  {
    title: "Oils",
    slug: "cold-pressed-oils",
    links: ["Til Oil", "Groundnut Oil", "Mustard Oil", "Kalonji Oil", "Coconut Oil", "Almond Oil", "Flaxseed Oil"],
  },
  {
    title: "Atta & Flours",
    slug: "atta-flours",
    links: ["Wheat Atta", "Multigrain", "Ragi", "Bajra", "Jowar", "Makka", "Besan", "Chana Atta"],
  },
  {
    title: "Dals & Pulses",
    slug: "dals-pulses",
    links: ["Arhar", "Moong", "Masoor", "Urad", "Chana", "Rajma", "Kabuli Chana", "Matar"],
  },
  {
    title: "Spices",
    slug: "spices-masalas",
    links: ["Haldi", "Dhaniya", "Mirch", "Jeera", "Garam Masala", "Sabji Masala", "Chaat Masala"],
  },
  {
    title: "Snacks",
    slug: "healthy-snacks",
    links: ["Makhana", "Papad", "Badi", "Cookies", "Rusk", "Chips", "Puffs"],
  },
];

export const sampleReviews = [
  {
    name: "Ritu Sharma",
    rating: 5,
    date: "12 Jul 2026",
    text: "Very good quality oil. Packaging was excellent and delivery was quick.",
  },
  {
    name: "Mahesh Jain",
    rating: 5,
    date: "04 Jul 2026",
    text: "Tastes exactly like the products we used to get from our village mill. Highly recommended.",
  },
  {
    name: "Anita Verma",
    rating: 4,
    date: "28 Jun 2026",
    text: "Genuinely pure and fresh. Slightly pricey but worth it for the family.",
  },
  {
    name: "Deepak Agarwal",
    rating: 5,
    date: "19 Jun 2026",
    text: "Ordered three times now. Consistent quality every single time.",
  },
  {
    name: "Sneha Kothari",
    rating: 4,
    date: "02 Jun 2026",
    text: "Loved the aroma. Sealed packing with no leakage at all.",
  },
];
