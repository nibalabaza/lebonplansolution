const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        index: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        index: true
    },
    content: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

messageSchema.index({ product: 1, user: 1 }); // compound index

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;