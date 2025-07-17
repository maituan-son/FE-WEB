import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = ({
  size = "medium",
  message = "Đang tải...",
  overlay = false,
  className = "",
}) => {
  const sizeClass = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  }[size];

  const content = (
    <div className={`${styles.loadingContainer} ${sizeClass} ${className}`}>
      <div className={styles.spinner}></div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );

  if (overlay) {
    return <div className={styles.overlay}>{content}</div>;
  }

  return content;
};

export default LoadingSpinner;
