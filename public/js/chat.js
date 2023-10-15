document.addEventListener("DOMContentLoaded", () => {
  const inboxList = document.querySelector(".inbox-list");
  const notificationDiv = document.getElementById("notification");

  const markMessageAsRead = (messageId) => fetch(`/messages/${messageId}/read`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  const showNotification = (message) => {
    notificationDiv.textContent = message;
    notificationDiv.style.display = "block";
    setTimeout(() => {
      notificationDiv.style.display = "none";
    }, 3000); // Hide notification after 3 seconds
  };

  inboxList.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("view-message")) {
      const listItem = e.target.closest("li");
      const { messageId } = listItem.dataset;

      // Optimistically update the UI to reflect "read" status
      listItem.classList.remove("unread");

      // Send request to backend to mark message as read
      markMessageAsRead(messageId)
        .then(({ success }) => {
          if (!success) {
            // If the backend operation fails, revert the UI change and notify the user
            listItem.classList.add("unread");
            showNotification("Failed to mark message as read. Please try again.");
          }
        })
        .catch(() => {
          // Handle any errors that occur during the fetch
          listItem.classList.add("unread");
          showNotification("An error occurred. Please try again.");
        });
    }
  });
});
