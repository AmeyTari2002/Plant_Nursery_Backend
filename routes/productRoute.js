import  express  from "express";
const router = express.Router()
import { isAdmin, isUser, requireSignin } from "../middlewares/authMiddleware.js";
import { braintreePaymentController, braintreeTokenController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productController, productCountController, productFilterController, productListController, productPhotoController, relatedProductController, searchProductController, updateController } from "../controllers/productController.js";
import formidable from "express-formidable";

//router
router.post('/create-product', requireSignin,formidable(), isAdmin,productController )
router.put('/update-product/:pid', requireSignin,formidable(), isAdmin,updateController )
router.get('/   ', getProductController)
router.get('/get-product/:slug', getSingleProductController)
router.get('/product-photo/:pid', productPhotoController)
router.get('/product/:pid', deleteProductController)
router.post('/product-filters', productFilterController)
router.get('/product-count', productCountController)
router.get('/product-list/:page', productListController) //product per page
router.get('/search/:keyword', searchProductController) 
router.get('/related-product/:pid/:cid', relatedProductController) 
router.get('/product-category/:slug', productCategoryController) 

//payments route 
//token->milta h braintree sa that are account get verify
router.get('/braintree/token', braintreeTokenController) 

//payment
router.post('/braintree/payment',requireSignin, braintreePaymentController)

export default router;