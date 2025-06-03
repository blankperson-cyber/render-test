window.addEventListener('load', function () {
  let loadingScreen = document.getElementById('loading-screen');
  let siteContent = document.querySelector('.site-content');

  setTimeout(() => {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
          loadingScreen.style.display = 'none';
          if (siteContent) {
              siteContent.style.display = 'block';
              siteContent.classList.add('fade-in');
          }
      }, 1000);
  }, 500);
});

//search function
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  let debounceTimeout;
  let pagesContent = {}; // Store all page content
  let displayedResults = new Set(); // To avoid showing duplicate results

  // 🔹 List of static pages to search (excluding dynamic team pages)
  const pages = ["/", "/about" , "/team" ,"/member"]; // Static pages only
  const pageLabels = {
    "/": "Home",
    "/about": "About",
    "/team": "Team"
  };

  // 🔹 Fetch content for static pages only
  async function fetchAllPages() {
    for (let page of pages) {
      try {
        const response = await fetch(page);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${page}`);
        }
        pagesContent[page] = await response.text();
      } catch (error) {
        console.error(`Failed to fetch ${page}:`, error);
        pagesContent[page] = ""; // Fallback if fetch fails
      }
    }

    // 🔹 Fetch list of teams dynamically
    await fetchTeamsList();
  }

  // 🔹 Fetch list of teams dynamically from the server
  async function fetchTeamsList() {
    try {
      const response = await fetch("/"); // Assuming an API endpoint that returns the list of team IDs or details
      if (!response.ok) {
        throw new Error("Failed to fetch teams list");
      }
      const teams = await response.json();
      // After fetching team list, fetch the content for each team page
      await fetchAllTeamPages(teams);
    } catch (error) {
      console.error("Error fetching teams list:", error);
    }
  }

  // 🔹 Fetch content for each team page dynamically
  async function fetchAllTeamPages(teams) {
    for (let team of teams) {
      const teamPageUrl = `/team/${team.id}`;
      try {
        const response = await fetch(teamPageUrl);
        if (response.ok) {
          const content = await response.text();
          pagesContent[teamPageUrl] = content; // Store the team page content
        } else {
          console.error(`Failed to fetch team page: ${teamPageUrl}`);
        }
      } catch (error) {
        console.error(`Failed to fetch team page: ${teamPageUrl}`, error);
      }
    }
  }

  // 🔹 Handle search input
  searchInput.addEventListener("input", function () {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(handleSearch, 300);
  });

  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = "";
    displayedResults.clear(); // Clear previously stored results for fresh search

    if (query === "") {
      searchResults.classList.remove("show");
      searchResults.classList.add("hide");
      return;
    }

    let hasResults = false;

    // 🔹 Search in all preloaded static and dynamic pages
    for (let [page, content] of Object.entries(pagesContent)) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content; // Convert page content to HTML elements

      tempDiv.querySelectorAll("[data-search]").forEach(element => {
        const resultText = `${pageLabels[page] || page} | ${element.textContent}`;
        if (element.textContent.toLowerCase().includes(query) && !displayedResults.has(resultText)) {
          const resultItem = createResultItem(resultText, page, element.id);
          searchResults.appendChild(resultItem);
          displayedResults.add(resultText); // Add this result to the set
          hasResults = true;
        }
      });
    }

    // 🔹 Show "No results found" if nothing matches
    if (!hasResults) {
      searchResults.innerHTML = `<div style="padding:5px;color:#185c8d;font-weight:700">No results found</div>`;
    }

    searchResults.classList.remove("hide");
    searchResults.classList.add("show");
  }

  // 🔹 Handle result click and dynamic fetching for team pages
  function createResultItem(text, page, elementId = null) {
    const resultItem = document.createElement("div");

    // Truncate text if it's too long (e.g., more than 100 characters)
    if (text.length > 150) {
      text = text.substring(0, 100) + '...';
    }

    resultItem.textContent = text;
    resultItem.style.cursor = "pointer";
    resultItem.style.padding = "5px";
    resultItem.style.borderBottom = "1px solid #ddd";
    resultItem.style.fontWeight = "700";
    resultItem.style.color = "#2c6893";

    resultItem.addEventListener("click", () => {
      if (page.startsWith("/team/")) {
        const teamId = page.split("/")[2]; // Extract teamId from the URL
        fetchTeamPage(teamId).then(content => {
          if (content) {
            sessionStorage.setItem("scrollToElement", elementId);
            window.location.href = `${page}#${elementId || ""}`;
          }
        });
      } else {
        sessionStorage.setItem("scrollToElement", elementId);
        window.location.href = `${page}#${elementId || ""}`;
      }
    });

    return resultItem;
  }

  // 🔹 Fetch static pages initially
  fetchAllPages();

  // 🔹 When the new page loads, scroll to the element
  window.addEventListener("load", () => {
    const elementId = sessionStorage.getItem("scrollToElement");
    if (elementId) {
      sessionStorage.removeItem("scrollToElement"); // Remove it after using
      document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});




// open side menu on ipad/mobile
document.addEventListener("DOMContentLoaded", function () {
  let btn_menu = document.getElementById('menuicon');
  let btn_closemenu = document.getElementById('xicon');
  let menu = document.getElementById('menu');
  let mobileNav = document.querySelector('.mobile-nav');

  // Ensure the menu is hidden but still allows animation
  menu.style.visibility = "hidden"; 
  menu.style.opacity = "0";
  menu.style.transform = "translateX(100%)"; // Start off-screen to the right

  // Open menu with animation
  btn_menu.addEventListener('click', () => {
      mobileNav.classList.add("menu-active");

      menu.style.visibility = "visible"; // Make sure it's visible before animation
      setTimeout(() => {
          menu.style.opacity = "1";
          menu.style.transform = "translateX(0)"; // Slide in from right
      }, 10);

      btn_menu.style.opacity = "0"; // Hide menu icon
      setTimeout(() => {
          btn_menu.style.display = "none"; 
          btn_closemenu.style.display = "block"; 
          setTimeout(() => {
              btn_closemenu.style.opacity = "1"; 
          }, 10);
      }, 300);
  });

  // Close menu with animation
  btn_closemenu.addEventListener('click', () => {
      menu.style.opacity = "0";
      menu.style.transform = "translateX(100%)"; // Slide back to the right
      btn_closemenu.style.opacity = "0"; 

      setTimeout(() => {
          menu.style.visibility = "hidden"; 
          mobileNav.classList.remove("menu-active");
          btn_closemenu.style.display = "none"; 
          btn_menu.style.display = "block"; 
          setTimeout(() => {
              btn_menu.style.opacity = "1"; 
          }, 10);
      }, 300); 
  });
});


// ✅ SMOOTH SCROLL FUNCTIONALITY
document.addEventListener("DOMContentLoaded", function () {
  let explorBtn = document.querySelector(".explor");
  if (explorBtn) {
      explorBtn.addEventListener("click", () => {
          const bottom = document.body.scrollHeight;

          // Scroll to the bottom
          window.scrollTo({ top: bottom, behavior: "smooth" });

          // Scroll back up after a delay
          setTimeout(() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
          }, 1500);
      });
  }
});

