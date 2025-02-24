import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});
  const [cart, setCart] = useState([]);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/user/getallproducts`);

        const sortedProducts = response.data.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProducts(sortedProducts);

        if (sortedProducts.length === 0) {
          toast.info("No products available. Please check back later!");
        }
        setError(null);
      } catch (error) {
        setError("Failed to fetch products.");
        toast.error("Failed to fetch products.");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchCartItems();
  }, []);

  // Fetch cart items to check the owner's ID
  const fetchCartItems = async () => {
    const token = localStorage.getItem("userauthToken");
    if (!token) return;

    try {
      const response = await axios.get(`${apiUrl}/user/getcart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(response.data.cart || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };
  const addToCart = async (product) => {
    const token = localStorage.getItem("userauthToken");

    if (!token) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    // If the cart is not empty, ensure all items belong to the same owner
    if (cart.length > 0) {
      const existingOwnerId = cart[0]?.ownerId; // Get the first item's ownerId

      if (product.ownerId !== existingOwnerId) {
        toast.error("You can only add products from the same owner.");
        return;
      }
    }

    setAddingToCart((prev) => ({ ...prev, [product._id]: true }));

    try {
      // Include ownerId in the request body
      const response = await axios.post(
        `${apiUrl}/user/addtocart`,
        { productId: product._id, ownerId: product.ownerId }, // Add ownerId to the request
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success || (response.status >= 200 && response.status < 300)) {
        toast.success(`${product.name} added to cart!`);
        fetchCartItems(); // Update cart after adding
      } else {
        toast.error("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          localStorage.removeItem("userauthToken");
          toast.error("Session expired. Please log in again.");
        } else if (
          error.response.status === 400 &&
          error.response.data.message === "Product already in cart"
        ) {
          toast.error(`${product.name} is already in your cart.`);
        } else {
          toast.error("Already in cart.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  return (
    <div>
      <h1 className="text-center text-3xl font-bold mb-6 mt-[8px]"></h1>
      <div className="flex justify-center items-center">
        <img
          src="/kitchen_home.jpg"
          alt="Kitchen Home"
          className="h-50 w-600 object-cover rounded-lg shadow-md"
        />
      </div>
      {loading && <p className="text-center">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {products.length === 0 && !error && (
        <p className="text-center text-gray-500">No products available.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white p-4 shadow-md rounded-md border border-gray-200"
          >
            <img
              src={product.imageFile}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600 mt-1">{product.description}</p>
            <p className="text-blue-600 font-bold mt-2">₹{product.price}</p>

            {/* Display the ownerId */}
            <p className="text-gray-500 mt-2">Owner ID: {product.ownerId}</p>

            <div className="mt-4 flex items-center justify-between">
              <button
                className={`text-white font-bold px-4 py-2 rounded ${addingToCart[product._id]
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
                  }`}
                onClick={() => addToCart(product)}
                disabled={addingToCart[product._id]}
              >
                {addingToCart[product._id] ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Home;
