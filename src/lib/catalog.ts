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

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

const cat = (name: string, slug: string, description: string): Category => ({
  id: slug,
  name,
  slug,
  description,
  image: CATEGORY_IMAGES[slug] ?? oils,
});

export const categories: Category[] = [
  cat(
    "Cold Pressed Oils",
    "cold-pressed-oils",
    "Wood & cold pressed oils extracted slowly to retain natural aroma and nutrition.",
  ),
  cat("Atta & Flours", "atta-flours", "Stone ground millet and grain flours for everyday rotis."),
  cat("Dals & Pulses", "dals-pulses", "Unpolished dals and pulses sourced from trusted farms."),
  cat("Rice & Grains", "rice-grains", "Aged rice, heritage wheat and wholesome grains."),
  cat("Spices & Masalas", "spices-masalas", "Sun dried, freshly ground spices with no fillers."),
  cat("Pickles & Chutneys", "pickles-chutneys", "Homemade achar prepared in traditional oil masala."),
  cat("Papad & Badi", "papad-badi", "Hand rolled papad and sun dried badi from family recipes."),
  cat("Dry Fruits & Nuts", "dry-fruits-nuts", "Premium grade nuts, naturally dried and hand picked."),
  cat("Seeds", "seeds", "Nutrient dense seeds for smoothies, salads and snacking."),
  cat("Healthy Snacks", "healthy-snacks", "Roasted, baked and guilt free desi snacking."),
  cat("Cookies & Rusks", "cookies-rusks", "Atta cookies and rusks baked in small batches."),
  cat("Traditional Sweets", "traditional-sweets", "Classic mithai made with pure ghee and jaggery."),
  cat("Ghee & Dairy", "ghee-dairy", "Bilona churned desi ghee with rich granular texture."),
  cat("Salt & Sweeteners", "salt-sweeteners", "Rock salt, jaggery and unrefined natural sweeteners."),
  cat("Breakfast & Healthy Foods", "breakfast-healthy", "Poha, dalia, oats and wholesome morning staples."),
  cat("Namkeen & Snacks", "namkeen-snacks", "Traditional namkeen fried in cold pressed oil."),
  cat("Natural & Herbal", "natural-herbal", "Herbal powders and natural wellness essentials."),
  cat("Cooking Essentials", "cooking-essentials", "Daily kitchen must-haves for the desi pantry."),
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

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

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

type Raw = [
  name: string,
  unit: string,
  categorySlug: string,
  price: number,
  mrp: number,
  rating: number,
  reviews: number,
  stock: number,
  tags: string,
  badge?: string,
];

const raw: Raw[] = [
  // Cold Pressed Oils
  ["Cold Pressed Til Oil", "1 Litre", "cold-pressed-oils", 379, 420, 4.8, 214, 40, "oil,til,sesame,cold pressed", "Bestseller"],
  ["Cold Pressed Groundnut Oil", "1 Litre", "cold-pressed-oils", 349, 390, 4.7, 186, 38, "oil,groundnut,peanut,cold pressed", "Popular"],
  ["Cold Pressed Yellow Mustard Oil", "1 Litre", "cold-pressed-oils", 329, 360, 4.6, 141, 45, "oil,mustard,sarson"],
  ["Cold Pressed Black Mustard Oil", "1 Litre", "cold-pressed-oils", 315, 315, 4.5, 96, 30, "oil,mustard,kachi ghani"],
  ["Cold Pressed Kalonji Oil", "500 Ml", "cold-pressed-oils", 549, 649, 4.7, 78, 22, "oil,kalonji,nigella,herbal", "Premium"],
  ["Cold Pressed Virgin Coconut Oil", "500 Ml", "cold-pressed-oils", 399, 470, 4.8, 132, 26, "oil,coconut,virgin", "Healthy Choice"],
  ["Cold Pressed Almond Oil", "500 Ml", "cold-pressed-oils", 899, 1099, 4.9, 64, 15, "oil,almond,badam", "Premium"],
  ["Cold Pressed Flaxseed Oil", "500 Ml", "cold-pressed-oils", 449, 499, 4.4, 51, 18, "oil,flaxseed,alsi,omega"],
  // Atta & Flours
  ["Ragi Atta", "1 Kg", "atta-flours", 119, 140, 4.6, 143, 60, "atta,ragi,millet,flour", "Healthy Choice"],
  ["Bajra Atta", "1 Kg", "atta-flours", 99, 110, 4.4, 88, 55, "atta,bajra,millet,flour"],
  ["Juwar Atta", "1 Kg", "atta-flours", 109, 109, 4.3, 62, 48, "atta,jowar,juwar,flour"],
  ["Makka Atta", "1 Kg", "atta-flours", 89, 99, 4.2, 57, 52, "atta,makka,maize,corn"],
  ["Chana Atta", "1 Kg", "atta-flours", 129, 145, 4.5, 71, 44, "atta,chana,flour"],
  ["Besan Bareek", "1 Kg", "atta-flours", 139, 165, 4.7, 205, 70, "besan,gram flour,atta", "Bestseller"],
  ["Singhara Atta", "500 Gm", "atta-flours", 149, 175, 4.5, 39, 25, "atta,singhara,vrat,fasting"],
  ["Kuttu Atta", "500 Gm", "atta-flours", 159, 159, 4.4, 34, 24, "atta,kuttu,buckwheat,vrat"],
  // Dals & Pulses
  ["Arhar Dal", "1 Kg", "dals-pulses", 159, 180, 4.7, 262, 80, "dal,arhar,toor,pulses", "Bestseller"],
  ["Chana Dal", "1 Kg", "dals-pulses", 109, 125, 4.5, 148, 76, "dal,chana,pulses"],
  ["Moong Dhuli", "1 Kg", "dals-pulses", 149, 165, 4.6, 176, 68, "dal,moong,dhuli,pulses"],
  ["Moong Chilka", "500 Gm", "dals-pulses", 89, 89, 4.3, 52, 50, "dal,moong,chilka,pulses"],
  ["Moong Sabut", "1 Kg", "dals-pulses", 139, 155, 4.4, 61, 47, "dal,moong,sabut,green gram"],
  ["Masoor Dal", "1 Kg", "dals-pulses", 119, 135, 4.5, 133, 72, "dal,masoor,pulses"],
  ["Urad Dhuli", "1 Kg", "dals-pulses", 155, 175, 4.4, 84, 41, "dal,urad,dhuli,pulses"],
  ["Urad Sabut", "1 Kg", "dals-pulses", 149, 149, 4.3, 47, 38, "dal,urad,sabut,black gram"],
  ["Rajma Chitra", "1 Kg", "dals-pulses", 189, 220, 4.7, 118, 44, "rajma,beans,pulses", "Popular"],
  ["Kabuli Chana", "1 Kg", "dals-pulses", 169, 189, 4.6, 96, 49, "chana,chickpea,kabuli"],
  ["Kala Chana", "1 Kg", "dals-pulses", 129, 129, 4.4, 58, 53, "chana,kala,pulses"],
  ["Safed Matar", "1 Kg", "dals-pulses", 99, 115, 4.2, 41, 46, "matar,peas,pulses"],
  // Rice & Grains
  ["Sonamasuri Chawal", "1 Kg", "rice-grains", 105, 120, 4.6, 174, 90, "rice,chawal,sonamasuri", "Bestseller"],
  ["MP Sharbati Wheat", "1 Kg", "rice-grains", 62, 68, 4.5, 121, 120, "wheat,gehu,sharbati"],
  ["MP Khapli Wheat", "1 Kg", "rice-grains", 95, 110, 4.6, 66, 58, "wheat,khapli,emmer", "Healthy Choice"],
  ["Quinoa", "1 Kg", "rice-grains", 549, 649, 4.5, 73, 20, "quinoa,grain,healthy"],
  ["Dalia", "500 Gm", "rice-grains", 59, 59, 4.3, 44, 64, "dalia,broken wheat,breakfast"],
  // Spices
  ["Haldi Powder", "250 Gm", "spices-masalas", 89, 99, 4.7, 211, 85, "spice,haldi,turmeric", "Bestseller"],
  ["Dhaniya Powder", "250 Gm", "spices-masalas", 79, 89, 4.5, 129, 78, "spice,dhaniya,coriander"],
  ["Kashmiri Mirch", "200 Gm", "spices-masalas", 149, 175, 4.6, 97, 42, "spice,mirch,chilli,kashmiri"],
  ["Garam Masala", "100 Gm", "spices-masalas", 99, 99, 4.6, 88, 55, "spice,garam masala,blend"],
  ["Jeera Sabut", "500 Gm", "spices-masalas", 289, 340, 4.7, 112, 36, "spice,jeera,cumin", "Popular"],
  ["Kali Mirch Powder", "100 Gm", "spices-masalas", 169, 189, 4.5, 63, 33, "spice,kali mirch,pepper"],
  ["Chaat Masala", "100 Gm", "spices-masalas", 79, 85, 4.4, 55, 60, "spice,chaat masala"],
  ["Sabji Masala", "100 Gm", "spices-masalas", 85, 85, 4.3, 40, 58, "spice,sabji masala"],
  // Snacks / Healthy
  ["Makhana", "250 Gm", "healthy-snacks", 299, 350, 4.8, 246, 50, "makhana,fox nut,snack,healthy", "Bestseller"],
  ["Roasted Peri Peri Makhana", "100 Gm", "healthy-snacks", 149, 165, 4.6, 82, 44, "makhana,roasted,snack"],
  ["Puffed Jowar Puffs", "150 Gm", "healthy-snacks", 99, 110, 4.3, 37, 40, "puffs,jowar,snack"],
  ["Multigrain Namkeen", "200 Gm", "namkeen-snacks", 119, 130, 4.4, 58, 42, "namkeen,snack,multigrain"],
  ["Roasted Chana Namkeen", "200 Gm", "namkeen-snacks", 89, 89, 4.3, 46, 48, "namkeen,chana,roasted"],
  // Cookies & rusks
  ["Atta Jaggery Cookies", "200 Gm", "cookies-rusks", 139, 160, 4.6, 94, 46, "cookies,atta,jaggery", "Popular"],
  ["Multigrain Rusk", "300 Gm", "cookies-rusks", 99, 110, 4.4, 61, 52, "rusk,multigrain,tea"],
  // Seeds
  ["Sunflower Seeds", "100 Gm", "seeds", 89, 99, 4.5, 77, 62, "seeds,sunflower,healthy"],
  ["Pumpkin Seeds", "100 Gm", "seeds", 129, 149, 4.6, 84, 55, "seeds,pumpkin,healthy", "Healthy Choice"],
  ["Chia Seeds", "200 Gm", "seeds", 179, 199, 4.5, 66, 43, "seeds,chia,omega"],
  ["Flax Seeds", "200 Gm", "seeds", 99, 99, 4.4, 52, 60, "seeds,flax,alsi"],
  // Dry fruits
  ["Premium Almonds", "250 Gm", "dry-fruits-nuts", 399, 470, 4.8, 168, 34, "almond,badam,dry fruits", "Premium"],
  ["Walnut Kernels", "250 Gm", "dry-fruits-nuts", 549, 649, 4.7, 91, 26, "walnut,akhrot,dry fruits"],
  ["Salted Pista", "200 Gm", "dry-fruits-nuts", 499, 560, 4.6, 74, 28, "pista,pistachio,dry fruits"],
  ["Seedless Raisins", "250 Gm", "dry-fruits-nuts", 179, 179, 4.4, 59, 48, "raisin,kishmish,dry fruits"],
  // Pickles / papad
  ["Homemade Mango Pickle", "400 Gm", "pickles-chutneys", 199, 230, 4.7, 137, 40, "pickle,achar,mango", "Homemade"],
  ["Mixed Vegetable Pickle", "400 Gm", "pickles-chutneys", 189, 189, 4.5, 68, 36, "pickle,achar,mixed"],
  ["Lemon Chatpata Pickle", "400 Gm", "pickles-chutneys", 179, 199, 4.4, 52, 33, "pickle,achar,lemon,nimbu"],
  ["Urad Papad", "200 Gm", "papad-badi", 89, 99, 4.5, 73, 58, "papad,urad,traditional"],
  ["Moong Badi", "200 Gm", "papad-badi", 109, 125, 4.4, 44, 39, "badi,moong,traditional"],
  // Ghee & dairy
  ["Bilona Desi Cow Ghee", "500 Ml", "ghee-dairy", 899, 1050, 4.9, 288, 30, "ghee,desi,bilona,cow", "Bestseller"],
  ["Buffalo Desi Ghee", "1 Litre", "ghee-dairy", 1149, 1149, 4.6, 96, 22, "ghee,buffalo,desi"],
  // Salt & sweeteners
  ["Sendha Namak", "500 Gm", "salt-sweeteners", 69, 79, 4.5, 62, 70, "salt,sendha,rock salt"],
  ["Organic Jaggery Powder", "500 Gm", "salt-sweeteners", 129, 149, 4.6, 88, 54, "jaggery,gud,sweetener", "Natural"],
  // Breakfast
  ["Thick Poha", "500 Gm", "breakfast-healthy", 55, 60, 4.3, 49, 80, "poha,breakfast,rice flakes"],
  ["Rolled Oats", "1 Kg", "breakfast-healthy", 219, 249, 4.5, 71, 46, "oats,breakfast,healthy"],
  // Natural & herbal
  ["Triphala Powder", "200 Gm", "natural-herbal", 149, 165, 4.4, 43, 32, "herbal,triphala,ayurveda", "Natural"],
  ["Amla Powder", "200 Gm", "natural-herbal", 129, 129, 4.3, 38, 35, "herbal,amla,ayurveda"],
  // Traditional sweets
  ["Gond Ka Laddu", "400 Gm", "traditional-sweets", 449, 520, 4.7, 66, 20, "sweets,laddu,gond,winter", "Homemade"],
  ["Til Gud Chikki", "250 Gm", "traditional-sweets", 149, 165, 4.5, 51, 38, "sweets,chikki,til,gud"],
  // Cooking essentials
  ["Kachi Ghani Cooking Oil", "5 Litre", "cooking-essentials", 1549, 1699, 4.6, 88, 18, "oil,cooking,bulk"],
  ["Roasted Gram Flour Mix", "500 Gm", "cooking-essentials", 119, 130, 4.3, 32, 40, "cooking,mix,besan"],
];

export const products: Product[] = raw.map(
  ([name, unit, category, price, mrp, rating, reviewCount, stock, tags, badge], i) => {
    const c = categoryBySlug(category)!;
    return {
      id: `JDP-${String(i + 1).padStart(3, "0")}`,
      name,
      slug: slugify(`${name}-${unit}`),
      category,
      categoryName: c.name,
      description: `${name} from Jain Desi and Pure — ${c.description} Packed fresh in small batches with no preservatives, no artificial colour and no adulteration.`,
      price,
      mrp,
      discount: mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0,
      unit,
      image: CATEGORY_IMAGES[category] ?? oils,
      stock,
      rating,
      reviewCount,
      tags: tags.split(","),
      badge,
      bestseller: badge === "Bestseller",
      featured: i % 3 === 0,
      brand: "Jain Desi and Pure",
    };
  },
);

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const productById = (id: string) => products.find((p) => p.id === id);
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);

