import nc from "next-connect";
import bcrypt from "bcrypt";
import { validateEmail } from "../../../utils/validation";
import db from "../../../utils/db";
import User from "../../../models/User";
import { createActivationToken, createResetToken } from "../../../utils/tokens";
import { sendEmail } from "../../../utils/sendEmails";
import { resetEmailTemplate } from "../../../emails/resetEmailTemplate";
const handler = nc();

handler.put(async (req, res) => {
  try {
    await db.connectDb();
    const { user_id, emailVerified } = req.body;
    
    const user= await User.findById(user_id);
    if(!user) {
        return res.status(400).json({message: "This account doesn't exist"})
    }
    
    await user.updateOne({
        emailVerified: "true",
    });
    res.json({email: user.email})
    res.send(user)
    
    
    await db.disconnectDb();
    res.json({
        message: "Your request for reset password is confirm",
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default handler;