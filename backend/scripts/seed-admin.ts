import "dotenv/config";

import bcrypt from "bcrypt";
import fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

import { connectDatabase } from "../src/config/db";
import { getMediaBucket } from "../src/config/gridfs";
import { MediaAssetModel } from "../src/models/MediaAsset";
import { ProductModel } from "../src/models/Product";
import { UserModel } from "../src/models/User";
import { formatSlugSource, safeFileName } from "../src/utils/format";

type SeedAsset = {
  key: string;
  filePath: string;
  originalName: string;
  kind: "image" | "video";
  contentType: string;
};

type SeedProduct = {
  name: string;
  description: string;
  fullDescription: string;
  category: string;
  price: number;
  availability: "available" | "limited" | "made_to_order" | "out_of_stock";
  featured?: boolean;
  mediaKeys: string[];
  coverKey: string;
};

const adminEmail = process.env.SEED_ADMIN_EMAIL;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const adminName = process.env.SEED_ADMIN_NAME ?? "Jonak Admin";

if (!adminEmail || !adminPassword) {
  throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before running the seed script.");
}

const assets: SeedAsset[] = [
  {
    key: "lion-gate",
    filePath: "src/assets/site/project-estate-gate-lion.jpg",
    originalName: "project-estate-gate-lion.jpg",
    kind: "image",
    contentType: "image/jpeg",
  },
  {
    key: "modern-gate",
    filePath: "src/assets/site/project-modern-gate-panel.jpg",
    originalName: "project-modern-gate-panel.jpg",
    kind: "image",
    contentType: "image/jpeg",
  },
  {
    key: "about-gate",
    filePath: "src/assets/site/about-gate.jpg",
    originalName: "about-gate.jpg",
    kind: "image",
    contentType: "image/jpeg",
  },
  {
    key: "security-door",
    filePath: "src/assets/site/project-security-door-woodgrain.jpg",
    originalName: "project-security-door-woodgrain.jpg",
    kind: "image",
    contentType: "image/jpeg",
  },
  {
    key: "wood-doors",
    filePath: "src/assets/site/project-wood-finish-doors.jpg",
    originalName: "project-wood-finish-doors.jpg",
    kind: "image",
    contentType: "image/jpeg",
  },
  {
    key: "spiral-indoor",
    filePath: "src/assets/site/project-spiral-staircase-indoor.jpg",
    originalName: "project-spiral-staircase-indoor.jpg",
    kind: "image",
    contentType: "image/jpeg",
  },
  {
    key: "spiral-exterior",
    filePath: "src/assets/site/project-spiral-staircase-exterior.jpg",
    originalName: "project-spiral-staircase-exterior.jpg",
    kind: "image",
    contentType: "image/jpeg",
  },
  {
    key: "shade-sail",
    filePath: "src/assets/site/project-shade-sail.jpg",
    originalName: "project-shade-sail.jpg",
    kind: "image",
    contentType: "image/jpeg",
  },
  {
    key: "bridge",
    filePath: "src/assets/project-bridge.jpg",
    originalName: "project-bridge.jpg",
    kind: "image",
    contentType: "image/jpeg",
  },
  {
    key: "crane",
    filePath: "src/assets/site/project-crane-highrise.jpg",
    originalName: "project-crane-highrise.jpg",
    kind: "image",
    contentType: "image/jpeg",
  },
  {
    key: "arch",
    filePath: "src/assets/site/project-arch-scaffold.jpg",
    originalName: "project-arch-scaffold.jpg",
    kind: "image",
    contentType: "image/jpeg",
  },
  {
    key: "showcase",
    filePath: "src/assets/site/showcase.mp4",
    originalName: "showcase.mp4",
    kind: "video",
    contentType: "video/mp4",
  },
];

