import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom'
const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('userauthToken');

        if (!token) {
          toast.info('Login to see the products.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${apiUrl}/user/getallproducts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedProducts = response.data.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sortedProducts);

        if (sortedProducts.length === 0) {
          toast.info('No products available. Please check back later!');
        } else {
          toast.success('Products loaded successfully!');
        }
        setError(null);
      } catch (error) {
        if (error.response?.status === 401) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('userauthToken');
          toast.error('Unauthorized access. Please log in again.');
          window.location.href = '/login';
        } else {
          setError('');
          toast.error('Failed to fetch products.');
        }
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    const token = localStorage.getItem('userauthToken');
    if (!token) {
      toast.error('Please log in to add items to your cart.');
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/user/addtocart`,
        { productId: product._id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success || (response.status >= 200 && response.status < 300)) {
        toast.success(`${product.name} added to cart!`);
      } else {
        toast.error('Failed to add product to cart.');
      }
    } catch (error) {
      toast.error('Already in Cart');
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div>
      {/* <img src=" /kitchen_home.jpg" alt="Product" className="w-full h-screen object-cover" /> */}
      <h1 className="text-center text-2xl font-bold mb-6 mt-[8px]">Home</h1>
      {loading && <p className="text-center">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {products.length === 0 && !error && (
        <p className="text-center text-gray-500">
          {localStorage.getItem('userauthToken') ? 'No products to display' : 'Login to see the products'}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {products.length > 0 && products.map((product) => (
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

            <div className="mt-4 flex items-center justify-between">
              <button
                className="text-green-500 font-bold"
                onClick={() => addToCart(product)} disabled={loading}
              >{loading ? "Adding to cart" : "Add to Cart"}

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
