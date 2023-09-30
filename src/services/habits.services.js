const habito = require('../models/habito');
var express = require('express');
const estadistica = require('../models/estadistica');
const mongoose = require('mongoose');
const amqp= require("amqplib");

class HabitsServices {
     async seeHabits (req, res)  {
      try{
      const arrayhabitos = await habito.find();
      res.send(arrayhabitos);
      }catch (error) {
        res.status(500).send('Error al buscar los habitos')
        console.log(error)
      }
      

        
    }
    async seeHabit (req, res)  {
      try{  
      
      const arrayhabitos = await habito.find({_id: req.params.habitid});
      if(arrayhabitos.length==0) return res.status(400).send('El habito no existe')
      res.send(arrayhabitos);
      console.log("Habito encontrado correctamente")
      }catch (error) {
        res.status(500).send('Error al buscar el habito')
        console.log(error)
      }
      

        
    }
    async createHabit (req, res)  {
      const newHabit = req.body
      try{
      newHabit.start_date = new Date()
      newHabit.start_date= newHabit.start_date.toLocaleDateString('es-MX');
      newHabit.start_date = newHabit.start_date.split('/'); 
      newHabit.start_date = `${newHabit.start_date[2]}/${newHabit.start_date[1]}/${newHabit.start_date[0]}`; 
      newHabit.is_done = false;
      habito.create(newHabit)
      res.send(newHabit)
      console.log("Habito creado correctamente")

    }catch (error) {
      res.status(500).send('Error al crear el habito')
      console.log(error)
    }
      
  }
  async updateHabit (req, res)  {
    const newHabit = req.body
    if(await habito.findOne({_id : req.params.habitid})){
    try{
      await habito.findOneAndUpdate({_id : req.params.habitid}, newHabit)
      res.send(await habito.findOne({_id : req.params.habitid}))
      console.log("Habito modificado correctamente")
    }catch (error) {
      res.status(500).send('Error al modificar el habito')
      console.log(error)
    }
  }else{
    res.status(400).send('El habito no existe')
  }
}
async deleteHabit (req, res)  {
    if(await habito.findOne({_id : req.params.habitid})){
    try{
      await habito.deleteOne({_id : req.params.habitid});
      res.send('Habito eliminado correctamente')
    }catch (error) {
      res.status(500).send('Error al eliminar el habito')
      console.log(error)
    }
  }else{
    res.status(400).send('El habito no existe')
  }
}
async doHabit (req, res)  {
  
  let date = new Date()
  date= date.toLocaleDateString('es-MX');
  date = date.split('/'); 
  date = `${date[2]}/${date[1]}/${date[0]}`; 
  date= new Date(date)
  
  if(await habito.findOne({_id : req.params.habitid})){
  try{
    await habito.findOneAndUpdate({_id : req.params.habitid}, {is_done : true})
    let habits= await habito.findOne({_id : req.params.habitid})
    console.log(habits)
      let estadistica1 = {
        habit_id: habits._id,
        date: date,
        user_id: habits.user_id
      }
      estadistica.create(estadistica1)
    
    res.send('Habito actualizado correctamente')
  }catch (error) {
    res.status(500).send('Error al actualizar el habito')
    console.log(error)
  }
}else{
  res.status(400).send('El habito no existe')
}
}

async checkHabit (req, res)  {
    

  const rabbitSettings = {
  protocol:"amqp",
  hostname: "172.17.0.2",
  port:5672,
  username:"guest",
  password:"guest",
  vhost:"/",
  authMechanism:["PLAIN","AMQPLAIN","EXTERNAL"],
  }
  const queue="habits";
  const habits= await habito.find()
  let date = new Date()
  date= date.toLocaleDateString('es-MX');
  date = date.split('/'); 
  date = `${date[2]}/${date[1]}/${date[0]}`; 
  date= new Date(date)
  try{
      const conn= await amqp.connect(rabbitSettings);
      console.log("Conectado a RabbitMQ");

      const channel= await conn.createChannel();
      console.log("Canal creado");

      const res= await channel.assertQueue(queue);
      console.log("Cola creada");

      for(let h in habits){
          await channel.sendToQueue(queue, Buffer.from(JSON.stringify(habits[h])));
          console.log(`Mensaje enviado ${queue}`);
      }

      console.log(`Esperando habitos de ${date}`);
      channel.consume(queue, msg=>{
          const input= JSON.parse(msg.content.toString());
          console.log(`Recibido ${input.name}`);
          console.log(input)
          let hdate= new Date(input.start_date)
          if(parseInt(input.frequency)==(date.getTime()-hdate.getTime())/(1000*60*60*24)){
            habito.findOneAndUpdate(
              { _id: input._id },
              { $set: { is_done: false, start_date: date } },
              { new: true }
            )
            .then((updatedHabit) => {
              channel.ack(msg);
              console.log("Habito recibido y actualizado");
            })
            .catch((error) => {
              res.status(500).send('Error al reiniciar el habito');
              console.log(error);
            });
          }else{
              channel.ack(msg);
              console.log("el habito aun no se debe actualizar");
          }
      });
  }catch(err){
      console.error(err);
  }
  console.log("revisando habitos")
  res.send('revisando habitos')
}
async seeStadistics (req, res)  {
  try{
  const arraystadistics = await estadistica.find();
  res.send(arraystadistics);
  }catch (error) {
    res.status(500).send('Error al buscar las estadisticas')
    console.log(error)
  }
      
}
async seeStadistic (req, res)  {
  try{
  if(req.params.filtro=='date'){
    req.params.valor=req.params.valor+"T05:00:00.000Z"
  }
  if (req.params.filtro === 'habit_id') {
    req.params.valor = new mongoose.Types.ObjectId(req.params.valor);
  }
  const arraystadistics = await estadistica.find({[req.params.filtro]: req.params.valor});
  res.send(arraystadistics);
  }catch (error) {
    res.status(500).send('Error al buscar las estadisticas')
    console.log(error)
  }
      
}
}

module.exports = new HabitsServices();
