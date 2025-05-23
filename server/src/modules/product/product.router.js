import { Router } from 'express'
import auth from '../../middleware/auth.js'
import { validation } from '../../middleware/validation.js'
import { asyncHandler } from '../../utils/errorHandling.js'
import { fileUpload } from '../../utils/multer.js'
import reviewsRouter from '../reviews/reviews.router.js'
import {  addProduct, productList, updateProduct, deleteProduct, getProductById, getAllProducts } from './product.controller.js'

import { addProductSchema, Headers, deleteProductSchema, updateProductSchema } from './product.validation.js'
const router = Router()

router.use("/:productId/reviews", reviewsRouter)
router.post(
  '/',
  validation(Headers, true),
  auth(),
  fileUpload({}).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 2 },
  ]),
  validation(addProductSchema),
  asyncHandler(addProduct),
)

router.put(
  '/:productId',
  validation(Headers, true),
  auth(),
  fileUpload({}).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 2 },
  ]),
  validation(updateProductSchema),
  asyncHandler(updateProduct),
)

router.delete('/:productId',
  auth(),
  validation(deleteProductSchema),
  asyncHandler(deleteProduct)
);

router.get('/all', asyncHandler(getAllProducts));

router.get('/:productId', asyncHandler(getProductById));

router.get('/', asyncHandler(productList));


export default router
