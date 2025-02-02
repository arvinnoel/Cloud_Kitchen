import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyKitchen = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [kitchenName, setKitchenName] = useState("");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Please log in to see your kitchen.");
        }

        const response = await axios.get(`${apiUrl}/owner/getownerproducts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedProducts = response.data.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProducts(sortedProducts);
        setKitchenName(response.data.kitchenName || "No Kitchen Name");

        if (sortedProducts.length === 0) {
          toast.info("No products added yet. Please add some products.");
        }

        setError(null);
      } catch (error) {
        if (error.response?.status === 401) {
          setError("Unauthorized access. Please log in again.");
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        } else {
          setError("");
        }
        toast.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  const handleDelete = async (productId) => {
    setDeletingProductId(productId);
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(
        `${apiUrl}/owner/deleteproduct/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(products.filter((product) => product._id !== productId));
      toast.success(response.data.message || "Product deleted successfully");
    } catch (error) {
      toast.error("Error deleting product:", error);
    } finally {
      setLoading(false);
      setDeletingProductId(null);
    }
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-6">{kitchenName}</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {products.length > 0 ? (
          products.map((product) => (
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

              <button
                onClick={() => handleDelete(product._id)}
                className="mt-4 w-full bg-red-500 text-white p-2 rounded-md"
                disabled={loading || deletingProductId === product._id}
              >
                {loading && deletingProductId === product._id
                  ? "Removing..."
                  : "Remove"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No products to display
          </p>
        )}
      </div>
    </div>
  );
};

export default MyKitchen;
