import type { Category, Product } from "@/lib/types";

import tshirtImg from "@/assets/cat-tshirt.jpg";
import shirtImg from "@/assets/cat-shirt.jpg";
import pantsImg from "@/assets/cat-pants.jpg";
import shoesImg from "@/assets/cat-shoes.jpg";
import lookbookImg from "@/assets/lookbook.jpg";
import editorialImg from "@/assets/editorial.jpg";

export const categoryImages = { tshirt: tshirtImg, shirt: shirtImg, pants: pantsImg, shoes: shoesImg };

export const categories: Category[] = [
  {
    id: 11,
    slug: "tshirt",
    name: "تیشرت",
    description: "تیشرت‌های پنبه‌ای با دوخت تمیز و فرم ماندگار برای پوشش روزمره.",
    image: tshirtImg,
  },
  {
    id: 12,
    slug: "shirt",
    name: "پیراهن",
    description: "پیراهن‌های آستین بلند از پارچه‌های نفس‌گیر، مناسب کار و مهمانی.",
    image: shirtImg,
  },
  {
    id: 13,
    slug: "pants",
    name: "شلوار",
    description: "شلوارهای پارچه‌ای و کتان با فرم استاندارد و رنگ‌بندی خنثی.",
    image: pantsImg,
  },
  {
    id: 14,
    slug: "shoes",
    name: "کفش",
    description: "کفش‌های چرم دست‌دوز با زیره راحت برای استفاده طولانی.",
    image: shoesImg,
  },
];

const SIZES_CLOTHES = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
  { value: "xxl", label: "۲XL" },
];

const SIZES_PANTS = ["۳۰", "۳۲", "۳۴", "۳۶", "۳۸"].map((l, i) => ({ value: `p${i}`, label: l }));
const SIZES_SHOES = ["۴۰", "۴۱", "۴۲", "۴۳", "۴۴"].map((l, i) => ({ value: `sh${i}`, label: l }));

const C = {
  cream: { value: "cream", label: "کرم", hex: "#EDE6D8" },
  white: { value: "white", label: "سفید", hex: "#F7F5F1" },
  navy: { value: "navy", label: "سرمه‌ای", hex: "#28344A" },
  charcoal: { value: "charcoal", label: "زغالی", hex: "#33322F" },
  olive: { value: "olive", label: "زیتونی", hex: "#5A6247" },
  camel: { value: "camel", label: "شتری", hex: "#B08A5F" },
  brown: { value: "brown", label: "قهوه‌ای", hex: "#6B452C" },
  stone: { value: "stone", label: "سنگی", hex: "#C7BDAE" },
  sky: { value: "sky", label: "آبی روشن", hex: "#AFC4DA" },
};

type Seed = {
  name: string;
  slug: string;
  cat: Product["categorySlug"];
  price: number;
  sale?: number;
  desc: string;
  short: string;
  colors: Product["colors"];
  image: string;
  featured?: boolean;
  isNew?: boolean;
  sales: number;
  stock?: number;
};

