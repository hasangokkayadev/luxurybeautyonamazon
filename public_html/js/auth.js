// Authentication state management for all pages
let currentUser = null;

// Update navigation based on auth state
function updateNavigation(user) {
  const authLink = document.getElementById("authLink");
  if (!authLink) return;

  if (user) {
    // User is logged in
    authLink.innerHTML = "Logout";
    authLink.href = "#";
    authLink.onclick = (e) => {
      e.preventDefault();
      handleLogout();
    };

    // Add delete account link if not exists
    if (!document.getElementById("deleteAccountLink")) {
      const deleteLink = document.createElement("a");
      deleteLink.id = "deleteAccountLink";
      deleteLink.href = "#";
      deleteLink.textContent = "Delete Account";
      deleteLink.onclick = (e) => {
        e.preventDefault();
        handleDeleteAccount();
      };
      authLink.parentNode.insertBefore(deleteLink, authLink.nextSibling);
    }
  } else {
    // User is logged out
    authLink.innerHTML = "Login";
    authLink.href = "login.html";
    authLink.onclick = null;

    // Remove delete account link if exists
    const deleteLink = document.getElementById("deleteAccountLink");
    if (deleteLink) {
      deleteLink.remove();
    }
  }
}

// Handle logout
function handleLogout() {
  auth
    .signOut()
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Logout error:", error);
      alert("Error logging out. Please try again.");
    });
}

// Handle account deletion
function handleDeleteAccount() {
  if (
    !confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    )
  ) {
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("No user logged in.");
    return;
  }

  // Prompt for password to re-authenticate
  const password = prompt(
    "Please enter your password to confirm account deletion:"
  );
  if (!password) {
    return;
  }

  // Re-authenticate user
  const credential = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );

  user
    .reauthenticateWithCredential(credential)
    .then(() => {
      // Delete user data from Firestore
      const userId = user.uid;
      const batch = db.batch();

      // Delete user document
      batch.delete(db.collection("users").doc(userId));

      // Delete cart document
      batch.delete(db.collection("carts").doc(userId));

      return batch.commit();
    })
    .then(() => {
      // Delete user account
      return user.delete();
    })
    .then(() => {
      alert("Your account has been deleted successfully.");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Delete account error:", error);
      if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Account deletion cancelled.");
      } else {
        alert("Error deleting account: " + error.message);
      }
    });
}

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
  currentUser = user;
  updateNavigation(user);
});
