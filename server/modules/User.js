import mongoose from 'mongoose';


export const userSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  });  

export const UserModel = mongoose.model("register", userSchema);

