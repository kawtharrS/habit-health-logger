function refreshSelectedList() {
    selectedList.innerHTML = "";
    for (let habit in selectedHabits) {
        const div = document.createElement("div");
        div.classList.add("selected-item");
        div.innerHTML = `
            <span>${habit}: ${selectedHabits[habit]}</span>
            <button class="edit-btn" data-habit="${habit}">edit</button>
            <button class="remove-btn" data-habit="${habit}">X</button>
        `;
        selectedList.appendChild(div);
    }

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const habitName = btn.dataset.habit;
            delete selectedHabits[habitName];
            refreshSelectedList();
        });
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            currentHabit = btn.dataset.habit;
            const unit = document.querySelector(`.habit-btn[data-habit="${currentHabit}"]`)?.dataset.unit || "";
            popupLabel.textContent = `Enter value for: ${currentHabit}${unit ? `/${unit}` : ""}`;
            habitValue.value = parseFloat(selectedHabits[currentHabit]) || "";
            popup.classList.remove("hidden");
        });
    });
}

function filterEntriesByWeek(entries, data = "date") {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());  //moves to sunday 
    return entries.filter(entry => {
        if (!entry[data]) return false;
        const entryDate = new Date(entry[data]);
        return entryDate >= startOfWeek && entryDate <= now;
    });
}

function countHabits(entries, field) {
    const count = {};
    entries.forEach(entry => {
        const habit = entry[field];
        if (habit) count[habit] = (count[habit] || 0) + 1;
    });
    return count;
}
async function getRate()
{
    try{
        const response = await axios.get(`${URLS.entries}?user_id=${userId}`);
        const entries = response.data.data;

        let sum=0;
        entries.forEach(entry =>{
            const i = entry.rating;
            sum+=i;
        });

        console.log("sum",sum);
        console.log("length", entries.length);
        const length =entries.length;
        if(length>0)
        {
            const average = Math.round(sum/length);
            document.getElementById("ratingContent").innerText = average;
        }
        else{
            alert("Nothing to show!");
        }
        
    }
    catch(error)
    {
        console.log(error);
    }
}

async function getAdvice() {
    try {
        const data = await axios.get(`${URLS.entries}?user_id=${userId}`);
        const adviceArray = data.data.data;

        const adviceList = adviceArray.map(a => a.advice).filter(Boolean);

        const response = await axios.post(
            URLS.advice,
            { advice: adviceList },
            { headers: { "Content-Type": "application/json" } }
        );

        document.getElementById("adviceContent").innerText = response.data.reply;
    } catch (error) {
        console.log(error);
    }
}

async function getWeeklyHabits() {
    try {
        const response = await axios.get(`${URLS.entries}?user_id=${userId}`);
        const entries = response.data.data;

        console.log(entries);

        const dateField = "created_at";

        const weeklyEntries = filterEntriesByWeek(entries, dateField);
        console.log(weeklyEntries);

        const weeklyTopHabitCount = countHabits(weeklyEntries, "top_habit");
        const weeklyWeakHabitCount = countHabits(weeklyEntries, "weak_habit");

        console.log(weeklyTopHabitCount);
        console.log(weeklyWeakHabitCount);
        return { weeklyTopHabitCount, weeklyWeakHabitCount, weeklyEntries };
    } catch (error) {
        console.log(error);
    }
}

async function getAllTimeHabits() {
    try {
        const response = await axios.get(`${URLS.entries}?user_id=${userId}`);
        const entries = response.data.data;

        console.log(entries);

        const allTimeTopHabitCount = countHabits(entries, "top_habit");
        const allTimeWeakHabitCount = countHabits(entries, "weak_habit");

        console.log(allTimeTopHabitCount);
        console.log(allTimeWeakHabitCount);

        return { allTimeTopHabitCount, allTimeWeakHabitCount, entries };
    } catch (error) {
        console.log(error);
    }
}

async function getAllTimeHabitsAll() {
    try {
        const response = await axios.get(URLS.entries + "/all");
        const entries = response.data.data;

        console.log("entries",entries);

        const allTimeTopHabitCount = countHabits(entries, "top_habit");
        const allTimeWeakHabitCount = countHabits(entries, "weak_habit");

        console.log(allTimeTopHabitCount);
        console.log(allTimeWeakHabitCount);

        return { allTimeTopHabitCount, allTimeWeakHabitCount, entries };
    } catch (error) {
        console.log(error);
    }
}

