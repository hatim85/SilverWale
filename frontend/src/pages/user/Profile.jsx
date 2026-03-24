import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess
} from '../../redux/slices/userSlice.js'
import { 
  getOrdersFailure, 
  getOrdersStart, 
  getOrdersSuccess, 
  updateOrderStatusFailure, 
  updateOrderStatusStart, 
  updateOrderStatusSuccess 
} from '../../redux/slices/orderSlice';
import { 
  fetchAddressesStart, 
  fetchAddressesSuccess, 
  fetchAddressesFailure,
  deleteAddressStart,
  deleteAddressSuccess,
  deleteAddressFailure
} from '../../redux/slices/addressSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import { toast } from 'react-toastify';
import { FaUser, FaBoxOpen, FaMapMarkerAlt, FaChevronRight, FaTrash, FaSignOutAlt } from 'react-icons/fa';

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector(state => state.user);
  const { orders, loading: ordersLoading } = useSelector((state) => state.order);
  const { addresses, loading: addressLoading } = useSelector((state) => state.address);
  
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'dashboard';

  useEffect(() => {
    if (currentUser?._id) {
      fetchOrders();
      fetchAddresses();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    dispatch(getOrdersStart())
    try {
      const res = await fetch(`${import.meta.env.VITE_PORT}/api/orders/getorders/${currentUser._id}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      dispatch(getOrdersSuccess(data));
    } catch (error) {
      dispatch(getOrdersFailure(error.message));
    }
  };

  const fetchAddresses = async () => {
    dispatch(fetchAddressesStart());
    try {
      const res = await fetch(`${import.meta.env.VITE_PORT}/api/user/address/${currentUser._id}`);
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      dispatch(fetchAddressesSuccess(data));
    } catch (error) {
      dispatch(fetchAddressesFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_PORT}/api/user/signout`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message)
      } else {
        dispatch(signoutSuccess());
        localStorage.removeItem('user');
        toast.success("Signed Out Successfully")
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleCancelOrder = async (orderId) => {
    dispatch(updateOrderStatusStart());
    try {
      const res = await fetch(`${import.meta.env.VITE_PORT}/api/orders/updatestatus/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      })
      if (!res.ok) throw new Error('Failed to cancel order');
      dispatch(updateOrderStatusSuccess({ orderId, status: 'cancelled' }))
      toast.success('Order cancelled');
    } catch (error) {
      dispatch(updateOrderStatusFailure(error.message))
    }
  };

  const handleAddressDelete = async (addressId) => {
    dispatch(deleteAddressStart());
    try {
      const response = await fetch(`${import.meta.env.VITE_PORT}/api/user/deleteaddress/${addressId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete address');
      dispatch(deleteAddressSuccess(addressId));
      toast.success('Address deleted');
    } catch (error) {
      dispatch(deleteAddressFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-80 flex flex-col space-y-3">
            <button 
              onClick={() => navigate('/profile?tab=dashboard')}
              className={`flex items-center justify-between p-5 border border-gray-100 rounded-sm transition-all ${currentTab === 'dashboard' ? 'shadow-md border-black bg-white ring-1 ring-black' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center space-x-4">
                <FaUser className={currentTab === 'dashboard' ? 'text-black' : 'text-gray-400'} />
                <span className={`text-xs font-bold uppercase tracking-widest ${currentTab === 'dashboard' ? 'text-black' : 'text-gray-500'}`}>Profile</span>
              </div>
              <FaChevronRight className="text-gray-300 text-[10px]" />
            </button>

            <button 
              onClick={() => navigate('/profile?tab=orders')}
              className={`flex items-center justify-between p-5 border border-gray-100 rounded-sm transition-all ${currentTab === 'orders' ? 'shadow-md border-black bg-white ring-1 ring-black' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center space-x-4">
                <FaBoxOpen className={currentTab === 'orders' ? 'text-black' : 'text-gray-400'} />
                <span className={`text-xs font-bold uppercase tracking-widest ${currentTab === 'orders' ? 'text-black' : 'text-gray-500'}`}>Orders</span>
              </div>
              <FaChevronRight className="text-gray-300 text-[10px]" />
            </button>

            <button 
              onClick={() => navigate('/profile?tab=addresses')}
              className={`flex items-center justify-between p-5 border border-gray-100 rounded-sm transition-all ${currentTab === 'addresses' ? 'shadow-md border-black bg-white ring-1 ring-black' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center space-x-4">
                <FaMapMarkerAlt className={currentTab === 'addresses' ? 'text-black' : 'text-gray-400'} />
                <span className={`text-xs font-bold uppercase tracking-widest ${currentTab === 'addresses' ? 'text-black' : 'text-gray-500'}`}>Address Book</span>
              </div>
              <FaChevronRight className="text-gray-300 text-[10px]" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-grow min-h-[500px]">
            {currentTab === 'dashboard' && (
              <div className="space-y-10 animate-fadeIn">
                <div className="flex justify-between items-center bg-transparent border-b border-gray-100 pb-4">
                  <h2 className="text-3xl font-serif italic text-gray-800">My Dashboard</h2>
                  <button onClick={handleSignout} className="bg-black text-white px-8 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">Logout</button>
                </div>

                <div className="border border-gray-100">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600">Account Information</h3>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Contact Information</h4>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p className="font-bold text-gray-800 text-sm mb-2">{currentUser.username}</p>
                        <p>{currentUser.email}</p>
                        <p>{currentUser.phone || 'No phone number provided'}</p>
                      </div>
                      <div className="pt-2 flex space-x-4">
                        <button className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">Edit</button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Newsletters</h4>
                      <p className="text-xs text-gray-400">You aren't subscribed to our newsletter.</p>
                      <button className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1">Edit</button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600">Address Book</h3>
                    <button onClick={() => navigate('/profile?tab=addresses')} className="text-[10px] font-bold uppercase tracking-widest border-b border-gray-400 pb-1 text-gray-500 hover:text-black hover:border-black transition-all">Manage Addresses</button>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 text-xs">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black mb-4">Default Billing Address</h4>
                      {addresses.length > 0 ? (
                        <div className="text-gray-500 space-y-1">
                          <p className="font-bold text-gray-800">{addresses[0].fullName}</p>
                          <p>{addresses[0].addressLine1}</p>
                          <p>{addresses[0].city}, {addresses[0].postalCode}</p>
                          <p>{addresses[0].country}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400">You have not set a default billing address.</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black mb-4">Default Shipping Address</h4>
                      {addresses.length > 0 ? (
                        <div className="text-gray-500 space-y-1">
                          <p className="font-bold text-gray-800">{addresses[0].fullName}</p>
                          <p>{addresses[0].addressLine1}</p>
                          <p>{addresses[0].city}, {addresses[0].postalCode}</p>
                          <p>{addresses[0].country}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400">You have not set a default shipping address.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'orders' && (
              <div className="space-y-10 animate-fadeIn">
                <div className="bg-transparent border-b border-gray-100 pb-4">
                  <h2 className="text-3xl font-serif italic text-gray-800">My Orders</h2>
                </div>
                
                {ordersLoading ? (
                  <p className="text-gray-400 text-xs text-center py-20 uppercase tracking-widest">Loading history...</p>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-100 bg-white p-6 rounded-sm space-y-6">
                        <div className="flex flex-col md:flex-row justify-between pb-4 border-b border-gray-50 gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID: <span className="text-black">{order._id}</span></p>
                            <p className="text-xs text-gray-500">Placed on {new Date(order.orderDate).toLocaleDateString()} • Status: <span className={`uppercase font-bold ${order.status === 'confirmed' ? 'text-green-600' : 'text-gray-800'}`}>{order.status}</span></p>
                          </div>
                          <div className="flex items-center space-x-6">
                            <p className="text-lg font-bold">₹{order.totalAmount}</p>
                            {order.status !== 'cancelled' && (
                              <button onClick={() => handleCancelOrder(order._id)} className="text-[10px] font-bold uppercase tracking-widest text-red-500 border-b border-red-200">Cancel</button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {order.products?.map((item, idx) => {
                             const coverIdx = item.productId?.coverImageIndex ?? 0;
                             const filename = item.productId?.image?.[coverIdx] || item.productId?.image?.[0];
                             const displayImg = filename ? (filename.includes('cloudinary.com') ? filename : `/${filename.split(/[\\/]/).pop()}`) : '/ErrorImage.png';
                             return (
                               <div key={idx} className="flex gap-4 items-center bg-gray-50/50 p-3">
                                 <img src={displayImg} className="w-16 h-16 object-contain bg-white border border-gray-100" />
                                 <div className="text-[11px]">
                                   <p className="font-bold text-gray-800 mb-1">{item.productId?.name || 'Product'}</p>
                                   <p className="text-gray-500">Qty: {item.quantity} × ₹{item.unitPriceAtPurchase}</p>
                                 </div>
                               </div>
                             );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center border border-gray-100 border-dashed rounded-sm">
                    <p className="text-gray-400 text-xs uppercase tracking-[0.2em]">You have placed no order.</p>
                  </div>
                )}
              </div>
            )}

            {currentTab === 'addresses' && (
              <div className="space-y-10 animate-fadeIn">
                <div className="bg-transparent border-b border-gray-100 pb-4">
                  <h2 className="text-3xl font-serif italic text-gray-800">Address Book</h2>
                </div>

                <div className="border border-gray-100">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600">Default Addresses</h3>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 text-xs">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black mb-4">Default Billing Address</h4>
                      {addresses.length > 0 ? (
                         <div className="text-gray-500 space-y-1">
                            <p className="font-bold text-gray-800">{addresses[0].fullName}</p>
                            <p>{addresses[0].addressLine1}</p>
                            <p>{addresses[0].city}, {addresses[0].postalCode}</p>
                            <p>{addresses[0].country}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400">You have not set a default billing address.</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black mb-4">Default Shipping Address</h4>
                      {addresses.length > 0 ? (
                        <div className="text-gray-500 space-y-1">
                            <p className="font-bold text-gray-800">{addresses[0].fullName}</p>
                            <p>{addresses[0].addressLine1}</p>
                            <p>{addresses[0].city}, {addresses[0].postalCode}</p>
                            <p>{addresses[0].country}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400">You have not set a default shipping address.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600">Additional Address Entries</h3>
                  </div>
                  <div className="p-8">
                    {addresses.length > 1 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {addresses.slice(1).map((addr, idx) => (
                          <div key={idx} className="relative p-6 bg-gray-50/30 border border-gray-50 group">
                            <div className="text-xs text-gray-500 space-y-1">
                              <p className="font-bold text-gray-800">{addr.fullName}</p>
                              <p>{addr.addressLine1}</p>
                              <p>{addr.city}, {addr.postalCode}</p>
                              <p>{addr.country}</p>
                            </div>
                            <button 
                              onClick={() => handleAddressDelete(addr._id)}
                              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <FaTrash className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-xs italic">No additional addresses found.</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6">
                  <button 
                    onClick={() => navigate('/addressform')}
                    className="bg-black text-white px-10 py-4 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl"
                  >
                    Add New Address
                  </button>
                  <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Back</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
