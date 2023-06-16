document.addEventListener('DOMContentLoaded', async function () {
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Function to fetch the mode setting from the server
    async function fetchModeSetting() {
        try {
            const response = await fetch('/settings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.text();
                let mode;
                if (data.mode !== undefined) {
                    mode = data.mode === 'true';
                    localStorage.setItem('mode', mode);
                    darkModeToggle.checked = mode;
                } else {
                    mode = localStorage.getItem('mode') === 'true';
                    darkModeToggle.checked = mode;
                }

            } else {
                console.error('Failed to fetch mode setting');
            }
        } catch (error) {
            console.error('Error fetching mode setting:', error);
        }
    }

    // Function to update the theme based on the mode setting
    function updateTheme(mode) {
        mode = localStorage.getItem('mode') === 'true';
        darkModeToggle.checked = mode;
        if (mode) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    // Function to send the request and update the mode setting
    async function updateDarkModeSetting() {
        const darkModeValue = darkModeToggle.checked;

        try {
            const response = await fetch('/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({darkModeToggle: darkModeValue})
            });

            if (response.ok) {
                const data = await response.json();
                const updatedMode = data.mode;

                console.log('localStorage post mode = ' + updatedMode);

                localStorage.setItem('mode', updatedMode);
                updateTheme(updatedMode);
                console.log('Dark mode updated successfully');
            } else {
                console.error('Dark mode update failed');
            }
        } catch (error) {
            console.error('Error updating dark mode:', error);
        }
    }

    darkModeToggle.addEventListener('change', updateDarkModeSetting);

    await fetchModeSetting();
});