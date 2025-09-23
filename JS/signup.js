document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message");

    // Validation
    if (username.length < 3) {
        message.textContent = "Name must be at least 3 characters!";
        message.className = "message error";
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        message.textContent = "Invalid email format!";
        message.className = "message error";
        return;
    }

    if (password.length < 6) {
        message.textContent = "Password must be at least 6 characters!";
        message.className = "message error";
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        message.className = "message error";
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        message.textContent = "Phone number must be 10 digits!";
        message.className = "message error";
        return;
    }

    // Success
    message.textContent = "✅ Account created successfully!";
    message.className = "message success";

    // Example: Send data to backend (fake simulation here)
    console.log({
        username,
        email,
        password,
        phone
    });
});
