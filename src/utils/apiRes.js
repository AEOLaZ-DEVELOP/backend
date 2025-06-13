class ApiResponse {                                                     /* class ApiResponse ซึ่งใช้เพื่อจัดการและสร้าง response สำหรับการส่งข้อมูลกลับไปยัง client ใน API โดยการกำหนด statusCode, data, และ message ที่จะส่งกลับไปใน response ซึ่งจะช่วยให้ response มีโครงสร้างที่เป็นมาตรฐานและง่ายต่อการจัดการ */
    constructor(statusCode, data, message = "Success"){                 /* สร้าง constructor ของ class ApiResponse ซึ่งรับพารามิเตอร์ 3 ตัว: statusCode: ✅ รหัสสถานะ HTTP ที่จะส่งกลับไปยัง client (เช่น 200 สำหรับ OK 404 สำหรับ Not Found), ✅data: ข้อมูลที่ต้องการส่งกลับไปยัง client, ✅ message: ข้อความที่แสดงผลที่เกี่ยวข้อง
                                                                           กับการตอบกลับ (ค่า default คือ "Success") */
        this.statusCode = statusCode                                    /* กำหนด statusCode ให้กับ instance ของ ApiResponse ซึ่งใช้เพื่อบ่งชี้ผลลัพธ์ของการตอบกลับ เช่น 200, 400, 500 */
        this.data = data                                                /* กำหนด data ให้กับ instance ของ ApiResponse ซึ่งเก็บข้อมูลที่ต้องการส่งกลับ เช่น ข้อมูลผู้ใช้, รายการข้อมูล, หรือข้อความที่ต้องการส่งกลับ */
        this.message = message                                          /* กำหนด message ให้กับ instance ของ ApiResponse ซึ่งใช้เพื่อส่งข้อความที่อธิบายถึงสถานะการตอบกลับ (โดยค่าเริ่มต้นคือ "Success") */
        this.success = statusCode < 400                                 /* กำหนด success เป็นค่า true หาก statusCode น้อยกว่า 400 (หมายถึงการตอบกลับที่สำเร็จ) หรือ false ถ้า statusCode 400 หรือมากกว่า (หมายถึงข้อผิดพลาด)โดยใช้เพื่อให้ client ทราบว่า request สำเร็จหรือไม่ */
    }
}

export { ApiResponse }

/* --- ✅ http response status code ---
            📌 Informational responses (100 – 199)
            📌 Successful responses (200 – 299)
            📌 Redirection messages (300 – 399)
            📌 Client error responses (400 – 499)
            📌 Server error responses (500 – 599)
*/