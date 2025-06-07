import multer from "multer";                            /* import โมดูล multer ซึ่งเป็น middleware ยอดนิยมใน Express สำหรับจัดการ multipart/form-data เช่น ไฟล์ที่แนบจาก form <input type="file"> โดย multer จะทำหน้าที่แปลงข้อมูล binary และนำมาเก็บในไฟล์หรือ memory */

const storage = multer.diskStorage({                    /* สร้างตัวแปรชื่อ storage ซึ่งเป็น object ที่กำหนดวิธีจัดเก็บไฟล์ (storage engine) โดยใช้ multer.diskStorage() → คือการสั่งให้ multer เก็บไฟล์ลงดิสก์ (hard disk) ในตำแหน่งที่กำหนดไว้ */
    destination: function (req, file, cb) {
      cb(null, "./public/temp")                         /* บันทึกไฟล์ที่ ./public/temp */
    },
    /* --- ✅ การทำงาน destination
            📌พารามิเตอร์:
                👉 req → request object จาก Express
                👉 file → ข้อมูลเกี่ยวกับไฟล์ เช่น originalname, mimetype, buffer
                👉 cb → callback เพื่อส่งกลับ path
            📌 พารามิเตอร์ในที่นี้: ให้ multer บันทึกไฟล์ที่ ./public/temp
    */
    filename: function (req, file, cb) {
      cb(null, file.originalname)                       /* ใช้ file.originalname → คือชื่อไฟล์จากฝั่ง client เช่น “avatar.png” ⚠️ ถ้ามีไฟล์ชื่อซ้ำใน ./public/temp → มันจะถูกเขียนทับ (ไม่แนะนำใน production) (ทางที่ดีควรใช้ Date.now() หรือ UUID เพื่อให้ชื่อไม่ซ้ำ) */
    /* --- ✅ การทำงาน filename
            📌 กำหนด ชื่อไฟล์ที่บันทึกไว้ในเครื่อง
            📌 ใช้ file.originalname → คือชื่อไฟล์จากฝั่ง client เช่น “avatar.png”
            📌 ถ้ามีไฟล์ชื่อซ้ำใน ./public/temp → มันจะถูกเขียนทับ (ไม่แนะนำใน production)
          🔥🔥🔥 (ทางที่ดีควรใช้ Date.now() หรือ UUID เพื่อให้ชื่อไม่ซ้ำ)
    */
    }
  })
    /* --- ✅ การทำงาน storage= multer.diskStorage({...})
            📌 const storage = multer.diskStorage({ destination, filename })
              👉 หมายความว่า: Multer จะเก็บไฟล์ไว้ใน ./public/temp และใช้ชื่อไฟล์เดิม
    */

              export const upload = multer({ 
    storage,                                            /* storage ที่กำหนดจะใช้เป็น config ของ instance นี้ */
})