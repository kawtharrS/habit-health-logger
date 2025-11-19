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
                            <td>${entry.top_habit}</td>
                            <td>${entry.weak_habit}</td>
                            <td>${entry.rating}</td>
                            <td>${entry.created_at}</td>
                        </tr>`;
                    historyTableBody.innerHTML += row;
                });
            }
            console.log("users table is updated successfully");
        }
        else{
            console.log("the table was not loaded");`1                                                                                                                              `
        }
        getTopHabit();
        getWeakestHabit();

    }
    catch(error)
    {
        console.log(error);
    }
}

async function getTopHabit()
{
    console.log("hi");
    try{
        const response = await axios.get(`${URLS.entries}?user_id=${userId}`);
        console.log(response);
        const entries = response.data.data;
        console.log(entries);

        const topHabitCount={};

        entries.forEach(entry => {
            const habit = entry.top_habit;
            if(habit)
            {
                if(!topHabitCount[habit])
                {
                    topHabitCount[habit]=0;
                }
                topHabitCount[habit]++;
            }
        });
        console.log(topHabitCount);

    }
    catch(error)
    {
        console.log(error);
    }
}

async function getWeakestHabit()
{
    try{
        const response = await axios.get(`${URLS.entries}?user_id=${userId}`);
        console.log(response);
        const entries = response.data.data;
        console.log(entries);

        const weakestHabitCount={};
        entries.forEach(entry =>{
            const habit = entry.weak_habit;
            if(habit)
            {
                if(!weakestHabitCount[habit])
                {
                    weakestHabitCount[habit]=0;
                }
                weakestHabitCount[habit]++;
            }
        });
        console.log(weakestHabitCount);

    }
    catch(error)
    {
        console.log(error);
    }
}