import React, { useState } from 'react';
import axios from 'axios';

const AddItem = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    imageFile: null,
  });
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setProduct({ ...product, imageFile: files[0] }); 
    } else {
      setProduct({ ...product, [name]: value }); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("imageFile", product.imageFile);
  
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to add a product.");
        return;
      }
  
      const response = await axios.post(`${apiUrl}/owner/addproducts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert("Product added successfully");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding product:", error.response || error);
      alert(error.response?.data?.message || "An unexpected error occurred.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Enter product description"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Add Item Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
