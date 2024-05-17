const express = require("express")
//const users = require("./MOCK_DATA.json")
const mongoose = require("mongoose")

const app = express()
const port =8000;
const fs = require("fs");
const { type } = require("os");

//Connection
mongoose.connect("mongodb://localhost:27017/voterbank")
.then(()=>console.log("MongoDB Connected"))
.catch((error)=> console.log("MongoDB Error: "+error))

//Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required:true,
        unique:true
    },
    jobTitle: {
        type:String
    },
    gender:{
        type: String
    }
},
{timestamps:true}
)

const User = mongoose.model("user", userSchema);

//Middleware
app.use(express.urlencoded({extended:false}))

app.use((req,res,next)=>{
    console.log("Hello from Middleware 1");
    res.myName="Hassan Ali"
    fs.appendFile("log.txt", `${Date.now()}: ${req.method}: ${req.path}\n`,(err,data)=>{
        next();
    })
   // return res.json("Hello from Middleware 121")
    //next();
});

app.use((req,res,next)=>{
    console.log("Hello from Middleware 2");
   // return res.json("Hello from Middleware 121")
   //return res.end("Bye bye")
    next();
});

//Routes
app.get("/api/users", async(req, res)=>{
    //console.log("My name is: "+res.myName)

    const dbUsers= await User.find({})
    res.json(dbUsers)
})

app.get("/users", async(req, res) => {
    const dbUsers= await User.find({})
    const html = `
    <ul>
      ${dbUsers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>`;
    res.send(html);
});

// app.get("/api/users/:id", (req, res)=>{
//     const id=Number(req.params.id)
//     const user = users.find(user => user.id===id)
//     return res.json(user)
// })

app.route("/api/users/:id").get(async(req, res)=>{
    // const id=Number(req.params.id)
    // const user = users.find(user => user.id===id)

    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).json({msg:"User not found"})
    return res.json(user)
})
.put((req, res)=>{
    return res.json(users[4])
})
.delete((req, res) => {
    const id=Number(req.params.id)
    const body=req.body;
    const index = users.findIndex(user => user.id === id); // Find the index of the user with the given ID
    if (index !== -1) {
        users.splice(index, 1); // Remove the user from the array
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            if (err) {
                console.error("Error writing to file:", err);
                return res.status(500).json({ status: "error", message: "Error deleting user" });
            }
            return res.json({ status: "success", message: "User deleted successfully" });
        });
    } else {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
});


app.post("/api/users", async (req, res)=>{
    const body=req.body
    console.log(body)
    // users.push({ id:users.length+1,
    //     ...body})
    // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data)=>
    // {
    //     return res.json(users[78])
    // })
    // console.log("Body", body)

    if(!body.first_name || !body.last_name || !body.email ||
        !body.gender || !body.job_title
    ){
        return res.status(404).json({msg:"All fields are required"})
    }

    const result = await User.create({
        firstName:body.first_name,
        lastName:body.last_name,
        email:body.email,
        gender:body.gender,
        jobTitle:body.job_title
    })

    return res.status(201).json({msg:"Success"})
})

app.listen(port, () => {
    return console.log("server started at port: "+port);
})