// --- รูปแบบย่อ ---
const asyncHandler = (requestHandler) => {                                              /* asyncHandler คือ higher-order function ที่รับ requestHandler (ซึ่งเป็นฟังก์ชัน async ที่จะถูกใช้ในการจัดการ request) เป็นอาร์กิวเมนต์โดยฟังก์ชัน asyncHandler นี้จะ wrap ฟังก์ชัน async ที่รับผิดชอบการจัดการ request ใน Express เพื่อให้สามารถ
                                                                                           จัดการข้อผิดพลาดได้อย่างมีประสิทธิภาพ */
    console.log('asyncHandler [utils]: ', requestHandler);
    console.log('asyncHandler [utils] typeof: ', typeof(requestHandler));
    return (req, res, next) => {                                                        /* ฟังก์ชันที่ asyncHandler คืนค่ากลับเป็น middleware function ของ Express ที่รับอาร์กิวเมนต์ 3 ตัว คือ req, res, และ next โดย 
                                                                                            ✅ req  : request object ที่เก็บข้อมูลจาก client
                                                                                            ✅ res  : response object ที่ใช้ในการส่งข้อมูลกลับไปยัง client
                                                                                            ✅ next : ฟังก์ชันที่ใช้ในการส่งคำขอไปยัง middleware ถัดไป */
        Promise.resolve(requestHandler(req, res, next))                                 /* requestHandler(req, res, next) คือฟังก์ชัน async ที่รับ request และ response ซึ่งจะทำงานภายใน middleware โดย Promise.resolve() ใช้เพื่อแปลง requestHandler ให้เป็น Promise ซึ่งเป็นสิ่งที่ต้องการสำหรับการจัดการกับ async/await คำสั่งนี้
                                                                                            จะรอให้ฟังก์ชัน async เสร็จสมบูรณ์และคืนค่า Promise ที่จะ resolve เมื่อการทำงานเสร็จสมบูรณ์ */
        .catch((err) => next(err))                                                      /* ในกรณีที่ฟังก์ชัน requestHandler เกิดข้อผิดพลาด (throw error) หรือ Promise ถูก reject, คำสั่งนี้จะจับข้อผิดพลาดนั้นโดย next(err) จะถูกเรียกเพื่อส่งข้อผิดพลาดไปยัง middleware ต่อไปที่ใช้จัดการข้อผิดพลาดใน Express ด้วยวิธีนี้, เราสามารถจัดการกับ
                                                                                            ข้อผิดพลาดจากฟังก์ชัน async ได้อย่างง่ายดาย โดยไม่ต้องใช้ try-catch ในทุกๆ handler */                                                                                      
    }
}

export { asyncHandler }


/* ✅ --- รูปแบบเต็ม ---
    const asyncHandler = () => {}
    const asyncHandler = (func) => () => {}
    const asyncHandler = (func) => async () => {}

    const asyncHandler = (fn) => async (req, res, next) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            res.status(err.code || 500).json({
                success: false,
                message: err.message
            })
        }
    } 
*/

/* ✅ --- แนะนำโดย chatGPT ---
        📌 code
                    const asyncHandler = (fn) => {
                        return (req, res, next) => {
                            // ใช้ Promise.resolve() เพื่อรองรับทั้ง async และ non-async functions
                            Promise.resolve(fn(req, res, next))
                                .catch((err) => {
                                    // จัดการกับข้อผิดพลาดโดยส่งข้อผิดพลาดไปยัง error handler middleware
                                    // ตรวจสอบข้อผิดพลาดว่าเป็น error ที่เราออกแบบมาไหม เช่น custom error code หรือไม่
                                    if (err && err.code) {
                                        res.status(err.code).json({
                                            success: false,
                                            message: err.message || "An error occurred"
                                        });
                                    } else {
                                        // หากข้อผิดพลาดไม่ใช่ custom error ให้ส่งเป็น 500 Internal Server Error
                                        res.status(500).json({
                                            success: false,
                                            message: "Internal Server Error"
                                        });
                                    }
                                });
                        };
                    };
                    export { asyncHandler };

            👉 คำอธิบาย:
                ➡️ Promise.resolve(fn(req, res, next)):
                    🧱 ฟังก์ชัน fn สามารถเป็น async function หรือ synchronous function ก็ได้
                    🧱 Promise.resolve() จะช่วยให้ ฟังก์ชัน synchronous ก็สามารถทำงานได้ในรูปแบบที่รองรับ Promise
                    🧱 โดยการใช้ Promise.resolve(), ฟังก์ชัน sync ที่ไม่คืนค่า Promise ก็จะถูกแปลงเป็น Promise ที่ resolve ทันที
                    🧱 ฟังก์ชัน async จะคืนค่าเป็น Promise อยู่แล้ว ดังนั้นการใช้ Promise.resolve() กับฟังก์ชัน async จะทำให้ไม่ต้องเปลี่ยนแปลงอะไรในกรณีนี้
                ➡️ catch((err) => next(err)):
                    🧱 ใช้ .catch() เพื่อจับข้อผิดพลาดที่เกิดขึ้นในฟังก์ชัน fn
                    🧱 หากเกิดข้อผิดพลาด, ข้อผิดพลาดจะถูกส่งไปยัง Express error handling middleware ด้วยคำสั่ง next(err)
                    🧱 ข้อผิดพลาดจะถูกจัดการใน error handler middleware ที่อยู่ใน Express
                ➡️ การตรวจสอบประเภทของข้อผิดพลาด:
                    🧱 ในกรณีที่มีข้อผิดพลาดจาก custom error (เช่น err.code เป็นรหัสที่เรากำหนดเอง), คำสั่งนี้จะส่ง HTTP status code ที่ตรงกับ err.code ไปยัง client
                    🧱 หากข้อผิดพลาดไม่ใช่ custom error, จะส่งเป็น 500 Internal Server Error ไปยัง client
        
        📌 เหตุผลที่ควรเขียนแบบนี้ (ระดับ advance):
            👉 รองรับทั้ง async และ sync functions: การใช้ Promise.resolve() ทำให้ฟังก์ชันทั้ง async และ sync สามารถทำงานได้
            👉 จัดการข้อผิดพลาดอย่างมีประสิทธิภาพ: การใช้ catch ในการจับข้อผิดพลาดทำให้คุณสามารถส่งข้อผิดพลาดไปยัง middleware สำหรับการจัดการ error ได้อย่างสะดวก
            👉 ความยืดหยุ่นในการใช้งาน: สามารถใช้ฟังก์ชันนี้กับ route handlers ที่เป็น async หรือ sync ได้ โดยไม่ต้องเขียนโค้ดที่ซ้ำซ้อน
        📌 สรุป:
            👉 การใช้ Promise.resolve() เป็นทางเลือกที่ดีในการรองรับทั้ง async และ sync functions ใน Express
            👉 asyncHandler แบบนี้จะช่วยจัดการกับข้อผิดพลาดอย่างมีประสิทธิภาพ และเพิ่มความยืดหยุ่นให้กับการพัฒนา API
            👉 สามารถใช้ global error handler เพื่อจัดการกับข้อผิดพลาดที่เกิดขึ้นจากฟังก์ชัน async ในหลายๆ route ได้อย่างสะดวก
*/