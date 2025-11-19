const cmn ="http://localhost/habit_and_health_logger/server"
URLS={
    users : cmn + "/users",
    login: cmn + "/services/loginService.php", 
    entries: cmn + "/entries", 
    api: cmn + "/public/review.php",
    habits: cmn + "/habits", 
    advice: cmn + "/public/advice.php"

}
const userId = localStorage.getItem("user-id");
const login = localStorage.getItem("isLogin");
const userRole = localStorage.getItem("userRole");

function validateName (name)
{
    const namePattern  = /^[a-zA-Z\s-]+$/; 

    if(name === null || name.trim() === ""){
        return "Name can not be empty!"
    }

    if(!namePattern.test(name))
    {
        return "Name can only contain letters, spaces & hyphens";
    }

    return true;
}

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
