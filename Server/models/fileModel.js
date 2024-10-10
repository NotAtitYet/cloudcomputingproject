import mongoose from "mongoose";
const fileSchema = new mongoose.Schema({
    ownerID: String,
    fileName: String,
    fileType: String,
    caption: String,
    fileURL: String,
});
export default mongoose.model('FileMetaData',fileSchema);