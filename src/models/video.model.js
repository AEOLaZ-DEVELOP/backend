import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";             /* ปลั๊กอินที่ช่วยให้การใช้งาน aggregate ใน MongoDB รองรับการแบ่งหน้า (pagination) ได้สะดวกขึ้น */

const videoSchema = new Schema(
    {
        videoFile: {
            type: String,                                                           /* ใช้เก็บ URL ของไฟล์วิดีโอจาก Cloudinary */
            required: true
        },
        thumbnail: {
            type: String,                                                           
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        duration: {
            type: Number, 
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    }, 
    {
        timestamps: true                                                            /* Mongoose จะเพิ่มฟิลด์ createdAt และ updatedAt โดยอัตโนมัติให้กับทุกๆ document ที่บันทึกลงในฐานข้อมูล ซึ่งช่วยในการติดตามเวลาเมื่อมีการสร้างหรืออัพเดตข้อมูล */
    }
)

videoSchema.plugin(mongooseAggregatePaginate)                                       /* ใช้ปลั๊กอิน mongooseAggregatePaginate เพื่อช่วยในการทำ pagination เมื่อใช้ aggregate ในการคิวรีข้อมูลจากฐานข้อมูลโดยทั่วไปจะใช้สำหรับการแบ่งหน้าในข้อมูลที่มีจำนวนมาก เช่น การดึงข้อมูลวิดีโอหลายๆ ตัวจากฐานข้อมูล พร้อมการแบ่งหน้าผลลัพธ์ให้สามารถแสดงผล
                                                                                       ในหน้าเว็บได้ */

export const Video = mongoose.model("Video", videoSchema)