import { RestaurantInfo, MenuCategory, MenuItem } from '../types/restaurant';

// Image paths from batch generation matching the reference design
export const ASSET_IMAGES = {
  heroSlatePlatter: '/images/hero_sushi_slate_platter_1791915562134.jpg',
  salmonNigiriTrio: '/images/dish_salmon_nigiri_trio_1791915561945.jpg',
  omakaseSashimiBowl: '/images/dish_omakase_sashimi_bowl_1791915562398.jpg',
  dragonMakiRoll: '/images/dish_dragon_maki_roll_1791915563407.jpg',
  crispyWagyuGyoza: '/images/dish_crispy_wagyu_gyoza_1791915563714.jpg',
};

export const DEFAULT_RESTAURANT_INFO: RestaurantInfo = {
  name: 'Hush Modern Restaurant',
  tagline: 'Artisanal Japanese Cuisine & Omakase Sushi Lounge',
  cuisine: 'Modern Japanese & Sushi Omakase',
  story: 'Hush Modern Restaurant fuses age-old Edomae sushi techniques with contemporary Tokyo culinary aesthetics. Our fish is line-caught and air-shipped four times weekly directly from Toyosu Market, paired with organic Koshihikari sushi rice seasoned with aged red akazu vinegar and freshly grated Shizuoka hon-wasabi.',
  address: '580 Bush Street, Financial District',
  neighborhood: 'Financial District / Downtown',
  city: 'San Francisco',
  state: 'CA',
  zip: '94108',
  phone: '(415) 555-0822',
  email: 'reservations@hushmodern.com',
  socialInstagram: '@hushmodernsushi',
  socialFacebook: 'facebook.com/hushmodernrestaurant',
  hours: [
    { day: 'Monday', open: '4:30 PM', close: '10:00 PM' },
    { day: 'Tuesday', open: '12:00 PM', close: '10:00 PM' },
    { day: 'Wednesday', open: '12:00 PM', close: '10:00 PM' },
    { day: 'Thursday', open: '12:00 PM', close: '10:30 PM' },
    { day: 'Friday', open: '12:00 PM', close: '11:00 PM' },
    { day: 'Saturday', open: '12:30 PM', close: '11:00 PM' },
    { day: 'Sunday', open: '12:30 PM', close: '9:30 PM' },
  ],
  deliveryZones: [
    { zip: '94108', neighborhood: 'Chinatown / Nob Hill East', minOrder: 25, fee: 3.99, estimatedMinutes: 25 },
    { zip: '94104', neighborhood: 'Financial District Center', minOrder: 25, fee: 3.99, estimatedMinutes: 20 },
    { zip: '94111', neighborhood: 'Embarcadero / Jackson Square', minOrder: 25, fee: 3.99, estimatedMinutes: 25 },
    { zip: '94133', neighborhood: 'North Beach / Telegraph Hill', minOrder: 30, fee: 4.50, estimatedMinutes: 30 },
    { zip: '94102', neighborhood: 'Union Square / Tenderloin', minOrder: 30, fee: 4.50, estimatedMinutes: 30 },
    { zip: '94105', neighborhood: 'SoMa East / Transbay', minOrder: 35, fee: 4.99, estimatedMinutes: 35 },
  ],
  defaultDeliveryFee: 3.99,
  minimumDeliveryOrder: 25.00,
  taxRatePercent: 8.75,
  estimatedPickupMinutes: '20–25 mins',
  estimatedDeliveryMinutes: '30–40 mins',
  currencySymbol: '$',
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'nigiri-sashimi',
    name: 'Nigiri & Sashimi',
    description: 'Pristine raw seafood brushed with aged nikiri soy on seasoned akazu sushi rice',
  },
  {
    id: 'specialty-rolls',
    name: 'Specialty Maki Rolls',
    description: 'Chef-crafted signature rolls featuring torched seafood, house sauces, and crispy tempura',
  },
  {
    id: 'omakase-platters',
    name: 'Omakase Platters & Bowls',
    description: 'Curated tasting platters on black slate boards and luxury chirashi donburi bowls',
  },
  {
    id: 'izakaya-starters',
    name: 'Izakaya & Warm Starters',
    description: 'Crispy wagyu gyoza, charred truffle edamame, and artisanal miso broths',
  },
  {
    id: 'drinks-desserts',
    name: 'Teas & Desserts',
    description: 'Ceremonial Uji matcha, yuzu fruit refreshments, and Japanese artisan sweets',
  },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Nigiri & Sashimi
  {
    id: 'salmon-nigiri-trio',
    categoryId: 'nigiri-sashimi',
    name: 'Scottish Salmon Nigiri Trio',
    italianName: 'Scottish Salmon Nigiri',
    description: 'Three pieces of glistening Scottish Loch Duart salmon nigiri with delicate diamond knife score, aged nikiri glaze, and micro shiso herbs.',
    price: 18.50,
    image: ASSET_IMAGES.salmonNigiriTrio,
    dietary: ['gluten-free', 'chef-choice'],
    calories: 280,
    prepTimeMinutes: 10,
    isAvailable: true,
    modifiers: [
      {
        id: 'prep-style',
        name: 'Preparation Style',
        required: true,
        options: [
          { id: 'fresh-raw', name: 'Raw Classic with Aged Nikiri Soy', priceDelta: 0 },
          { id: 'aburi-torched', name: 'Flame-Torched with Yuzu Miso', priceDelta: 2.00 },
        ],
      },
      {
        id: 'wasabi-level',
        name: 'Fresh Real Wasabi',
        required: true,
        options: [
          { id: 'wasabi-regular', name: 'Standard Wasabi (Inside Rice)', priceDelta: 0 },
          { id: 'wasabi-side', name: 'Wasabi on the Side', priceDelta: 0 },
          { id: 'wasabi-none', name: 'No Wasabi', priceDelta: 0 },
        ],
      },
      {
        id: 'add-topping',
        name: 'Luxury Additions',
        required: false,
        options: [
          { id: 'ikura-crown', name: 'Add Salmon Roe Crown', priceDelta: 4.50 },
          { id: 'black-truffle', name: 'Add Shaved Black Winter Truffle', priceDelta: 6.00 },
        ],
      },
    ],
  },
  {
    id: 'bluefin-tuna-sashimi',
    categoryId: 'nigiri-sashimi',
    name: 'Bluefin Tuna Sashimi (5pc)',
    italianName: 'Bluefin Tuna Sashimi',
    description: 'Five thick-cut slices of sustainably caught bluefin tuna served with shredded daikon radish, fresh shiso leaf, and freshly grated real wasabi root.',
    price: 24.00,
    image: ASSET_IMAGES.heroSlatePlatter,
    dietary: ['gluten-free', 'dairy-free', 'chef-choice'],
    calories: 220,
    prepTimeMinutes: 8,
    isAvailable: true,
    modifiers: [
      {
        id: 'soy-sauce',
        name: 'Artisanal Dipping Sauce',
        required: true,
        options: [
          { id: 'house-nikiri', name: 'House 5-Year Barrel-Aged Nikiri Soy', priceDelta: 0 },
          { id: 'gf-tamari', name: 'Gluten-Free Organic Tamari Soy', priceDelta: 0 },
          { id: 'yuzu-ponzu', name: 'Citrus Yuzu Ponzu Reduction', priceDelta: 1.00 },
        ],
      },
    ],
  },
  {
    id: 'hamachi-yellowtail-nigiri',
    categoryId: 'nigiri-sashimi',
    name: 'Yellowtail Nigiri (3pc)',
    italianName: 'Yellowtail Nigiri',
    description: 'Buttery Japanese yellowtail nigiri topped with fermented green pepper paste and white truffle oil drops.',
    price: 19.00,
    image: ASSET_IMAGES.salmonNigiriTrio,
    dietary: ['gluten-free'],
    calories: 260,
    prepTimeMinutes: 10,
    isAvailable: true,
  },

  // Specialty Maki
  {
    id: 'hush-signature-dragon',
    categoryId: 'specialty-rolls',
    name: 'Hush Signature Dragon Roll',
    italianName: 'Signature Dragon Roll',
    description: 'Crispy tiger prawn tempura and English cucumber inside, draped with BBQ freshwater eel, ripe Hass avocado, spicy tobiko, and sweet kabayaki glaze.',
    price: 22.00,
    image: ASSET_IMAGES.dragonMakiRoll,
    dietary: ['chef-choice'],
    calories: 520,
    prepTimeMinutes: 12,
    isAvailable: true,
    modifiers: [
      {
        id: 'spice-level',
        name: 'Spiciness Preference',
        required: true,
        options: [
          { id: 'mild', name: 'Mild (Standard Kabayaki Glaze)', priceDelta: 0 },
          { id: 'spicy-mayo', name: 'Spicy Sriracha Japanese Aioli Drizzle', priceDelta: 0 },
          { id: 'fire-spicy', name: 'Extra Fiery Chili Crisp', priceDelta: 1.00 },
        ],
      },
      {
        id: 'crunch-extra',
        name: 'Optional Additions',
        required: false,
        options: [
          { id: 'extra-avocado', name: 'Extra Double Layer Hass Avocado', priceDelta: 3.00 },
          { id: 'tobiko-roe', name: 'Double Golden Flying Fish Roe (Tobiko)', priceDelta: 2.50 },
        ],
      },
    ],
  },
  {
    id: 'salmon-avocado-tobiko',
    categoryId: 'specialty-rolls',
    name: 'Torch-Seared Salmon & Avocado Roll',
    italianName: 'Seared Salmon Avocado Roll',
    description: 'Fresh salmon, creamy avocado, and cucumber rolled inside out, coated in vibrant orange masago roe and kissed with torch flame and sesame.',
    price: 18.00,
    image: ASSET_IMAGES.heroSlatePlatter,
    dietary: ['gluten-free'],
    calories: 460,
    prepTimeMinutes: 12,
    isAvailable: true,
    modifiers: [
      {
        id: 'rice-choice',
        name: 'Rice Selection',
        required: true,
        options: [
          { id: 'white-rice', name: 'Traditional Seasoned White Rice', priceDelta: 0 },
          { id: 'brown-rice', name: 'Organic Short Grain Brown Sushi Rice', priceDelta: 1.50 },
        ],
      },
    ],
  },

  // Omakase & Platters
  {
    id: 'hush-slate-omakase-platter',
    categoryId: 'omakase-platters',
    name: 'Modern Slate Omakase Platter (16pc)',
    italianName: 'Chef Omakase Platter',
    description: 'Our showpiece presentation on a dark slate board: 4 salmon nigiri, 4 bluefin tuna sashimi, 6 salmon avocado tobiko maki, real wasabi, and pickled ginger.',
    price: 58.00,
    image: ASSET_IMAGES.heroSlatePlatter,
    dietary: ['chef-choice'],
    calories: 840,
    prepTimeMinutes: 18,
    isAvailable: true,
    modifiers: [
      {
        id: 'miso-pairing',
        name: 'Artisanal Starter Pairing',
        required: false,
        options: [
          { id: 'red-miso', name: 'Include Two Bowls of Red Miso Soup', priceDelta: 6.00 },
          { id: 'truffle-edamame', name: 'Include Charred Truffle Sea Salt Edamame', priceDelta: 8.00 },
        ],
      },
    ],
  },
  {
    id: 'chirashi-sashimi-donburi',
    categoryId: 'omakase-platters',
    name: 'Imperial Chirashi Sashimi Bowl',
    italianName: 'Artisanal Sashimi Rice Bowl',
    description: 'Artisanal ceramic bowl piled high with fresh Scottish salmon, bluefin tuna, yellowtail, sweet egg omelet, cucumber ribbons, and glistening salmon roe over warm seasoned sushi rice.',
    price: 36.00,
    image: ASSET_IMAGES.omakaseSashimiBowl,
    dietary: ['gluten-free', 'chef-choice'],
    calories: 680,
    prepTimeMinutes: 14,
    isAvailable: true,
    modifiers: [
      {
        id: 'uni-topping',
        name: 'Hokkaido Delicacy',
        required: false,
        options: [
          { id: 'add-uni', name: 'Add Fresh Sea Urchin (Uni, 20g)', priceDelta: 14.00 },
          { id: 'double-ikura', name: 'Double Salmon Roe Mountain', priceDelta: 6.50 },
        ],
      },
    ],
  },

  // Izakaya & Starters
  {
    id: 'crispy-wagyu-lace-gyoza',
    categoryId: 'izakaya-starters',
    name: 'Crispy Lace Wagyu Dumplings (6pc)',
    italianName: 'Crispy Wagyu Dumplings',
    description: 'Pan-seared A5 wagyu beef dumplings with a delicate golden crispy lace skirt, scallions, and a chili garlic ponzu dipping glaze.',
    price: 16.50,
    image: ASSET_IMAGES.crispyWagyuGyoza,
    dietary: ['chef-choice'],
    calories: 420,
    prepTimeMinutes: 10,
    isAvailable: true,
    modifiers: [
      {
        id: 'dip-sauce',
        name: 'Dipping Sauce',
        required: true,
        options: [
          { id: 'spicy-ponzu', name: 'House Chili Garlic Ponzu', priceDelta: 0 },
          { id: 'sweet-ginger-soy', name: 'Sweet Ginger Black Vinegar Soy', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'charred-edamame-truffle',
    categoryId: 'izakaya-starters',
    name: 'Wok-Charred Truffle Edamame',
    italianName: 'Truffle Sea Salt Edamame',
    description: 'Young organic soybean pods wok-seared over high flame with white truffle oil, toasted sesame seeds, and sea salt flakes.',
    price: 9.50,
    image: ASSET_IMAGES.crispyWagyuGyoza,
    dietary: ['vegan', 'gluten-free'],
    calories: 190,
    prepTimeMinutes: 6,
    isAvailable: true,
  },

  // Teas & Desserts
  {
    id: 'matcha-mille-crepe',
    categoryId: 'drinks-desserts',
    name: 'Matcha Mille Crepe Cake',
    italianName: 'Matcha Green Tea Crepe Cake',
    description: 'Twenty paper-thin handmade crepe layers separated by light whipped ceremonial green tea cream and dusted with dark chocolate cocoa.',
    price: 12.00,
    image: ASSET_IMAGES.omakaseSashimiBowl,
    dietary: ['vegetarian', 'chef-choice'],
    calories: 360,
    prepTimeMinutes: 5,
    isAvailable: true,
  },
  {
    id: 'yuzu-sparkler-drink',
    categoryId: 'drinks-desserts',
    name: 'Sparkling Yuzu Blossom Elixir',
    italianName: 'Sparkling Yuzu Blossom',
    description: 'Freshly squeezed Kochi prefecture yuzu juice with sparkling mineral water, wild honey, and mint sprig (350ml glass bottle).',
    price: 7.50,
    image: ASSET_IMAGES.heroSlatePlatter,
    dietary: ['vegan', 'gluten-free'],
    calories: 85,
    prepTimeMinutes: 3,
    isAvailable: true,
  },
];
