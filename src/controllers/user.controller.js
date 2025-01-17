import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res)=>{
    //get user details from frontend
    //validation-not empty
    //check if user already exist: username, email
    //check for images, check for avatar
    //upload to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return respnonse

    const {fullName, email, username, password} = req.body
    console.log("email", email);

    // if(fullName ===""){
    //     throw new ApiError(400,"Full Name is required")
    // }

    if(
        [fullName,email, username, password].some((field)=>field?.trim==="")
    ){
        throw new ApiError(400, "All fields are required")
    }
    //use or operator and check all the values

    const existedUser = User.findOne({
        $or:[{ username },{ email }]
    })
    if(existedUser){
        throw new ApiError(409,"User with username or email already exists")
    }
//multer gives the path for the first object of avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //check if user created
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" //things which are not required
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong")
    }

    //we will return json response here
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

})



export {
    registerUser,
}