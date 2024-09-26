import mongoose, { Schema } from 'mongoose'

const TaskSchema = new Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    realizada: {
        type: Boolean,
        default: false
    },
    prioridad: {
        type: String,
        default: 'BAJA'
    }

},{
    timestamps:true
})

const Task = mongoose.model('Task', TaskSchema);

export default Task;