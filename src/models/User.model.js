import mongoose, {Schema} from "mongoose"
import jwt from "jsonwebtoken" //jwt is a bearer token- ye token mujhe jo bhi bhejega m use data bhej dunga
import bcrypt from "bcrypt"
const userSchema = new Schema({

    username:{
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        required: true,
        trim:true
    },
    avatar:{
        type: String, //cloudinary url
        required:true,
    },
    coverImage:{
        type:String
    },

    watchHistory:{
        type: Schema.Types.ObjectId,
        ref:"Video"
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    refreshToken:{
        type:String,

    }
},{timestamps:true}
);
//use hook pre(middleware) to encrypt password just before saving
userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({ //payload the information it keeps
        _id: this._id,
        email : this.email,
        username: this.username,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        { //payload the information it keeps
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema)