const mongoose = require('mongoose');

const prodSchema = mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    price: {
        type:Number,
        required:true
    },
    category: {
        type:String,
        required:true
    },
    imageUrl: [{ 
        type: String,
        required: true 
    }] // Include image URL field,
    ,isFeatured: {
        type: Boolean,
        default: false
        }
});

let Product = mongoose.model('Product', prodSchema);
module.exports = Product;