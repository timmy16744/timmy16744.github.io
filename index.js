import firebase from "firebase/app";
import { getDatabase, ref, push, on } from "firebase/database";
import { firebaseConfig } from "./firebaseConfig.js";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = getDatabase();

const taskForm = document.getElementById("task-form");
const tasksList = document.getElementById("tasks-list");

function saveTask(task) {
  const tasksRef = ref(db, "tasks");
  push(tasksRef, task);
}

function fetchClients() {
  const tasksRef = ref(db, "tasks");
  on(tasksRef, (snapshot) => {
    tasksList.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
      const task = childSnapshot.val();
      displayTask(task);
    });
  });
}

function displayTask(task) {
  const taskItem = document.createElement("li");
  taskItem.textContent = `${task.clientName} - ${task.loanAmount}`;
  tasksList.appendChild(taskItem);
}

function resetForm() {
  taskForm.reset();
}

function handleSubmit(event) {
  event.preventDefault();

  const clientNameInput = document.getElementById("client-name");
  const loanAmountInput = document.getElementById("loan-amount");

  const clientName = clientNameInput.value;
  const loanAmount = loanAmountInput.value;

  const task = {
    clientName,
    loanAmount,
  };

  saveTask(task);
  resetForm();
}

// Connect to the emulated database instance
if (location.hostname === "localhost") {
  const database = getDatabase(firebase.app());
  database.useEmulator("localhost", 9000);
}

taskForm.addEventListener("submit", handleSubmit);
document.getElementById("fetch-data-button").addEventListener("click", fetchClients);

fetchClients();
