import userModel from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
const saltRounds = 10

const createUser = (req, res) => {
    try {
        const username  = req.body.username;
        !username && res.send('Enter Username');
        //!password && res.send('Enter password');
        

     const pass = req.body.pass
     const password = bcrypt.hashSync(pass,saltRounds);
     console.log(password)
        userModel.create(
            {
               username,
               password
            },
            (err,data) => {
                if (err) {
                  console.log('Error', Error);
                  return  res.send({ Error: err });
                }
                console.log(data)
                return res.send( 'User created successfully' );
            }
        );
    } catch (err) {
        res.send(err);
    }
};

const updateUser = (req, res) => {
    try {
    
       // const { query } = req.query;
        const {query} = req.query
        const {user} = req.body 
        console.log("here",query)
        if(query){
            userModel.findOneAndUpdate({username: query},{ $set: { username: user }}, {new: true},
                (err, data) => {
                    if (err) {
                        console.log("user doesn't exist");
                       return res.send({ Error: err });
                    }
                   res.send(data);
                })
        }
    } catch (err) {
        res.send (err);
    }
};

const searchUsers = (req, res) => {
    try{
        const{query} = req.query

        console.log(query)
        if(query){ 
            userModel.find({username:query},
            (err,data) => {
                if(err) {
                    console.log("user doesn't exist");
                    return res.send({Error:err});
                }
                console.log(data)
                res.send(data);
            })
        }
    }catch(err){
        res.send(err)
    }
}

const login = (req, res) => {
     try{
         const userData = {
             username : req.body.username,
             password : req.body.pass
         }
         console.log(userData)
         userModel.find({username:userData.username},
            (err,data) => {
             if(err){
                 console.log("user not found");
                 return res.send(err);
             }
             res.send(data)
             let user = data[0].username
             let key = 'sdff1'
             bcrypt.compare(userData.password,data[0].password,
                (err,res)=>{
                   if(res){
                       jwt.sign({username : user},key,
                       (err,token) => {
                          if(err){
                              console.log("err",err)
                          }else{
                              console.log(token)
                          }
                       })
                       console.log("logged")
                   }else{
                       console.log(err)
                       return
                   }
                   
             })
         })
     }
     catch (err){
         res.send(err)
     }
}
const deleteUser = (req, res) => {
    try {
        const { id } = req.params;
        !id && res.send('enter id');
        userModel.deleteOne(
            {
                _id: id,
            },
            err => {
                if (err) {
                    return res.send('can not delete');
                } else {
                    res.send('user deleted');
                }
            }
        );
    } catch (err) {
        console.log(res.send(err));
    }
};

export default { createUser, searchUsers, deleteUser, updateUser, login };
