import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: false, unique: true },
    password: { 
        type: String,
        required: function() {
            return !this.googleId; // Password is required if googleId is not provided
        }
     },
    fullname: { type: String, required: true },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    },
    googleId: {
        type: String,
    },
    avatar: {
        type: String,
        default: null
    },
    addresses: [
        {
            label: { type: String, default: "Home" },
            line1: { type: String, required: true },
            line2: { type: String },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            isDefault: { type: Boolean, default: false }
        }
    ],
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        }
    ]
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) 
        return;
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
}
)
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("User", userSchema);

export default userModel;