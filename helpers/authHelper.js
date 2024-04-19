import bcrypt from "bcrypt"

//hash fucntion
export const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword
    }
    catch (error) {
        console.log(error)
    }

}
//compare function

export const comaprePassword =async(password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword);
}