const products: SeedProduct[] = [
  {
    name: "Lion Crest Estate Gate System",
    description:
      "A premium matte-black estate gate package with crest detailing and reinforced steel framing.",
    fullDescription:
      "A complete estate gate solution designed for luxury residential entrances. The package combines ornamental crest work, structural reinforcement, and a smooth modern finish for long-term durability.",
    category: "Gates",
    price: 6500000,
    availability: "limited",
    featured: true,
    mediaKeys: ["lion-gate", "modern-gate", "about-gate", "showcase"],
    coverKey: "lion-gate",
  },
  {
    name: "Modern Security Gate Panel",
    description: "Clean geometric gate panel fabrication for contemporary homes and compounds.",
    fullDescription:
      "A practical and stylish gate build that pairs security with a modern architectural language. It works well for residential compounds, duplexes, and private developments.",
    category: "Gates",
    price: 4800000,
    availability: "available",
    mediaKeys: ["modern-gate", "about-gate"],
    coverKey: "modern-gate",
  },
  {
    name: "Woodgrain Security Door Package",
    description: "Reinforced steel door fabrication with warm wood-finish cladding and trim.",
    fullDescription:
      "A durable door package with a premium woodgrain aesthetic. Suitable for apartments, homes, and commercial interiors where security and appearance both matter.",
    category: "Doors",
    price: 1850000,
    availability: "available",
    mediaKeys: ["security-door", "wood-doors"],
    coverKey: "security-door",
  },
  {
    name: "Spiral Staircase Fabrication",
    description:
      "Bespoke spiral staircase fabrication with stainless rail detailing and precise finishing.",
    fullDescription:
      "A custom spiral staircase build for interior or exterior installation, engineered for structural safety and a refined visual finish. Ideal for premium residential projects.",
    category: "Staircases",
    price: 3200000,
    availability: "made_to_order",
    mediaKeys: ["spiral-indoor", "spiral-exterior"],
    coverKey: "spiral-indoor",
  },
  {
    name: "Shade Sail Courtyard Cover",
    description: "A tensioned shade sail installation for open courtyards and walkways.",
    fullDescription:
      "A neat shading solution that improves comfort in paved or landscaped outdoor spaces. The sail system is engineered for practical coverage and a clean architectural look.",
    category: "Buildings",
    price: 1400000,
    availability: "available",
    mediaKeys: ["shade-sail"],
    coverKey: "shade-sail",
  },
  {
    name: "Bridge and Access Road Works",
    description: "Civil works package for bridge construction and site access circulation.",
    fullDescription:
      "A civil works package covering reinforced concrete bridge works, access transitions, and site circulation support for construction and logistics routes.",
    category: "Civil Works",
    price: 14500000,
    availability: "limited",
    mediaKeys: ["bridge", "crane"],
    coverKey: "bridge",
  },
  {
    name: "Decorative Entrance Framework",
    description: "A structural entrance frame and site scaffolding build for a custom frontage.",
    fullDescription:
      "A structural frontage package for residential or commercial entrances. The build is ideal for projects that need a strong first impression and a clean structural layout.",
    category: "Buildings",
    price: 4200000,
    availability: "available",
    featured: true,
    mediaKeys: ["arch", "crane", "showcase"],
    coverKey: "arch",
  },
];

async function uploadSeedAsset(seedAsset: SeedAsset, uploadedBy: unknown) {
  const existingAsset = await MediaAssetModel.findOne({
    originalName: seedAsset.originalName,
    kind: seedAsset.kind,
    contentType: seedAsset.contentType,
  });

  if (existingAsset) {
    return existingAsset;
  }

  const absolutePath = path.resolve(process.cwd(), seedAsset.filePath);
  const buffer = await fs.readFile(absolutePath);
  const bucket = getMediaBucket();
  const storedFilename = `seed-${safeFileName(path.basename(seedAsset.originalName, path.extname(seedAsset.originalName)))}${path.extname(seedAsset.originalName)}`;
  const uploadStream = bucket.openUploadStream(storedFilename, {
    metadata: {
      contentType: seedAsset.contentType,
      originalName: seedAsset.originalName,
      kind: seedAsset.kind,
    },
  });

  await pipeline(Readable.from(buffer), uploadStream);

  return MediaAssetModel.create({
    fileId: uploadStream.id,
    kind: seedAsset.kind,
    filename: storedFilename,
    originalName: seedAsset.originalName,
    contentType: seedAsset.contentType,
    size: buffer.length,
    uploadedBy,
  });
}

async function generateUniqueSlug(name: string) {
  const baseSlug = formatSlugSource(name) || "product";
  let candidate = baseSlug;
  let counter = 2;

  while (await ProductModel.exists({ slug: candidate })) {
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return candidate;
}

async function main() {
  await connectDatabase();

  const email = adminEmail!;
  const password = adminPassword!;
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await UserModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      name: adminName,
      email: email.toLowerCase(),
      passwordHash,
      role: "admin",
      isActive: true,
    },
    { new: true, upsert: true },
  );

  const seededAssets = new Map<string, Awaited<ReturnType<typeof uploadSeedAsset>>>();
  for (const asset of assets) {
    const record = await uploadSeedAsset(asset, admin._id);
    seededAssets.set(asset.key, record);
  }

  const hasProducts = await ProductModel.exists({});
  if (hasProducts) {
    console.log("Products already exist. Admin account ensured, sample catalogue skipped.");
    return;
  }

  for (const productSeed of products) {
    const mediaDocs = productSeed.mediaKeys.map((key, index) => {
      const asset = seededAssets.get(key);
      if (!asset) {
        throw new Error(`Missing seed asset for key: ${key}`);
      }

      return {
        mediaId: asset._id,
        isCover: key === productSeed.coverKey,
        order: index,
      };
    });

    const slug = await generateUniqueSlug(productSeed.name);
    await ProductModel.create({
      name: productSeed.name,
      slug,
      description: productSeed.description,
      fullDescription: productSeed.fullDescription,
      category: productSeed.category,
      price: productSeed.price,
      availability: productSeed.availability,
      published: true,
      featured: productSeed.featured ?? false,
      media: mediaDocs,
      createdBy: admin._id,
      updatedBy: admin._id,
    });
  }

  console.log(`Seeded admin ${email} and ${products.length} published products.`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
