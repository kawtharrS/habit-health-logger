const burger = document.querySelector('.burger i');
const nav = document.querySelector('.nav');

function toggleNav(){
    burger.classList.toggle('fa-bars');
    burger.classList.toggle('fa-times');
    nav.classList.toggle('nav-active');
}

burger.addEventListener('click', function(){
    toggleNav();
});


const isLogin = localStorage.getItem("isLogin");  


const logged = document.getElementById("login");
const tracking = document.getElementById("tracking");
const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
    localStorage.removeItem("isLogin"); 
    localStorage.removeItem("userId"); 
    window.location.href = "./client/pages/login.html";
});

if (isLogin === "true") {
    console.log(isLogin);
    tracking.classList.remove("hidden");
    logout.classList.remove("hidden");
    logged.classList.add("hidden");
    console.log("user logged in");
    console.log(userRole);
} else {
    logged.classList.remove("hidden");
    tracking.classList.add("hidden");
    logout.classList.add("hidden");
    console.log("user not logged in");
}
