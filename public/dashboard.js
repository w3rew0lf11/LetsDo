import {
  BrowserProvider,
  Contract,
} from "https://cdn.jsdelivr.net/npm/ethers@6.10.0/dist/ethers.min.js";

// Enforce authentication
const walletAddress = localStorage.getItem("wallet_address");

if (!walletAddress) {
  alert("Please connect your wallet first.");
  window.location.href = "index.html";
}

// Contract configuration
const CONTRACT_ADDRESS = "0x4F7b07a5118Ba8305314d7e21e9061b977E25e2D";
const ABI_URL = "public/abi.json";

let contract;
let signer;

const TaskStatus = {
  PENDING: 0,
  COMPLETED: 1,
};

let tasks = [];
let currentFilter = "all";

// DOM Elements
const tasksContainer = document.getElementById("tasks-container");
const taskForm = document.getElementById("task-form");
const taskModal = document.getElementById("task-modal");
const addTaskBtn = document.getElementById("add-task-btn");
const cancelTaskBtn = document.getElementById("cancel-task");
const closeModalBtn = document.getElementById("close-modal");
const filterLinks = document.querySelectorAll(".sidebar-menu a[data-filter]");
const taskListTitle = document.getElementById("task-list-title");
const disconnectBtn = document.getElementById("disconnect-btn");

// Initialize contract connection
const initializeContract = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    const provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const res = await fetch(ABI_URL);
    const data = await res.json();
    contract = new Contract(CONTRACT_ADDRESS, data.abi, signer);
    console.log("Contract initialized:", contract);
  } catch (err) {
    console.error("Contract initialization failed:", err);
    alert(`Error: ${err.message}`);
    throw err;
  }
};

// Format timestamp to readable date
function formatDate(ts) {
  if (!ts || ts === 0) return "Not finished";
  return new Date(Number(ts) * 1000).toLocaleString();
}

// Render tasks based on current filter
function renderTasks() {
  if (!tasksContainer) return;

  let filteredTasks = tasks;
  if (currentFilter === "important") {
    filteredTasks = tasks.filter((t) => t.important);
  } else if (currentFilter === "pending") {
    filteredTasks = tasks.filter((t) => t.status === TaskStatus.PENDING);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((t) => t.status === TaskStatus.COMPLETED);
  }

  if (filteredTasks.length === 0) {
    tasksContainer.innerHTML = "<p>No tasks found.</p>";
    return;
  }

  tasksContainer.innerHTML = filteredTasks
    .map(
      (task) => `
        <div class="task-item ${
          task.status === TaskStatus.COMPLETED ? "task-completed" : ""
        } ${task.important ? "important" : ""}">
            <input type="checkbox" class="task-checkbox" ${
              task.status === TaskStatus.COMPLETED ? "checked" : ""
            } 
                   data-task-id="${task.id}" 
                   ${task.status === TaskStatus.COMPLETED ? "disabled" : ""}>
            <div class="task-content">
                <div class="task-title">${task.taskName}</div>
                <div class="task-description">${task.description}</div>
                <div class="task-meta">
                    <span>Started: ${formatDate(task.startedTime)}</span>
                    ${
                      task.status === TaskStatus.COMPLETED
                        ? `<span>Finished: ${formatDate(
                            task.finishedTime
                          )}</span>`
                        : ""
                    }
                    <span class="task-status ${
                      task.status === TaskStatus.COMPLETED
                        ? "status-completed"
                        : "status-pending"
                    }">
                        ${
                          task.status === TaskStatus.COMPLETED
                            ? "completed"
                            : "pending"
                        }
                    </span>
                </div>
            </div>

        </div>
    `
    )
    .join("");

  // Add event listeners for important buttons
  document.querySelectorAll(".important-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const taskId = e.currentTarget.dataset.taskId;
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        try {
          await contract.markAsImportant(taskId);
          task.important = !task.important;
          renderTasks();
        } catch (err) {
          console.error("Error marking task as important:", err);
          alert(`Failed to update task: ${err.message}`);
        }
      }
    });
  });

  // Add event listeners for checkboxes
  document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", async (e) => {
      const taskId = e.target.dataset.taskId;
      try {
        await contract.maskAsFinished(taskId);
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
          task.status = TaskStatus.COMPLETED;
          task.finishedTime = Math.floor(Date.now() / 1000);
          renderTasks();
        }
      } catch (err) {
        console.error("Error completing task:", err);
        alert(`Failed to complete task: ${err.message}`);
        e.target.checked = false;
      }
    });
  });

  updateStats();
}

// Update statistics display
function updateStats() {
  document.getElementById("total-tasks").textContent = tasks.length;
  document.getElementById("completed-tasks").textContent = tasks.filter(
    (t) => t.status === TaskStatus.COMPLETED
  ).length;
  document.getElementById("important-tasks").textContent = tasks.filter(
    (t) => t.important
  ).length;
}

// Fetch tasks from contract
async function fetchAndDisplayTasks() {
  try {
    if (!tasksContainer) return;

    tasksContainer.innerHTML = "<p>Loading tasks...</p>";

    if (!contract) await initializeContract();
    const result = await contract.getAllTasks();

    tasks = result.map((task, index) => ({
      id: index.toString(),
      taskName: task.taskName,
      description: task.description,
      startedTime: task.startedTime,
      finishedTime: task.finishedTime,
      status: Number(task.status),
    }));

    renderTasks();
  } catch (err) {
    console.error("Failed to load tasks:", err);
    if (tasksContainer) {
      tasksContainer.innerHTML = `<p>Error loading tasks: ${err.message}</p>`;
    }
  }
}

// Modal functions
function openModal() {
  taskModal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  taskModal.style.display = "none";
  document.body.style.overflow = "auto";
  taskForm.reset();
}

// Handle task form submission
taskForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const taskName = document.getElementById("task-name").value.trim();
  if (!taskName) {
    alert("Task name is required");
    return;
  }

  const description =
    document.getElementById("task-description").value.trim() ||
    "No description";

  try {
    if (!contract) await initializeContract();

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";

    const tx = await contract.addTask(
      taskName,
      description,
      Math.floor(Date.now() / 1000), // startedTime
      0 // finishedTime (0 for pending)
    );

    await tx.wait();
    await fetchAndDisplayTasks();
    closeModal();
  } catch (err) {
    console.error("Error adding task:", err);
    alert(`Failed to add task: ${err.message}`);
  } finally {
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Save Task";
    }
  }
});

// Handle filter clicks
filterLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    currentFilter = link.dataset.filter;
    taskListTitle.textContent = link.textContent;

    filterLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    renderTasks();
  });
});

// Initialize on page load
window.addEventListener("DOMContentLoaded", async () => {
  try {
    // Display wallet address
    const walletAddress = localStorage.getItem("wallet_address");
    if (walletAddress) {
      const displayElement = document.getElementById("wallet-address-span");
      if (displayElement) {
        displayElement.textContent = walletAddress;
        displayElement.removeAttribute("title");
      }
    }

    // Set up event listeners
    addTaskBtn?.addEventListener("click", openModal);
    cancelTaskBtn?.addEventListener("click", closeModal);
    closeModalBtn?.addEventListener("click", closeModal);
    disconnectBtn?.addEventListener("click", () => {
      localStorage.removeItem("wallet_address");
      window.location.href = "index.html";
    });

    taskModal?.addEventListener("click", function (e) {
      if (e.target === taskModal) {
        closeModal();
      }
    });

    await initializeContract();
    await fetchAndDisplayTasks();
  } catch (err) {
    console.error("Initialization error:", err);
  }
});
