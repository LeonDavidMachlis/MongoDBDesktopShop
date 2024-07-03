import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetחלב סויהch products:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get('/api/products', {
        params: { name: nameFilter },
      });
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to search products:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post('/api/products', newProduct);
      fetchProducts();
      setNewProduct({ name: '', description: '', price: 0 });
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };


  return (
    <div>
      <h1>Product Management</h1>
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        <h2>Add New Product</h2>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={newProduct.name}
          onChange={handleNewChange}
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={newProduct.description}
          onChange={handleNewChange}
        />
        <input
          type="number"
          placeholder="Price"
          name="price"
          value={newProduct.price}
          onChange={handleNewChange}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
      <div>
        <h2>Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              {product.name} - {product.description} - ${product.price}
              <button onClick={() => handleDeleteProduct(product._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Shop;