import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true, //veri ne zaman oluşturuldu ve güncellendi bilgisini veriyor
  }
);
export const User = mongoose.model("User", userSchema);
