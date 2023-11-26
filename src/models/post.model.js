import { Schema, model } from "mongoose";

const postSchema = new Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageUrls: {
            type: [String],
        },

        autor: {
            ref: "User",
            type: Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model("Post", postSchema);
