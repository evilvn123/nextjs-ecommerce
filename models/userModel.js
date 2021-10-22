import { mongoose } from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    root: {
      type: String,
      default: false,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dming-nextjs/image/upload/v1634301479/nextjs_ecommerce/1024px-User-avatar.svg_fwdsck.png",
    },
  },
  {
    timestamps: true,
  }
);

let Dataset = mongoose.models.user || mongoose.models("user", userSchema);

export default Dataset;
