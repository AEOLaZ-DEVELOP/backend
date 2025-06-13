import {v2 as cloudinary} from "cloudinary"                                             /* ใช้การ import Cloudinary SDK เวอร์ชัน v2 แล้วตั้งชื่อว่า cloudinary เป็นรูปแบบการ rename import เพื่อใช้ v2 API โดยเฉพาะ (เช่น .uploader.upload()) */
import fs from "fs"

cloudinary.config({                                                                     /* กำหนดค่า การเชื่อมต่อกับ Cloudinary จาก environment variables โดย process.env.XXX → อ่านค่าจาก .env เช่น: */
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {                                   /* รับพารามิเตอร์เป็น path ของไฟล์ที่อยู่ในเครื่อง (local) ที่ต้องการอัปโหลด */
    try {
        if (!localFilePath) return null                                                 /* ตรวจสอบว่ามี localFilePath จริงหรือไม่ (ถ้าไม่มี → return null) */
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {              /* เรียกใช้เมธอด upload() ของ Cloudinary เพื่ออัปโหลดไฟล์ */
            resource_type: "auto"                                                       /* esource_type: "auto" → ให้ Cloudinary ตรวจว่าเป็น image / video / raw โดยอัตโนมัติ */
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)                                                    /* ลบไฟล์ต้นฉบับที่อยู่ในเครื่องหลังอัปโหลดสำเร็จใช้ .unlinkSync() ของ fs ซึ่งเป็น synchronous (บล็อก thread เล็กน้อยแต่เหมาะกับ use case นี้) */
        return response;                                                                /* ส่งคืนผลลัพธ์ response ของ Cloudinary API ซึ่งจะมีข้อมูล เช่น: 
                                                                                            {
                                                                                                public_id: "abc123",
                                                                                                secure_url: "https://res.cloudinary.com/.../file.jpg",
                                                                                                resource_type: "image"
                                                                                            }
                                                                                        */

    } catch (error) {                                                                   /* ถ้าเกิดข้อผิดพลาดในการอัปโหลด (เช่น ไฟล์เสีย, API ล่ม) */
        fs.unlinkSync(localFilePath)                                                    /* remove the locally saved temporary file as the upload operation got failed (ให้ลบไฟล์ต้นฉบับในเครื่องทิ้งเหมือนเดิม เพื่อไม่ให้ไฟล์ขยะสะสม) */
        return null;
    }
}

export {uploadOnCloudinary}