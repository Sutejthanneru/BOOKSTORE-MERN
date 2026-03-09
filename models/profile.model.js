import mongoose from "mongoose";
const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
   fullName: {
      type: String,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    bio: {
      type: String,
      trim: true
    },

    avatar: {
      type: String 
    },
    address: {
      type: String,
      trim: true
    }
    
},
{
    timestamps:true
});

export default mongoose.model("Profile",profileSchema);