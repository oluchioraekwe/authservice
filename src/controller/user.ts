import {Request,Response} from 'express';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { hashPassword, verifyPassword } from '../utility/hash';
import { postRequest } from '../utility/request';
dotenv.config()



const baseurl_student = process.env.BASEURL_STUDENT
const baseurl_staff = process.env.BASEURL_STAFF
const studentPort = process.env.STUDENT_PORT
const staffPort = process.env.STAFF_PORT


export const registeruser = async(req:Request, res:Response) =>{
    let port = studentPort
    let baseurl = baseurl_student
    const body = req.body
    if(body && req.body.password){
        body.password = await hashPassword(body.password)
    }
    if(body.userType && body.userType == "Staff"){
        port = staffPort
        baseurl = baseurl_staff
    }
    const url = `${baseurl}:${port}/`
    const result = await postRequest(url,body)

    res.status(201).send(result);
  }

export const login = async(req:Request,res:Response)=>{
    const {email, password, userType} = req.body
    let port = studentPort
    let baseurl = baseurl_student
    if(userType && userType == "Staff"){
        port = staffPort
        baseurl = baseurl_staff
    }
    const url = `${baseurl}:${port}/email`
    if(!email || !password){
        return res.status(400).send('Invalid Login Credentials')
    }

    const user = await postRequest(url,req.body) as any
    if(!user){
        return res.status(400).send('Invalid Login Credentials')
    }
    const passwordCheck = await verifyPassword(password,user.password)
    if(!passwordCheck){
        return res.status(400).send('Invalid Login Credentials')
    }
    const secret = process.env.TOKEN_SECRET as string
    const tokenpayload = {
        id: user._id,
        email: user.email,
        userType: user.userType
    }
    const token = jwt.sign(tokenpayload,secret,{expiresIn:'1h'})
    res.status(201).send({message:'Success',token});
}
