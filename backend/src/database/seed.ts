import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin User ───────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@atlas.com' },
    update: {},
    create: {
      email: 'admin@atlas.com',
      name: 'Atlas Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created (admin@atlas.com / admin123)');

  // ── Categories ───────────────────────────────────────────────────────────
  const categories = [
    { name: 'Fabrics & Textiles', slug: 'fabric', image: img('1558171813-4c088753af8f'), count: 48, tagline: 'Woven heritage' },
    { name: 'Leather & Hides', slug: 'leather', image: img('1558769132-cb1aea458c5e'), count: 32, tagline: 'Full-grain craft' },
    { name: 'Woods & Veneers', slug: 'wood', image: img('1558618666-fcd25c85cd64'), count: 56, tagline: 'Sustainably sourced' },
    { name: 'Stone & Marble', slug: 'stone', image: img('1615529182904-14819c35db37'), count: 27, tagline: 'Quarried beauty' },
    { name: 'Metals & Alloys', slug: 'metal', image: img('1504328345603-70a3c140ef03'), count: 41, tagline: 'Industrial poetry' },
    { name: 'Ceramic & Clay', slug: 'ceramic', image: img('1610701596061-2ecf227e85c2'), count: 38, tagline: 'Kiln-fired art' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log('✅ Categories seeded.');

  // ── Products ──────────────────────────────────────────────────────────────
  const products = [
    {
      name: 'Atlas Merino Wool Blend', slug: 'atlas-merino-wool', category: 'fabric', subcategory: 'Wool',
      price: 48, originalPrice: 62, stock: 120, rating: 4.8, reviewCount: 214,
      description: 'A luxurious heavyweight merino wool blend, woven in Biella, Italy. Soft drape with a structured hand — ideal for tailored outerwear and upholstery.',
      details: ['Composition: 72% Merino Wool, 28% Cashmere', 'Weight: 420 g/m²', 'Width: 150 cm', 'Origin: Biella, Italy', 'Care: Dry clean only'],
      images: [img('1558171813-4c088753af8f'), img('1618354625252-2251eab37ca8'), img('1620799140408-edc6dcb6d633')],
      tags: ['premium', 'winter', 'tailoring'], featured: true, bestseller: true, unit: 'per yard', origin: 'Italy',
    },
    {
      name: 'Horween Chromexcel Leather', slug: 'horween-chromexcel', category: 'leather', subcategory: 'Full Grain',
      price: 135, stock: 45, rating: 4.9, reviewCount: 182,
      description: 'Legendary pull-up leather from the Horween tannery in Chicago. Rich waxy finish develops a stunning patina with age and use.',
      details: ['Type: Full-grain pull-up', 'Weight: 4–5 oz', 'Hide size: 22–26 sq ft', 'Origin: Chicago, USA', 'Finish: Hot-stuffed waxy'],
      images: [img('1558769132-cb1aea458c5e'), img('1594223274512-ad4803739b7c'), img('1528702696946-59fc3e0a2d9a')],
      tags: ['heritage', 'bags', 'footwear'], featured: true, unit: 'per hide', origin: 'USA',
    },
    {
      name: 'Black Walnut Slab', slug: 'black-walnut-slab', category: 'wood', subcategory: 'Hardwood',
      price: 289, originalPrice: 340, stock: 12, rating: 4.7, reviewCount: 76,
      description: 'Live-edge black walnut slab, air-dried for 24 months. Deep chocolate heartwood with striking sapwood contrast. Perfect for statement tables.',
      details: ['Species: Juglans nigra', 'Dimensions: 220 × 90 × 5 cm', 'Moisture: 8–10%', 'Origin: Appalachian, USA', 'Finish: Unfinished'],
      images: [img('1558618666-fcd25c85cd64'), img('1616486338812-3dadae4b4ace'), img('1609546230275-87c004d8e02a')],
      tags: ['statement', 'live-edge', 'furniture'], featured: true, newArrival: true, unit: 'per slab', origin: 'USA',
    },
    {
      name: 'Carrara Bianco Marble Tile', slug: 'carrara-bianco-marble', category: 'stone', subcategory: 'Marble',
      price: 92, stock: 320, rating: 4.6, reviewCount: 148,
      description: 'Classic Carrara marble with soft grey veining on a luminous white ground. Honed finish for a contemporary matte look.',
      details: ['Type: Bianco Carrara C', 'Size: 60 × 60 × 2 cm', 'Finish: Honed', 'Origin: Carrara, Italy', 'Grade: First choice'],
      images: [img('1615529182904-14819c35db37'), img('1600607687939-ce8a6c25118c'), img('1604014237800-1c9102c219da')],
      tags: ['classic', 'interior', 'flooring'], bestseller: true, unit: 'per m²', origin: 'Italy',
    },
    {
      name: 'Brushed Brass Sheet', slug: 'brushed-brass-sheet', category: 'metal', subcategory: 'Brass',
      price: 74, stock: 88, rating: 4.8, reviewCount: 93,
      description: 'Architectural-grade brass sheet with a hand-brushed finish. Warm golden tone that develops character over time.',
      details: ['Alloy: C26000 Cartridge Brass', 'Thickness: 1.2 mm', 'Sheet: 1220 × 610 mm', 'Finish: Brushed satin', 'Temper: Half-hard'],
      images: [img('1504328345603-70a3c140ef03'), img('1581091870622-1e1c8790a8f0'), img('1530124566582-a618bc2a3456')],
      tags: ['architectural', 'warm', 'finishing'], newArrival: true, unit: 'per sheet', origin: 'Germany',
    },
    {
      name: 'Shigaraki Stoneware Tile', slug: 'shigaraki-stoneware', category: 'ceramic', subcategory: 'Stoneware',
      price: 58, stock: 204, rating: 4.7, reviewCount: 67,
      description: 'Hand-glazed stoneware tiles fired in a traditional anagama kiln. Each tile is unique — natural ash glaze creates unpredictable surface effects.',
      details: ['Size: 15 × 15 × 1.2 cm', 'Firing: 5-day anagama', 'Finish: Natural ash glaze', 'Origin: Shigaraki, Japan', 'Box: 22 tiles'],
      images: [img('1610701596061-2ecf227e85c2'), img('1581783898377-1c85bf937427'), img('1558618047-3f3fa09dc7ac')],
      tags: ['artisan', 'japanese', 'unique'], featured: true, unit: 'per box', origin: 'Japan',
    },
    {
      name: 'Belgian Linen Canvas', slug: 'belgian-linen-canvas', category: 'fabric', subcategory: 'Linen',
      price: 38, stock: 180, rating: 4.5, reviewCount: 112,
      description: 'Heavyweight Belgian flax linen with a naturally slubbed texture. Pre-washed for softness.',
      details: ['Composition: 100% Flax Linen', 'Weight: 280 g/m²', 'Width: 280 cm', 'Origin: Flanders, Belgium', 'Care: Machine wash warm'],
      images: [img('1620799140408-edc6dcb6d633'), img('1555529669-d691a18f66c9'), img('1618354625252-2251eab37ca8')],
      tags: ['natural', 'drapery', 'neutral'], bestseller: true, unit: 'per yard', origin: 'Belgium',
    },
    {
      name: 'Vegetable-Tanned Vachetta', slug: 'veg-tan-vachetta', category: 'leather', subcategory: 'Vegetable Tanned',
      price: 98, stock: 72, rating: 4.8, reviewCount: 201,
      description: 'Tuscan vegetable-tanned vachetta — the gold standard for leather goods.',
      details: ['Type: Vachetta, veg-tan', 'Weight: 3–4 oz', 'Hide size: 18–22 sq ft', 'Origin: Santa Croce, Italy', 'Tannage: Chestnut bark'],
      images: [img('1594223274512-ad4803739b7c'), img('1558769132-cb1aea458c5e'), img('1528702696946-59fc3e0a2d9a')],
      tags: ['classic', 'tooling', 'bags'], unit: 'per hide', origin: 'Italy',
    },
    {
      name: 'European White Oak Plank', slug: 'white-oak-plank', category: 'wood', subcategory: 'Hardwood',
      price: 22, stock: 640, rating: 4.6, reviewCount: 319,
      description: 'Select-grade European white oak with clean, linear grain. FSC-certified and kiln-dried.',
      details: ['Species: Quercus robur', 'Dimensions: 240 × 19 × 2 cm', 'Grade: Select & Better', 'Origin: France', 'Moisture: 8%'],
      images: [img('1616486338812-3dadae4b4ace'), img('1558618666-fcd25c85cd64'), img('1609546230275-87c004d8e02a')],
      tags: ['flooring', 'sustainable', 'classic'], bestseller: true, unit: 'per plank', origin: 'France',
    },
    {
      name: 'Travertino Romano Classic', slug: 'travertino-romano', category: 'stone', subcategory: 'Travertine',
      price: 68, stock: 180, rating: 4.7, reviewCount: 88,
      description: 'Warm ivory Roman travertine with characteristic pitting. Cross-cut for a soft linear pattern.',
      details: ['Type: Travertino Romano Classico', 'Size: 60 × 40 × 2 cm', 'Finish: Filled & honed', 'Origin: Tivoli, Italy', 'Cut: Cross-cut'],
      images: [img('1600607687939-ce8a6c25118c'), img('1615529182904-14819c35db37'), img('1604014237800-1c9102c219da')],
      tags: ['mediterranean', 'warm', 'exterior'], unit: 'per m²', origin: 'Italy',
    },
    {
      name: 'Patinated Copper Sheet', slug: 'patinated-copper', category: 'metal', subcategory: 'Copper',
      price: 89, stock: 54, rating: 4.9, reviewCount: 41,
      description: 'Pre-patinated copper with a rich verdigris finish. The green patina is chemically stabilized.',
      details: ['Alloy: C11000 ETP Copper', 'Thickness: 0.8 mm', 'Sheet: 1000 × 500 mm', 'Finish: Pre-patinated verdigris', 'Sealed: Yes, matte lacquer'],
      images: [img('1581091870622-1e1c8790a8f0'), img('1504328345603-70a3c140ef03'), img('1530124566582-a618bc2a3456')],
      tags: ['character', 'sculptural', 'outdoor'], newArrival: true, unit: 'per sheet', origin: 'Finland',
    },
    {
      name: 'Hand-Thrown Terracotta', slug: 'terracotta-hand-thrown', category: 'ceramic', subcategory: 'Terracotta',
      price: 34, stock: 160, rating: 4.5, reviewCount: 95,
      description: 'Sun-baked terracotta tiles from a family workshop in Puglia.',
      details: ['Size: 20 × 20 × 1.8 cm', 'Finish: Raw, unglazed', 'Firing: Wood-fired', 'Origin: Puglia, Italy', 'Box: 25 tiles'],
      images: [img('1581783898377-1c85bf937427'), img('1610701596061-2ecf227e85c2'), img('1558618047-3f3fa09dc7ac')],
      tags: ['mediterranean', 'artisan', 'flooring'], unit: 'per box', origin: 'Italy',
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`✅ ${products.length} products seeded.`);

  console.log('\n🎉 Seed complete!\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
