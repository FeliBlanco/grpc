import express from 'express'
import cors from 'cors'

import tasks from './tasks.js'
import ConectarDB from './db.js';

const app = express();

ConectarDB();


app.use(cors());

app.use('/tasks', tasks)


export default app;