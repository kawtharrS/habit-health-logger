const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const popup = document.getElementById("habitPopup");
const popupLabel = document.getElementById("popupLabel");
const habitValue = document.getElementById("habitValue");
const saveHabit = document.getElementById("saveHabit");
const closePopup = document.getElementById("closePopup");
const sendAllBtn = document.getElementById("sendAllHabits");
const selectedList = document.getElementById("selectedList");
const addHabit = document.getElementById("addHabit");
const addHabitPopup = document.getElementById("addHabitPopup");
const saveNewHabit = document.getElementById("saveNewHabit");
const closeNewPopup = document.getElementById("closeNewPopup");
const newHabitName = document.getElementById("newHabitName");
const newHabitUnit = document.getElementById("newHabitUnit");
const newHabitActive = document.getElementById("newHabitActive");
const deletePopup = document.getElementById("deletePopup");

const URL_API = "http://localhost:8080/habit_and_health_logger/server/public/review.php";
const ADD_HABIT_URL = "http://localhost:8080/habit_and_health_logger/server/habits/create";
const ALL_HABITS_URL = "http://localhost:8080/habit_and_health_logger/server/habits";
const DELETE_HABITS_URL = "http://localhost:8080/habit_and_health_logger/server/habits/delete";
const USER_INPUT_URL = "http://localhost:8080/habit_and_health_logger/server/entries/create";

let selectedHabits = {};
let currentHabit = "";
const userId = localStorage.getItem("user-id");

document.addEventListener("DOMContentLoaded", async () => {
    await loadUserHabits();
});

function addMessage(text, type) {
    const div = document.createElement("div");
    div.classList.add("message", type === "ai" ? "bot" : "user");
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage(habit_messages = "", habitId = null) {
    let message = habit_messages || input.value.trim();
    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    try {
        // Send message to AI
        const response = await axios.post(URL_API, { message }, { headers: { "Content-Type": "application/json" } });
        const aiReply = response.data.reply || "";
        createAIMessage(aiReply);

        // Save entry
        const saveData = {
            user_id: userId,
            raw_text: message,
            ai_response: aiReply
        };
        if (habitId) saveData.habit_id = habitId;

        const saved = await axios.post(USER_INPUT_URL, saveData, { headers: { "Content-Type": "application/json" } });
        console.log("Saved entry:", saved.data);

    } catch (err) {
        createAIMessage("Sorry, I could not process your request.");
        console.log("Error saving message:", err);
    }
}

function createAIMessage(text) {
    addMessage(text, "ai");
}

sendBtn.addEventListener("click", () => sendMessage());
input.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

function attachHabitListeners() {
    const habitButtons = document.querySelectorAll(".habit-btn");
    habitButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentHabit = btn.dataset.habit;
            const unit = btn.dataset.unit || "";
            popupLabel.textContent = `Enter value for: ${currentHabit}${unit ? `/${unit}` : ""}`;
            habitValue.value = "";
            popup.classList.remove("hidden");
        });
    });
}

saveHabit.addEventListener("click", async () => {
    let value = parseFloat(habitValue.value.trim());
    if (isNaN(value) || value < 0) return alert("Value cannot be less than 0");

    const habitBtn = document.querySelector(`.habit-btn[data-habit="${currentHabit}"]`);
    const habitId = habitBtn?.dataset.id || null;

    // Send message and save with habit ID
    await sendMessage(`${currentHabit}: ${value}`, habitId);

    const unit = habitBtn?.dataset.unit || "";
    selectedHabits[currentHabit] = value + unit;

    popup.classList.add("hidden");
    refreshSelectedList();
});

closePopup.addEventListener("click", () => popup.classList.add("hidden"));

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

sendAllBtn.addEventListener("click", () => {
    if (Object.keys(selectedHabits).length === 0) return alert("No habits selected!");

    let finalMessage = "Today's Habits:\n";
    for (let habit in selectedHabits) finalMessage += `${habit}: ${selectedHabits[habit]}\n`;

    addMessage(finalMessage.trim(), "user");
    sendMessage(finalMessage.trim());

    selectedHabits = {};
    refreshSelectedList();
});

addHabit.addEventListener("click", () => addHabitPopup.classList.remove("hidden"));
closeNewPopup.addEventListener("click", () => addHabitPopup.classList.add("hidden"));
saveNewHabit.addEventListener("click", createHabit);

async function createHabit() {
    if (!newHabitName.value || !newHabitUnit.value) return alert("You should insert all values");

    try {
        const value = null;
        const response = await axios.post(ADD_HABIT_URL, {
            user_id: userId,
            habit_name: newHabitName.value,
            unit: newHabitUnit.value,
            target_value: value,
            is_active: newHabitActive.checked ? 1 : 0
        });
        console.log("Habit created:", response);

        addHabitPopup.classList.add("hidden");
        newHabitName.value = "";
        newHabitUnit.value = "";
        newHabitActive.checked = false;

        await loadUserHabits();
    } catch (error) {
        console.log("Error creating habit:", error);
    }
}

async function loadUserHabits() {
    try {
        const response = await axios.get(`${ALL_HABITS_URL}?user_id=${userId}`);
        const habits = response.data.data;
        const habitsPanel = document.querySelector(".habits-panel");

        document.querySelectorAll(".habit-btn").forEach(btn => { if (btn.id !== "addHabit") btn.remove(); });

        habits.forEach(habit => {
            const btn = document.createElement("button");
            btn.classList.add("habit-btn");
            btn.dataset.habit = habit.habit_name;
            btn.dataset.unit = habit.unit;
            btn.dataset.id = habit.id;
            btn.textContent = habit.habit_name;
            habitsPanel.insertBefore(btn, addHabit);
        });

        attachHabitListeners();
    } catch (error) {
        console.log("Error loading habits:", error);
    }
}

deletePopup.addEventListener("click", deleteHabits);

async function deleteHabits() {
    if (!currentHabit) return alert("Please select a habit to delete!");

    const habitBtn = document.querySelector(`.habit-btn[data-habit="${currentHabit}"]`);
    const habitId = habitBtn?.dataset.id;

    if (!habitId) return alert("Habit ID not found!");
    if (!confirm(`Are you sure you want to delete ${currentHabit}?`)) return;

    try {
        const response = await axios.post(DELETE_HABITS_URL, { id: habitId });
        console.log("Deleted:", response.data);

        if (selectedHabits[currentHabit]) delete selectedHabits[currentHabit];
        currentHabit = "";

        refreshSelectedList();
        await loadUserHabits();
        popup.classList.add("hidden");
    } catch (error) {
        console.log("Error deleting habit:", error);
        alert("Failed to delete habit");
    }
}
