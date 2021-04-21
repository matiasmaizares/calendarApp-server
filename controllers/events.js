const {response}=require('express');
const {generarJWT}=require('../helpers/jwt');
const Evento=require('../models/Evento');

const getEventos =async (req,res=response)=>{

    const eventos=await Evento.find().populate('user','name')

    res.json({
        ok:true,
        eventos
    })

};

const crearEvento =async (req,res=response)=>{

    const evento=new Evento(req.body);
    
    try {
        evento.user=req.uid
        const eventoGuardado=  await evento.save();
        res.json({
            ok:true,
            evento:eventoGuardado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'hable con el admin'
        })
    }

};

const actualizarEvento =async (req,res=response)=>{

    const eventoId=req.params.id;
 
    try {

        const evento=await Evento.findById(eventoId);
        const uid=req.uid;

        if(!evento){
            return res.status(404).json({
                ok:false,
                msg:'evento no exite con es id'
            });
        }
       
        if(evento.user.toString()!==uid){
            return res.status(401).json({
                ok:false,
                msg:'no tiene privilegio'
            })
        }
        const nuevoEvento={
            ...req.body,
            user:uid
        }
        const eventoActualizado=await Evento.findByIdAndUpdate(eventoId,nuevoEvento,{new:true});

        res.json({
            ok:true,
            evento:eventoActualizado
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'hable con el admin'
        })
    }
    
};

const eliminarEvento =async (req,res=response)=>{

    const eventoId=req.params.id;
 
    try {

        const evento=await Evento.findById(eventoId);
        const uid=req.uid;

        if(!evento){
            return res.status(404).json({
                ok:false,
                msg:'evento no exite con es id'
            });
        }
       
        if(evento.user.toString()!==uid){
            return res.status(401).json({
                ok:false,
                msg:'no tiene privilegio'
            })
        }
     
        await Evento.findByIdAndDelete(eventoId);

        res.json({
            ok:true   
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'hable con el admin'
        })
    }
};

module.exports={
    getEventos,crearEvento,actualizarEvento,eliminarEvento
}

