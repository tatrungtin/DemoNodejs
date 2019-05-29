 // tạo ra user mới
const { ObjectId } = require('mongoose').Types
const {User, BlogPost, Comment, Product} =  require('./models')

const insertUser = async (name, age, email)=>{
    try{
        const user = new User()
        user.name = name
        user.age = age
        user.email = email
        await user.save()
        console.log(`Thêm mới thành công ${user}`)
    }catch(e){
        console.log(`Không thể thêm mới user ${e}`)
    }
}
const deleteAllUser = async ()=>{
    try{
        await User.deleteMany({})
        console.log(`Xoa thanh cong`)
    }catch(e){
        console.log(`Không thể thêm mới user ${e}`)
    }
}

//tim kiem

const findUserById = async (userId)=>{
    try {
        let foundUser = await  User.findById(userId)
        console.log(`foundUser = ${JSON.stringify(foundUser)}`)
    } catch (error) {
        console.log(`Không tìm thấy user ${error}`)
    }
}
// danh sách user có điều kiện
const findSomeUsers = async () =>{
    try {
        let foundUsers = await User.find(
            {
                age :{$gte :31},
                name : /ta/i //insensitive-case

            },
            ["name","age"],
            {
                sort :{
                    name : -1 //1 => Sắp xếp theo thứ tự a,b,c, -1=> theo thứ tụ z,y,x,...b,a
                }
            }
        ).skip(0).limit(5)
        foundUsers.forEach(user =>{
            console.log(`user ${user}`)
        })
        console.log(`Tổng số ${foundUsers.length}`)
    } catch (error) {
        
    }
}
const updateUser = async (userId, name, age, email) =>{
    try {
        let newUser = {}
        if(name !== undefined){
            newUser.name = name
        }
        if(email !== undefined){
            newUser.email = email
        }
        if(name !== undefined){
            newUser.age = age
        }
        let updatedUser = await User.findOneAndUpdate(
            {
                _id :ObjectId(userId)
            },
            newUser
        )
        if(updateUser != null){
            console.log(`Cap nhat thanh cong ${JSON.stringify(newUser)}`)
        }else{
            console.log(`Khong tim thay user`)    
        }
    } catch (error) {
        console.log(`khong update duoc user`)
    }
}
//Cách 2: kết hợp findById và update
const updateUser1 = async (userId, name, email, age) => {
    try {
        let foundUser = await User.findById(userId)
        if(!foundUser) {
            console.log(`Không tìm thấy user với id=${userId} để cập nhật`)
            return
        }
        //Chỉ update nếu "có thay đổi"
        foundUser.name = (name !== undefined)?name:foundUser.name
        foundUser.email = (email !== undefined) ? email : foundUser.email
        foundUser.age = (age !== undefined) ? age : foundUser.age
        await foundUser.save()
        console.log(`update thành công.User = ${JSON.stringify(foundUser)}`)        
    } catch(error) {
        console.log(`Ko update được thông tin user.Error: ${error}`)
    }
}
//Xoá một user theo Id ?
const deleteUser = async (userId) => {
    try {
        await User.deleteOne({_id: ObjectId(userId)})
        console.log(`Xoá thành công bản ghi user với id = ${JSON.stringify(userId)}`)        
    } catch(error) {
        console.log(`Ko xoá được bản ghi user.Error: ${error}`)
    } 
}
//case study create user with 5 blogpost
const createSomeUsersAndPosts = async () =>{
    try {
        const mrTin = new User({
            name:'Tin ta',
            age :20,
            email:'tinta@gmail.com',
            blogPosts:[]
        }) 
        //list post
        const newPost = new BlogPost({
            title :"Phim hoat hinh 1",
            content :"Day la phim hoat hinh",
            date:Date.now(),
            author: mrTin
        })   
        await newPost.save()
        await mrTin.blogPosts.push(newPost)
        await mrTin.save()

        const newPost1 = new BlogPost({
            title :"Phim hoat hinh 2",
            content :"Day la phim hoat hinh",
            date:Date.now(),
            author: mrTin
        })   
        await newPost1.save()
        await mrTin.blogPosts.push(newPost1)
        await mrTin.save()
    } catch (error) {
        console.log(`Ko tao duoc user.Error: ${error}`)
    }
}
// hien danh sach users kem chi tiet bai viet
const populateUsers = async ()=>{
    try {
        let foundUsers = await User.find({
            age :{$gte :20}
        }).populate({
            path :'blogPosts',
            select:['title', 'content'],
            //loc ket qua sau khi populate
            match :{content: /lau dai/i},
            options :{limit:5}
        }).exec() 
        foundUsers.forEach(user =>{
            console.log(`user = ${user}`)
        })
    } catch (error) {
        console.log(`Error: ${error}`)
    }
} 
//populate chieu nguoc lai hien author trong blogpsst
const populateBlogPosts = async () => {
    try {
        let foundBlogPosts = await BlogPost.find({}).
                                populate({
                                    path: 'author',
                                    select: ['name', 'email']
                                }).exec()
        foundBlogPosts.forEach(blogPost => {
            console.log(`blogPost = ${blogPost}`)
        }) 
        console.log(`Operation success`)
    } catch(error) {
        console.log(`Operation failed.Error: ${error}`)
    } 
}
//bang comment cua user luc len blogpost luc len product dynamic ref
const populateCommnents = async ()=>{
    try {
        //lay ten 
        const mrTin = await User.findById('5cee4417e45f4925e035fbda')
        //mrtin viet comment len blogpost
        const aBlogPost = await BlogPost.findById('5cee4417e45f4925e035fbdd')
        const comment1 = await Comment.create({
            body :'this is good',
            author :mrTin,
            commentOn:aBlogPost,
            onModel :'BlogPost'
        })
        aBlogPost.comments.push(comment1)
        await comment1.save()
        await aBlogPost.save()
        // comment len product
        const book = await Product.create({
            name :'node js',
            yearOfProduction:2018
        })
        const comment2 = await Comment.create({
            body :'comment product',
            author :mrTin,
            commentOn :book,
            onModel:'Product'
        })
        book.comments.push(comment2)
        await comment2.save()
        await book.save()
        console.log(`Success coommnet`)
    } catch (error) {
        console.log(`Operation failed.Error: ${error}`)
    }
}

module.exports = {
    insertUser,
    deleteAllUser,
    findUserById,
    findSomeUsers,
    updateUser,
    createSomeUsersAndPosts,
    populateUsers,
    populateBlogPosts,
    populateCommnents
}