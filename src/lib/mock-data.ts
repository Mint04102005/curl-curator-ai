import type {
  Booking,
  FaceShapeRow,
  HairFaceRule,
  Hairstyle,
  PendingApproval,
  Salon,
  SalonOwner,
  TryOnHistory,
  User,
} from "@/types";

// Curated Unsplash photos for visual fidelity. Stable IDs.
const HAIR_IMG = (seed: string) =>
  `https://images.unsplash.com/${seed}?w=600&h=600&fit=crop&auto=format`;

const SALON_IMG = (seed: string) =>
  `https://images.unsplash.com/${seed}?w=800&h=600&fit=crop&auto=format`;

const AVATAR = (seed: number) => `https://i.pravatar.cc/150?img=${seed}`;

export const MOCK_USERS: User[] = Array.from({ length: 20 }, (_, i) => ({
  user_id: i + 1,
  username: `user${i + 1}`,
  email: `user${i + 1}@ai-hairstyle-recommendation.app`,
  gender: i % 2 === 0 ? "female" : "male",
  phone: `09${String(10000000 + i * 12345).slice(0, 8)}`,
  role_id: 2,
  created_at: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  is_locked: i === 7,
  avatar_url: AVATAR(i + 1),
  fullname: `Nguyễn Văn ${i + 1}`,
  dob: new Date(Date.now() - (20 + i) * 365.25 * 86400000).toISOString().split("T")[0],
  address: `${100 + i * 5} Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh`,
}));

// Demo accounts for each role
MOCK_USERS.push(
  {
    user_id: 100,
    username: "admin",
    email: "admin@ai-hairstyle-recommendation.app",
    gender: "male",
    phone: "0900000001",
    role_id: 1,
    created_at: new Date().toISOString(),
    avatar_url: AVATAR(60),
    fullname: "Quản trị viên hệ thống",
    dob: "1995-05-15",
    address: "123 Đường Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh",
  },
  {
    user_id: 101,
    username: "salon",
    email: "salon@ai-hairstyle-recommendation.app",
    gender: "female",
    phone: "0900000002",
    role_id: 3,
    created_at: new Date().toISOString(),
    avatar_url: AVATAR(45),
    fullname: "Chủ Salon Demo",
    dob: "1998-08-20",
    address: "456 Đường Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh",
  },
);

export const MOCK_SALON_OWNERS: SalonOwner[] = Array.from({ length: 10 }, (_, i) => ({
  owner_id: i + 1,
  user_id: 101,
  license_no: `BL-2025-${String(1000 + i)}`,
  is_verified: i < 6,
}));

const HAIR_SEEDS_FEMALE = [
  "photo-1605497788044-5a32c7078486",
  "photo-1595959183082-7b570b7e08e2",
  "photo-1522337360788-8b13dee7a37e",
  "photo-1554519515-242161756769",
  "photo-1492106087820-71f1a00d2b11",
  "photo-1502323777036-f29e3972d82f",
  "photo-1487412947147-5cebf100ffc2",
  "photo-1531123897727-8f129e1688ce",
  "photo-1517841905240-472988babdf9",
  "photo-1524504388940-b1c1722653e1",
];
const HAIR_SEEDS_MALE = [
  "photo-1500648767791-00dcc994a43e",
  "photo-1506794778202-cad84cf45f1d",
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1519085360753-af0119f7cbe7",
  "photo-1463453091185-61582044d556",
  "photo-1531891437562-4301cf35b7e4",
  "photo-1542327897-d73f4005b533",
  "photo-1488161628813-04466f872be2",
  "photo-1542178243-bc20204b769f",
  "photo-1534308143481-c55f00be8bd7",
];

const HAIR_NAMES_FEMALE = [
  "Layered Bob Hàn Quốc",
  "Tóc Mái Thưa Air",
  "Long Wave Lãng Mạn",
  "Bob Ngắn Cá Tính",
  "Tóc Xoăn Sóng Pháp",
  "Ponytail Cao Thanh Lịch",
  "Tóc Pixie Năng Động",
  "Lob Uốn Cụp Hiện Đại",
  "Tóc Dài Ép Thẳng",
  "Half-up Half-down",
];
const HAIR_NAMES_MALE = [
  "Two Block Hàn Quốc",
  "Undercut Cổ Điển",
  "Side Part Lịch Lãm",
  "Pompadour Cao",
  "Quiff Hiện Đại",
  "Mid Fade Texture",
  "Crop Top Năng Động",
  "Mullet Cá Tính",
  "Slick Back Sang Trọng",
  "Buzz Cut Tối Giản",
];

