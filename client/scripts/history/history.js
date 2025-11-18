window.onload=getHistory;

async function getHistory()
{
    try{
        console.log(userId);

        const response = await axios.get(`${URLS.entries}?user_id=${userId}`);

        console.log(response);

        const data = response.data.data;
        const success = response.data.status;

        console.log(data);
        console.log(success == 200)
        
        if(success == 200)
        {
            historyTableBody.innerHTML =``;
            if(Array.isArray(data))
            {
                data.forEach((entry) => {
                    const row = `
                        <tr>
                            <td>${entry.raw_text}</td>
                            <td>${entry.ai_response}</td>
                            <td>${entry.created_at}</td>
                            <td>${entry.updated_at}</td>
                            <td>
                                <button class="edit" data-action="edit">Edit</button>
                                <button class="delete" data-action="edit">Delete</button>
                            </td>
                        </tr>`;
                    historyTableBody.innerHTML += row;
                });
            }
            console.log("users table is updated successfully");
        }
        else{
            console.log("the table was not loaded");`1                                                                                                                              `
        }

    }
    catch(error)
    {
        console.log(error);
    }
}