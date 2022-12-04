const form = document.querySelector('.new_task');
const ul = document.querySelector('.todo-app_task-list');
const counterLeftItems = document.getElementById('count')
const buttonAll = document.getElementById("all");
const buttonActive = document.getElementById("active");
const buttonCompleted = document.getElementById("completed");
const buttonSelectAll = document.querySelector('.select-all')
const buttonClearCompleted = document.querySelector('.view-mode_clear-completed')

let tasks = [];
let counterItemsLeft = 0;

function update() {
    let length = tasks.length;
    counterItemsLeft = 0;
    ul.innerHTML = '';

    if (buttonAll.checked) {
        for (let i = 0; i < length; i++) {
            ul.appendChild(tasks[i]);
            if (tasks[i].isCompleted === false) {
                counterItemsLeft++;
            }
        }
    }
    if (buttonActive.checked) {
        for (let i = 0; i < length; i++) {
            if (tasks[i].isCompleted === false) {
                ul.appendChild(tasks[i]);
                counterItemsLeft++;
            }
        }
    }
    if (buttonCompleted.checked) {
        counterItemsLeft = 0;
        for (let i = 0; i < length; i++) {
            if (tasks[i].isCompleted === true) {
                ul.appendChild(tasks[i]);
            }
        }
    }
    counterLeftItems.textContent = counterItemsLeft.toString() + ' items left';
}

function selectAll() {
    let check = document.getElementsByTagName('input');
    for (let i = 0; i < check.length; i++) {
        if (check[i].type === 'checkbox') {
            check[i].checked = true;
        }
    }
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].isCompleted = true;
    }
    update();
}

function unchecked() {
    let check = document.getElementsByTagName('input');
    for (let i = 0; i < check.length; i++) {
        if (check[i].type === 'checkbox') {
            check[i].checked = false;
        }
    }
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].isCompleted = false;
    }
    update();
}

function clearCompleted() {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].isCompleted === true) {
            tasks.splice(i, 1);
            i--;
        }
    }
    update();
}

function addTask(e) {
    e.preventDefault();
    if (this.description.value) {
        const task = createTask(this.description.value)
        tasks.push(createLi(task));
        if (!buttonActive.checked) {
            selectAll();
            unchecked();
        } else {
            unchecked();
        }
        update();
    }
    this.reset();
}

/**
 *
 * @param task {{id: string | number, desc: string}}
 * @returns {HTMLLIElement}
 */
function createLi(task) {
    const li = document.createElement('li');
    li.id = task.id;
    li.className = 'todo-app_task-item task-item';

    const input = document.createElement('input');
    input.id = task.id + 1;
    input.type = 'checkbox';
    input.className = 'task-item_status';
    input.ariaLabel = 'Completed task';

    const label = document.createElement('label');
    label.className = 'task-item_status-custom';
    label.htmlFor = task.id + 1;

    const span = document.createElement('span');
    span.className = 'task-item_text';
    span.textContent = task.desc;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'task-item_delete';

    const deleteTask = () => {
        deleteButton.removeEventListener('click', deleteTask);
        li.remove();
        let index;
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === li.id) {
                index = i;
            }
        }
        tasks.splice(index, 1);
        update();
    };
    deleteButton.addEventListener('click', deleteTask);
    input.addEventListener('change', () => {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === li.id) {
                tasks[i].isCompleted = !tasks[i].isCompleted;
            }
        }
        if (input.checked) {
            span.style.textDecoration = "line-through";
            span.style.color = "#DCDCDC";
        } else {
            span.style.textDecoration = "none";
            span.style.color = "#666666";
        }
        update();
    });
    li.append(input, label, span, deleteButton);
    update();
    return li;
}

function createTask(desc) {
    return {
        id: Date.now(),
        desc: desc,
        isCompleted: false
    }
}

form.addEventListener('submit', addTask);
buttonAll.addEventListener('click', update);
buttonActive.addEventListener('click', update);
buttonCompleted.addEventListener('click', update);
buttonClearCompleted.addEventListener('click', clearCompleted);
buttonSelectAll.addEventListener('click', selectAll);

