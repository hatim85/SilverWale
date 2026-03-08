import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', 
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unitPriceAtPurchase: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    status:{
        type:String,
        enum:['pending','confirmed','processing','shipped','delivered','cancelled'],
        default:'pending'
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
