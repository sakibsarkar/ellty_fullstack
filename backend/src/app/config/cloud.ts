import { v2 as cloudinary } from "cloudinary";
import Config from ".";

cloudinary.config({
  cloud_name: Config.CD_CLOUD_NAME,
  api_key: Config.CD_API_KEY,
  api_secret: Config.CD_API_SECRET,
});
export default cloudinary;
