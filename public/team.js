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

  document.title = document.title.toUpperCase();



