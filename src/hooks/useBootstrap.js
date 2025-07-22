import { useEffect } from 'react';

export const useBootstrap = () => {
  useEffect(() => {
    // Chỉ load Bootstrap khi component mount
    if (!document.querySelector('#bootstrap-css')) {
      const link = document.createElement('link');
      link.id = 'bootstrap-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
      document.head.appendChild(link);
    }

    if (!document.querySelector('#bootstrap-js')) {
      const script = document.createElement('script');
      script.id = 'bootstrap-js';
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
      document.head.appendChild(script);
    }

    // Cleanup khi component unmount
    return () => {
      const cssLink = document.querySelector('#bootstrap-css');
      const jsScript = document.querySelector('#bootstrap-js');
      
      if (cssLink) {
        cssLink.remove();
      }
      if (jsScript) {
        jsScript.remove();
      }
    };
  }, []);
};
