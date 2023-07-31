import nc from "next-connect";
import User from "../../../models/User";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";
import bcrypt from 'bcrypt'
const handler = nc().use(auth);

handler.put(async (req, res) => {
  try {
    db.connectDb();
    const { cur_password, password } = req.body;
    const user = await User.findById(req.user);
    const enc_pass = await bcrypt.hash(password, 12);
    if(!user.password) {
      await user.updateOne({
        password: enc_pass,
      });
      return res.status(200).json({message: "Password added to your social login."})
    }
    const isMatch = await bcrypt.compare(cur_password, user.password)
    if(!isMatch) {
      return res.status(400).json({message: "Your existing password is incorrect."})
    }
    await user.updateOne({
      password: enc_pass,
    })
    db.disconnectDb();
    return res.status(200).json({message: "Password Changed Successfully"})
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default handler;