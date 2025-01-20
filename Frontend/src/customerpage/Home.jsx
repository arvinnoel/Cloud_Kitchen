import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
          throw new Error('Please log in.');
        }

        const response = await axios.get(`${apiUrl}/user/getallproducts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(response.data.products);
        setError(null);
      } catch (error) {
        if (error.response?.status === 401) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('userauthToken'); // Clear invalid token
        } else {
          setError('Failed to fetch products.');
        }
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-6">Home</h1>

      {loading && <p className="text-center">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white p-4 shadow-md rounded-md border border-gray-200"
          >
            <img
              src={`${apiUrl}${product.imageFile}`} // Prepend the base URL
              alt={product.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600 mt-1">{product.description}</p>
            <p className="text-blue-600 font-bold mt-2">${product.price}</p>

            <div className="mt-4 flex items-center justify-between">
              <button
                className="text-green-500 font-bold"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
