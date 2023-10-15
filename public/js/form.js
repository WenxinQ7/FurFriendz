async function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const messageData = Object.fromEntries(formData);

  function updateNotification(message, status) {
    const notificationElement = document.getElementById("notification");

    notificationElement.textContent = message;
    notificationElement.classList.remove("success", "error"); // Clear any previous classes

    if (status === "success") {
      notificationElement.classList.add("success");
    } else if (status === "error") {
      notificationElement.classList.add("error");
    }

    notificationElement.style.display = "block";
  }

  try {
    const response = await fetch("/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    const { success, error } = await response.json();

    if (response.ok && success) {
      updateNotification("Message sent successfully!", "success");
    } else {
      updateNotification(`Failed to send the message. ${error}`, "error");
    }
  } catch (err) {
    updateNotification("An error occurred while sending the message.", "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#messageForm");
  form.addEventListener("submit", handleSubmit);
});
