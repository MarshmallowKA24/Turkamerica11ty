
        // Add hover effects to resource links
        document.querySelectorAll('.resource-link').forEach(link => {
            link.addEventListener('mouseenter', function () {
                this.style.transform = 'translateX(5px)';
            });

            link.addEventListener('mouseleave', function () {
                this.style.transform = 'translateX(0)';
            });
        });

        // Tab functionality
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Settings panel functionality
        const settingsTab = document.getElementById('settingsTab');
        const settingsOverlay = document.getElementById('settingsOverlay');
        const closeSettings = document.getElementById('closeSettings');

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

        // Close settings with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && settingsOverlay.classList.contains('active')) {
                settingsOverlay.classList.remove('active');
            }
        });

        // Button interactions
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        darkModeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode');
        });

        // Modal functionality
        function closeModal() {
            document.getElementById('explanationModal').classList.remove('active');
        }

        // Close modal when clicking outside
        document.getElementById('explanationModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });