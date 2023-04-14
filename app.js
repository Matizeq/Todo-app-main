const input = document.querySelector("input");
const addTask = document.querySelector(".add");
const taskContainer = document.querySelector(".task--container");
const counter = document.querySelector(".counter");
const optionButton = document.querySelectorAll(".option--button");
const clearCompleted = document.querySelector(".clear");

// Elements for 'changeTheme' function
const switchButton = document.querySelector(".switch");
const header = document.querySelector(".top");
const main = document.querySelector(".main--content");
const create = document.querySelector(".create");
const counterContainer = document.querySelector(".counter--continer");
const options = document.querySelector(".options");

// Create a new task
function createTask() {
  const taskDiv = document.createElement("div");
  const inputValue = input.value;
  taskDiv.classList.add("task");
  taskDiv.classList.add("to--do");
  taskDiv.setAttribute("draggable", true);
  taskDiv.innerHTML = `<div class="mark"></div>
  <p class="task--content">${inputValue}</p>
  <img src="images/icon-cross.svg" alt="Close" class="task--close"></img>`;
  taskContainer.appendChild(taskDiv);
  input.value = "";
  checkItemsLeft();

  // Adding light background to created task if switch have "switch--light" class
  if (switchButton.classList.contains("switch--light")) {
    taskDiv.classList.add("task--light");
  }

  // Adding "hidden" class to created task if option 'completed' is choosen
  optionButton.forEach(function (option) {
    if (
      option.classList.contains("completed") &&
      option.classList.contains("choosen--option")
    ) {
      taskDiv.classList.add("hidden");
    } else {
      taskDiv.classList.remove("hidden");
    }
  });
}

// Removing task
function removeTask() {
  const tasks = document.querySelectorAll(".task");

  tasks.forEach(function (item) {
    const taskRemove = item.querySelector(".task--close");

    taskRemove.addEventListener("click", function () {
      item.remove();
      checkItemsLeft();
    });
  });
}

function addComplete() {
  const tasks = document.querySelectorAll(".task");

  tasks.forEach(function (item) {
    const currentMark = item.querySelector(".mark");
    const paragraph = item.querySelector(".task--content");
    currentMark.addEventListener("click", function () {
      item.classList.remove("to--do");
      item.classList.add("checked");
      currentMark.classList.add("done");
      currentMark.innerHTML = `<img src="images/icon-check.svg" alt="Completed">`;
      paragraph.classList.add("strikethrough");
      checkItemsLeft();
    });
  });
}

function checkItemsLeft() {
  const itemsLeft = document.querySelectorAll(".to--do").length;
  counter.textContent = itemsLeft;
}

function changeTheme() {
  const elementsTable = [header, main, create, counterContainer, options];

  switchButton.addEventListener("click", function () {
    switchButton.classList.toggle("switch--light");

    // Adding new class to items based on their original class name
    for (let element of elementsTable) {
      element.classList.toggle(`${element.className.split(" ")[0]}--light`);

      if (switchButton.classList.contains("switch--light")) {
        const tasks = document.querySelectorAll(".task");
        const taskContent = document.querySelectorAll(".task--content");

        tasks.forEach(function (item) {
          item.classList.add("task--light");
        });
        taskContent.forEach(function (item) {
          item.classList.add("task--content--light");
        });
      } else {
        const tasks = document.querySelectorAll(".task");
        const taskContent = document.querySelectorAll(".task--content");

        tasks.forEach(function (item) {
          item.classList.remove("task--light");
        });
        taskContent.forEach(function (item) {
          item.classList.remove("task--content--light");
        });
      }
    }
  });
}

addTask.addEventListener("click", function () {
  if (input.value.length !== 0) {
    createTask();
  }

  addComplete();
  removeTask();
  setDraggaleTasks();
});

// Removing all completed tasks
clearCompleted.addEventListener("click", function () {
  const completedTasks = document.querySelectorAll(".checked");

  completedTasks.forEach(function (completed) {
    completed.remove();
    checkItemsLeft();
  });
});

// Choosing tasks to display
optionButton.forEach(function (option) {
  option.addEventListener("click", function () {
    const toDoTask = document.querySelectorAll(".to--do");
    const completedTasks = document.querySelectorAll(".checked");
    const active = document.querySelector(".choosen--option");

    if (active) {
      active.classList.remove("choosen--option");
    }
    const card = option;
    card.classList.add("choosen--option");

    function addHidden(taskType) {
      taskType.forEach(function (item) {
        item.classList.add("hidden");
      });
    }

    function removeHidden(taskType) {
      taskType.forEach(function (item) {
        item.classList.remove("hidden");
      });
    }

    if (option.classList.contains("all")) {
      removeHidden(completedTasks);
      removeHidden(toDoTask);
    } else if (option.classList.contains("active")) {
      addHidden(completedTasks);
      removeHidden(toDoTask);
    } else if (option.classList.contains("completed")) {
      addHidden(toDoTask);
      removeHidden(completedTasks);
    }
  });
});

// Draggeble tasks
function setDraggaleTasks() {
  const draggableTasks = taskContainer.querySelectorAll(".task");

  draggableTasks.forEach(function (task) {
    task.addEventListener("dragstart", function () {
      task.classList.add("dragging");
    });
    task.addEventListener("dragend", function () {
      task.classList.remove("dragging");
    });
  });

  taskContainer.addEventListener("dragover", function (e) {
    e.preventDefault();
    const draggingTask = taskContainer.querySelector(".dragging");
    const siblings = [
      ...taskContainer.querySelectorAll(".task:not(.dragging)"),
    ];

    let nextSibling = siblings.find((sibling) => {
      return e.clientY <= sibling.offsetTop + sibling.offsetHeight;
    });

    taskContainer.insertBefore(draggingTask, nextSibling);
  });
  taskContainer.addEventListener("dragenter", (e) => e.preventDefault());
}

removeTask();
addComplete();
changeTheme();
setDraggaleTasks();
