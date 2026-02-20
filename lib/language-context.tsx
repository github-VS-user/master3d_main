"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Language = "en" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.catalog": "Catalog",
    "nav.myOrders": "My Orders",
    
    // Hero
    "hero.badge": "Made in Switzerland",
    "hero.title": "Precision 3D Printing for Every Idea",
    "hero.description": "From custom prototypes to unique designs, Master 3D brings your concepts to life with Swiss-quality 3D printing. Fast delivery across Switzerland.",
    "hero.subtitle": "From custom prototypes to unique designs, Master 3D brings your concepts to life with Swiss-quality 3D printing. Fast delivery across Switzerland.",
    "hero.browseCatalog": "Browse Catalog",
    "hero.trackOrder": "Track Your Order",
    "hero.productsPrinted": "Products Printed",
    "hero.productsCount": "Products Printed",
    
    // Features
    "features.precisionTitle": "Precision Printing",
    "features.precisionDesc": "High-quality FDM and resin printing with layer accuracy down to 0.1mm.",
    "features.fastTitle": "Fast Delivery",
    "features.fastDesc": "Quick turnaround with shipping across all of Switzerland.",
    "features.qualityTitle": "Swiss Quality",
    "features.qualityDesc": "Every product is inspected to meet Swiss quality standards before shipping.",
    "features.quality.title": "Swiss Quality",
    "features.quality.desc": "Premium materials and precision printing for durable results",
    "features.shipping.title": "Fast Shipping",
    "features.shipping.desc": "Quick turnaround with delivery across Switzerland",
    "features.secure.title": "Secure Payment",
    "features.secure.desc": "TWINT and bank transfer options available",
    
    // Featured Products
    "featured.title": "Featured Products",
    "featured.subtitle": "Our most popular 3D printed products",
    "featured.viewAll": "View All",
    "featured.viewFullCatalog": "View Full Catalog",
    "featured.noProducts": "No featured products yet. Check back soon!",
    
    // Product Card
    "productCard.color": "Color",
    "productCard.addToCart": "Add to Cart",
    "productCard.freeShipping": "Free shipping",
    "product.addToCart": "Add to Cart",
    "product.selectColor": "Select Color",
    "product.shippingTime": "Shipping Time",
    "product.shippingCost": "Shipping Cost",
    "product.free": "Free",
    
    // Catalog
    "catalog.title": "Product Catalog",
    "catalog.subtitle": "Browse our full range of 3D printed products",
    "catalog.noProducts": "No products yet",
    "catalog.noProductsDesc": "Our catalog is being set up. Check back soon for amazing 3D printed products!",
    
    // Checkout
    "checkout.title": "Checkout",
    "checkout.subtitle": "Complete your order",
    "checkout.shippingDetails": "Shipping Details",
    "checkout.shippingOnly": "Shipping to Switzerland only",
    "checkout.fullName": "Full Name",
    "checkout.phoneNumber": "Phone Number",
    "checkout.phoneOptional": "(optional)",
    "checkout.phoneHelper": "Recommended for order tracking and updates",
    "checkout.street": "Street Address",
    "checkout.city": "City",
    "checkout.zip": "ZIP Code",
    "checkout.canton": "Canton",
    "checkout.placeOrder": "Place Order",
    "checkout.orderSummary": "Order Summary",
    "checkout.emptyCart": "Your cart is empty",
    "checkout.emptyCartDesc": "Add some products to get started!",
    "checkout.continueShopping": "Continue Shopping",
    
    // My Orders
    "myOrders.title": "My Orders",
    "myOrders.subtitle": "Track your orders and view order details",
    "myOrders.searchBy": "Search By",
    "myOrders.phoneNumber": "Phone Number",
    "myOrders.orderNumber": "Order Number",
    "myOrders.searchPlaceholder": "Enter your order number",
    "myOrders.search": "Search",
    "myOrders.searching": "Searching...",
    "myOrders.noOrders": "No orders found",
    "myOrders.paymentInfo": "Payment Info",
    "myOrders.trackOrder": "Track Order",
    
    // Order Success
    "orderSuccess.confirmed": "Order Confirmed!",
    "orderSuccess.orderNumber": "Your order number is",
    "orderSuccess.paymentInstructions": "Payment Instructions",
    "orderSuccess.shippingInfo": "Shipping Information",
    "orderSuccess.trackYourOrder": "Track Your Order",
    "orderSuccess.backToHome": "Back to Home",
    
    // Footer
    "footer.tagline": "Swiss 3D Printing Excellence",
    "footer.trackOrder": "Track Order",
    "footer.rights": "All rights reserved.",
    
    // Common
    "common.loading": "Loading...",
    "common.close": "Close",
    "common.total": "Total",
    "common.price": "Price",
  },
  fr: {
    // Navbar
    "nav.home": "Accueil",
    "nav.catalog": "Catalogue",
    "nav.myOrders": "Mes Commandes",
    
    // Hero
    "hero.badge": "Fabriqué en Suisse",
    "hero.title": "Impression 3D de Précision pour Chaque Idée",
    "hero.description": "Des prototypes personnalisés aux designs uniques, Master 3D donne vie à vos concepts avec une impression 3D de qualité suisse. Livraison rapide dans toute la Suisse.",
    "hero.subtitle": "Des prototypes personnalisés aux designs uniques, Master 3D donne vie à vos concepts avec une impression 3D de qualité suisse. Livraison rapide dans toute la Suisse.",
    "hero.browseCatalog": "Parcourir le Catalogue",
    "hero.trackOrder": "Suivre Votre Commande",
    "hero.productsPrinted": "Produits Imprimés",
    "hero.productsCount": "Produits Imprimés",
    
    // Features
    "features.precisionTitle": "Impression de Précision",
    "features.precisionDesc": "Impression FDM et résine de haute qualité avec une précision de couche jusqu'à 0,1 mm.",
    "features.fastTitle": "Livraison Rapide",
    "features.fastDesc": "Délai d'exécution rapide avec expédition dans toute la Suisse.",
    "features.qualityTitle": "Qualité Suisse",
    "features.qualityDesc": "Chaque produit est inspecté pour répondre aux normes de qualité suisses avant l'expédition.",
    "features.quality.title": "Qualité Suisse",
    "features.quality.desc": "Matériaux premium et impression de précision pour des résultats durables",
    "features.shipping.title": "Livraison Rapide",
    "features.shipping.desc": "Délai d'exécution rapide avec livraison dans toute la Suisse",
    "features.secure.title": "Paiement Sécurisé",
    "features.secure.desc": "Options TWINT et virement bancaire disponibles",
    
    // Featured Products
    "featured.title": "Produits en Vedette",
    "featured.subtitle": "Nos produits imprimés en 3D les plus populaires",
    "featured.viewAll": "Voir Tout",
    "featured.viewFullCatalog": "Voir le Catalogue Complet",
    "featured.noProducts": "Aucun produit en vedette pour le moment. Revenez bientôt!",
    
    // Product Card
    "productCard.color": "Couleur",
    "productCard.addToCart": "Ajouter au Panier",
    "productCard.freeShipping": "Livraison gratuite",
    "product.addToCart": "Ajouter au Panier",
    "product.selectColor": "Sélectionner la Couleur",
    "product.shippingTime": "Délai de Livraison",
    "product.shippingCost": "Frais de Port",
    "product.free": "Gratuit",
    
    // Catalog
    "catalog.title": "Catalogue de Produits",
    "catalog.subtitle": "Parcourez notre gamme complète de produits imprimés en 3D",
    "catalog.noProducts": "Aucun produit pour le moment",
    "catalog.noProductsDesc": "Notre catalogue est en cours de mise en place. Revenez bientôt pour découvrir d'incroyables produits imprimés en 3D!",
    
    // Checkout
    "checkout.title": "Paiement",
    "checkout.subtitle": "Finalisez votre commande",
    "checkout.shippingDetails": "Détails de Livraison",
    "checkout.shippingOnly": "Livraison en Suisse uniquement",
    "checkout.fullName": "Nom Complet",
    "checkout.phoneNumber": "Numéro de Téléphone",
    "checkout.phoneOptional": "(optionnel)",
    "checkout.phoneHelper": "Recommandé pour le suivi de commande et les mises à jour",
    "checkout.street": "Adresse",
    "checkout.city": "Ville",
    "checkout.zip": "Code Postal",
    "checkout.canton": "Canton",
    "checkout.placeOrder": "Passer Commande",
    "checkout.orderSummary": "Résumé de la Commande",
    "checkout.emptyCart": "Votre panier est vide",
    "checkout.emptyCartDesc": "Ajoutez des produits pour commencer!",
    "checkout.continueShopping": "Continuer vos Achats",
    
    // My Orders
    "myOrders.title": "Mes Commandes",
    "myOrders.subtitle": "Suivez vos commandes et consultez les détails",
    "myOrders.searchBy": "Rechercher Par",
    "myOrders.phoneNumber": "Numéro de Téléphone",
    "myOrders.orderNumber": "Numéro de Commande",
    "myOrders.searchPlaceholder": "Entrez votre numéro de commande",
    "myOrders.search": "Rechercher",
    "myOrders.searching": "Recherche...",
    "myOrders.noOrders": "Aucune commande trouvée",
    "myOrders.paymentInfo": "Info Paiement",
    "myOrders.trackOrder": "Suivre Commande",
    
    // Order Success
    "orderSuccess.confirmed": "Commande Confirmée!",
    "orderSuccess.orderNumber": "Votre numéro de commande est",
    "orderSuccess.paymentInstructions": "Instructions de Paiement",
    "orderSuccess.shippingInfo": "Informations de Livraison",
    "orderSuccess.trackYourOrder": "Suivre Votre Commande",
    "orderSuccess.backToHome": "Retour à l'Accueil",
    
    // Footer
    "footer.tagline": "Excellence Suisse en Impression 3D",
    "footer.trackOrder": "Suivre la Commande",
    "footer.rights": "Tous droits réservés.",
    
    // Common
    "common.loading": "Chargement...",
    "common.close": "Fermer",
    "common.total": "Total",
    "common.price": "Prix",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null
    if (saved && (saved === "en" || saved === "fr")) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
