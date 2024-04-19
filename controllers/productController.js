import slugify from "slugify"
import productModel from "../models/productModel.js"
import categoryModel from "../models/categoryModel.js"
import fs from 'fs'
import braintree from "braintree"
import orderModel from "../models/orderModel.js"
import dotenv from 'dotenv'

dotenv.config()

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});



export const productController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        switch (true) {
            case !name:
                return res.status(500).send({ error: "name is required" })
            case !description:
                return res.status(500).send({ error: "description is required" })
            case !price:
                return res.status(500).send({ error: "price is required" })
            case !category:
                return res.status(500).send({ error: "category is required" })
            case !quantity:
                return res.status(500).send({ error: "quantity is required" })
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "photo is required and should be less than 1 MB" })
        }
        const product = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }
        await product.save()
        res.status(201).send({
            success: true,
            message: 'Product Created Successfully',
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "error in creating product"
        })
    }
}
export const updateController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        switch (true) {
            case !name:
                return res.status(500).send({ error: "name is required" })
            case !description:
                return res.status(500).send({ error: "description is required" })
            case !price:
                return res.status(500).send({ error: "price is required" })
            case !category:
                return res.status(500).send({ error: "category is required" })
            case !quantity:
                return res.status(500).send({ error: "quantity is required" })
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "photo is required and should be less than 1 MB" })
        }
        const product = await productModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }
        await product.save()
        res.status(201).send({
            success: true,
            message: 'Product Updated Successfully',
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error: error.message,
            message: "error in creating product"
        })
    }
}

export const getProductController = async (req, res) => {
    try {
        const product = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(201).send({
            success: true,
            totalCount: product.length,
            product,
            message: 'All product fetched',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error: error.message,
            message: "error in getting product"
        })
    }
}
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate('category')
        res.status(200).send({
            success: true,
            product,
            message: 'All product fetched',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error: error.message,
            message: "error in getting product"
        })
    }
}
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error: error.message,
            message: "error in getting product"
        })
    }
}
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            product,
            message: 'Product Deleted',
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error: error.message,
            message: "error in getting product"
        })
    }
}

export const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked.length) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            products,
            message: 'Product Deleted',
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            error: error.message,
            message: "error while filtering Products"
        })
    }
}

//total numbers of documents
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total,
            message: 'Estimated Documents Fetch',
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            error: error.message,
            message: "error while pagination Products"
        })
    }
}


// https://chat.openai.com/c/73b63321-0e95-4ce5-ad42-5e1593d3904a

//Product list based on page
export const productListController = async (req, res) => {
    try {
        const perPage = 6
        const page = req.params.page ? req.params.page : 1  //page number 2 1 3 ans so on
        const products = await productModel.find({}).select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            products,
            message: 'Estimated Documents Per Page Fetch',
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            error: error.message,
            message: "error while pagination Products"
        })
    }
}


// searchProductController

export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const result = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ]
        }).select("-photo")
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            error: error.message,
            message: "error while searching Products"
        })
    }
}

export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(2).populate("category")
        res.status(200).send({
            success: true,
            products,
            message: 'Estimated Documents Per Page Fetch',
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            error: error.message,
            message: "error while getting Related Products"
        })
    }
}


export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug })
        const products = await productModel.find({ category }).populate('category')
        res.status(200).send({
            success: true,
            category,
            products,
            message: 'Estimated Documents Per Page Fetch',
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            error: error.message,
            message: "error while getting Category Products"
        })
    }
}



//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
}
export const braintreePaymentController = async (req,res) => {
    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
}
