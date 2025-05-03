import { Request, Response } from 'express'
// import SelectedCheckout from '../Models/Checkout'
// import Product from '../Models/Product'

import Product from '../Models_GPT/Product' // Model

export const selectItemsForCheckout = async (req: Request, res: Response) => {
  const userId = req.user?.userId
  const { items } = req.body

  if (!userId || !items) {
    res.status(400).json({ message: 'Missing user or items' })
    return 
  }

  try {
    // validate products exist
    for (const item of items) {
      const product = await Product.findOne({ id_product: item.productId })
      if (!product) {
        res.status(404).json({ message: `Product not found: ${item.productId}` })
        return 
      }
    }

    const existing = await SelectedCheckout.findOne({ userId })

    if (existing) {
      existing.items = items
      await existing.save()
    } else {
      await SelectedCheckout.create({ userId, items })
    }

    res.status(200).json({ success: true, message: 'Selected items saved for checkout' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error })
  }
}

export const getCheckoutSummary = async (req: Request, res: Response) => {
  const userId = req.user?.userId

  if (!userId) {
    res.status(400).json({ message: 'Missing user' })
    return 
  }

  try {
    const selected = await SelectedCheckout.findOne({ userId })

    if (!selected || selected.items.length === 0) {
    res.status(200).json({ message: 'No selected items', items: [] })
      return 
    }

    let subtotal = 0
    const detailedItems = []

    for (const item of selected.items) {
      const product = await Product.findOne({ id_product: item.productId })

      if (!product) continue

      const total = product.price * item.quantity
      subtotal += total

      detailedItems.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        images: product.images,
      })
    }

    const shipping = 50
    const total = subtotal + shipping 

    res.status(200).json({
      items: detailedItems,
      subtotal,
      shipping,
      total,
    }) 
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error })
  }
}
