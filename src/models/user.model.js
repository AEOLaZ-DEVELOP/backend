import mongoose, {Schema} from "mongoose";                                      /* mongoose: ใช้ในการเชื่อมต่อและทำงานกับ MongoDB ใน Node.js และ Schema: ใช้สำหรับการสร้าง Schema ใน Mongoose (เป็นโครงสร้างที่ใช้กำหนดข้อมูลใน MongoDB) */
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,                                                         /* ตัดช่องว่างที่เกิน */
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [                                                         /* กำหนดให้ฟิลด์ password เป็น required (จำเป็นต้องมีค่า) หากไม่มีการป้อนค่ารหัสผ่านในขณะที่สร้างหรืออัปเดตข้อมูลผู้ใช้ จะเกิดข้อผิดพลาดและไม่สามารถบันทึกข้อมูลได้ค่าของ required เป็น array ซึ่งมี 2 ค่า: */
                true,                                                           /* true: ระบุว่า ฟิลด์นี้ต้องมีค่า (ไม่สามารถเป็น null หรือ undefined) */
                'Password is required'                                          /* 'Password is required': ข้อความแสดงข้อผิดพลาดที่จะถูกแสดงหากไม่มีการป้อนรหัสผ่าน */
            ]                                
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {                                  /* ใช้เพื่อทำงานบางอย่างก่อนที่จะบันทึก (save) ข้อมูลลงในฐานข้อมูลก็คือ async function (next) {...} */
    if(!this.isModified("password")) return next();                             /* ถ้าหากรหัสผ่านไม่ได้ถูกแก้ไข (isModified("password") ตรวจสอบว่า password มีการเปลี่ยนแปลงหรือไม่) ก็ให้ข้ามไปที่ next() โดยไม่ทำการเข้ารหัสโดย isModified คือเมธอดที่ใช้ตรวจสอบว่า ฟิลด์ (field) ว่าถูกแก้ไขหรือไม่โดย this ในที่นี้หมายถึง document ของ 
                                                                                   Mongoose ที่กำลังทำงานอยู่ (เช่น ผู้ใช้หรือข้อมูลที่เก็บใน MongoDB) โดย password คือ ฟิลด์ ของ document ถ้าฟิลด์ password ไม่ได้ถูกแก้ไข มันจะคืนค่าเป็น false โดย isModified จะตรวจสอบค่าจาก user ที่ส่งมาเช่น รูปแบบ json ถ้าใน json ไม่มี key password
                                                                                   isModified จะ check แค่ feild หรือ key password ที่ส่งมาเท่านั้นไม่เกี่ยวกับ feild password ใน database */
    this.password = await bcrypt.hash(this.password, 10)                        /* หากรหัสผ่านมีการเปลี่ยนแปลง ก็จะทำการเข้ารหัสรหัสผ่านด้วย bcrypt โดยใช้ salt rounds เป็น 10 */
    next()                                                                      /* หลังจากการเข้ารหัสรหัสผ่านเสร็จแล้วให้ดำเนินการต่อไปคือ event "save" */
})
 /* --- ✅ การทำงาน userSchema.pre (...)
            📌 userSchema.pre("save", ...):
                👉 นี่คือการใช้ pre-save hook ของ Mongoose ซึ่งหมายความว่าโค้ดในบล็อกนี้จะทำงานก่อนที่จะทำการบันทึกข้อมูล (save) ลงใน MongoDB
                👉 pre("save"): save คือ event ที่จะเกิดขึ้นก่อนการบันทึกข้อมูลในฐานข้อมูล (เช่น เมื่อคุณสร้างหรืออัพเดต document ใน MongoDB) สามารถอธิบายได้ว่าเป็น event hook ที่มีลักษณะคล้ายกับ event emitter แต่มีการใช้งานในบริบทที่เฉพาะเจาะจงกับการบันทึกข้อมูลใน MongoDB ผ่าน Mongoose
                👉 async function (next): ตัวฟังก์ชันนี้ใช้แบบ asynchronous เนื่องจากมันจะทำงานที่เกี่ยวข้องกับการเข้ารหัสรหัสผ่าน ซึ่งเป็นการกระทำที่อาจใช้เวลา (เนื่องจากมีการเชื่อมต่อกับฐานข้อมูลหรือทำการคำนวณที่ใช้เวลา) ดังนั้นจึงต้องใช้ async/await
                👉 next(): ฟังก์ชันนี้จะถูกเรียกเมื่อฟังก์ชันนี้ทำงานเสร็จเรียบร้อยแล้ว เพื่อให้กระบวนการบันทึกข้อมูล (save) ดำเนินการต่อไป หากไม่มีการเรียก next() ก็จะไม่สามารถบันทึกข้อมูลได้
            📌 if (!this.isModified("password")) return next();
                👉 this.isModified("password"):
                    ➡️ this ในที่นี้คืออ็อบเจ็กต์ของ document ที่เรากำลังทำงานอยู่ ซึ่งในกรณีนี้คือ userSchema หรือข้อมูลผู้ใช้
                    ➡️ .isModified("password"): เป็นฟังก์ชันของ Mongoose ที่ใช้เช็คว่า field หรือ attribute ที่ชื่อว่า "password" ถูกแก้ไขหรือไม่ (modified)
                    ➡️ ถ้า "password" ไม่ได้ถูกแก้ไข (คือไม่ใช่การเปลี่ยนแปลงที่เกิดขึ้นในครั้งนี้) ฟังก์ชันจะส่งค่ากลับเป็น false
                    ➡️ ถ้าหาก password ไม่ได้ถูกแก้ไข (ผลลัพธ์เป็น false) จะทำการข้ามไปยังการเรียก next() และกระบวนการบันทึกข้อมูลจะดำเนินต่อไปโดยไม่ต้องทำอะไรกับรหัสผ่าน
                    ➡️ ถ้า "password" ถูกแก้ไข (คือ true) การเข้ารหัสรหัสผ่านจะเกิดขึ้น
            📌 this.password = await bcrypt.hash(this.password, 10);
                👉 this.password:
                    ➡️ this.password หมายถึงการเข้าถึงค่าของฟิลด์ password ใน userSchema ซึ่งก็คือรหัสผ่านที่ผู้ใช้กรอกเข้ามา
                👉 await bcrypt.hash(this.password, 10):
                    ➡️ bcrypt.hash(): ฟังก์ชันนี้จาก bcrypt ใช้ในการเข้ารหัสรหัสผ่าน (hashing)
                    ➡️ การเข้ารหัสหมายความว่าเราจะใช้วิธีการแปลงรหัสผ่านให้อยู่ในรูปแบบที่ไม่สามารถย้อนกลับได้ เพื่อเพิ่มความปลอดภัยในการเก็บข้อมูลรหัสผ่าน
                    ➡️ this.password: ค่าของรหัสผ่านที่ผู้ใช้กรอกเข้ามา ซึ่งจะถูกแปลงเป็น hash โดย bcrypt
                    ➡️ 10: ตัวเลขนี้คือจำนวน salt rounds ที่จะใช้ในการเข้ารหัสรหัสผ่าน ซึ่งเป็นตัวกำหนดความซับซ้อนในการเข้ารหัส ค่า 10 นั้นเป็นค่าเริ่มต้นที่เหมาะสม โดยยิ่งจำนวนสูงขึ้นการคำนวณยิ่งช้าขึ้น ทำให้การแฮ็กยากขึ้น แต่ก็กินเวลาในการคำนวณมากขึ้น
                    ➡️ การใช้ await ในที่นี้ทำให้โปรแกรมรอจนกว่า bcrypt.hash() จะทำงานเสร็จแล้วถึงจะไปที่บรรทัดถัดไป โดยไม่ทำให้โปรแกรมหยุดทำงาน
            📌 next();
                👉 เมื่อการเข้ารหัสรหัสผ่านเสร็จสิ้นแล้ว ตัวแปร this.password จะถูกอัพเดตด้วยค่าของ hashed password ที่ได้จาก bcrypt.hash() และ next() จะถูกเรียกเพื่อบอกว่า hook นี้ทำงานเสร็จแล้ว และ Mongoose สามารถบันทึกข้อมูลนี้ลงในฐานข้อมูลได้
                👉 next() ช่วยให้กระบวนการบันทึกข้อมูลใน MongoDB ดำเนินการต่อไป
 */

