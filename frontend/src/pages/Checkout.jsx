import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  MapPin, Plus, Loader2, CheckCircle2, AlertCircle, 
  CreditCard, ShieldCheck, ArrowLeft, Truck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Checkout = () => {
  const { cart, coupon, total, subtotal, discount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Checkout success details
  const [placedOrder, setPlacedOrder] = useState(null);

  // Address creation form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const { register: registerAddr, handleSubmit: handleSubmitAddr, reset: resetAddr, formState: { errors: errorsAddr } } = useForm();
  
  // Payment card form
  const { register: registerPay, handleSubmit: handleSubmitPay, formState: { errors: errorsPay } } = useForm();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    if (cart.length === 0 && !placedOrder) {
      navigate('/cart');
      return;
    }
    fetchAddresses();
  }, [isAuthenticated, cart.length]);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/users/addresses');
      setAddresses(response.data);
      const defaultAddr = response.data.find(a => a.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
      } else if (response.data.length > 0) {
        setSelectedAddress(response.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAddress = async (data) => {
    setSavingAddress(true);
    try {
      const response = await api.post('/users/addresses', { ...data, isDefault: addresses.length === 0 });
      setAddresses([...addresses, response.data]);
      setSelectedAddress(response.data.id);
      setShowAddressForm(false);
      resetAddr();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePlaceOrder = async (payData) => {
    if (!selectedAddress) {
      setErrorMsg('Please select a shipping address.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    const mockTransactionId = 'TXN-' + Math.floor(100000000 + Math.random() * 900000000);
    const checkoutPayload = {
      addressId: selectedAddress,
      couponCode: coupon ? coupon.code : null,
      paymentMethod: paymentMethod,
      transactionId: mockTransactionId
    };

    try {
      const response = await api.post('/orders', checkoutPayload);
      setPlacedOrder(response.data);
      clearCart(); // Local cart state clear
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Transaction declined. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center animate-fade-in space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-500 mb-2 dark:bg-green-950/20">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        
        <h2 className="font-outfit text-2xl font-extrabold text-gray-800 dark:text-white">Order Confirmed!</h2>
        
        <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          Your order #{placedOrder.id} has been placed successfully and is currently being processed. 
          A confirmation notification has been sent to your Profile.
        </p>

        {/* Invoice Summary Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-soft dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h4 className="font-outfit text-xs font-bold text-gray-400 uppercase tracking-wider">Fulfillment Status</h4>
          
          <div className="flex items-center gap-3 bg-primary-50/50 border border-primary-100/50 p-3 rounded-xl dark:bg-primary-950/20 dark:border-primary-900/50">
            <Truck className="h-5 w-5 text-primary-500 shrink-0" />
            <div className="text-xs text-primary-600 dark:text-primary-400">
              <span className="font-bold block">Delivery Method: Standard Standard</span>
              <span className="text-3xs block text-primary-500/80">Estimated delivery: 3-5 Business Days</span>
            </div>
          </div>

          <div className="text-xs space-y-2 text-gray-500 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Order Reference:</span>
              <span className="font-semibold text-gray-800 dark:text-slate-200"># {placedOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-bold text-gray-800 dark:text-white">${placedOrder.finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            to="/orders"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            Track Order
          </Link>
          <Link
            to="/books"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary-500 px-6 text-xs font-bold text-white hover:bg-primary-600 shadow-soft"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Return to cart */}
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 dark:hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" />
        Return to Shopping Cart
      </Link>
      
      <h1 className="font-outfit text-2xl font-bold text-gray-800 dark:text-white">Checkout</h1>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column Delivery Addresses & Payment details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Address section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-primary-500" />
                <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-sm">Shipping Destination</h3>
              </div>
              <button 
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-500 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                Add New Address
              </button>
            </div>

            {/* Create new address form */}
            {showAddressForm && (
              <form onSubmit={handleSubmitAddr(handleCreateAddress)} className="p-4.5 rounded-2xl bg-gray-50 border border-gray-100 dark:bg-slate-800/40 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Street Address</label>
                  <input
                    type="text"
                    {...registerAddr('street', { required: 'Street is required' })}
                    placeholder="123 Bestseller Lane, Suite 2"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                  {errorsAddr.street && <span className="text-3xs text-red-500">{errorsAddr.street.message}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    {...registerAddr('city', { required: 'City is required' })}
                    placeholder="New York"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                  {errorsAddr.city && <span className="text-3xs text-red-500">{errorsAddr.city.message}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">State</label>
                  <input
                    type="text"
                    {...registerAddr('state', { required: 'State is required' })}
                    placeholder="NY"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                  {errorsAddr.state && <span className="text-3xs text-red-500">{errorsAddr.state.message}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Country</label>
                  <input
                    type="text"
                    {...registerAddr('country', { required: 'Country is required' })}
                    placeholder="USA"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                  {errorsAddr.country && <span className="text-3xs text-red-500">{errorsAddr.country.message}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Postal / Zip Code</label>
                  <input
                    type="text"
                    {...registerAddr('zipCode', { required: 'Zip code is required' })}
                    placeholder="10001"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                  {errorsAddr.zipCode && <span className="text-3xs text-red-500">{errorsAddr.zipCode.message}</span>}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Contact Phone</label>
                  <input
                    type="text"
                    {...registerAddr('phone', { required: 'Phone is required' })}
                    placeholder="+1 555-0199"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                  {errorsAddr.phone && <span className="text-3xs text-red-500">{errorsAddr.phone.message}</span>}
                </div>

                <div className="sm:col-span-2 flex gap-2 pt-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setShowAddressForm(false)} 
                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={savingAddress}
                    className="rounded-xl bg-primary-500 px-4 py-2 text-xs font-bold text-white hover:bg-primary-600"
                  >
                    {savingAddress ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            )}

            {/* Addresses list */}
            {addresses.length === 0 ? (
              <span className="block text-gray-400 text-xs text-center py-6">No delivery addresses found. Add one above to proceed!</span>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <label 
                    key={addr.id} 
                    className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAddress === addr.id
                        ? 'border-primary-500 bg-primary-50/10 shadow-soft'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="absolute right-3.5 top-3.5 h-4.5 w-4.5 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="font-bold text-xs text-gray-800 dark:text-slate-100 block mb-1">
                      {addr.isDefault && (
                        <span className="bg-primary-50 text-primary-500 px-2 py-0.5 rounded-full text-3xs mr-2 dark:bg-primary-950/20">Default</span>
                      )}
                      Delivery Location
                    </span>
                    <span className="text-3xs text-gray-500 dark:text-slate-400 leading-relaxed font-medium">
                      {addr.street}, {addr.city}, {addr.state}, {addr.country} - {addr.zipCode}
                    </span>
                    <span className="text-3xs text-gray-400 mt-2">Phone: {addr.phone}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment Card Form */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-3 dark:border-slate-800">
              <CreditCard className="h-4.5 w-4.5 text-primary-500" />
              <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-sm">Payment Methods</h3>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`flex-1 flex gap-2 items-center justify-center p-3 rounded-xl border font-semibold text-xs transition-colors ${
                  paymentMethod === 'CARD' 
                    ? 'border-primary-500 bg-primary-50/10 text-primary-500' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                }`}
              >
                <CreditCard className="h-4.5 w-4.5" />
                Credit/Debit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex-1 flex gap-2 items-center justify-center p-3 rounded-xl border font-semibold text-xs transition-colors ${
                  paymentMethod === 'UPI' 
                    ? 'border-primary-500 bg-primary-50/10 text-primary-500' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                }`}
              >
                UPI Payments
              </button>
            </div>

            {/* Card Information forms */}
            {paymentMethod === 'CARD' ? (
              <form onSubmit={handleSubmitPay(handlePlaceOrder)} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Cardholder Name</label>
                  <input
                    type="text"
                    {...registerPay('cardName', { required: 'Cardholder name is required' })}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                  {errorsPay.cardName && <span className="text-3xs text-red-500">{errorsPay.cardName.message}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Card Number</label>
                  <input
                    type="text"
                    {...registerPay('cardNumber', { 
                      required: 'Card number is required',
                      pattern: { value: /^\d{16}$/, message: 'Must be a 16-digit card number' }
                    })}
                    placeholder="4111 2222 3333 4444"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                  {errorsPay.cardNumber && <span className="text-3xs text-red-500">{errorsPay.cardNumber.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      {...registerPay('expiry', { 
                        required: 'Expiry is required',
                        pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Must match MM/YY format' }
                      })}
                      placeholder="12/28"
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                    />
                    {errorsPay.expiry && <span className="text-3xs text-red-500">{errorsPay.expiry.message}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">CVV</label>
                    <input
                      type="password"
                      {...registerPay('cvv', { 
                        required: 'CVV is required',
                        pattern: { value: /^\d{3}$/, message: 'Must be 3 digits' }
                      })}
                      placeholder="123"
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                    />
                    {errorsPay.cvv && <span className="text-3xs text-red-500">{errorsPay.cvv.message}</span>}
                  </div>
                </div>

                {/* Place Order Trigger */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 text-xs font-bold text-white shadow-soft hover:bg-primary-600 transition-all hover:-translate-y-0.5 disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-slate-800"
                >
                  {submitting ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : `Authorize Payment & Place Order`}
                </button>
              </form>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">UPI Identifier (VPA)</label>
                  <input
                    type="text"
                    placeholder="username@okaxis"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                </div>
                <button
                  onClick={() => handlePlaceOrder()}
                  disabled={submitting}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 text-xs font-bold text-white shadow-soft hover:bg-primary-600 transition-all hover:-translate-y-0.5 disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-slate-800"
                >
                  {submitting ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : 'Pay & Order'}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column Checkout Summaries */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 h-fit space-y-4">
          <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-sm border-b border-gray-50 pb-3 dark:border-slate-800">
            Review Items List
          </h3>

          <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
            {cart.map((item) => {
              const price = item.bookDiscountPrice > 0 ? item.bookDiscountPrice : item.bookPrice;
              return (
                <div key={item.id} className="flex gap-3 py-3 items-center">
                  <img src={item.bookCoverImage} alt={item.bookTitle} className="h-12 w-9 object-cover rounded border border-gray-100 dark:border-slate-800" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xs text-gray-800 dark:text-slate-200 block truncate">{item.bookTitle}</span>
                    <span className="text-3xs text-gray-400 mt-0.5">Qty {item.quantity} &bull; ${price.toFixed(2)}</span>
                  </div>
                  <span className="font-bold text-xs text-gray-800 dark:text-slate-100">${(price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2.5 text-xs text-gray-500 dark:text-slate-400 pt-3 border-t border-gray-50 dark:border-slate-800">
            <div className="flex justify-between">
              <span>Checkout Subtotal:</span>
              <span className="font-semibold text-gray-800 dark:text-slate-200">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Coupon Deductions:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-50 pt-2.5 dark:border-slate-800 text-xs font-bold text-gray-800 dark:text-white">
              <span>Amount Payable:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-3xs text-gray-400 pt-2 border-t border-gray-50 dark:border-slate-800/50">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span>Encrypted payments by Secure Gate</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Checkout;
