import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  matricNumber: {
    type: String,
    required: true,
    unique: true,
  },
  faceDescriptor: {
    type: [Number],
    required: true,
  },
});

export default mongoose.model("User", UserSchema);
