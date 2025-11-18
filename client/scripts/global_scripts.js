URLS={
    users :"http://localhost:8080/habit_and_health_logger/server/users",
}

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