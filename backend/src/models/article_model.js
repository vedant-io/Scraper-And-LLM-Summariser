import mongoose from "mongoose";

const articleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    author: {
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Article = mongoose.model("Article", articleSchema);
