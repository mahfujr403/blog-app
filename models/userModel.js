import mongoose from "mongoose";
import bcrypt from "bcrypt";



const userSchema = new mongoose.Schema({
    name : String,
    email : { type: String, unique: true },
    password : String,
    createdAt : { type: Date, default: Date.now }
})



// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model('User', userSchema);
export { User };