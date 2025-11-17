const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const popup = document.getElementById("habitPopup");
const popupLabel = document.getElementById("popupLabel");
const habitValue = document.getElementById("habitValue");
const saveHabit = document.getElementById("saveHabit");
const closePopup = document.getElementById("closePopup");
const habitButtons = document.querySelectorAll(".habit-btn");
const sendAllBtn = document.getElementById("sendAllHabits");
const selectedList = document.getElementById("selectedList");
const addHabit = document.getElementById("addHabit") ;
const deleteHabit = document.getElementById("deleteHabit");
const addHabitPopup = document.getElementById("addHabitPopup");
const saveNewHabit = document.getElementById("saveNewHabit");
const closeNewPopup= document.getElementById("closeNewPopup");
const newHabitName= document.getElementById("newHabitName");
const newHabitUnit= document.getElementById("newHabitUnit");
const newHabitValue= document.getElementById("newHabitValue");
const newHabitActive= document.getElementById("newHabitActive");

const URL_API = "http://localhost:8080/habit_and_health_logger/server/public/review.php";
const ADD_HABIT_URL = "http://localhost:8080/habit_and_health_logger/server/habits/create";
const GET_URL = "http://localhost:8080/habit_and_health_logger/server/habits/id";
const ALL_HABITS_URL = "http://localhost:8080/habit_and_health_logger/server/habits";
let selectedHabits = {};
let currentHabit = "";
document.addEventListener("DOMContentLoaded", loadAllHabits);
function addMessage(text, type) {
    const div = document.createElement("div");
    div.classList.add("message", type);
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}



async function sendMessage(habit_messages) {
  let message="";
  if(habit_messages != "")
  {
     message = habit_messages;
  }
  else{
      message = input.value.trim();
      addMessage(message, "user");
      input.value = "";
  }
    if (message === "") return;

    try {
        const response = await axios.post(
            URL_API,
            { message: message },
            { headers: { "Content-Type": "application/json" } }
        );
        createAIMessage(response.data.reply);
    } catch (err) {
        createAIMessage("Sorry, I could not process your request.");
    }
}

function createAIMessage(text) {
    addMessage(text, "ai");
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
});

habitButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentHabit = btn.dataset.habit;

        let unit = "";
        switch (currentHabit) {
            case "Sleep": unit = "/hrs"; break;
            case "Steps": unit = "/step"; break;
            case "Caffeine": unit = "/cup"; break;
            case "Water": unit = "/L"; break;
            case "Running": unit = "/Km"; break;
            case "Reading": unit = "/pages"; break;
            default: unit = "/cal";
        }

        popupLabel.textContent = "Enter value for: " + currentHabit + unit;
        habitValue.value = "";
        popup.classList.remove("hidden");
    });
});

saveHabit.addEventListener("click", () => {
    let value = parseFloat(habitValue.value.trim());

    if (isNaN(value) || value < 0) {
        alert("Value cannot be less than 0");
        return;
    }

    let unit = "";
    switch (currentHabit) {
        case "Sleep": unit = "hrs"; break;
        case "Steps": unit = "step"; break;
        case "Caffeine": unit = "cup"; break;
        case "Water": unit = "L"; break;
        case "Running": unit = "Km"; break;
        case "Reading": unit = "pages"; break;
        default: unit = "cal";
    }

    selectedHabits[currentHabit] = value + unit;
    popup.classList.add("hidden");
    refreshSelectedList();
});

closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
});

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

    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const habitName = btn.dataset.habit;
            delete selectedHabits[habitName];
            refreshSelectedList();
        });
    });
}

sendAllBtn.addEventListener("click", () => {
    if (Object.keys(selectedHabits).length === 0) {
        alert("No habits selected!");
        return;
    }

    let finalMessage = "Today's Habits:\n";
    for (let habit in selectedHabits) {
        finalMessage += `${habit}: ${selectedHabits[habit]}\n`;
    }

    addMessage(finalMessage.trim(), "user");
    sendMessage(finalMessage.trim()); 

    selectedHabits = {};
    refreshSelectedList();
});

addHabit.addEventListener("click", () => {
    document.getElementById("addHabitPopup").classList.remove("hidden");
});
saveNewHabit.addEventListener("click", createHabit);

closeNewPopup.addEventListener("click", ()=>{
   addHabitPopup.classList.add("hidden");
});

async function createHabit() {
    console.log("creating a new habit");

    try {
        if (newHabitName.value === "" || newHabitUnit.value === "" || newHabitValue.value === "") {
            alert("You should insert all values");
            return;
        }

        const habitName = newHabitName.value;
        const unit = newHabitUnit.value;
        const value = newHabitValue.value;
        const isActive = newHabitActive.checked;
        const user_id = 1;

        const response = await axios.post(ADD_HABIT_URL, {
            user_id: user_id,
            habit_name: habitName,
            unit: unit,
            value: value,
            is_active: isActive ? 1 : 0
        });

        console.log("Habit saved:", response);

        const habit = await getHabit();
        console.log("Fetched:", habit);

        const habitsPanel = document.querySelector(".habits-panel");

        const newBtn = document.createElement("button");
        newBtn.classList.add("habit-btn");
        newBtn.dataset.habit = habit.habit_name;
        newBtn.textContent = habit.habit_name;

        habitsPanel.insertBefore(newBtn, addHabit);

        addHabitPopup.classList.add("hidden");

    } catch (error) {
        console.log("error", error);
    }
}
async function getHabit()
{
    try{
        console.log("hi from get habit");
        const url = GET_URL+"?id=1";
        const response = await axios.get(url);
        console.log(response);
        return response.data.data;
    }
    catch(error)
    {
        console.log(error);
    }
}

async function loadAllHabits() {
    try {
        const response = await axios.get(ALL_HABITS_URL);

        const habits = response.data.data; 

        const habitsPanel = document.querySelector(".habits-panel");

        const existingBtns = document.querySelectorAll(".habit-btn");
        existingBtns.forEach(btn => {
            if (btn.id !== "addHabit") btn.remove();
        });

        habits.forEach(habit => {
            const btn = document.createElement("button");
            btn.classList.add("habit-btn");
            btn.dataset.habit = habit.habit_name;
            btn.textContent = habit.habit_name;

            habitsPanel.insertBefore(btn, addHabit);
        });

    } catch (error) {
        console.log("Error loading habits:", error);
    }
}
