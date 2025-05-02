import express from 'express'
import { selectItemsForCheckout, getCheckoutSummary } from '../controllers/checkout.controller'
import { verifyToken } from '../middlewares/verifyToken'

const router = express.Router()

router.post('/select', verifyToken, selectItemsForCheckout)
router.get('/summary', verifyToken, getCheckoutSummary)

export default router
