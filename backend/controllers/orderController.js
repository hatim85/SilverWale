import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { getMakingCharge } from "../utils/pricing.js";

export const createOrder = async (req, res) => {
    try {
        const { amount, userId, products, paymentMethod, status, totalAmount, deliveryDate } = req.body;
        console.log('createOrder payload:', { amount, userId, products, paymentMethod, status, totalAmount, deliveryDate });
        const makingCharge = await getMakingCharge();

        // Fetch product prices and calculate unitPriceAtPurchase
        const productIds = products.map(p => p.productId);
        const dbProducts = await Product.find({ _id: { $in: productIds } }).select("_id price").lean();
        const priceMap = new Map(dbProducts.map(p => [String(p._id), Number(p.price || 0)]));

        const orderLines = products.map(p => {
            const basePrice = priceMap.get(String(p.productId)) ?? 0;
            const unitPriceAtPurchase = basePrice + makingCharge;
            return {
                productId: p.productId,
                quantity: p.quantity,
                unitPriceAtPurchase
            };
        });

        const newOrder = new Order({
            userId,
            products: orderLines,
            totalAmount,
            paymentId: null, // COD orders don’t have a paymentId
            status: status || 'pending',
            orderDate: new Date(),
        });
        await newOrder.save();
        console.log('Order created:', newOrder);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('createOrder error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId })
      .populate({
        path: "products",
        populate: { path: "productId" },
      });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    const validOrders = orders.filter(order => order !== null);
    res.status(200).json(validOrders);
  } catch (error) {
    res.status(500).json({
      message: 'Error in fetching orders',
      error: error.message,
    });
  }
}


export const updateStatus=async(req,res)=>{
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { status },
          { new: true }
        );
        if (!updatedOrder) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export const getAllAdminOrders=async(req,res)=>{
  try{
      const page = req.query.page || 1;
      const pageSize = 10; 
      const skip = (page - 1) * pageSize;

      const orders = await Order.find()
          .populate({
              path: 'userId',
              select: 'username email'
          })
          .populate({
              path: 'products.productId',
              model: 'Product'
          })
          .skip(skip)
          .limit(pageSize);

      res.status(200).json(orders);
  }
  catch(error){
    res.status(500).json({message:error.message})
  }
} 