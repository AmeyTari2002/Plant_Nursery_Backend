import expres from 'express'
import { isAdmin, requireSignin } from '../middlewares/authMiddleware.js'
import {  categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js'


const router = expres.Router()

//routes

router.post('/create-category',requireSignin,isAdmin,createCategoryController)

//update
router.put('/update-category/:id',requireSignin,isAdmin,updateCategoryController)

//get all category
router.get('/get-category', categoryController)

//single category 
router.get('/single-category/:slug',singleCategoryController)

//delete category
router.delete('/delete-category/:id',requireSignin,isAdmin,deleteCategoryController)


export default router