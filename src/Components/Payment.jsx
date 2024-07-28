import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../Firebase'; 

function Payment() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [couponCode, setCouponCode] = useState(""); 
  const [discount, setDiscount] = useState(0); 
  const [paymentMethod, setPaymentMethod] = useState(''); 
  const grandTotal = 1000; 
  const cartItems = []; 
  const validCoupons = {
    'DISCOUNT10': 10,
    'DISCOUNT20': 20,
  };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const loadPaypalScript = async () => {
      const res = await loadScript('https://www.paypal.com/sdk/js?client-id=AcD4zOIDkak7TIuRl9wjj6tJWpuS36gH4CZVxtKbepjv7252kzkyEwcBOALQ2MY5-CszRaWIY5De7PUF');
      if (!res) {
        toast.error('PayPal SDK failed to load. Are you online?');
        return;
      }

      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: ((grandTotal - discount) / 100).toFixed(2),
              },
            }],
          });
        },
        onApprove: async (data, actions) => {
          const details = await actions.order.capture();
          toast.success('Payment Successful');
          const paymentId = details.id;
          const orderInfo = {
            cartItems,
            addressInfo: {
              name,
              address,
              pincode,
              phoneNumber,
              date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }),
            },
            date: new Date().toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
            email: JSON.parse(localStorage.getItem("user")).user.email,
            userid: JSON.parse(localStorage.getItem("user")).user.uid,
            paymentId,
          };

          try {
            await addDoc(collection(fireDB, "orders"), orderInfo);
          } catch (error) {
            console.log(error);
          }
        },
      }).render('#paypal-button-container');
    };

    if (paymentMethod === 'paypal') {
      loadPaypalScript();
    }
  }, [paymentMethod, name, address, pincode, phoneNumber, grandTotal, discount, cartItems]);

  const validateCoupon = () => {
    if (validCoupons[couponCode]) {
      setDiscount((grandTotal * validCoupons[couponCode]) / 100);
      toast.success(`Coupon applied! You get a ${validCoupons[couponCode]}% discount.`);
    } else {
      setDiscount(0);
      toast.error('Invalid coupon code.');
    }
  };

  const buyNow = async () => {
    try {
      const scriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!scriptLoaded) {
        return toast.error('Razorpay SDK failed to load. Are you online?');
      }
    } catch (error) {
      return toast.error('Razorpay SDK failed to load. Are you online?');
    }

    if (name === "" || address === "" || pincode === "" || phoneNumber === "") {
      return toast.error("All fields are required", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }

    const addressInfo = {
      name,
      address,
      pincode,
      phoneNumber,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    var options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      key_secret: import.meta.env.VITE_RAZORPAY_KEY_SECRET,
      amount: parseInt((grandTotal - discount) * 100), 
      currency: "INR",
      order_receipt: 'order_rcptid_' + name,
      name: "E-Bharat",
      description: "for testing purpose",
      handler: async function (response) {
        toast.success('Payment Successful');

        const paymentId = response.razorpay_payment_id;
        const orderInfo = {
          cartItems,
          addressInfo,
          date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          email: JSON.parse(localStorage.getItem("user")).user.email,
          userid: JSON.parse(localStorage.getItem("user")).user.uid,
          paymentId,
        };

        try {
          await addDoc(collection(fireDB, "orders"), orderInfo);
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    var pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Payment Form</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Pincode</label>
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button onClick={validateCoupon} className="mt-2 bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600">Apply Coupon</button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Payment Method</option>
          <option value="paypal">PayPal</option>
          <option value="razorpay">Razorpay</option>
        </select>
      </div>
      {paymentMethod === 'paypal' && (
        <div id="paypal-button-container"></div>
      )}
      {paymentMethod === 'razorpay' && (
        <button
          onClick={buyNow}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Buy Now
        </button>
      )}
      <ToastContainer />
    </div>
  );
}

export default Payment;
