

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../Firebase'; // Ensure this path is correct

function Payment() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const grandTotal = 1000; // Example grand total amount
  const cartItems = []; // Example cart items array

  const loadRazorpayScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  };

  const buyNow = async () => {
    try {
      await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    } catch {
      return toast.error('Razorpay SDK failed to load. Are you online?');
    }

    // validation 
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
        key: "rzp_test_PkyiG8HwLHo5Y9",
        key_secret: "PV0C39YB4yXK7PCCvVZrUC8H", // Move this to a secure server environment
      amount: parseInt(grandTotal * 100), // Ensure grandTotal is defined
      currency: "INR",
      order_receipt: 'order_rcptid_' + name,
      name: "E-Bharat",
      description: "for testing purpose",
      handler: async function (response) {
        toast.success('Payment Successful');

        const paymentId = response.razorpay_payment_id;
        // store in firebase 
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

    if (window.Razorpay) {
      var pay = new window.Razorpay(options);
      pay.open();
      console.log(pay);
    } else {
      toast.error('Razorpay SDK is not loaded');
    }
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
      <button
        onClick={buyNow}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Buy Now
      </button>
      <ToastContainer />
    </div>
  );
}

export default Payment;
