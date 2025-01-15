     // Select theme toggle button and icon
     const themeToggle = document.getElementById("theme-toggle");
     const themeIcon = document.getElementById("theme-icon");
     
     // Ensure elements exist before proceeding
     if (themeToggle && themeIcon) {
       // Apply saved theme from localStorage
       const savedTheme = localStorage.getItem("theme");
       if (savedTheme === "dark") {
         document.body.classList.add("dark-mode");
         themeIcon.classList.add("fa-moon");
         themeIcon.classList.remove("fa-sun");
       } else {
         document.body.classList.remove("dark-mode");
         themeIcon.classList.add("fa-sun");
         themeIcon.classList.remove("fa-moon");
       }
     
       // Toggle theme on button click
       themeToggle.addEventListener("click", () => {
         const isDarkMode = document.body.classList.toggle("dark-mode");
     
         // Update icon based on theme
         if (isDarkMode) {
           themeIcon.classList.add("fa-moon");
           themeIcon.classList.remove("fa-sun");
           localStorage.setItem("theme", "dark");
         } else {
           themeIcon.classList.add("fa-sun");
           themeIcon.classList.remove("fa-moon");
           localStorage.setItem("theme", "light");
         }
       });
     } else {
       console.error("Theme toggle or icon element not found in the DOM.");
     }
     
     
     const skeletonContainer = document.querySelector(".skeleton-container");
     const contentContainer = document.querySelector(".content-container");
     
     // Simulating loading process
     setTimeout(() => {
       // Hide skeleton and show content
       skeletonContainer.style.display = "none";
       contentContainer.style.display = "block";
     }, 3000); // Replace 3000 with actual loading time
     
     