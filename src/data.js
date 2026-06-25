export const BRAND = "Maison Dorée";

export const FEATURED = [
  { id: 1, name: "Pan-Seared Chilean Sea Bass", desc: "Delicate white fish with citrus beurre blanc, wilted spinach, and micro herbs.", price: "$38.00", tag: "Bestseller", img: "/images/sea-bass.png" },
  { id: 2, name: "Wagyu Beef Tenderloin", desc: "A5 grade wagyu, truffle jus, roasted garlic mash, and charred broccolini.", price: "$52.00", tag: "Chef's Pick", img: "/images/wagyu.png" },
  { id: 3, name: "Truffle Risotto al Parmigiano", desc: "Carnaroli rice slow-stirred with black truffle, aged parmigiano, and mascarpone.", price: "$34.00", tag: "New", img: "/images/truffle-risotto.png" },
];

export const MENU_ITEMS = [
  { id: 1, name: "Grilled Mediterranean Prawns", price: "$28.00", weight: "Starter", img: "/images/prawns.png" },
  { id: 2, name: "Mushroom & Thyme Ravioli", price: "$26.00", weight: "Pasta", img: "/images/ravioli.png" },
  { id: 3, name: "Herb-Crusted Lamb Rack", price: "$46.00", weight: "Main", img: "/images/lamb-rack.png" },
  { id: 4, name: "Saffron Lobster Tail", price: "$58.00", weight: "Seafood", img: "/images/lobster-tail.png" },
];

export const FOOTER_COLS = [
  { heading: "Our Menu", links: [
    { label: "Starters", path: "/order.html?cat=starters" },
    { label: "Main Course", path: "/order.html?cat=mains" },
    { label: "Seafood", path: "/order.html?cat=seafood" },
    { label: "Desserts", path: "/order.html" },
  ]},
  { heading: "Experience", links: [
    { label: "About Us", path: "/about" },
    { label: "Our Story", path: "/about" },
    { label: "Chef's Table", path: "/", section: "chefs-table" },
    { label: "Contact", path: "/contact" },
  ]},
  { heading: "Useful Links", links: [
    { label: "Privacy Policy", path: "#" },
    { label: "Refund Policy", path: "#" },
    { label: "Terms of Service", path: "#" },
    { label: "FAQ", path: "#" },
  ]},
];

export const MEAL_BUILDER = {
  proteins: [
    { name: "Wagyu Beef", price: 32, emoji: "🥩" },
    { name: "Atlantic Salmon", price: 26, emoji: "🐟" },
    { name: "Free-Range Chicken", price: 22, emoji: "🍗" },
    { name: "Lobster Tail", price: 38, emoji: "🦞" },
  ],
  sides: [
    { name: "Truffle Mash", price: 8, emoji: "🥔" },
    { name: "Grilled Asparagus", price: 7, emoji: "🌿" },
    { name: "Wild Rice Pilaf", price: 6, emoji: "🍚" },
    { name: "Roasted Vegetables", price: 7, emoji: "🥕" },
  ],
  sauces: [
    { name: "Truffle Jus", price: 5, emoji: "🫗" },
    { name: "Béarnaise", price: 4, emoji: "🧈" },
    { name: "Red Wine Reduction", price: 5, emoji: "🍷" },
    { name: "Lemon Butter", price: 4, emoji: "🍋" },
  ],
  extras: [
    { name: "Foie Gras", price: 18, emoji: "✨" },
    { name: "Shaved Truffle", price: 15, emoji: "🍄" },
    { name: "King Prawns (3)", price: 14, emoji: "🦐" },
    { name: "Cheese Board", price: 12, emoji: "🧀" },
  ],
};
