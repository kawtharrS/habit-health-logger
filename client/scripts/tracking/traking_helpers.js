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