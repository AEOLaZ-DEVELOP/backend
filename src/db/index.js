import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)                      /* หลังจากเชื่อมต่อ connectionInstance จะเก็บข้อมูลการเชื่อมต่อและรายละเอียดต่าง ๆ เกี่ยวกับการเชื่อมต่อ (เช่น host, port) ในส่วนของ mongoose.connect จะคืนค่าเป็น promise l*/
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);                          /* หากการเชื่อมต่อสำเร็จ, จะพิมพ์ข้อความ "MongoDB connected" พร้อมกับชื่อของ host ที่เชื่อมต่อ (เช่น localhost หรือ IP ของ MongoDB server) และ connectionInstance.connection.host เป็นการเข้าถึงข้อมูล
                                                                                                                            การเชื่อมต่อของ MongoDB ซึ่งจะบอก host ที่เชื่อมต่อไป */
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)                                                                                                 /*  จะหยุดการทำงานของโปรเซส (แอป) หากการเชื่อมต่อ MongoDB ล้มเหลวโดยรหัส 1 หมายถึงการออกจากโปรเซสเนื่องจาก ข้อผิดพลาดถ้าการเชื่อมต่อสำเร็จ, แอปจะทำงานต่อไปตามปกติ แต่หากการเชื่อมต่อล้มเหลว, แอปจะหยุด
                                                                                                                            การทำงานที่จุดนี้ */
    }
}

export default connectDB