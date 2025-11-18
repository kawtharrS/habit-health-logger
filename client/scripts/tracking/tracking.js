let selectedHabits = {};
let currentHabit = "";

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
        const response = await axios.post(URLS.api, { message }, { headers: { "Content-Type": "application/json" } });
        const aiReply = response.data.reply || "";
        createAIMessage(aiReply);

        // Save entry
        const saveData = {
            user_id: userId,
            raw_text: message,
            ai_response: aiReply
        };
        if (habitId) saveData.habit_id = habitId;

        const saved = await axios.post(URLS.entries+"/create", saveData, { headers: { "Content-Type": "application/json" } });
        console.log("Saved entry:", saved.data);

    } catch (err) {
        createAIMessage("Sorry, I could not process your request.");
        console.log("Error saving message:", err);
    }
}

function createAIMessage(text) {
    addMessage(text, "ai");
}

async function createHabit() {
    if (!newHabitName.value || !newHabitUnit.value) return alert("You should insert all values");

    try {
        if(validateName(newHabitName.value)){
            const value = null;
            const response = await axios.post(URLS.habits+"/create", {
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
        }
        else alert("Please enter a valid habit name!")

    } catch (error) {
        console.log("Error creating habit:", error);
    }
}

async function loadUserHabits() {
    try {
        const response = await axios.get(`${URLS.habits}?user_id=${userId}`);
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

async function deleteHabits() {
    if (!currentHabit) return alert("Please select a habit to delete!");

    const habitBtn = document.querySelector(`.habit-btn[data-habit="${currentHabit}"]`);
    const habitId = habitBtn?.dataset.id;

    if (!habitId) return alert("Habit ID not found!");
    if (!confirm(`Are you sure you want to delete ${currentHabit}?`)) return;

    try {
        const response = await axios.post(URLS.habits+"/delete", { id: habitId });
        console.log("Deleted:", response.data);

        if (selectedHabits[currentHabit]) delete selectedHabits[currentHabit];
        currentHabit = "";

        refreshSelectedList();
        await loadUserHabits();

        popup.classList.add("hidden");
    } catch (error) {
        console.log(error);
    }
}
