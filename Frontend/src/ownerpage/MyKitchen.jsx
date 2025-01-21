import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyKitchen = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [kitchenName, setKitchenName] = useState('');
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        let isMounted = true; // To handle component unmount

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Please log in to see your kitchen.');
                }

                const response = await axios.get(`${apiUrl}/owner/getownerproducts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (isMounted) {
                    setProducts(response.data.products || []);
                    setKitchenName(response.data.kitchenName || 'No Kitchen Name');
                    setError(null);
                    toast.success('Products fetched successfully!');
                }
            } catch (error) {
                if (isMounted) {
                    if (error.response?.status === 401) {
                        setError('Unauthorized access. Please log in again.');
                        localStorage.removeItem('authToken');
                        window.location.href = '/login';
                    } else {
                        setError('Error fetching products. Please try again later.');
                    }
                }
                toast.error(error.message || 'An error occurred while fetching products.');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();
        return () => {
            isMounted = false;
        };
    }, [apiUrl]);

    return (
        <div>
            <h1 className="text-center text-2xl font-bold mb-6">{kitchenName}</h1>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {loading && <p className="text-center text-blue-500">Loading products...</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white p-4 shadow-md rounded-md border border-gray-200"
                    >
                        <img
                            src={`${apiUrl}${product.imageFile}`}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-md"
                        />
                        <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                        <p className="text-gray-600 mt-1">{product.description}</p>
                        <p className="text-blue-600 font-bold mt-2">${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyKitchen;
