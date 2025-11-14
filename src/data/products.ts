export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
  rating: number;
  badge?: string;
};

export const featuredProducts: Product[] = [
  {
    id: "aurora",
    name: "Aurora Headphones",
    description:
      "Spatial audio, adaptive noise cancelling, and a sculpted aluminum frame.",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",
    tags: ["audio", "new"],
    rating: 4.8,
    badge: "New Arrival",
  },
  {
    id: "lumen",
    name: "Lumen Watch",
    description:
      "Sapphire glass, multi-day battery, and proactive wellness tracking.",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
    tags: ["wearables"],
    rating: 4.9,
    badge: "Bestseller",
  },
  {
    id: "pulse",
    name: "Pulse Speaker",
    description:
      "360º audio with adaptive tuning and cinematic ultra-wide sound stage.",
    price: 229,
    image:
      "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=900&q=80",
    tags: ["audio", "home"],
    rating: 4.6,
  },
  {
    id: "glide",
    name: "Glide Smart Shoes",
    description:
      "Self-lacing fit, effortless cushioning, and predictive activity coaching.",
    price: 279,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    tags: ["lifestyle"],
    rating: 4.7,
  },
  {
    id: "atlas",
    name: "Atlas Work Backpack",
    description:
      "Featherweight textile, waterproof zippers, and modular tech sleeves.",
    price: 189,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    tags: ["travel"],
    rating: 4.5,
  },
];

export const sliderContent = [
  {
    id: "hero-1",
    label: "Elevate Every Day",
    title: "Objects that move with you.",
    description:
      "Thoughtful essentials engineered for ambitious teams, modern creatives, and design lovers.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "hero-2",
    label: "Spring Capsule",
    title: "Soft textures, precise lines.",
    description:
      "A curated collection inspired by Scandinavian calm and Tokyo energy.",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "hero-3",
    label: "Better Basics",
    title: "Function wrapped in color.",
    description:
      "Balance minimal silhouettes with confident hues for the studio or street.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
  },
];
