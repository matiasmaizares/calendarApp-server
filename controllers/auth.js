const {response}=require('express');
const Usuario=require('../models/Usuario');
const bcrypt=require('bcryptjs');
const {generarJWT}=require('../helpers/jwt')

const crearUsuario =async (req,res=response)=>{
    
     const {name,email,password}=req.body;
    
    try {

        let usuario=await Usuario.findOne({email})

        if(usuario){
            return res.status(400).json({
                ok:false,
                msg:'un usuario existe con ese correo'
            })
        }

        usuario=new Usuario(req.body);
        
        //encriptar contraseña
        const salt=bcrypt.genSaltSync(10);
        usuario.password=bcrypt.hashSync(password,salt)

        await usuario.save();

        //generar JWT
        const token= await generarJWT(usuario.id,usuario.name);

        res.status(201).json({
            ok:true,
            uid:usuario.id,
            name:usuario.name,
            token
        })  
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'hable con el afmin'
        })
    }
    
}
const loginUsuario= async(req,res=response)=>{
    
    const {email,password}=req.body;

    try {
        const usuario=await Usuario.findOne({email})

        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg:'el usuario no existe'
            })
        }

        //confirmar los passwords
        const validPassword=bcrypt.compareSync(password,usuario.password)

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'password incorrecto'
            })
        }

        //generar nuestro JWT
        const token=await generarJWT(usuario.id,usuario.name);

        res.json({
            ok:true,
            uid:usuario.id,
            name:usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'hable con el admin'
        })
    }
   
}
const revalidarToken= async(req,res=response)=>{
    const {uid,name}=req

    //generar un nuevo JWT y retornarlo es ta peticion
    const token=await generarJWT(uid,name);

    res.json({
        ok:true,
        uid,
        name,
        token
    })
}


module.exports={crearUsuario,loginUsuario,revalidarToken}


