document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            let theme = 'dark';
            if (document.body.classList.contains('light-mode')) {
                theme = 'light';
            }
            localStorage.setItem('theme', theme);
        });
    }
});