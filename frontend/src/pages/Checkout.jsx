import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import AddressCard from '../components/AddressCard';
import { fetchCartItemsRequest, fetchCartItemsSuccess, fetchCartItemsFailure } from '../redux/slices/cartSlice';

function Checkout() {
    const dispatch = useDispatch();
    const { cartItems, loading, error } = useSelector(state => state.cart);
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const userId = currentUser._id;

    const [deliveryCharge, setDeliveryCharge] = useState(50);
    const [loadingDelivery, setLoadingDelivery] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('cod'); 
    const [processing, setProcessing] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    useEffect(() => {
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            const fetchCartItems = async () => {
                dispatch(fetchCartItemsRequest());
                try {
                    const response = await fetch(`${import.meta.env.VITE_PORT}/api/cart/getcart/${userId}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    if (!response.ok) throw new Error('Failed to fetch items');
                    const data = await response.json();
                    dispatch(fetchCartItemsSuccess(data));
                } catch (err) {
                    dispatch(fetchCartItemsFailure(err.message));
                }
            };
            fetchCartItems();
        }
    }, [cartItems, userId, dispatch]);

    const totalPrice = Array.isArray(cartItems) ? cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0) : 0;
    const codFee = paymentMethod === 'cod' ? 15 : 0;
    const totalAmount = totalPrice + deliveryCharge + codFee;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    useEffect(() => {
        const fetchDeliveryCharge = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_PORT}/api/settings/pricing`);
                if (!res.ok) throw new Error('Failed to fetch delivery charge');
                const data = await res.json();
                setDeliveryCharge(Number(data?.deliveryCharge ?? 0));
            } catch (err) {
                console.error('Failed to load delivery charge:', err);
                setDeliveryCharge(50);
            } finally {
                setLoadingDelivery(false);
            }
        };
        fetchDeliveryCharge();
    }, []);

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert('Please select an address before placing your order.');
            return;
        }
        setProcessing(true);
        try {
            const products = cartItems.map(item => ({
                productId: item.product._id,
                quantity: item.quantity,
                size: item.size
            }));
            const cartItemsToDelete = cartItems.map(cartItem => cartItem.cartItemId);

            if (paymentMethod === 'cod') {
                const orderData = {
                    amount: totalAmount,
                    userId,
                    products,
                    paymentMethod: 'cod',
                    status: 'pending',
                    totalAmount,
                    deliveryDate: formattedDeliveryDate,
                    address: selectedAddress
                };
                await axios.post(`${import.meta.env.VITE_PORT}/api/orders/create`, orderData);
                await Promise.all(cartItemsToDelete.map(id =>
                    axios.delete(`${import.meta.env.VITE_PORT}/api/cart/delete/${id}`)
                ));
                navigate('/paymentsuccess');
            } else {
                if (!window.Razorpay) {
                    alert('Razorpay SDK not loaded. Please refresh the page.');
                    return;
                }
                const { data: { order } } = await axios.post(`${import.meta.env.VITE_PORT}/api/payment/createpayment`, {
                    amount: totalAmount,
                    userId,
                    products,
                    totalAmount,
                    address: selectedAddress
                });
                const { data: { key } } = await axios.get(`${import.meta.env.VITE_PORT}/api/getkey`);
                const options = {
                    key,
                    amount: order.amount,
                    currency: "INR",
                    name: "SilverWale",
                    description: "Premium Jewellery Purchase",
                    image: "/Logo.jpeg", 
                    order_id: order.id,
                    handler: async (response) => {
                        try {
                            await Promise.all(cartItemsToDelete.map(id =>
                                axios.delete(`${import.meta.env.VITE_PORT}/api/cart/delete/${id}`)
                            ));
                            navigate('/paymentsuccess');
                        } catch (err) {
                            console.error('Failed to clear cart after payment:', err);
                            alert('Payment succeeded, but failed to clear cart. Please contact support.');
                        }
                    },
                    prefill: {
                        name: currentUser?.username || "",
                        email: currentUser?.email || "",
                        contact: currentUser?.phone || ""
                    },
                    theme: {
                        color: "#000000"
                    }
                };
                const razor = new window.Razorpay(options);
                razor.open();
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const getImagePath = (imageName) => {
        if (!imageName) return '/ErrorImage.png';
        if (imageName.includes('cloudinary.com')) return imageName;
        return `/${imageName.split(/[\\/]/).pop()}`;
    };

    return (
        <div className="bg-[#fafafa] min-h-screen font-sans">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif tracking-widest text-black uppercase mb-4">Secure Checkout</h1>
                    <div className="w-12 h-[1px] bg-black mx-auto"></div>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                    {/* Left Column: Address & Payment */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Address Selection */}
                        <div className="bg-white p-6 md:p-10 border border-gray-100 shadow-sm">
                            <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-black mb-6 border-b border-gray-100 pb-4">
                                Shipping Details
                            </h2>
                            <AddressCard className="w-full" onAddressSelect={setSelectedAddress} />
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 md:p-10 border border-gray-100 shadow-sm">
                            <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-black mb-6 border-b border-gray-100 pb-4">
                                Payment Method
                            </h2>
                            <div className="space-y-4">
                                <label className={`flex items-center p-4 border cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-black focus:ring-black border-gray-300"
                                    />
                                    <div className="ml-4">
                                        <span className="block text-sm font-bold text-gray-900 tracking-wider uppercase text-[11px] md:text-sm">Pay Online</span>
                                        <span className="block text-xs text-gray-500 mt-1">UPI, Credit Card, Debit Card, Net Banking</span>
                                    </div>
                                </label>
                                
                                <label className={`flex items-center p-4 border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-black focus:ring-black border-gray-300"
                                    />
                                    <div className="ml-4">
                                        <span className="block text-sm font-bold text-gray-900 tracking-wider uppercase text-[11px] md:text-sm">Cash on Delivery</span>
                                        <span className="block text-xs text-gray-500 mt-1">Pay when your order arrives. Extra ₹15 fee applies.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <div className="bg-white p-6 md:p-10 border border-black shadow-sm sticky top-24">
                            <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-black mb-6 border-b border-gray-100 pb-4">
                                Order Summary
                            </h2>
                            
                            {/* Items List */}
                            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                                {Array.isArray(cartItems) && cartItems.map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="w-20 h-20 bg-[#f9f9f9] border border-gray-100 p-2 flex-shrink-0">
                                            <img
                                                src={getImagePath(item.product?.image?.[item.product?.coverImageIndex] || item.product?.image?.[0])}
                                                alt={item.product?.name}
                                                className="w-full h-full object-contain mix-blend-multiply"
                                                onError={(e) => {e.target.src='/ErrorImage.png'}}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h3 className="text-[10px] md:text-[11px] font-bold text-gray-900 uppercase tracking-widest line-clamp-1">{item.product?.name}</h3>
                                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Qty: {item.quantity} | Size: {item.size}</p>
                                            <p className="text-xs md:text-sm font-bold text-black mt-2">₹{Number(item.product?.price).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Calculations */}
                            <div className="space-y-3 text-[10px] md:text-[11px] uppercase tracking-wider font-bold text-gray-500 border-t border-gray-100 pt-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">₹{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Charge</span>
                                    <span className="text-gray-900">
                                        {loadingDelivery ? 'Calculating...' : (deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`)}
                                    </span>
                                </div>
                                {paymentMethod === 'cod' && (
                                    <div className="flex justify-between text-yellow-700">
                                        <span>COD Extra Fee</span>
                                        <span className="">₹{codFee}</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-black mt-6 pt-6 flex justify-between items-center mb-8">
                                <span className="text-[11px] md:text-sm font-bold tracking-widest uppercase">Total</span>
                                <span className="text-xl md:text-2xl font-serif text-black">₹{totalAmount.toLocaleString()}</span>
                            </div>

                            <p className="text-[10px] text-gray-500 mb-6 text-center italic tracking-wider">
                                ESTIMATED DELIVERY BY {formattedDeliveryDate}
                            </p>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={processing || loadingDelivery}
                                className="w-full bg-black text-white hover:bg-gray-900 transition-colors py-4 text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : `Place Order • ₹${totalAmount.toLocaleString()}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