export const MOCK_HAIRSTYLES: Hairstyle[] = [
  ...HAIR_NAMES_FEMALE.map<Hairstyle>((name, i) => ({
    hair_id: i + 1,
    hair_name: name,
    image_url: HAIR_IMG(HAIR_SEEDS_FEMALE[i]!),
    gender: "female",
    description: "Phù hợp khuôn mặt thanh thoát, dễ tạo kiểu hằng ngày.",
  })),
  ...HAIR_NAMES_MALE.map<Hairstyle>((name, i) => ({
    hair_id: i + 11,
    hair_name: name,
    image_url: HAIR_IMG(HAIR_SEEDS_MALE[i]!),
    gender: "male",
    description: "Phong cách hiện đại, dễ chăm sóc, hợp môi trường công sở.",
  })),
];

export const MOCK_FACE_SHAPES: FaceShapeRow[] = [
  { shape_id: 1, shape_name: "Tròn" },
  { shape_id: 2, shape_name: "Oval" },
  { shape_id: 3, shape_name: "Vuông" },
  { shape_id: 4, shape_name: "Trái Tim" },
  { shape_id: 5, shape_name: "Dài" },
];

// Generate suitability matrix
export const MOCK_HAIR_FACE: HairFaceRule[] = (() => {
  const rules: HairFaceRule[] = [];
  let id = 1;
  for (const hair of MOCK_HAIRSTYLES) {
    for (const shape of MOCK_FACE_SHAPES) {
      const base = 50 + ((hair.hair_id * 7 + shape.shape_id * 13) % 50);
      rules.push({
        rule_id: id++,
        hair_id: hair.hair_id,
        shape_id: shape.shape_id,
        suitability_score: base,
      });
    }
  }
  return rules;
})();

const SALON_TAGS = ["Tròn,Oval", "Oval,Trái Tim", "Vuông,Dài", "Trái Tim,Oval", "Oval,Dài,Vuông"];

export const MOCK_SALONS: Salon[] = Array.from({ length: 20 }, (_, i) => ({
  salon_id: i + 1,
  owner_id: (i % 10) + 1,
  salonname: [
    "Maison Hair Studio",
    "Seoul Beauty Lab",
    "30Shine Premium",
    "Liêm Barber",
    "Bobby Salon",
    "Hà Nội Hair Atelier",
    "La Belle Coiffure",
    "Tokyo Hair House",
    "Urban Cuts",
    "Glow & Go Salon",
    "Velvet Hair Bar",
    "Mint Salon",
    "Lumière Studio",
    "Saigon Sharp",
    "Artisan Hair",
    "Noir Salon",
    "Aurora Hair Lounge",
    "Studio 21",
    "Hue Hair Co.",
    "Atelier Coupe",
  ][i]!,
  address: `${100 + i * 3} Nguyễn Văn Linh, Q.${(i % 12) + 1}, TP.HCM`,
  rating: Math.round((3.8 + ((i * 13) % 12) / 10) * 10) / 10,
  tag: SALON_TAGS[i % SALON_TAGS.length]!,
  image_url: SALON_IMG(
    [
      "photo-1521590832167-7bcbfaa6381f",
      "photo-1560066984-138dadb4c035",
      "photo-1622286342621-4bd786c2447c",
      "photo-1503951914875-452162b0f3f1",
      "photo-1599387737877-5d3b0a2dbd1c",
    ][i % 5]!,
  ),
}));

export const MOCK_BOOKINGS: Booking[] = Array.from({ length: 30 }, (_, i) => ({
  booking_id: i + 1,
  user_id: (i % 20) + 1,
  salon_id: (i % 20) + 1,
  booking_date: new Date(Date.now() + (i - 10) * 86400000).toISOString(),
  notes: ["Cắt + gội", "Uốn nhẹ", "Nhuộm nâu trà sữa", "Cắt nam undercut", ""][i % 5]!,
  status: (["P", "C", "D", "X", "P"] as const)[i % 5]!,
}));

export const MOCK_TRY_ON_HISTORY: TryOnHistory[] = Array.from({ length: 20 }, (_, i) => ({
  history_id: i + 1,
  user_id: (i % 20) + 1,
  hair_id: (i % MOCK_HAIRSTYLES.length) + 1,
  input_img_url: AVATAR((i % 70) + 1),
  output_img_url: MOCK_HAIRSTYLES[i % MOCK_HAIRSTYLES.length]!.image_url,
  saved_at: new Date(Date.now() - i * 3600000).toISOString(),
}));

export const MOCK_APPROVALS: PendingApproval[] = Array.from({ length: 10 }, (_, i) => ({
  approval_id: i + 1,
  owner_id: i + 1,
  status: (["P", "P", "A", "P", "R", "P", "A", "P", "P", "R"] as const)[i]!,
}));
