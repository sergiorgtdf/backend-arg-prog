import { Schema, model } from "mongoose";

const taskSchema = new Schema(
    {
        title: {
            type: String,
            require: true,
        },

        description: {
            type: String,
            require: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        userId: {
            ref: "User",
            type: Schema.Types.ObjectId,
            require: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model("Task", taskSchema);
