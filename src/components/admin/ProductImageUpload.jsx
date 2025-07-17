import { useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import styles from "./ProductImageUpload.module.css";

const ProductImageUpload = ({
  images = [],
  onImagesChange,
  maxFiles = 10,
  maxSizePerFile = 5 * 1024 * 1024, // 5MB
}) => {
  const [imagePreviews, setImagePreviews] = useState(images);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // Validate file size
    const invalidFiles = files.filter((file) => file.size > maxSizePerFile);
    if (invalidFiles.length > 0) {
      alert(
        `Một số file vượt quá dung lượng cho phép (${
          maxSizePerFile / 1024 / 1024
        }MB)`
      );
      return;
    }

    // Validate total files
    if (imagePreviews.length + files.length > maxFiles) {
      alert(`Chỉ được upload tối đa ${maxFiles} ảnh`);
      return;
    }

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    const updatedPreviews = [...imagePreviews, ...newPreviews];

    setImagePreviews(updatedPreviews);
    onImagesChange(updatedPreviews, files);
  };

  const removeImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    onImagesChange(updatedPreviews);
  };

  return (
    <div className={styles.imageUploadContainer}>
      <label className={styles.formLabel}>Upload ảnh sản phẩm</label>

      <div className={styles.uploadSection}>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className={styles.fileInput}
          hidden
          disabled={uploadingImages}
        />
        <label htmlFor="imageUpload" className={styles.fileInputLabel}>
          <FiUpload className={styles.uploadIcon} />
          <span>Chọn ảnh từ máy tính</span>
          <small>
            JPG, PNG, WebP - Tối đa {maxSizePerFile / 1024 / 1024}MB mỗi ảnh
          </small>
        </label>
      </div>

      {imagePreviews.length > 0 && (
        <div className={styles.imagePreviewContainer}>
          {imagePreviews.map((preview, index) => (
            <div key={index} className={styles.imagePreview}>
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className={styles.previewImage}
              />
              <button
                type="button"
                className={styles.removeImageButton}
                onClick={() => removeImage(index)}
                disabled={uploadingImages}
              >
                <FiX />
              </button>
              {index === 0 && (
                <span className={styles.thumbnailBadge}>Ảnh chính</span>
              )}
            </div>
          ))}
        </div>
      )}

      {uploadingImages && (
        <div className={styles.uploadingIndicator}>
          <div className={styles.spinner}></div>
          <span>Đang upload ảnh...</span>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
