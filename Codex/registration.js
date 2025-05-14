document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");
  const errorMessage = document.getElementById("errorMessage");
  const successMessage = document.getElementById("successMessage");

  // Pre-select event if coming from event page
  const urlParams = new URLSearchParams(window.location.search);
  const eventParam = urlParams.get("event");
  if (eventParam) {
    const eventSelect = document.getElementById("eventSelect");
    eventSelect.value = eventParam;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Reset messages
    errorMessage.style.display = "none";
    successMessage.style.display = "none";

    // Basic validation
    const requiredFields = [
      "eventSelect",
      "fullName",
      "email",
      "phone",
      "regNumber",
      "department",
    ];
    let isValid = true;
    let yearSelected = false;

    requiredFields.forEach((field) => {
      const element = document.getElementById(field);
      if (!element.value.trim()) {
        isValid = false;
        element.style.borderColor = "#dc2626";
      } else {
        element.style.borderColor = "#d1d5db";
      }
    });

    // Check if year is selected
    const yearRadios = form.querySelectorAll('input[name="year"]');
    yearRadios.forEach((radio) => {
      if (radio.checked) yearSelected = true;
    });

    if (!yearSelected) {
      isValid = false;
      errorMessage.textContent = "Please select your year of study";
      errorMessage.style.display = "block";
      return;
    }

    if (!isValid) {
      errorMessage.textContent = "Please fill in all required fields";
      errorMessage.style.display = "block";
      return;
    }

    // Collect form data
    const formData = {
      event: form.eventSelect.value,
      fullName: form.fullName.value,
      email: form.email.value,
      phone: form.phone.value,
      regNumber: form.regNumber.value,
      year: form.year.value,
      department: form.department.value,
      experience: form.experience.value,
      registrationDate: new Date().toISOString(),
    };

    try {
      // In a real application, this would be an API call
      // For now, we'll simulate storing in localStorage
      let registrations = JSON.parse(
        localStorage.getItem("eventRegistrations") || "[]"
      );
      registrations.push(formData);
      localStorage.setItem("eventRegistrations", JSON.stringify(registrations));

      // Show success message
      successMessage.style.display = "block";
      form.reset();

      // Redirect to success page or show confirmation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1000);
    } catch (error) {
      errorMessage.textContent = "An error occurred. Please try again.";
      errorMessage.style.display = "block";
    }
  });

  // Real-time validation
  form.querySelectorAll("input, select").forEach((element) => {
    element.addEventListener("input", function () {
      if (this.hasAttribute("required") && !this.value.trim()) {
        this.style.borderColor = "#dc2626";
      } else {
        this.style.borderColor = "#d1d5db";
      }
    });
  });
});
