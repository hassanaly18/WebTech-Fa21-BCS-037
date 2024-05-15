document.getElementById("contact_form").addEventListener("submit", function(event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Get the form elements
    var firstName = document.getElementById("first_name").value;
    var email = document.getElementById("email_addr").value;
    var message = document.getElementById("message").value;

    // Check if any field is empty
    if (firstName === '' || email === '' || message === '') {
      // Show error alert box
      alert("Please fill out all fields");
      return; // Stop further execution
    }

    // If all fields are filled, submit the form
    this.submit();
  });
