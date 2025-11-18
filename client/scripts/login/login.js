loginBtn.addEventListener("click", async () => {
    const email = uname.value.trim();
    const password = psw.value;

    if (!email || !password) {
        alert("Enter both email and password");
        return;
    }

    try {
        const response = await axios.post(URLS.login, { email, password }, {
            headers: { "Content-Type": "application/json" }
        });

        console.log(response);

        //add user id to the local storage
        const userId = response.data.data.id;
        localStorage.setItem('user-id',userId); 
        console.log("User id saved:", userId);

        //add the user's role to the local storage 
        console.log (response.data.data[0].role);
        const userRole = response.data.data[0].role;
        localStorage.setItem('userRole', userRole);
        console.log("User's role :", userRole);

        alert("Welcome you are logged in");
        window.location.replace("../../../index.html");


    } catch (error) {
        console.error("Login failed:", error);
    }
});
