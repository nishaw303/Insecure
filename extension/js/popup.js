//On click, change background color
function click(e) {
  chrome.tabs.executeScript(null,
      {code:"document.body.style.backgroundColor='" + e.target.id + "'"});
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  var temp = document.querySelectorAll('div');
  for (var i = 0; i < temp.length; i++) {
    temp[i].addEventListener('click', click);
  }
});
