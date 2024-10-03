import { Router } from 'express';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import Task from '../models/tasks.js';
import mongoose from 'mongoose';

const router = Router();

/* RPC CONFIG */
const PROTO_PATH = path.join(process.cwd(), 'simple.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  
const simpleProto = grpc.loadPackageDefinition(packageDefinition).SimpleService;
  
const clientRPC = new simpleProto('localhost:50051', grpc.credentials.createInsecure());

/* ENDPOINTS */

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        //DEVOLVER TASK
        res.send(tasks);
    }
    catch(err) {
        res.status(503).send();
    }
})

router.post('/', async (req, res) => {
    try {
        const {
            title,
            description
        } = req.body
        if(!title || !description) return res.status(503).send()
        const newTask = await new Task({
            title,
            description
        }).save()
        //CREAR TASK
        res.send(newTask);
    }
    catch(err) {
        res.status(503).send();
    }
})

router.get('/estadistics', async (req, res) => {
    try {

        const tasks = await Task.find()
        console.log(tasks)

        //const paraPasar = tasks.map(value => ({_id: value._id, title: value.title, description: value.description, createdAt: value.createdAt ? `${value.createdAt}` : ''}))

        clientRPC.Estadistica({ tareas: JSON.stringify(tasks) }, (error, response) => {
            if (!error) {
              console.log('Resultado:', response);
              res.send(response);
            } else {
                res.status(503).send()
                console.error('Error:', error);
            }
        });

    }
    catch(err) {
        console.log(err)
        res.status(503).send();
    }
})

router.post('/:id/realizada', async (req, res) => {
    try {
        const id = req.params;
        const id_decode = new mongoose.Types.ObjectId(id)
        
        const result = await Task.updateOne({_id: id_decode}, {realizada: true})
        console.log(result)
        res.send()
    }
    catch(err) {
        console.log(err)
        res.status(503).send()
    }
})
router.post('/:id/prioridad', async (req, res) => {
    try {
        const {
            prioridad
        } = req.body
        const id = req.params;
        if(!prioridad) return res.status(503).send()
        if(prioridad != "BAJA" && prioridad != "ALTA") return res.status(503).send()

        const id_decode = new mongoose.Types.ObjectId(id)
        
        const result = await Task.updateOne({_id: id_decode}, {prioridad})
        console.log(result)
        res.send()
    }
    catch(err) {
        console.log(err)
        res.status(503).send()
    }
})


export default router