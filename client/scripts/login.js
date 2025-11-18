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
        console.log(response);
        const userId = response.data.data.id;
        localStorage.setItem('user-id',userId); 
        console.log("User id saved:", userId);

        console.log (response.data.data[0].role);
        const userRole = response.data.data[0].role;
        localStorage.setItem('userRole', userRole);
        console.log("User's role :", userRole);


    } catch (error) {
        console.error("Login failed:", error);
    }
});
