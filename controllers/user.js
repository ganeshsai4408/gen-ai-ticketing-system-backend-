import bcrypt from 'bcrypt';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { inngest } from '../inngest/client.js';

export const signup = async (req, res) => {
    const { email, password, skills = [], role = "user" } = req.body;
    try {
       const hashed = bcrypt.hashSync(password, 10);
       const user = await User.create({ email, password: hashed, skills, role });

       await inngest.send({
              name: 'user.signup',
              data: {
                email
              }
         });
         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
         // Return user without password
         const userResponse = { ...user.toObject() };
         delete userResponse.password;
         res.json({user: userResponse, token});

        

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: error.message });
        console.error("Signup error:", error);
    }

}
export const login = async (req, res) =>{
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        // Return user without password
        const userResponse = { ...user.toObject() };
        delete userResponse.password;
        res.json({user: userResponse, token});
    } catch (error) {
         res.status(500).json({ error: error.message });
    }
   
}
export const logout = async (req, res) =>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        jwt.verify(token, process.env.JWT_SECRET);
        res.json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });

  
    }
}
export const UpdateUser = async (req, res) =>{
    const {skills = [], role, email}= req.body
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({ error: "Forbidden" });
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await User.updateOne({ email }, { skills: skills.length ? skills : user.skills, role });
        return res.json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });     

    }
}
export const getUsers = async (req, res) =>{
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({ error: "Forbidden" });
        }
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const { email } = req.params;
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({ error: "Forbidden" });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        await User.deleteOne({ email });
        res.json({ message: `User ${email} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}