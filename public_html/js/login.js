// Login/Signup page logic
let isLoginMode = true;

const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const submitBtn = document.getElementById("submitBtn");
const toggleLink = document.getElementById("toggleLink");
const toggleAuth = document.getElementById("toggleAuth");
const resetPasswordLink = document.getElementById("resetPasswordLink");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
  if (user) {
    // Redirect to homepage if already logged in
    window.location.href = "index.html";
  }
});

// Toggle between login and signup
toggleLink.addEventListener("click", (e) => {
  e.preventDefault();
  isLoginMode = !isLoginMode;

  if (isLoginMode) {
    authTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    toggleAuth.innerHTML =
      "Don't have an account? <a href='#' id='toggleLink'>Sign up</a>";
    resetPasswordLink.style.display = "inline";
  } else {
    authTitle.textContent = "Sign Up";
    submitBtn.textContent = "Sign Up";
    toggleAuth.innerHTML =
      "Already have an account? <a href='#' id='toggleLink'>Login</a>";
    resetPasswordLink.style.display = "none";
  }

  // Re-attach event listener to new toggle link
  document
    .getElementById("toggleLink")
    .addEventListener("click", arguments.callee);
  hideMessages();
});

// Handle form submission
authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  hideMessages();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (isLoginMode) {
    // Login
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        showError(getErrorMessage(error.code));
      });
  } else {
    // Sign up
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Create user document in Firestore
        return db.collection("users").doc(user.uid).set({
          email: user.email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      })
      .then(() => {
        // Create empty cart document
        const user = auth.currentUser;
        return db.collection("carts").doc(user.uid).set({
          items: [],
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      })
      .then(() => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        showError(getErrorMessage(error.code));
      });
  }
});

// Handle password reset
resetPasswordLink.addEventListener("click", (e) => {
  e.preventDefault();
  hideMessages();

  const email = document.getElementById("email").value;

  if (!email) {
    showError("Please enter your email address first.");
    return;
  }

  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      showSuccess("Password reset email sent. Please check your inbox.");
    })
    .catch((error) => {
      showError(getErrorMessage(error.code));
    });
});

// Helper functions
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = "block";
}

function hideMessages() {
  errorMessage.style.display = "none";
  successMessage.style.display = "none";
}

function getErrorMessage(errorCode) {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please login instead.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    default:
      return "An error occurred. Please try again.";
  }
}
