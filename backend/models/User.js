import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    company: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "member"],
        default: "user"
    },
    jobCompatibilityScores: {
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
        score: { type: Number, required: true },
        date: { type: Date, default: Date.now }
    }
})

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

const UserModel = mongoose.model("User", UserSchema);
export { UserModel as User };