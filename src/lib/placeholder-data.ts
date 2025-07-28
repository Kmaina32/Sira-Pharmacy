export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'medication' | 'wellness' | 'baby-care' | 'personal-care';
  stock: number;
  usage: string;
  aiHint: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Effective relief from pain and fever. Suitable for adults and children over 12 years.',
    price: 150.00,
    imageUrl: 'https://placehold.co/400x400.png',
    category: 'medication',
    stock: 150,
    usage: 'Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.',
    aiHint: 'painkiller pills',
  },
  {
    id: '2',
    name: 'Vitamin C 1000mg',
    description: 'Boosts your immune system and provides antioxidant support. Effervescent tablets.',
    price: 450.00,
    imageUrl: 'https://placehold.co/400x400.png',
    category: 'wellness',
    stock: 80,
    usage: 'Dissolve one tablet in a glass of water daily.',
    aiHint: 'vitamin supplement',
  },
  {
    id: '3',
    name: 'Gentle Baby Wipes',
    description: 'Hypoallergenic and fragrance-free wipes for delicate baby skin. Contains 72 wipes.',
    price: 300.00,
    imageUrl: 'https://placehold.co/400x400.png',
    category: 'baby-care',
    stock: 200,
    usage: 'Use during diaper changes or for cleaning baby\'s hands and face.',
    aiHint: 'baby wipes',
  },
  {
    id: '4',
    name: 'Antiseptic Liquid',
    description: 'Kills 99.9% of germs to protect against infection from cuts, scratches, and insect bites.',
    price: 250.00,
    imageUrl: 'https://placehold.co/400x400.png',
    category: 'personal-care',
    stock: 120,
    usage: 'Dilute before use as directed on the label. For external use only.',
    aiHint: 'antiseptic bottle',
  },
  {
    id: '5',
    name: 'Amoxicillin 250mg',
    description: 'A broad-spectrum antibiotic used to treat a variety of bacterial infections.',
    price: 600.00,
    imageUrl: 'https://placehold.co/400x400.png',
    category: 'medication',
    stock: 50,
    usage: 'Prescription only. Take as directed by your doctor.',
    aiHint: 'antibiotic capsules',
  },
  {
    id: '6',
    name: 'Omega-3 Fish Oil',
    description: 'Supports heart and brain health. High-potency softgels.',
    price: 1200.00,
    imageUrl: 'https://placehold.co/400x400.png',
    category: 'wellness',
    stock: 90,
    usage: 'Take one softgel daily with a meal.',
    aiHint: 'fish oil',
  },
  {
    id: '7',
    name: 'Diaper Rash Cream',
    description: 'Forms a protective barrier to treat and prevent diaper rash.',
    price: 550.00,
    imageUrl: 'https://placehold.co/400x400.png',
    category: 'baby-care',
    stock: 110,
    usage: 'Apply liberally at each diaper change.',
    aiHint: 'diaper cream',
  },
  {
    id: '8',
    name: 'Moisturizing Sunscreen SPF 50',
    description: 'Broad-spectrum UVA/UVB protection that hydrates the skin.',
    price: 850.00,
    imageUrl: 'https://placehold.co/400x400.png',
    category: 'personal-care',
    stock: 75,
    usage: 'Apply generously 15 minutes before sun exposure. Reapply every 2 hours.',
    aiHint: 'sunscreen lotion',
  },
];

export const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'medication', label: 'Medication' },
    { value: 'wellness', label: 'Wellness' },
    { value: 'baby-care', label: 'Baby Care' },
    { value: 'personal-care', label: 'Personal Care' },
];

export const orders = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    date: '2023-10-26',
    total: 750.00,
    status: 'Delivered',
    items: 3,
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    date: '2023-10-25',
    total: 1500.50,
    status: 'Shipped',
    items: 2,
  },
  {
    id: 'ORD-003',
    customerName: 'Peter Jones',
    date: '2023-10-25',
    total: 300.00,
    status: 'Processing',
    items: 1,
  },
  {
    id: 'ORD-004',
    customerName: 'Mary Anne',
    date: '2023-10-24',
    total: 2100.00,
    status: 'Delivered',
    items: 5,
  },
];

export const salesData = [
    { date: 'Oct 20', 'This Month': 4000, 'Last Month': 2400 },
    { date: 'Oct 21', 'This Month': 3000, 'Last Month': 1398 },
    { date: 'Oct 22', 'This Month': 2000, 'Last Month': 9800 },
    { date: 'Oct 23', 'This Month': 2780, 'Last Month': 3908 },
    { date: 'Oct 24', 'This Month': 1890, 'Last Month': 4800 },
    { date: 'Oct 25', 'This Month': 2390, 'Last Month': 3800 },
    { date: 'Oct 26', 'This Month': 3490, 'Last Month': 4300 },
];
