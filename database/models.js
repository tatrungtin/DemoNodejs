 var mongoose  = require('mongoose')
 const {Schema} = mongoose
 const {ObjectId} = Schema
 //kêt nối cơ sở dữ liệu
 var connectDatabase = async ()=>{
    try{
        let uri = 'mongodb://127.0.0.1:27017/fullstack'
        let options = {
            connectTimeoutMS: 10000,// 10 giây
			useNewUrlParser: true,
			useCreateIndex: true,
        }
        await mongoose.connect(uri,options)
        console.log('Connect database successfully')
    }catch(e){
        console.log(`Connect database faile ${e}`)
    }
 }
 connectDatabase()
 const UserSchema = new Schema({
    name :{
        type :String,
        default :'unknown'
    },
    age: {
        type: Number, 
        min: 18, index: true
    },
    email: {
        type: String, 
        match:/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    },
    blogPosts:[{type:mongoose.Schema.Types.ObjectId, ref: "BlogPost"}]
 })

const BlogPostSchema = new Schema({
    title :{type :String, default :'hâhâ'},
    content :{type:String, default:''},
    date :{type:String ,  default:Date.now},
    //trường tham chiếu
    author :{type:mongoose.Schema.Types.ObjectId, ref: "User"},
    comments :[{ type:mongoose.Schema.Types.ObjectId, ref:'Comment'}]
})
const CommentSchema = new Schema({
    body :{type :String, require :true},
    author :{type:mongoose.Schema.Types.ObjectId, ref :"User"},
    commentOn :{
        type:mongoose.Schema.Types.ObjectId,
        require :true,
        refPath :'onModel'
    },
    onModel :{
        type: String,
        required:true,
        enum :['BlogPost', 'Product']
    }

})
const ProductSchema = new Schema({
    name :{type :String, default:''},
    yearOfProduction:{type:Number, min:2000},
    comments :[{ type:mongoose.Schema.Types.ObjectId, ref:'Comment'}]

})
 //chuyen schema sang model
 const User = mongoose.model('User', UserSchema)
 const BlogPost = mongoose.model('BlogPost', BlogPostSchema)
 const Comment = mongoose.model('Comment', CommentSchema)
 const Product = mongoose.model('Product', ProductSchema)
 module.exports = {User,BlogPost,Comment,Product}

