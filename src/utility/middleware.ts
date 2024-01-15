import {Request,Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const secret = process.env.TOKEN_SECRET as string
export const authenticate = async(req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization?.split(" ")['1']
    
    if(!token){
        return res.status(400).send('Invalid Token')
    }
    try{
        const verifyToken =  jwt.verify(token,secret) as any
        delete verifyToken.iat
        delete verifyToken.exp
        req.user = verifyToken
        console.log(verifyToken)
        next()
    }catch(error:any){
        return res.status(401).send(error.message)
    }
} 


export const verifyToken = async(req:Request,res:Response)=>{
    const token = req.body.token
    if(!token){
        return res.status(400).send('Invalid Token')
    }
    try{
        const verifyToken =  jwt.verify(token,secret) as any
        delete verifyToken.iat
        delete verifyToken.exp
       // req.user = verifyToken
        return res.status(200).send(verifyToken)
 
    }catch(error:any){
        return res.status(401).send(error.message)
    }
} 