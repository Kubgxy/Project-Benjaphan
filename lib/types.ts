export interface Product {
  id: string
  name: string
  category: string
  price: number
  formattedPrice: string
  description: string
  details: string[]
  features: string[]
  images: string[]
  rating: number
  reviews: number
  isNew: boolean
  isBestseller: boolean
  isOnSale: boolean
  discount?: number
  availableSizes?: string[]
  availableColors?: {
    name: string
    value: string
  }[]
  materials: string[]
  stock: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  featured: boolean
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string
  image: string
  products: string[] // Product IDs
}

export interface Testimonial {
  id: string
  name: string
  avatar: string
  role: string
  content: string
  rating: number
  date: string
}

export interface Brand {
  id: string
  name: string
  logo: string
  description: string
}

export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface PaymentInfo {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
}

export interface OrderDetails {
  items: {
    productId: string
    name: string
    price: number
    quantity: number
    selectedSize?: string
    selectedColor?: string
  }[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingInfo: ShippingInfo
  paymentInfo: PaymentInfo
}

export interface Order {
  id: string
  details: OrderDetails
  status: "pending" | "processing" | "shipped" | "delivered"
  createdAt: string
}