const seeds: Seed[] = [
  {
    name: "تیشرت پنبه‌ای پیما کلاسیک",
    slug: "tishert-pima-classic",
    cat: "tshirt",
    price: 690000,
    sale: 545000,
    desc: "تیشرتی از نخ پیما با بافت متراکم که پس از چند بار شست‌وشو فرم یقه خود را حفظ می‌کند. برش آن نه چسبان است و نه گشاد؛ دقیقاً همان اندازه‌ای که زیر پیراهن یا به‌تنهایی خوب می‌نشیند.",
    short: "نخ پیما، یقه ماندگار، برش استاندارد",
    colors: [C.cream, C.charcoal, C.olive],
    image: tshirtImg,
    isNew: true,
    sales: 320,
  },
  {
    name: "تیشرت جودون یقه گرد",
    slug: "tishert-joudon-yaghe-gerd",
    cat: "tshirt",
    price: 780000,
    desc: "بافت جودون با وزن متوسط، انتخابی مطمئن برای فصل‌های معتدل. درز شانه‌ها تقویت شده و لبه آستین دو دوخته است.",
    short: "بافت جودون، وزن متوسط",
    colors: [C.white, C.navy],
    image: tshirtImg,
    sales: 210,
    featured: true,
  },
  {
    name: "تیشرت جیب‌دار نخ ضخیم",
    slug: "tishert-jibdar-nakh-zakhim",
    cat: "tshirt",
    price: 850000,
    sale: 690000,
    desc: "نخ ضخیم‌تر با حالت‌پذیری بهتر و یک جیب سینه ساده. طراحی بدون لوگوی بیرونی تا در هر ترکیبی جا بیفتد.",
    short: "نخ ضخیم، جیب سینه ساده",
    colors: [C.cream, C.charcoal],
    image: tshirtImg,
    sales: 480,
    isNew: true,
  },
  {
    name: "تیشرت آستین بلند ریب",
    slug: "tishert-astin-boland-rib",
    cat: "tshirt",
    price: 920000,
    desc: "آستین بلند با بافت ریب ظریف در مچ و یقه. گزینه‌ای آرام برای روزهای خنک ابتدای پاییز.",
    short: "بافت ریب، آستین بلند",
    colors: [C.olive, C.navy, C.stone],
    image: tshirtImg,
    sales: 140,
  },
  {
    name: "پیراهن آکسفورد سفید",
    slug: "pirahan-oxford-sefid",
    cat: "shirt",
    price: 1450000,
    desc: "پیراهن آکسفورد با یقه دکمه‌دار و پارچه‌ای که با گذر زمان نرم‌تر می‌شود. پایه‌ای‌ترین پیراهن یک کمد مردانه درست‌وحسابی.",
    short: "آکسفورد، یقه دکمه‌دار",
    colors: [C.white, C.sky],
    image: shirtImg,
    featured: true,
    sales: 610,
  },
  {
    name: "پیراهن پوپلین آبی روشن",
    slug: "pirahan-poplin-abi",
    cat: "shirt",
    price: 1590000,
    sale: 1290000,
    desc: "پوپلین سبک با سطح صاف و مات، مناسب ساعت‌های طولانی کار. یقه نیمه‌ایتالیایی که با کراوات و بدون کراوات هر دو خوب می‌ایستد.",
    short: "پوپلین سبک، یقه نیمه‌ایتالیایی",
    colors: [C.sky, C.white],
    image: shirtImg,
    isNew: true,
    sales: 275,
  },
  {
    name: "پیراهن کتان تابستانی",
    slug: "pirahan-katan-tabestani",
    cat: "shirt",
    price: 1680000,
    desc: "ترکیب کتان و پنبه با تهویه بالا. چروک‌های طبیعی کتان بخشی از شخصیت این پیراهن است، نه ایراد آن.",
    short: "کتان و پنبه، تهویه بالا",
    colors: [C.cream, C.stone],
    image: shirtImg,
    sales: 190,
  },
  {
    name: "پیراهن فلانل زمستانی",
    slug: "pirahan-flanel-zemestani",
    cat: "shirt",
    price: 1750000,
    desc: "فلانل برس‌خورده با لمس نرم و گرمای مطبوع. برش کمی آزادتر تا روی تیشرت هم راحت بنشیند.",
    short: "فلانل برس‌خورده، برش آزادتر",
    colors: [C.navy, C.brown],
    image: shirtImg,
    sales: 120,
    stock: 0,
  },
  {
    name: "شلوار پارچه‌ای پیلی‌دار",
    slug: "shalvar-parchei-pilidar",
    cat: "pants",
    price: 1890000,
    sale: 1590000,
    desc: "شلوار پیلی‌دار با فرم افتاده و دم‌پای مرتب. کمر داخلی نواردوزی شده تا پیراهن در طول روز بیرون نزند.",
    short: "پیلی‌دار، فرم افتاده",
    colors: [C.navy, C.stone, C.charcoal],
    image: pantsImg,
    featured: true,
    sales: 530,
  },
  {
    name: "شلوار چینو کلاسیک",
    slug: "shalvar-chino-classic",
    cat: "pants",
    price: 1490000,
    desc: "چینوی نخی با رنگ‌های خنثی که تقریباً با هر پیراهن و تیشرتی ست می‌شود. برش مستقیم و ساده.",
    short: "چینوی نخی، برش مستقیم",
    colors: [C.camel, C.olive, C.charcoal],
    image: pantsImg,
    isNew: true,
    sales: 410,
  },
  {
    name: "شلوار پشمی فلانل",
    slug: "shalvar-pashmi-flanel",
    cat: "pants",
    price: 2350000,
    desc: "پشم فلانل با وزن مناسب فصل سرد و آویز طبیعی خوب. انتخابی رسمی‌تر برای جلسات و مهمانی.",
    short: "پشم فلانل، آویز طبیعی",
    colors: [C.charcoal, C.navy],
    image: pantsImg,
    sales: 160,
  },
  {
    name: "شلوار کتان راسته",
    slug: "shalvar-katan-raste",
    cat: "pants",
    price: 1620000,
    sale: 1350000,
    desc: "کتان سبک با برش راسته برای روزهای گرم. جیب‌های کناری اریب و جیب پشت دکمه‌دار.",
    short: "کتان سبک، برش راسته",
    colors: [C.cream, C.stone],
    image: pantsImg,
    sales: 240,
  },
  {
    name: "کفش لوفر چرم طبیعی",
    slug: "kafsh-loafer-charm",
    cat: "shoes",
    price: 3450000,
    sale: 2890000,
    desc: "لوفر با رویه چرم گاوی و زیره چرمی دوخته‌شده. بدون بند، با فرم پاشنه‌ای که پس از چند بار پوشیدن قالب پا می‌شود.",
    short: "چرم گاوی، زیره دوخته‌شده",
    colors: [C.brown, C.charcoal],
    image: shoesImg,
    featured: true,
    isNew: true,
    sales: 380,
  },
  {
    name: "کفش دربی چرم صیقلی",
    slug: "kafsh-derby-charm",
    cat: "shoes",
    price: 3890000,
    desc: "دربی کلاسیک با بندهای سه‌جفتی و رویه صیقلی. همراه مناسب شلوار پارچه‌ای در موقعیت‌های رسمی.",
    short: "دربی کلاسیک، رویه صیقلی",
    colors: [C.charcoal, C.brown],
    image: shoesImg,
    sales: 205,
  },
  {
    name: "کفش چاکادار جیر",
    slug: "kafsh-chakadar-jir",
    cat: "shoes",
    price: 3290000,
    desc: "جیر نرم با دوخت دستی در لبه‌ها و زیره سبک. حد فاصل کفش رسمی و راحتی روزمره.",
    short: "جیر نرم، زیره سبک",
    colors: [C.camel, C.olive],
    image: shoesImg,
    sales: 170,
  },
  {
    name: "کفش اسنیکر چرم مینیمال",
    slug: "kafsh-sneaker-charm",
    cat: "shoes",
    price: 2750000,
    desc: "اسنیکر ساده با رویه چرم و خط طراحی تمیز، بدون آرم‌های بزرگ. برای روزهایی که راحتی اولویت است.",
    short: "چرم ساده، طراحی تمیز",
    colors: [C.white, C.stone],
    image: shoesImg,
    isNew: true,
    sales: 460,
  },
  {
    name: "تیشرت یقه هفت نخی",
    slug: "tishert-yaghe-haft",
    cat: "tshirt",
    price: 720000,
    desc: "یقه هفت با زاویه ملایم که خط گردن را بلندتر نشان می‌دهد. پارچه نخی با کمی کشسانی.",
    short: "یقه هفت، پارچه کشسان",
    colors: [C.stone, C.navy],
    image: tshirtImg,
    sales: 95,
  },
  {
    name: "پیراهن یقه دیپلمات راه‌راه",
    slug: "pirahan-diplomat-raheraah",
    cat: "shirt",
    price: 1720000,
    desc: "راه‌راه‌های باریک روی زمینه روشن با یقه دیپلمات. جزئیات کم اما دقیق، مناسب محیط کاری.",
    short: "راه‌راه باریک، یقه دیپلمات",
    colors: [C.sky, C.white],
    image: shirtImg,
    sales: 310,
  },
];

const galleryFor = (main: string) => [main, lookbookImg, editorialImg];

export const products: Product[] = seeds.map((s, index) => {
  const category = categories.find((c) => c.slug === s.cat)!;
  const sizes = s.cat === "shoes" ? SIZES_SHOES : s.cat === "pants" ? SIZES_PANTS : SIZES_CLOTHES;
  const stockQuantity = s.stock ?? 6 + (index % 9);
  return {
    id: 1000 + index,
    name: s.name,
    slug: s.slug,
    sku: `SHK-${category.slug.toUpperCase().slice(0, 3)}-${1000 + index}`,
    description: s.desc,
    shortDescription: s.short,
    price: s.sale ?? s.price,
    regularPrice: s.price,
    salePrice: s.sale ?? null,
    onSale: Boolean(s.sale),
    categorySlug: category.slug,
    categoryName: category.name,
    images: galleryFor(s.image).map((src, i) => ({
      id: i,
      src,
      alt: `${s.name} — نمای ${i + 1}`,
    })),
    sizes,
    colors: s.colors,
    stockStatus: stockQuantity > 0 ? "instock" : "outofstock",
    stockQuantity,
    featured: Boolean(s.featured),
    isNew: Boolean(s.isNew),
    totalSales: s.sales,
  };
});
