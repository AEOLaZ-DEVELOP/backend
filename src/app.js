import express from "express"
import cors from "cors"                                                             /* นำเข้า CORS (Cross-Origin Resource Sharing) middleware เพื่อจัดการการเข้าถึงทรัพยากรจากแหล่งข้อมูล (domains) อื่นในกรณีนี้ CORS ถูกใช้เพื่ออนุญาตให้มีการร้องขอจากโดเมนที่ระบุใน environment variable CORS_ORIGIN */
import cookieParser from "cookie-parser"                                            /* นำเข้า cookie-parser middleware ที่ช่วยในการอ่าน cookies จาก HTTP requests */
    /*  --- ✅ cookieParser ---
        📌 การใช้ import cookieParser from "cookie-parser" ใน Node.js server (โดยเฉพาะเมื่อใช้ Express framework) มีเหตุผลหลายประการ เนื่องจาก cookie-parser เป็น middleware ที่ช่วยให้คุณสามารถ อ่าน และ จัดการ cookies ที่ส่งมาพร้อมกับ HTTP request ได้ง่ายขึ้น
        📌 เหตุผลที่ใช้ cookie-parser:
            👉 การอ่านและจัดการ Cookies ใน Request:
                ➡️ Cookies เป็นข้อมูลที่ถูกส่งจาก client (เบราว์เซอร์) ไปยัง server ในรูปแบบของ key-value pairs
                ➡️ ในแอปพลิเคชันเว็บ, cookies มักถูกใช้สำหรับ:
                    🧱 การจัดการ session หรือ authentication tokens
                    🧱 การบันทึกข้อมูลของผู้ใช้ เช่น การตั้งค่า preference หรือข้อมูลการติดตาม
                ➡️ ด้วย cookie-parser, คุณสามารถ อ่าน cookies ใน request ได้ง่าย ๆ และใช้ข้อมูลเหล่านั้นในการประมวลผลคำขอจาก client
            👉 ง่ายต่อการเข้าถึงข้อมูล cookies:
                ➡️ หลังจากที่คุณใช้ cookie-parser middleware, cookies จะถูกแปลงเป็น object ที่สามารถเข้าถึงได้ง่ายจาก req.cookies
                ➡️ ตัวอย่างเช่น หากมี cookie ชื่อ userId, คุณสามารถเข้าถึงมันได้โดยตรงจาก req.cookies.userId
            👉 จัดการกับ Cookies ได้ง่าย:
                ➡️ cookie-parser ยังช่วยในการเข้ารหัสและถอดรหัส cookies ในกรณีที่ cookies ถูก signed (เช่น cookies ที่ถูกเข้ารหัสเพื่อป้องกันการปลอมแปลงข้อมูล)
                ➡️ มันช่วยให้คุณสามารถจัดการกับ signed cookies ได้อย่างปลอดภัย โดยไม่ต้องเขียนโค้ดเข้ารหัส/ถอดรหัสเอง
            👉 การจัดการกับ JSON Cookies:
                ➡️ นอกจากนี้ cookie-parser ยังสามารถใช้ JSON cookies ได้ ซึ่งทำให้การจัดการข้อมูลใน cookies ง่ายขึ้น โดยไม่ต้องแปลงข้อมูลด้วยตนเอง
                ➡️ ตัวอย่างเช่น หากคุณต้องการเก็บข้อมูลใน cookies เป็น JSON object, cookie-parser จะช่วยให้คุณสามารถ parse ข้อมูล JSON ใน cookies ได้
            👉 ความปลอดภัย:
                ➡️ การใช้ cookie-parser ช่วยให้คุณสามารถตั้งค่าการตรวจสอบ signed cookies และตรวจสอบความถูกต้องของข้อมูลใน cookies ได้
                ➡️ หากคุณใช้ cookie-parser พร้อมกับการใช้ signed cookies, คุณสามารถป้องกันการปลอมแปลงข้อมูลใน cookies ได้ (เช่น tokens หรือ session IDs)
            👉 ในตัวอย่างข้างต้น:
                ➡️ cookieParser() middleware จะทำให้เราสามารถ อ่าน cookies จาก req.cookies ได้โดยตรง
                ➡️ ใน route /set-cookie, เซิร์ฟเวอร์จะตั้งค่า cookie ชื่อ userId ด้วยค่าที่กำหนด
                ➡️ ใน route /get-cookie, เซิร์ฟเวอร์จะอ่านค่าของ cookie userId จาก request
            👉 สรุป:
                ➡️ การใช้ cookie-parser ใน Node.js และ Express ช่วยให้การ จัดการกับ cookies ทำได้ง่ายขึ้น โดยไม่ต้องเขียนโค้ดจัดการกับ cookies ด้วยตัวเอง:
                    🧱 ช่วย อ่าน cookies จาก request ได้ง่าย
                    🧱 ช่วยจัดการกับ signed cookies และ JSON cookies
                    🧱 ทำให้สามารถเข้าถึงข้อมูลจาก cookies ได้ง่ายและสะดวก
                    🧱 ช่วยเพิ่มความ ปลอดภัย ในการจัดการ cookies
    */

const app = express()

app.use(cors({                                                                      /* ใช้ middleware cors() เพื่อเปิดใช้งาน CORS */
    origin: process.env.CORS_ORIGIN,                                                /* กำหนดโดเมนที่สามารถเข้าถึง API นี้ (อ่านจาก environment variable CORS_ORIGIN) */
    credentials: true                                                               /* อนุญาตให้ใช้งาน cookies หรือข้อมูลการพิสูจน์ตัวตนที่ส่งมาพร้อมคำขอ */
}))

app.use(express.json({limit: "16kb"}))                                              /* ใช้ express.json() middleware สำหรับการแปลงข้อมูลใน request body ให้เป็น JSON โดย limit: "16kb" กำหนดขนาดสูงสุดของข้อมูลใน request body ที่สามารถส่งได้ (จำกัดไว้ที่ 16KB) */
app.use(express.urlencoded({                                                        /* ใช้ express.urlencoded() middleware สำหรับการแปลงข้อมูลที่ส่งในรูปแบบ application/x-www-form-urlencoded (เช่น form submission) */
    extended: true,                                                                 /* extended: true เปิดให้ใช้งานการเข้ารหัสข้อมูลที่ซับซ้อน (สามารถใช้งาน object หรือ array ได้) */
    limit: "16kb"                                                                   /* limit: "16kb" กำหนดขนาดสูงสุดของข้อมูลใน request body ที่สามารถส่งได้ (จำกัดไว้ที่ 16KB) */
}))                        

app.use(express.static("public"))                                                   /* ใช้ express.static() เพื่อให้เซิร์ฟเวอร์สามารถเสิร์ฟไฟล์ static (เช่น HTML, CSS, JS, รูปภาพ) จากโฟลเดอร์ public */
app.use(cookieParser())                                                             /* ใช้ cookieParser() middleware เพื่อให้สามารถอ่าน cookies จาก request ได้ */


//routes import
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)

export { app }