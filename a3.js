function getGist() {
	var requset = new XMLHttpRequest();
	if(!requset) {
		throw "Failed to create XMLHttpReuest";
	}
	var url = " https://api.github.com/gists?page=3";
	requset.onreadystatechange = function() {
		if(this.readyState === 4) {
			var gistItem = JSON.parse(this.responseText);
			var lan = gistItem[0].files;
		}
		console.log(lan);
	};
	requset.open("GET", url);
	requset.send();
}

window.onload = function(){
	getGist();
}

function saveDemoInput() {
  localStorage.setItem("demoText", document.getElementsByName ("demo-input")[0].value);
}
function clearLocalStorage() {
  localStorage.clear();
}
function displayLocalStorage() {
  document.getElementById("output").innerHTML = localStorage.getItem("demoText");
}
