import { inngest } from "../client.js";
import User from "../../models/user.js";
export const onUserSignup  = inngest.createFunction(
    {id: "on-user-signup", retries:3},
    { event: "user/signup" },
    async ({ event, step }) => {
        try {
            const {email} = event.data
            await step.run("get-user-email", async() =>{
                const userObject = await User.findOne({email})
                if (!userObject) {
                    throw new Error("User not found");
                }
                return userObject;
            })
            await step.run("send-welcome-email", async () => {
                const subject = `Welcome to our service!`
                const message =`hi,
                \n\n
                thanks for signing up
                ` 
                await sendEmail(User.email, subject, message);
            })  
            return { success: true };         
        } catch (error) {
            console.error("Error in onSignup function:", error);
            return { success: false, error: error.message };
        }
    }
);