// ✅ NAVIGATION ANIMATION ON SCROLL
let lastScrollTop = 0; // ✅ Keep only this one

window.addEventListener("scroll", function () {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
        document.documentElement.style.setProperty('--appear-state', 'running'); // Scrolling Down
    } else {
        document.documentElement.style.setProperty('--appear-state', 'paused'); // Scrolling Up
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// ✅ NAVIGATION ANIMATION ON SCROLL on all devices
gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll("section, .news-section, .labs-section, .labs-item, .teams-list,Discription ").forEach((section) => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: section,
            start: "top 80%", 
            end: "top 40%",   
            toggleActions: "play none none reverse",
        }
    });
});

// ✅ NEWS SLIDER FUNCTIONALITY
window.addEventListener("load", () => {
    const slider = document.querySelector(".news-slider");
    const newsItems = document.querySelectorAll(".news-item");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
  
    if (!slider || !newsItems.length || !prevBtn || !nextBtn) return;
  
    let currentIndex = 0;
    const gap = 20;
    const itemWidth = newsItems[0].offsetWidth + gap;
    let startX = 0;
    let endX = 0;
    let isDragging = false;
    const threshold = 50; // Minimum swipe/drag distance
  
    function updateSlider(initial = false) {
      const offset = -currentIndex * itemWidth;
  
      if (initial) {
        slider.style.transition = "none";
      } else {
        slider.style.transition = "transform 0.5s ease-in-out";
      }
  
      slider.style.transform = `translateX(${offset}px)`;
  
      newsItems.forEach((item, index) => {
        item.classList.remove("active", "no-hover");
        if (index === currentIndex) {
          item.classList.add("active", "no-hover");
        }
      });
  
      if (initial) {
        setTimeout(() => {
          slider.style.transition = "transform 0.5s ease-in-out";
        }, 500);
      }
    }
  
    function nextSlide() {
      currentIndex = (currentIndex < newsItems.length - 1) ? currentIndex + 1 : 0;
      updateSlider();
    }
  
    function prevSlide() {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : newsItems.length - 1;
      updateSlider();
    }
  
    function handleSwipe() {
      const diff = startX - endX;
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          nextSlide(); // Swipe left or drag left
        } else {
          prevSlide(); // Swipe right or drag right
        }
      }
    }
  
    // Mobile swipe events
    slider.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });
  
    slider.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    });
  
    // PC mouse drag events
    slider.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      slider.style.cursor = "grabbing";
    });
  
    slider.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      endX = e.clientX;
    });
  
    slider.addEventListener("mouseup", () => {
      if (isDragging) {
        handleSwipe();
      }
      isDragging = false;
      slider.style.cursor = "grab";
    });
  
    slider.addEventListener("mouseleave", () => {
      isDragging = false;
      slider.style.cursor = "grab";
    });
  
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);
    window.addEventListener("resize", () => updateSlider(true));
  
    setTimeout(() => {
      updateSlider(true);
    }, 10);
  });
  
// new teams
  document.addEventListener("DOMContentLoaded", () => {
    let selectedTeam = null;
    const confirmBtn = document.getElementById("confirm-btn");
  
    document.querySelectorAll(".team-item").forEach(item => {
        item.addEventListener("click", function () {
            document.querySelectorAll(".team-item").forEach(team => team.classList.remove("selected"));
            this.classList.add("selected");
  
            selectedTeam = this.querySelector("input");
            confirmBtn.disabled = false;
        });
    });
  
    window.showTeamInfo = function () {
        if (!selectedTeam) {
            console.log("No team selected!");
            return;
        }
  
        // Redirect using the team title (encoded for safe URL usage)
        const teamTitle = encodeURIComponent(selectedTeam.dataset.name);
        window.location.href = `/team/${encodeURIComponent(teamTitle)}`;
      };
  });
  