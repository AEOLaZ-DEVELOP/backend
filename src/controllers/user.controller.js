import {asyncHandler} from '../utils/asyncHandler.js'
import { User} from "../models/user.model.js"

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")                                     /* ใช้ Array.prototype.some() ถ้าใน array มีค่าใดค่าหนึ่งทำให้ field (callback) return true → จะ return true ทั้งหมด */
    )    {
        throw new ApiError(400, "All fields are required")
    }
    /* --- ✅ สรุปการทำงาน  ---
        📌 [fullName, email, username, password]    : สร้าง array ชั่วคราว จากค่าที่ได้จาก destructuring ของ req.body  
        📌 .some((field) => field?.trim() === "")   : เป็นการวน loop แบบ callback
            👉 field = ค่าของแต่ละ element ใน array
            👉 field?.trim() = เอาค่านั้นมา trim ช่องว่าง (ทั้งหน้า/หลัง) ✅ และใช้ ?. เพื่อป้องกัน error ถ้า field = undefined/null
            👉 ถ้า trim แล้ว === "" → แปลว่า "ไม่มีข้อมูลจริง ๆ" → true
    */ 
    
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]                                                                                  /* ใช้ $or เพื่อค้นหา document ที่ username หรือ email ตรงกัน กับข้อมูลที่รับมา */
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    /* --- ✅ สรุปการทำงาน  ---
        📌 ความหมายโดยรวม
            👉 ดึง "path" ของไฟล์ avatar ที่อัปโหลดมาจาก req.files โดย:
            👉 ป้องกัน error หากไม่มี files, avatar, หรือ avatar[0]
            👉 ใช้ Optional Chaining (?.) เพื่อหลีกเลี่ยง TypeError
        📌 req.files
            👉 req.files คือ object ที่ได้จาก middleware เช่น Multer เมื่อตั้งค่าแบบ multipart/form-data (เช่นการอัปโหลดไฟล์)
            👉 ตัวอย่างค่าที่อาจอยู่ใน req.files:
                    {
                        avatar: [
                            {
                            fieldname: 'avatar',
                            originalname: 'meow.jpg',
                            encoding: '7bit',
                            mimetype: 'image/jpeg',
                            destination: 'uploads/',
                            filename: 'meow-123.jpg',
                            path: 'uploads/meow-123.jpg',
                            size: 90024
                            }
                        ]
                    }
        📌 req.files?.avatar
            👉 ใช้ Optional Chaining (?.) เพื่อป้องกัน error หาก req.files ไม่มีอยู่ (เช่น undefined)
            👉 ถ้ามี → จะได้เป็น array ของไฟล์ (เพราะ avatar อนุญาตหลายไฟล์หรือ single())
        📌 req.files?.avatar[0]
            👉 ดึงไฟล์ตัวแรก (index 0) ของ key avatar
            👉 หากไม่มีไฟล์ → ค่าจะเป็น undefined → ไม่เกิด crash เพราะมี ?. คั่นไว้
        📌 req.files?.avatar[0]?.path
            👉 ดึง path ของไฟล์ที่อัปโหลด (ตัวแรก)
            👉 ตัวแปร path คือ ตำแหน่งไฟล์ในเครื่อง (local path) เช่น:
                            uploads/meow-123.jpg
        📌 สรุปการทำงาน
                            const avatarLocalPath = req.files?.avatar[0]?.path;
            👉 ถ้า req.files มีไฟล์ที่ชื่อว่า avatar
            👉 และมีไฟล์แรกอยู่
            👉 ให้เอาค่า path มาเก็บใน avatarLocalPath
            👉 ถ้าไม่ → avatarLocalPath = undefined (ไม่ throw error)
        📌 ถ้าไม่มี ?. จะต้องเขียนยาวแบบนี้
                            let avatarLocalPath;
                            if (req.files && req.files.avatar && req.files.avatar.length > 0) {
                                avatarLocalPath = req.files.avatar[0].path;
                            }
            👉 สรุป: ?. ช่วยเขียนให้สั้น กระชับ และปลอดภัยขึ้นเยอะมาก
    */

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path                                                              /* เข้าถึงไฟล์แรกจาก array ดึง path ซึ่งเป็น path ของไฟล์บน server local (เช่น uploads/my-cover-xyz.jpg) แล้วเก็บไว้ในตัวแปร coverImageLocalPath เพื่อใช้ upload cloud ต่อได้ */ 
        /* --- ✅ สรุปการทำงาน  ---
            📌 req.files: ตรวจว่า object req.files มีอยู่จริงไหม (ไม่เป็น undefined หรือ null) ถ้า req.files ไม่ได้แนบมาเลย (เช่น frontend ไม่ได้อัปโหลดไฟล์) → โค้ดจะไม่ crash
            📌 Array.isArray(req.files.coverImage): ตรวจว่า req.files.coverImage เป็น array จริงหรือไม่เพราะ Multer อาจให้ req.files.coverImage เป็น undefined ถ้าไม่มีการอัปโหลด ✅ ถ้าคุณใช้ upload.fields([{ name: 'coverImage', maxCount: 1 }]) → ผลลัพธ์จะเป็น array เสมอ
            📌 req.files.coverImage.length > 0: ตรวจว่าใน array นั้น มีไฟล์อย่างน้อย 1 ไฟล์ป้องกันกรณีที่ coverImage: [] (อัปโหลดชื่อ field มาจริงแต่ไม่มีไฟล์เลย)
        */      
    }
    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

export {registerUser}