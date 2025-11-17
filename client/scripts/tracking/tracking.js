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

const URL_API = "http://localhost:8080/habit_and_health_logger/server/public/review.php";

let selectedHabits = {};
let currentHabit = "";

function addMessage(text, type) {
    const div = document.createElement("div");
    div.classList.add("message", type);
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const message = input.value.trim();
    if (message === "") return;

    addMessage(message, "user");
    input.value = "";

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
    sendMessage(); 

    selectedHabits = {};
    refreshSelectedList();
});

