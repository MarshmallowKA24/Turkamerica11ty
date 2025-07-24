
        // Add click effects to channel items
        document.querySelectorAll('.channel-item').forEach(item => {
            item.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });

        // Add progress tracking functionality
        document.querySelectorAll('.activity-item').forEach(item => {
            item.addEventListener('click', function() {
                this.classList.toggle('completed');
            });
        });
        
        // Time conversion helper function
        function timeToMinutes(timeStr) {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        }
        
        // Current time highlighting
        function highlightCurrentActivity() {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();
            
            document.querySelectorAll('.activity-item').forEach(item => {
                const timeSlot = item.querySelector('.time-slot').textContent;
                const [startTime, endTime] = timeSlot.split(' - ');
                
                const startMinutes = timeToMinutes(startTime);
                const endMinutes = timeToMinutes(endTime);
                
                if (currentTime >= startMinutes && currentTime <= endMinutes) {
                    item.classList.add('current-activity');
                } else {
                    item.classList.remove('current-activity');
                }
            });
        }

        // Settings panel functionality
        const settingsTab = document.getElementById('settingsTab');
        const settingsOverlay = document.getElementById('settingsOverlay');
        const closeSettings = document.getElementById('closeSettings');

        if (settingsTab && settingsOverlay && closeSettings) {
            settingsTab.addEventListener('click', function(e) {
                e.preventDefault();
                settingsOverlay.classList.add('active');
            });

            closeSettings.addEventListener('click', function() {
                settingsOverlay.classList.remove('active');
            });

            // Close settings when clicking outside
            settingsOverlay.addEventListener('click', function(e) {
                if (e.target === settingsOverlay) {
                    settingsOverlay.classList.remove('active');
                }
            });
        }

        // Close settings with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && settingsOverlay && settingsOverlay.classList.contains('active')) {
                settingsOverlay.classList.remove('active');
            }
        });

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', function() {
                document.body.classList.toggle('dark-mode');
                // Save preference to localStorage if needed
                // localStorage.setItem('darkMode', this.checked);
            });
        }

        // Initialize current activity highlighting
        highlightCurrentActivity();
        setInterval(highlightCurrentActivity, 60000);