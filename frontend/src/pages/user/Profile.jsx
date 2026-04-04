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
  deleteAddressFailure,
  addAddressStart,
  addAddressSuccess,
  addAddressFailure,
  swapDefaultAddress
} from '../../redux/slices/addressSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import toast from 'react-hot-toast';
import { FaUser, FaBoxOpen, FaMapMarkerAlt, FaChevronRight, FaTimes, FaSignOutAlt, FaPlus } from 'react-icons/fa';

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector(state => state.user);
  const { orders, loading: ordersLoading } = useSelector((state) => state.order);
  const { addresses, loading: addressLoading } = useSelector((state) => state.address);
  
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'dashboard';

  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', addressLine1: '', addressLine2: '',
    city: '', postalCode: '', country: '', phoneNumber: ''
  });

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
      toast.success('Address removed');
    } catch (error) {
      dispatch(deleteAddressFailure(error.message));
    }
  };

  const handleMakeDefault = (idx) => {
    // idx is 1-based relative to the additional addresses (slice(1)), so actual index = idx + 1
    dispatch(swapDefaultAddress(idx + 1));
    toast.success('Default address updated');
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    dispatch(addAddressStart());
    try {
      const res = await fetch(`${import.meta.env.VITE_PORT}/api/user/createaddress/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to add address');
      const data = await res.json();
      dispatch(addAddressSuccess(data));
      toast.success('Address added');
      setShowAddForm(false);
      setFormData({ fullName: '', addressLine1: '', addressLine2: '', city: '', postalCode: '', country: '', phoneNumber: '' });
      fetchAddresses();
    } catch (err) {
      dispatch(addAddressFailure(err.message));
      toast.error('Could not save address');
    } finally {
      setSaving(false);
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

                {/* Default Address */}
                <div className="border border-gray-100">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600">Default Address</h3>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 text-xs">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black mb-4">Default Billing Address</h4>
                      {addresses.length > 0 ? (
                        <div className="text-gray-500 space-y-1">
                          <p className="font-bold text-gray-800">{addresses[0].fullName}</p>
                          <p>{addresses[0].addressLine1}</p>
                          {addresses[0].addressLine2 && <p>{addresses[0].addressLine2}</p>}
                          <p>{addresses[0].city}, {addresses[0].postalCode}</p>
                          <p>{addresses[0].country}</p>
                          <p className="text-gray-400">{addresses[0].phoneNumber}</p>
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
                          {addresses[0].addressLine2 && <p>{addresses[0].addressLine2}</p>}
                          <p>{addresses[0].city}, {addresses[0].postalCode}</p>
                          <p>{addresses[0].country}</p>
                          <p className="text-gray-400">{addresses[0].phoneNumber}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400">You have not set a default shipping address.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Addresses */}
                <div className="border border-gray-100">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600">Additional Addresses</h3>
                  </div>
                  <div className="p-8">
                    {addresses.length > 1 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.slice(1).map((addr, idx) => (
                          <div key={addr._id} className="relative p-6 border border-gray-100 group hover:border-gray-300 transition-all space-y-4">
                            {/* Delete button — X instead of trash */}
                            <button 
                              onClick={() => handleAddressDelete(addr._id)}
                              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <FaTimes className="h-3.5 w-3.5" />
                            </button>

                            <div className="text-xs text-gray-500 space-y-1 pr-6">
                              <p className="font-bold text-gray-800 text-sm">{addr.fullName}</p>
                              <p>{addr.addressLine1}</p>
                              {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                              <p>{addr.city}, {addr.postalCode}</p>
                              <p>{addr.country}</p>
                              <p className="text-gray-400">{addr.phoneNumber}</p>
                            </div>

                            {/* Make Default button */}
                            <button 
                              onClick={() => handleMakeDefault(idx)}
                              className="text-[10px] font-bold uppercase tracking-widest border-b border-gray-300 pb-0.5 text-gray-400 hover:text-black hover:border-black transition-all"
                            >
                              Make Default
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-xs italic">No additional addresses found.</p>
                    )}
                  </div>
                </div>

                {/* Add Address Button */}
                <div className="flex justify-between items-center pt-2">
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl"
                  >
                    <FaPlus className="h-3 w-3" />
                    <span>Add New Address</span>
                  </button>
                  <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Back</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inline Add Address Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
          <div className="relative bg-white w-full max-w-lg mx-4 shadow-2xl animate-fadeIn overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-serif italic text-gray-800">New Delivery Address</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-black transition-colors">
                <FaTimes className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="px-8 py-6 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                <input
                  name="fullName" value={formData.fullName} onChange={handleFormChange}
                  placeholder="Recipient's full name" required
                  className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone</label>
                  <input
                    name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange}
                    placeholder="+91..." required
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Postal Code</label>
                  <input
                    name="postalCode" value={formData.postalCode} onChange={handleFormChange}
                    placeholder="Pincode" required
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Address Line 1</label>
                <input
                  name="addressLine1" value={formData.addressLine1} onChange={handleFormChange}
                  placeholder="House No., Building, Street" required
                  className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Address Line 2 (Optional)</label>
                <input
                  name="addressLine2" value={formData.addressLine2} onChange={handleFormChange}
                  placeholder="Locality, Landmark"
                  className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">City</label>
                  <input
                    name="city" value={formData.city} onChange={handleFormChange}
                    placeholder="City" required
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Country</label>
                  <input
                    name="country" value={formData.country} onChange={handleFormChange}
                    placeholder="Country" required
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex space-x-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all disabled:bg-gray-400"
                >
                  {saving ? 'Saving...' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:border-black transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
