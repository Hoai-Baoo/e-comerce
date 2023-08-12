const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numberViewers:{
        type:Number,
        default:0,
    },
    likes:[
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes:[
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    image:{
        type: String,
        default: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZyUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&w=1000&q=80'
    },
    author: {
        type: String,
        default: 'Admin'
    },
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);