if (userRole !== "admin") {
    window.location.href = "not-authorized.html"; 
}

addUserBtn.addEventListener("click", addUser);
document.addEventListener("DOMContentLoaded",  () => {
     getUsers();
});

async function addUser()
{
    if(!username.value || !email.value ||!password.value || !role.value)
    {
        alert("All fields must be filled!");
        return;
    }

    try{
        if(validateName(username.value) && validateEmail(email.value)){
            const response = await axios.post(URLS.users +"/create", {
                name: username.value, 
                email:email.value, 
                password:password.value,
                role:role.value
            });
            console.log(response);
            alert("user added successfully!");
        }
        else{
            alert("Name should be valid!");
        }
    }
    catch(error)
    {
        console.log(error);
    }
}

async function getUsers()
{
    try{
        const response = await axios.get(URLS.users);
        console.log(response);

        const data=response.data.data;
        const success = response.data.status;

        console.log(data);
        console.log(success == 200);

        if(success == 200)
        {
            usersTableBody.innerHTML=``;
            if(Array.isArray(data))
            {
                data.forEach((user) => {
                    const row = `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>
                                <button class="edit" data-action="edit">Edit</button>
                                <button class="delete" data-action="delete">Delete</button>
                            </td>

                        </tr>`;
                    usersTableBody.innerHTML += row;
                });
                console.log("users table is updated successfully");
            }
            else{
                console.log("the user table did not work");
            }
        }

    }
    catch(error)
    {
        console.log(error);
    }
}


usersTableBody.addEventListener("click", (e) => {
    const action = e.target.dataset.action;

    if(!action)
        return;

    // the row the click happened inside
    const row = e.target.closest("tr");
    const userId = row.children[0].textContent;

    if(action === "delete")
    {
        console.log("delete");
        deleteUser(userId);
    }
    else if(action === "edit"){
        console.log("update");
        updateUser(userId);
    }

});


async function deleteUser(userId)
{
    try{
        const response = await axios.post(URLS.users+"/delete", {id:userId});
        console.log(response);

    }
    catch(error)
    {
        console.log(error);
    }
}

async function updateUser(userId)
{
    let name = prompt("Enter you name");
    if(name === null) return;
    try{
        const response = await axios.post(URLS.users+"/update", {id:userId, name:name});
        console.log(response);

    }
    catch(error)
    {
        console.log(error);
    }
}


