// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
// import {app} from './app.js'
dotenv.config({
    path: './.env'
})


connectDB()
// .then(() => {                                                                           /* .then() ใช้สำหรับจัดการผลลัพธ์ที่ได้เมื่อ Promise สำเร็จเมื่อการเชื่อมต่อ MongoDB สำเร็จ (และฟังก์ชัน connectDB ส่งคืน Promise ที่ resolve), คำสั่งใน then() จะถูกเรียกในกรณีนี้จะเป็นการ เริ่มเซิร์ฟเวอร์ Express ด้วย app.listen() */
//     app.listen(process.env.PORT || 8000, () => {
//         console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
//     })
// })
// .catch((err) => {                                                                       /* หากมีข้อผิดพลาดในขั้นตอนการเชื่อมต่อกับ MongoDB (หรือหากเกิดข้อผิดพลาดใน connectDB()), catch() จะถูกเรียกเพื่อจับข้อผิดพลาดนั้น err จะเก็บข้อผิดพลาดที่เกิดขึ้น */
//     console.log("MONGO db connection failed !!! ", err);
// })
