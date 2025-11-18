document.addEventListener("DOMContentLoaded", async () => {
    await loadUserHabits();
});

sendBtn.addEventListener("click", () => sendMessage());

input.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

saveHabit.addEventListener("click", async () => {
    let value = parseFloat(habitValue.value.trim());
    if (isNaN(value) || value < 0) return alert("Value cannot be less than 0");

    const habitBtn = document.querySelector(`.habit-btn[data-habit="${currentHabit}"]`);

    const unit = habitBtn?.dataset.unit || "";
    selectedHabits[currentHabit] = value + unit;

    popup.classList.add("hidden");
    refreshSelectedList();
});

closePopup.addEventListener("click", () => popup.classList.add("hidden"));

sendAllBtn.addEventListener("click", () => {
    if (Object.keys(selectedHabits).length === 0) return alert("No habits selected!");

    let finalMessage = "Today's Habits:\n";
    for (let habit in selectedHabits) finalMessage += `${habit}: ${selectedHabits[habit]}\n`;

    sendMessage(finalMessage.trim());

    selectedHabits = {};
    refreshSelectedList();
});

addHabit.addEventListener("click", () => addHabitPopup.classList.remove("hidden"));

closeNewPopup.addEventListener("click", () => addHabitPopup.classList.add("hidden"));

saveNewHabit.addEventListener("click", createHabit);

deletePopup.addEventListener("click", deleteHabits);


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
