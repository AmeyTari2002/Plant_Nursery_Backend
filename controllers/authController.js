import { comaprePassword, hashPassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import  JWT  from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        //validation
        if (!name)
            return res.send({ erorr: 'Name is Required' })
        if (!email) 
            return res.send({ erorr: 'Email is Required' })
        if (!password)
            return res.send({ erorr: 'Password is Required' })
        if (!phone)
            return res.send({ erorr: 'Phone Number is Required' })
        if (!address)
            return res.send({ erorr: 'Address is Required' })

        //check user in database
        const existingUser = await userModel.findOne({ email: email });
        //existing user
        if (existingUser) {
            return res.status(200).send(
                {
                    success: false,
                    message: 'Already Register please Login',
                }
            )
        }
        //register User
        //password hash calling hashpassword from helpers
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({name,email,phone,address,password:hashedPassword}).save()

        res.status(201).send(
            {
                success:true,
                message:"User Register Successfully",
                user,
            }
        )

    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error
        })

    }
}

//Login Controller

export const loginController =async(req,res)=>{
    try{
        const {email,password}=req.body;
        //validation
        if(!email || !password)
        {
            return res.status(404).send({
                success:false,
                message:"Invalid Username or Password",
            })
        }
        //chech user if exist
        const user = await userModel.findOne({email})
        //check if not having the user 
        if(!user)
        {
            return res.status(200).send({
                success:false,
                message:"Email is not register"
            })
        }

        //compare function in auth helper
        const match = await comaprePassword(password,user.password)

        //if not matches the password
        if(!match)
        {
            return res.status(200).send({
                success:false,
                message:"Invalid Password"
            })
        }
        //if all value that is email and password is correct then create a token using sign method and _id which is present in database
        const token = JWT.sign({_id:user._id},process.env.JWT_SECRET, {expiresIn:'1d'})
        res.status(200).send({
            success:true,
            message:"Login Successful",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            token
        })
    }
    catch(error)
    {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Login",
            error
        })
    }

}

//upadte profile
export const updateProfile =async(req,res)=>{
    try {
        const {name,email,password,address,phone} = req.body
        const user = await userModel.findById(req.user._id)
        //password
        
        
        const hashedPassword = password ? await hashPassword(password) : undefined

        const updateUser = await userModel.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
        },{new:true})
        res.status(200).send({
            success:true,
            message:"Updated  Successful",
            updateUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while updating profile",
            error
        })
    }
} 


export const getOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };


  export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };

  //order status
export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };

//test controller

export const testController = (req,res)=>{
    res.send('Protected Routes')
}

