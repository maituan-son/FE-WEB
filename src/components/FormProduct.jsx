
import React, { useState, useEffect } from "react";
import { getCategories } from "../api/categoris";
import { uploadImage } from "../api/imageUpload";

export default function FormProduct({ isOpen, onClose, onAddProduct, editId, todos }) {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    currency: "",
    category: [],
    sizes: [],
    colors: [],
    image: "",
    inStock: true,
    description: "",
  });

  // const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editId) {
      const todoToEdit = todos.find((todo) => todo.id === editId);
      if (todoToEdit) {
        setForm({
          name: todoToEdit.name || "",
          brand: todoToEdit.brand || "",
          price: todoToEdit.price || "",
          currency: todoToEdit.currency || "",
          category: todoToEdit.category || [],
          sizes: todoToEdit.sizes || [],
          colors: todoToEdit.colors || [],
          image: todoToEdit.image || "",
          inStock: todoToEdit.inStock || false,
          description: todoToEdit.description || "",
        });
      }
    } else {
      setForm({
        name: "",
        brand: "",
        price: "",
        currency: "",
        category: [],
        sizes: [],
        colors: [],
        image: "",
        inStock: false,
        description: "",
        createdAt: new Date().toISOString(),
      });
    }
  }, [editId, todos]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   setUploading(true);
  //   try {
  //     const response = await uploadImage(file);
  //     setForm({ ...form, image: response.data.url });
  //     console.log("Ảnh đã upload:", response.data.url);
  //   } catch (err) {
  //     console.error("Upload thất bại:", err);
  //   } finally {
  //     setUploading(false);
  //   }
  // };
  const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const response = await uploadImage(file);
    console.log("Ảnh đã upload:", response.data.url);
  } catch (err) {
    console.error("Upload thất bại:", err);
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct(form);
    onClose();   
    setForm({
      name: "",
      brand: "",
      price: "",
      currency: "",
      category: [],
      sizes: [],
      colors: [],
      image: "",
      inStock: false,
      description: "",
      createdAt: new Date().toISOString(),
    });
  };

  const [categorys, setCategorys] = useState([]);

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategorys(res.data.data || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Tên sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="brand" className="form-label">Thương hiệu</label>
             <select
                  className="form-select"
                  type="Array"
                  id="brand"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn thương hiệu</option>
                  <option value="nike">Nike</option>
                  <option value="adidas">Adidas</option>
                  <option value="puma">Puma</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Giá</label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="currency" className="form-label">Đơn vị tiền tệ</label>
                <select
                  className="form-select"
                  id="currency"
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn đơn vị</option>
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="sizes" className="form-label">Kích thước</label>
                <select
                  type=""
                  className="form-select"
                  id="sizes"
                  name="sizes"
                  value={form.sizes}
                  onChange={handleChange}
                  required
                >
                <option value="">chọn kích thước</option>
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42">42</option>
                <option value="43">43</option>
                <option value="44">44</option>
                <option value="45">45</option>
                </select>

              </div>
              <div className="mb-3">
                <label htmlFor="colors" className="form-label">Màu sắc</label>
                <select
                  className="form-select"
                  id="colors"
                  name="colors"
                  value={form.colors}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn màu sắc</option>
                  <option value="red">Đỏ</option>
                  <option value="green">Xanh lá</option>
                  <option value="blue">Xanh dương</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Danh mục</label>
                <select
                  className="form-select"
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn danh mục</option>
                 {categorys.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="imageFile" className="form-label">Upload Image</label>
              <input type="file" onChange={handleUpload} />

              </div>

              {/* rest unchanged */}
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="inStock"
                  name="inStock"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="inStock">Còn hàng</label>
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Mô tả</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Đóng</button>
              <button type="submit" className="btn btn-primary">{editId ? "Cập nhật" : "Thêm sản phẩm"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
