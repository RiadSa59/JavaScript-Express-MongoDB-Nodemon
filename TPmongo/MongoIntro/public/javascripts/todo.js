const displayMessage = msg => document.getElementById('content').textContent = msg;

const displayTasks = async () => {
  const response = await fetch('/task');
  const tasks = await response.json();
  const list = document.getElementById('list');
  list.innerHTML = '';

  tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task');
    taskItem.textContent = `${task.description} (Urgence: ${task.urgency})`;
    taskItem.setAttribute('data-urgency', task.urgency);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.innerHTML = '&#10005;'; // Unicode cross symbol
    deleteButton.onclick = () => deleteTask(task._id);

    taskItem.appendChild(deleteButton);
    list.appendChild(taskItem);
  });
};


const createTask = async () => {
  const description = document.getElementById('desc').value;
  const urgency = document.getElementById('urgency').value;

  const response = await fetch('/task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, urgency }),
  });

  if (response.ok) {
    const task = await response.json();
    displayMessage(`Tâche créée avec l'ID: ${task._id}`);
    displayTasks();
  } else {
    const error = await response.json();
    displayMessage(`Erreur lors de la création de la tâche: ${error.error}`);
  }
};

const deleteTask = async taskId => {
  const response = await fetch(`/task/${taskId}`, { method: 'DELETE' });

  if (response.ok) {
    const task = await response.json();
    displayMessage(`Tâche supprimée avec l'ID: ${task._id}`);
    displayTasks();
  } else {
    const error = await response.json();
    displayMessage(`Erreur lors de la suppression de la tâche: ${error.error}`);
  }
};

const setup = () => {
  displayTasks();
  displayMessage('prêt');
  document.getElementById('create').addEventListener('click', createTask);
};

// go !
setup();