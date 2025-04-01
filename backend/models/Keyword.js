import mongoose from "mongoose";

const keywordSchema = new mongoose.Schema({
    company: { type: String, required: true }, // To associate with a specific company
    roles: [
        {
            role: { type: String, required: true },
            keywords: { type: [String], required: true }, // Array of keywords for the role
        },
    ],
});

export const Keyword = mongoose.model("Keyword", keywordSchema);
