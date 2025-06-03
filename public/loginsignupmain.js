
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".signup-link").addEventListener("click", function (e) {
        e.preventDefault();
        document.body.classList.add("page-exit");
        setTimeout(() => {
            window.location.href = "/signup";
        }, 500); // Match the animation duration
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".loginlink").addEventListener("click", function (e) {
        e.preventDefault();
        document.body.classList.add("page-exit");
        setTimeout(() => {
            window.location.href = "/login";
        }, 500); // Match the animation duration
    });
});



// direct the users
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Get input values
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            // Log data being sent
            console.log("Sending Data:", { username, password });

            try {
                const response = await fetch("http://localhost:3000/login/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded", // Send as form data
                    },
                    body: new URLSearchParams({ username, password }), // Convert to form data format
                });

                const data = await response.json();
                console.log("Response:", data);

                if (data.success) {
                    alert(`✅ Welcome, ${data.userType}! Redirecting...`);
                    window.location.href = data.userType === "admin" ? "/admin" : "/dashboard";
                } else {
                    alert(data.error);
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("⚠️ Something went wrong. Please try again.");
            }
        });
    } else {
        console.error("⚠️ Login form not found!");
    }
});
