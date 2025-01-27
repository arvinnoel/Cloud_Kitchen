import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddItem = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB');
        return;
      }
      setProduct({ ...product, imageFile: file });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('description', product.description);
    formData.append('imageFile', product.imageFile);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('You must be logged in to add a product.');
        return;
      }

      const response = await axios.post(`${apiUrl}/owner/addproducts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Product added successfully');
      setProduct({ name: '', price: '', description: '', imageFile: null });
      e.target.reset();

      const { imageFile } = response.data; 
      console.log('Uploaded image URL:', imageFile);

      setProduct((prev) => ({ ...prev, imageFile }));

    } catch (error) {
      toast.error(
        `Error adding product: ${error.response?.data?.message || 'An unexpected error occurred.'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <input
              type="file"
              name="imageFile"
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {product.imageFile && typeof product.imageFile !== 'string' && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(product.imageFile)}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-md"
                />
              </div>
            )}
            {product.imageFile && typeof product.imageFile === 'string' && (
              <div className="mt-4">
                <img
                  src={product.imageFile} 
                  alt="Uploaded"
                  className="w-48 h-48 object-cover rounded-md"
                />
              </div>
            )}
          </div>
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
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
