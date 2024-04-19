import  express  from "express";
import {registerController,loginController, testController, updateProfile, getOrdersController, getAllOrdersController, orderStatusController} from "../controllers/authController.js";
import { isAdmin, isUser, requireSignin } from "../middlewares/authMiddleware.js";
//router Object
const router =express.Router();


//routing
//register || method:POST
router.post('/register',registerController)

//LOGIN || METHOD:POST
router.post('/login',loginController)

//test controller
router.get('/test',requireSignin,isAdmin ,testController)

//protected auth for user
// router.get('/user-auth',requireSignin,isUser,(req,res)=>{
router.get('/user-auth',requireSignin,(req,res)=>{
    res.status(200).send({ok:true})
})
//protected route for admin
router.get('/admin-auth',requireSignin,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

//update profile
router.put('/profile',requireSignin,updateProfile);

//orders
router.get("/orders", requireSignin, getOrdersController);

//all orders
router.get("/all-orders", requireSignin, isAdmin, getAllOrdersController);

// order status update
router.put("/order-status/:orderId",requireSignin,isAdmin,orderStatusController);

export default router
