document.addEventListener("DOMContentLoaded", function () {
  // Check authentication
  if (!localStorage.getItem("adminLoggedIn")) {
    window.location.href = "admin-login.html";
    return;
  }

  // Logout handler
  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "admin-login.html";
  });

  // Get registrations data
  const registrations = JSON.parse(
    localStorage.getItem("eventRegistrations") || "[]"
  );

  // Update stats
  updateStats(registrations);

  // Create year distribution chart
  createYearDistributionChart(registrations);

  // Populate registrations table
  populateRegistrationsTable(registrations);

  // Handle event form
  setupEventForm();
});

function updateStats(registrations) {
  document.getElementById("totalRegistrations").textContent =
    registrations.length;

  const today = new Date().toDateString();
  const todayCount = registrations.filter(
    (reg) => new Date(reg.registrationDate).toDateString() === today
  ).length;

  document.getElementById("todayRegistrations").textContent = todayCount;
}

function createYearDistributionChart(registrations) {
  const yearCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };

  registrations.forEach((reg) => {
    yearCounts[reg.year] = (yearCounts[reg.year] || 0) + 1;
  });

  const ctx = document.getElementById("yearDistribution").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      datasets: [
        {
          label: "Number of Registrations",
          data: [
            yearCounts["1"],
            yearCounts["2"],
            yearCounts["3"],
            yearCounts["4"],
          ],
          backgroundColor: ["#1cbbff", "#700357", "#1cbbff", "#700357"],
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
}

function populateRegistrationsTable(registrations) {
  const tableBody = document.getElementById("registrationsTableBody");
  tableBody.innerHTML = "";

  registrations
    .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
    .forEach((reg) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${reg.fullName}</td>
            <td>${
              reg.event === "python-bootcamp"
                ? "Python Bootcamp"
                : "Web Development Workshop"
            }</td>
            <td>${reg.year}st Year</td>
            <td>${reg.department.toUpperCase()}</td>
            <td>${new Date(reg.registrationDate).toLocaleDateString()}</td>
        `;
      tableBody.appendChild(row);
    });
}

function setupEventForm() {
  const form = document.getElementById("eventForm");
  const eventSelect = document.getElementById("eventSelect");

  // Load existing event data
  const events = {
    "python-bootcamp": {
      title: "Python Bootcamp: From Basics to Advanced",
      date: "2025-05-15",
      description:
        "Join us for an immersive 2-day Python bootcamp where you'll master Python programming from fundamentals to advanced concepts.",
    },
    "web-dev": {
      title: "Full Stack Web Development Workshop",
      date: "2025-05-25",
      description:
        "Join us for an intensive hands-on workshop where you'll learn modern web development from industry experts.",
    },
  };

  // Update form when event selection changes
  eventSelect.addEventListener("change", function () {
    const event = events[this.value];
    document.getElementById("eventTitle").value = event.title;
    document.getElementById("eventDate").value = event.date;
    document.getElementById("eventDescription").value = event.description;
  });

  // Trigger initial load
  eventSelect.dispatchEvent(new Event("change"));

  // Handle form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const eventData = {
      title: document.getElementById("eventTitle").value,
      date: document.getElementById("eventDate").value,
      description: document.getElementById("eventDescription").value,
    };

    // In a real application, this would update the database
    events[eventSelect.value] = eventData;

    alert("Event details updated successfully!");
  });
}