export const searchProducts = (query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q)),
  );
};

export const popularProducts = products
  .slice()
  .sort((a, b) => b.reviewCount - a.reviewCount)
  .slice(0, 12);

export const homeSections = [
  { title: "Popular Products", slug: "", items: popularProducts },
  { title: "Cold Pressed Oils", slug: "cold-pressed-oils", items: productsByCategory("cold-pressed-oils") },
  { title: "Atta & Flours", slug: "atta-flours", items: productsByCategory("atta-flours") },
  { title: "Dals & Pulses", slug: "dals-pulses", items: productsByCategory("dals-pulses") },
  { title: "Rice & Grains", slug: "rice-grains", items: productsByCategory("rice-grains") },
  { title: "Spices & Masalas", slug: "spices-masalas", items: productsByCategory("spices-masalas") },
  {
    title: "Healthy Snacks",
    slug: "healthy-snacks",
    items: [...productsByCategory("healthy-snacks"), ...productsByCategory("cookies-rusks")],
  },
  {
    title: "Pickles & Papad",
    slug: "pickles-chutneys",
    items: [...productsByCategory("pickles-chutneys"), ...productsByCategory("papad-badi")],
  },
  {
    title: "Dry Fruits & Seeds",
    slug: "dry-fruits-nuts",
    items: [...productsByCategory("dry-fruits-nuts"), ...productsByCategory("seeds")],
  },
];

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
