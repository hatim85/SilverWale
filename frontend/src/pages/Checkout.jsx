import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DummyHeader from '../components/DummyHeader';
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
    const [paymentMethod, setPaymentMethod] = useState('online'); // 'cod' or 'online'
    const [processing, setProcessing] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    // Debug: log cartItems
    console.log('Checkout cartItems:', cartItems);

    // Redirect to cart if no items (in effect)
    useEffect(() => {
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    // Fetch cart items on mount in case Redux state is empty
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

    console.log('Checkout totalPrice:', totalPrice, 'deliveryCharge:', deliveryCharge, 'totalAmount:', totalAmount);

    // Delivery date: 1 week from today
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
            alert('Please add or select an address before placing an order.');
            return;
        }
        setProcessing(true);
        try {
            const products = cartItems.map(item => ({
                productId: item.product._id,
                quantity: item.quantity
            }));
            const cartItemsToDelete = cartItems.map(cartItem => cartItem.cartItemId);

            if (paymentMethod === 'cod') {
                // COD: create order without Razorpay
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
                // Delete cart items
                await Promise.all(cartItemsToDelete.map(id =>
                    axios.delete(`${import.meta.env.VITE_PORT}/api/cart/delete/${id}`)
                ));
                // alert('Order placed successfully! You will pay on delivery.');
                navigate('/paymentsuccess');
            } else {
                // Online payment: existing Razorpay flow
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
                const productsQueryParam = encodeURIComponent(JSON.stringify(products));
                const cartItemsQueryParam = encodeURIComponent(JSON.stringify(cartItemsToDelete));
                const options = {
                    key,
                    amount: order.amount,
                    currency: "INR",
                    name: "SilverWale",
                    description: "Ecommerce for jewellery",
                    image: "https://example.com/your_logo",
                    order_id: order.id,
                    handler: async (response) => {
                        // Payment successful: clear cart and redirect
                        try {
                            await Promise.all(cartItemsToDelete.map(id =>
                                axios.delete(`${import.meta.env.VITE_PORT}/api/cart/delete/${id}`)
                            ));
                            // Optionally: show success and redirect
                            // alert('Payment successful! Order placed.');
                            navigate('/paymentsuccess');
                        } catch (err) {
                            console.error('Failed to clear cart after payment:', err);
                            alert('Payment succeeded, but failed to clear cart. Please contact support.');
                        }
                    },
                    prefill: {
                        name: "Gaurav Kumar",
                        email: "gaurav.kumar@example.com",
                        contact: "9000090000"
                    },
                    notes: {
                        address: "Razorpay Corporate Office"
                    },
                    theme: {
                        color: "#3399cc"
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

    return (
        <>
            <DummyHeader />
            <AddressCard className='w-fit' onAddressSelect={setSelectedAddress} />
            <div className='max-w-4xl mx-auto p-6 bg-white rounded shadow-lg space-y-6'>
                <h1 className='text-2xl font-semibold'>Checkout</h1>

                {loadingDelivery ? (
                    <p>Loading pricing...</p>
                ) : (
                    <>
                        {/* Order Summary */}
                        <div className='border rounded p-4 space-y-2'>
                            <h2 className='text-lg font-semibold mb-2'>Order Summary</h2>
                            <div className='flex justify-between'>
                                <p>Subtotal</p>
                                <p>₹{totalPrice + 100}</p>
                            </div>
                            <div className='flex justify-between'>Discount <p>-₹100</p></div>
                            <div className='flex justify-between'>
                                Delivery
                                <p>
                                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                                </p>
                            </div>
                            {paymentMethod === 'cod' && (
                                <div className='flex justify-between text-orange-600'>
                                    COD Extra Fee
                                    <p>₹{codFee}</p>
                                </div>
                            )}
                            <hr className='border-gray-400' />
                            <div className='flex justify-between font-semibold text-lg'>
                                Total
                                <p>₹{totalAmount}</p>
                            </div>
                            <div className='text-sm text-gray-600'>
                                You saved ₹100 in this order
                                {deliveryCharge === 0 && ' + FREE delivery'}
                            </div>
                        </div>

                        {/* Delivery Date */}
                        <div className='border rounded p-4'>
                            <h2 className='text-lg font-semibold mb-2'>Delivery Details</h2>
                            <p className='text-gray-700'>Estimated delivery by <strong>{formattedDeliveryDate}</strong></p>
                        </div>

                        {/* Payment Method */}
                        <div className='border rounded p-4'>
                            <h2 className='text-lg font-semibold mb-2'>Payment Method</h2>
                            <div className='space-y-2'>
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input
                                        type='radio'
                                        name='paymentMethod'
                                        value='online'
                                        checked={paymentMethod === 'online'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>Pay Online (Razorpay)</span>
                                </label>
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input
                                        type='radio'
                                        name='paymentMethod'
                                        value='cod'
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>Cash on Delivery (COD)</span>
                                </label>
                            </div>
                        </div>

                        {/* Place Order Button */}
                        <button
                            onClick={handlePlaceOrder}
                            disabled={processing}
                            className='w-full bg-blue-600 text-white py-3 rounded font-semibold disabled:opacity-50'
                        >
                            {processing ? 'Processing...' : `Place Order (${paymentMethod === 'cod' ? 'COD' : 'Pay Online'})`}
                        </button>
                    </>
                )}
            </div>
        </>
    );
}

export default Checkout;
