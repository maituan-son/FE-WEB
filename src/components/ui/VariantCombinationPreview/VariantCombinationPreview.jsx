import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import styles from './VariantCombinationPreview.module.css';

const VariantCombinationPreview = ({ 
  combinations, 
  onToggle, 
  onUpdate,
  disabled = false 
}) => {
  if (!combinations || combinations.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Chưa có tổ hợp nào được tạo</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4>Xem trước tổ hợp variants ({combinations.length})</h4>
        <div className={styles.bulkActions}>
          <button 
            className={styles.bulkBtn}
            onClick={() => combinations.forEach(combo => !combo.enabled && onToggle(combo.id))}
          >
            <FiCheck /> Chọn tất cả
          </button>
          <button 
            className={styles.bulkBtn}
            onClick={() => combinations.forEach(combo => combo.enabled && onToggle(combo.id))}
          >
            <FiX /> Bỏ chọn tất cả
          </button>
        </div>
      </div>

      <div className={styles.combinationGrid}>
        {combinations.map((combo) => (
          <div 
            key={combo.id} 
            className={`${styles.combinationCard} ${!combo.enabled ? styles.disabled : ''}`}
          >
            <div className={styles.cardHeader}>
              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={combo.enabled}
                  onChange={() => onToggle(combo.id)}
                  disabled={disabled}
                  className={styles.hiddenCheckbox}
                />
                <span className={styles.customCheckbox}>
                  <FiCheck className={styles.checkIcon} />
                </span>
              </label>
              
              <div className={styles.combinationTags}>
                {combo.combinations.map((item, index) => (
                  <span key={index} className={styles.tag}>
                    <span className={styles.tagAttribute}>{item.attributeName}</span>
                    <span className={styles.tagValue}>{item.valueName}</span>
                  </span>
                ))}
              </div>
            </div>

            {combo.enabled && (
              <div className={styles.cardContent}>
                <div className={styles.inputGroup}>
                  <label>SKU</label>
                  <input
                    type="text"
                    value={combo.sku}
                    onChange={(e) => onUpdate(combo.id, 'sku', e.target.value)}
                    className={styles.input}
                    disabled={disabled}
                  />
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Giá ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={combo.price}
                      onChange={(e) => onUpdate(combo.id, 'price', parseFloat(e.target.value) || 0)}
                      className={styles.input}
                      disabled={disabled}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Tồn kho</label>
                    <input
                      type="number"
                      value={combo.stock}
                      onChange={(e) => onUpdate(combo.id, 'stock', parseInt(e.target.value) || 0)}
                      className={styles.input}
                      disabled={disabled}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Giá cũ ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={combo.oldPrice || ''}
                    onChange={(e) => onUpdate(combo.id, 'oldPrice', parseFloat(e.target.value) || 0)}
                    className={styles.input}
                    placeholder="Không bắt buộc"
                    disabled={disabled}
                  />
                </div>

                {combo.oldPrice > 0 && combo.price > 0 && (
                  <div className={styles.discount}>
                    Giảm giá: {Math.round(((combo.oldPrice - combo.price) / combo.oldPrice) * 100)}%
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <p>
          <strong>{combinations.filter(c => c.enabled).length}</strong> / {combinations.length} tổ hợp được chọn
        </p>
      </div>
    </div>
  );
};

export default VariantCombinationPreview;
