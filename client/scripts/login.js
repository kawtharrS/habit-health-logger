const uname = document.getElementById("uname");
const psw = document.getElementById("psw");
const loginBtn = document.getElementById("loginBtn");

const LOGIN_URL = "http://localhost:8080/habit_and_health_logger/server/services/loginService.php";

loginBtn.addEventListener("click", async () => {
    const email = uname.value.trim();
    const password = psw.value;

    if (!email || !password) {
        alert("Enter both email and password");
        return;
    }

    try {
        const response = await axios.post(LOGIN_URL, { email, password }, {
            headers: { "Content-Type": "application/json" }
        });

        const userData = response.data.data;
        localStorage.setItem('user', JSON.stringify(userData)); 
        console.log("User data saved:", userData);

        const storedUser = JSON.parse(localStorage.getItem('user'));
        console.log("Read from localStorage:", storedUser);
        console.log("User ID:", storedUser.id);

    } catch (error) {
        console.error("Login failed:", error);
    }
});
