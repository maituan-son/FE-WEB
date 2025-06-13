import React from 'react'

const ToggleThame = () => {
    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
    }
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const toggleIcon = isDarkMode ? '🌙' : '☀️'
    const toggleText = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    return (
        <button onClick={toggleTheme} className="toggle-theme">
            {toggleIcon} {toggleText}
        </button>
    )
}

export default ToggleThame