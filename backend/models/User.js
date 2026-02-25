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
    iv: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
  },
});

export default mongoose.model("User", UserSchema);
