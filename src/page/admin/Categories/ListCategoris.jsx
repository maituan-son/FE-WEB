import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { createCategory, getCategories, updateCategory, softDeleteCategory } from "../../../api/categoris";
import styles from './ListCategories.module.css';
import { FiEdit2, FiTrash2, FiImage, FiEye, FiPlus, FiUpload, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { uploadImage } from "../../../api/imageUpload";
import { useCallback } from "react";

function ListCategories() {
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); 
  const [isTrash] = useState(false);
  const [form, setForm] = useState({ 
    title: "", 
    logoUrl: "", 
    description: "", 
    slug: "" 
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // New states for file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCategories({
        page: currentPage,
        limit,
        search: searchTerm,
        trash: isTrash ? "true" : "false",
      });

      setCategories(res.data.data.data);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Không thể tải danh sách danh mục!");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, isTrash]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleClose = () => {
    setShow(false);
    setForm({ title: "", logoUrl: "", description: "", slug: "" });
    setEditId(null);
    // Reset file upload states
    setSelectedFile(null);
    setImagePreview(null);
    setIsDragOver(false);
  };

  const handleShow = (category = null) => {
    if (category) {
      setForm({
        title: category.title,
        logoUrl: category.logoUrl || "",
        description: category.description,
        slug: category.slug
      });
      setEditId(category._id);
      // Set existing image preview
      if (category.logoUrl) {
        setImagePreview(category.logoUrl);
      }
    } else {
      setForm({ title: "", logoUrl: "", description: "", slug: "" });
      setEditId(null);
      setImagePreview(null);
    }
    setSelectedFile(null);
    setIsDragOver(false);
    setShow(true);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    setForm({ ...form, title, slug });
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  // Validate and set file
  const validateAndSetFile = (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setForm({ ...form, logoUrl: "" });
  };

  // Upload image to server
  const handleImageUpload = async () => {
    if (!selectedFile) return form.logoUrl; // Return existing URL if no new file

    try {
      setUploadingImage(true);
      const response = await uploadImage(selectedFile);
      const imageUrl = response.data.url || response.data.data?.url; // Adjust based on your API response
      toast.success('Upload ảnh thành công!');
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Upload ảnh thất bại!');
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      
      let logoUrl = form.logoUrl;

      // Upload new image if selected
      if (selectedFile) {
        logoUrl = await handleImageUpload();
      }

      const formData = {
        ...form,
        logoUrl
      };
      
      if (editId) {
        await updateCategory(editId, formData);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await createCategory(formData);
        toast.success("Thêm danh mục thành công!");
      }
      fetchCategories();
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        setLoading(true);
        await softDeleteCategory(id);
        toast.success("Xóa danh mục thành công!");
        fetchCategories();
      } catch {
        toast.error("Có lỗi xảy ra khi xóa!");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerSection}>
          <h2 className={styles.pageTitle}>Quản lý danh mục</h2>
          <p className={styles.pageSubtitle}>Quản lý danh mục sản phẩm của cửa hàng</p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.addButton} onClick={() => handleShow()}>
            <FiPlus className={styles.buttonIcon} />
            Thêm danh mục mới
          </button>
          <Link to="/admin/categories/trash" className={styles.trashButton}>
            <FiTrash2 className={styles.buttonIcon} />
            Thùng rác
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className={styles.emptyState}>
            <FiImage size={64} className={styles.emptyIcon} />
            <h3>Chưa có danh mục nào</h3>
            <p>Hãy thêm danh mục đầu tiên của bạn</p>
          </div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.customTable}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Logo</th>
                    <th>Tên danh mục</th>
                    <th>Mô tả</th>
                    <th>Slug</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category._id}>
                      <td data-label="STT">{index + 1 + (currentPage - 1) * limit}</td>
                      <td data-label="Logo" className={styles.logoCell}>
                        {category.logoUrl ? (
                          <img 
                            src={category.logoUrl} 
                            alt={category.title}
                            className={styles.categoryLogo}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <div className={styles.noLogo}>
                            <FiImage />
                          </div>
                        )}
                        <div className={styles.noLogo} style={{display: category.logoUrl ? 'none' : 'flex'}}>
                          <FiImage />
                        </div>
                      </td>
                      <td data-label="Tên danh mục" className={styles.titleCell}>
                        <span className={styles.categoryTitle}>{category.title}</span>
                      </td>
                      <td data-label="Mô tả" className={styles.descriptionCell}>
                        <span className={styles.description} title={category.description}>
                          {category.description.length > 50 
                            ? `${category.description.substring(0, 50)}...` 
                            : category.description
                          }
                        </span>
                      </td>
                      <td data-label="Slug" className={styles.slugCell}>
                        <code className={styles.slug}>{category.slug}</code>
                      </td>
                      <td data-label="Hành động" className={styles.actionCell}>
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.editButton}
                            onClick={() => handleShow(category)}
                            title="Chỉnh sửa"
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            className={styles.deleteButton}
                            onClick={() => handleSoftDelete(category._id)}
                            title="Xóa"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className={`${styles.pagination} ${styles.advanced}`}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                ← Trang trước
              </button>

              <span className={styles.pageInfo}>
                Trang {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
              >
                Trang sau →
              </button>
            </div>  
          </>
        )}

        <Modal show={show} onHide={handleClose} className={styles.customModal} size="lg">
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title className={styles.modalTitle}>
              {editId ? "Cập nhật" : "Thêm mới"} danh mục
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Tên danh mục</span>
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.title}
                    onChange={handleTitleChange}
                    placeholder="Nhập tên danh mục..."
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Slug</label>
                  <input
                    type="text"
                    className={`${styles.formInput} ${styles.slugInput}`}
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="slug-tu-dong-tao"
                    required
                    readOnly
                  />
                  <small className={styles.helpText}>
                    Slug được tạo tự động từ tên danh mục
                  </small>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Logo danh mục</label>
                
                <div className={styles.imageUploadContainer}>
                  {/* File Input */}
                  <div className={styles.fileInputWrapper}>
                    <input
                      type="file"
                      id="logoUpload"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className={styles.fileInput}
                      hidden
                    />
                    <label 
                      htmlFor="logoUpload" 
                      className={`${styles.fileInputLabel} ${isDragOver ? styles.dragOver : ''}`}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <FiUpload className={styles.uploadIcon} />
                      <span>
                        {isDragOver ? 'Thả file ảnh vào đây!' : 'Chọn ảnh từ máy tính hoặc kéo thả vào đây'}
                      </span>
                      <small>JPG, PNG, GIF, WebP - Tối đa 5MB</small>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className={styles.imagePreviewContainer}>
                      <div className={styles.imagePreview}>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className={styles.previewImage}
                        />
                        <button 
                          type="button"
                          className={styles.removeImageButton}
                          onClick={handleRemoveImage}
                          title="Xóa ảnh"
                        >
                          <FiX />
                        </button>
                      </div>
                      
                      {selectedFile && (
                        <div className={styles.fileInfo}>
                          <p className={styles.fileName}>{selectedFile.name}</p>
                          <p className={styles.fileSize}>
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                      
                      {uploadingImage && (
                        <div className={styles.uploadProgress}>
                          <div className={styles.uploadSpinner}></div>
                          <span>Đang upload...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Mô tả</span>
                  <span className={styles.required}>*</span>
                </label>
                <textarea
                  rows={4}
                  className={styles.formTextarea}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Nhập mô tả cho danh mục..."
                  required
                />
              </div>
            </Modal.Body>
            <Modal.Footer className={styles.modalFooter}>
              <button 
                type="button"
                className={`${styles.modalButton} ${styles.secondaryButton}`}
                onClick={handleClose}
                disabled={loading || uploadingImage}
              >
                Hủy
              </button>
              <button 
                type="submit"
                className={`${styles.modalButton} ${styles.primaryButton}`}
                disabled={loading || uploadingImage}
              >
                {loading || uploadingImage ? (
                  <span className={styles.loadingText}>
                    <div className={styles.miniSpinner}></div>
                    {uploadingImage ? "Đang upload..." : editId ? "Đang cập nhật..." : "Đang thêm..."}
                  </span>
                ) : (
                  editId ? "Cập nhật" : "Thêm mới"
                )}
              </button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default ListCategories;
