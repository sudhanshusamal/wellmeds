import nc from 'next-connect'
import User from '../../../models/User'
import { validateEmail } from '../../../utils/validation';
import db from '../../../utils/db'
import bcrypt from "bcrypt";
import { createActivationToken } from '../../../utils/tokens';
import { sendEmail } from '@/utils/sendEmails';
import { activateEmailTemplate } from '@/emails/activateEmailTemplate';
const handler = nc();

handler.post(async (req, res) => {
    try {
        await db.connectDb();
        const { name, email, password } = req.body;
        if (!name || !email || !password) {

            return res.status(400).json({ message: "Please fill all fields" })
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email" })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already existed" })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "password must contain 8" })
        }
        const cryptedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, password: cryptedPassword })
        const addedUser = await newUser.save();
        const activation_token = createActivationToken({
            id: addedUser._id.toString(),
        })
        const url = `${process.env.BASE_URL}/activate/${activation_token}`
        sendEmail(email, url, "", "Activate your WELLMEDS account.", activateEmailTemplate)
        await db.disconnectDb();
        res.json({ message: 'Register success! Please confirm your email to continue.' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

});

export default handler;