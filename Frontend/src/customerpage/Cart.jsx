import React, { useEffect, useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("userauthToken"); 
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    if (!token) {
      console.error("No token found! User must log in.");
      setError("You need to log in first.");
      setLoading(false);
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${apiUrl}/user/getcartitem`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Cart API Response:", data); // Debugging

      if (response.ok && Array.isArray(data.cart)) {
        setCart(data.cart); // Ensure this matches the actual response structure
      } else {
        setError(data.message || "Failed to fetch cart items.");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to fetch cart.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    console.log("Removing product with ID:", productId); // Debugging log

    try {
      const response = await fetch(`${apiUrl}/user/removecartitem`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }), 
      });

      const data = await response.text(); 
      console.log("Raw Response:", data); 

      try {
        const jsonData = JSON.parse(data);
        if (response.ok) {
          setCart(jsonData.cart);
        } else {
          console.error("Error removing item from cart:", jsonData.message);
        }
      } catch (e) {
        console.error("Error parsing response:", e);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Your Cart</h1>

        {loading && <p className="text-center text-gray-600">Loading cart...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && cart.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <img
              src="https://media.giphy.com/media/LqW1z4sLnQ15S/giphy.gif" 
              alt="Empty Cart"
              className="w-64 h-64 object-cover rounded-lg"
            />
            <p className="text-center text-gray-600 text-xl">Your cart is empty. Let's fill it up!</p>
          </div>
        )}

        {!loading && !error && cart.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item.productId || item._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-6">
                    <img
                      src={item.imageFile}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex flex-col">
                      <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">Kitchen: {item.kitchenName}</p>
                      <p className="text-gray-600">Price: ${item.price}</p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 hover:text-red-700 font-semibold transition-colors duration-200"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Total</h3>
                <p className="text-xl font-bold text-gray-800">
                  ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                </p>
              </div>
              <button
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;