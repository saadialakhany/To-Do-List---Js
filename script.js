"strict mode";

const inputField = document.querySelector(".input--field");
const addBtn = document.querySelector(".input--btn");
const taskContainer = document.querySelector(".tasks");
const taskList = document.querySelector(".tasks-list");
const list = document.querySelector(".task");

let tasks = [];

const clearInputField = function () {
  inputField.value = "";
};

const addTask = function () {
  if (inputField.value === "") return;
  const newTask = {
    id: Date.now(),
    text: inputField.value
      .trim()
      .toLowerCase()
      .split(" ")
      .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
      .join(" "),
    completed: false,
  };
  clearInputField();
  tasks.push(newTask);
  renderTasks(newTask);
  updateLocalStorage();
};

const renderTasks = function (task) {
  const markup = ` <li class="task ${
    task.completed ? "task--checked" : ""
  }" data-id="${task.id}">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="#1db9ed"
        viewBox="0 0 256 256"
        class="task--icon icon--unchecked ${task.completed ? "hide" : ""}"
      >
        <path
          d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"
        ></path>
      </svg>
    
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#1db9ed" viewBox="0 0 256 256" class="task--icon icon--checked ${
        task.completed ? "" : "hide"
      }">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
    
      <p class="task--text">${task.text}</p>
      
      <button class="task--close-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#504e4e"
          viewBox="0 0 256 256"
        >
          <path
            d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"
          ></path>
        </svg>
      </button>
    </li>`;

  taskContainer.insertAdjacentHTML("beforeend", markup);
};

const markChecked = function (e) {
  const clickedItem = e.target.closest(".task");
  //   console.log(clickedItem);

  if (!clickedItem) return;

  // Check if the clicked element is the close button
  const closeButton = e.target.closest(".task--close-btn");

  if (closeButton) {
    // Ask for confirmation before deleting the task
    const confirmation = confirm("Are you sure you want to delete this task?");

    if (confirmation) {
      // If the user confirms, remove the task
      clickedItem.remove();
      const taskId = parseInt(clickedItem.dataset.id, 10);
      tasks = tasks.filter((task) => task.id !== taskId);
      updateLocalStorage();
    }
  } else {
    // If the task is clicked, toggle the checked state
    clickedItem.classList.toggle("task--checked");
    const taskIndex = tasks.findIndex(
      (task) => task.id === parseInt(clickedItem.dataset.id, 10)
    );
    // console.log(taskIndex);
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      updateLocalStorage();
    }
    clickedItem.querySelector(".icon--checked").classList.toggle("hide");
    clickedItem.querySelector(".icon--unchecked").classList.toggle("hide");
  }
};

function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = storedTasks;
  tasks.forEach((task) => {
    renderTasks(task);
  });
}

const updateLocalStorage = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

addBtn.addEventListener("click", addTask);
window.addEventListener("keydown", function (e) {
  if (e.key !== "Enter") return;
  if (e.key === "Enter" && inputField !== "") addTask();
});

taskContainer.addEventListener("click", markChecked);

window.addEventListener("load", loadTasks);
