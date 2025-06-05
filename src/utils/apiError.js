class ApiError extends Error {                                          /* สร้าง custom error class ชื่อ ApiError ซึ่งใช้สำหรับจัดการข้อผิดพลาด (errors) ในแอปพลิเคชัน API โดยเฉพาะ มันสามารถใช้เพื่อจัดการกับข้อผิดพลาดที่เกิดขึ้นในแอปพลิเคชันที่ใช้ Express หรือ Node.js โดย class ApiError ซึ่งสืบทอดจาก Error 
                                                                           (built-in JavaScript error class) การที่ ApiError สืบทอดจาก Error ทำให้ ApiError เป็น custom error class ที่สามารถใช้งานได้เหมือนกับ Error class ทั่วไป url: https://nodejs.org/api/errors.html */
    constructor(                                                        /* สร้าง constructor สำหรับ class ApiError เพื่อรับค่าพารามิเตอร์ที่จำเป็นโดยพารามิเตอร์ที่รับมีหลายตัว, ซึ่งช่วยให้สามารถกำหนดค่าต่าง ๆ ของ error เช่น statusCode, message, errors, และ stack trace */
        statusCode,                                                     /* กำหนดรหัสสถานะ (status code) สำหรับข้อผิดพลาดที่เกิดขึ้น เช่น 404 สำหรับ "Not Found", 500 สำหรับ "Internal Server Error" ตัวแปรนี้จะถูกใช้ใน response เพื่อบ่งชี้ประเภทของข้อผิดพลาด */
        message= "Something went wrong",                                /* message คือข้อความที่อธิบายข้อผิดพลาด "Something went wrong" เป็นค่าดีฟอลต์ (default) หากไม่มีการส่งข้อความเข้ามา */
        errors = [],                                                    /* errors คืออาร์เรย์ที่สามารถใช้เก็บรายละเอียดเพิ่มเติมเกี่ยวกับข้อผิดพลาด เช่น รายการของข้อผิดพลาดย่อย (nested errors) หรือข้อผิดพลาดจาก validation เริ่มต้นเป็นอาร์เรย์ว่าง */
        stack = ""                                                      /* stack เป็นข้อมูลที่ใช้ในการเก็บ stack trace ของข้อผิดพลาด ซึ่งเป็นข้อมูลที่แสดงตำแหน่งในโค้ดที่เกิดข้อผิดพลาดหากไม่ได้ส่งค่าของ stack เข้ามา, จะใช้ค่าเริ่มต้นเป็นค่าว่าง */
    ){
        super(message)                                                  /* เรียก constructor ของ Error class โดยใช้ super(message) เพื่อส่งข้อความข้อผิดพลาดไปให้กับ Error class จะทำให้ message ถูกตั้งค่าใน object ที่สร้างจาก ApiError */
        this.statusCode = statusCode                                    /* กำหนด statusCode ให้กับ instance ของ ApiError ซึ่งจะใช้เพื่อบ่งชี้รหัสสถานะของข้อผิดพลาด เช่น 404, 500 เป็นต้น */
        this.data = null                                                /* data เป็นคุณสมบัติของ error ที่สามารถใช้เพื่อเก็บข้อมูลเพิ่มเติมเกี่ยวกับข้อผิดพลาด เช่น ข้อมูลที่อาจช่วยให้ client แก้ไขปัญหาได้ค่าดีฟอลต์เป็น null */
        this.message = message                                          /* กำหนด message ให้กับ error object ซึ่งจะใช้เพื่อบรรยายเกี่ยวกับข้อผิดพลาด */
        this.success = false;                                           /* กำหนด success เป็น false เพื่อบ่งชี้ว่าเกิดข้อผิดพลาดโดยปกติ success จะถูกใช้ใน response API เพื่อตอบว่า request สำเร็จหรือไม่ */
        this.errors = errors                                            /* กำหนด errors ให้กับ instance ของ ApiError ซึ่งสามารถเก็บข้อผิดพลาดย่อย ๆ หรือรายละเอียดเพิ่มเติมจากการตรวจสอบ validation หรือข้อผิดพลาดอื่น ๆ */

        if (stack) {                                                    
            this.stack = stack                                          /* ถ้ามีการส่ง stack เข้ามา, จะกำหนดให้กับ this.stack เพื่อบันทึกข้อมูล stack trace ที่กำหนด */
        } else{                                                         
            Error.captureStackTrace(this, this.constructor)             /* ถ้าไม่มีการส่ง stack เข้ามา, ฟังก์ชัน Error.captureStackTrace(this, this.constructor) จะช่วยในการ บันทึก stack trace ของ error เพื่อให้ทราบว่าเกิดข้อผิดพลาดที่ไหนในโค้ด this.constructor ระบุว่า stack trace ควรเริ่มต้นจากตัว constructor ของ ApiError */
        }

    }
}

export {ApiError}