userSchema.methods.isPasswordCorrect = async function(password){                /* isPasswordCorrect: เป็น method ของ userSchema (สร้าง model methods ได้ โดยการใช้ schema.methods) ที่ใช้ในการตรวจสอบว่ารหัสผ่านที่ป้อนเข้ามาตรงกับรหัสผ่านที่เก็บในฐานข้อมูลหรือไม่ */
    return await bcrypt.compare(password, this.password)                        /* bcrypt.compare(password, this.password): เปรียบเทียบรหัสผ่านที่ป้อนกับรหัสผ่านที่เก็บไว้ในฐานข้อมูล (หลังจากที่ถูกเข้ารหัส) this ในที่นี้หมายถึง document ที่ถูกสร้างจาก userSchema ซึ่งในกรณีนี้คือ ข้อมูลผู้ใช้ (เช่น รหัสผู้ใช้, ชื่อผู้ใช้, อีเมล, และข้อมูลอื่นๆ) */
}

userSchema.methods.generateAccessToken = function(){                            /* generateAccessToken: เป็น method ของ userSchema ที่ใช้สร้าง JSON Web Token (JWT) ที่จะใช้ในการ ยืนยันตัวตน (Authentication) ของผู้ใช้ */
    return jwt.sign(                                                            /* jwt.sign() คือการสร้าง JSON Web Token (JWT) โดยใช้ข้อมูลจาก payload และ secret key */
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY                          /* expiresIn คือการตั้งค่าเวลาหมดอายุ (expiry) ของ Access Token ค่านี้จะถูกเก็บใน environment variable (ใน .env file) เช่น "1h" (1 ชั่วโมง), "30m" (30 นาที), หรือค่าอื่นๆ ที่ต้องการเมื่อเวลา expiresIn หมดอายุ, JWT จะไม่สามารถใช้ได้อีกและจะต้องมีการ
                                                                                   รีเฟรช token ใหม่ */
        }
    )
}
 /* --- ✅ การทำงาน userSchema.methods.generateAccessToken = function(){...}
            📌 ยกตัวอย่าง    _id: this._id
                👉 มันหมายถึงการกำหนดค่าให้กับ key _id ใน payload ของ JSON Web Token (JWT) ซึ่งจะถูกใช้เพื่อฝังค่า _id ของผู้ใช้จาก document ใน MongoDB ลงใน JWT ที่เรากำลังสร้าง
                👉 this._id:
                    ➡️ this หมายถึง document ที่ถูกสร้างจาก Mongoose schema (userSchema) ซึ่งเป็นข้อมูลของผู้ใช้ในฐานข้อมูล MongoDB
                    ➡️ _id คือ field ที่ MongoDB สร้างขึ้นโดยอัตโนมัติเมื่อคุณบันทึกข้อมูลใหม่ (หรือในที่นี้คือ user) ในฐานข้อมูล
                    ➡️ ดังนั้น, this._id หมายถึงค่า _id ของ document ของผู้ใช้ที่เรากำลังทำงานกับมันในตอนนี้
                👉 _id: this._id:
                    ➡️ ใน JWT, เราจะสร้าง payload ซึ่งเป็นข้อมูลที่ฝังไว้ใน token
                    ➡️ โดยการใส่ _id: this._id, เราจะนำค่า _id ของผู้ใช้จาก MongoDB (ที่ถูกเก็บไว้ใน this._id) มาใส่ใน payload ของ JWT เพื่อให้เราสามารถใช้ _id นี้ในการอ้างอิงผู้ใช้ในภายหลัง
                👉 สรุป:
                    ➡️ this._id คือ ค่า _id ของ document ของผู้ใช้ใน MongoDB
                    ➡️ _id: this._id คือการฝัง ค่า _id ลงใน JWT payload เพื่อให้สามารถใช้ _id ของผู้ใช้ในการยืนยันตัวตน (authentication) ในการทำงานต่อไป
 */

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)