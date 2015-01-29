function getGist() {
	var requset = new XMLHttpRequest();
	if(!requset) {
		throw "Failed to create XMLHttpReuest";
	}
	var url = "https://api.github.com/gists";

	var params = {
		page: 1,
		
	};
	url += "?" + urlStringify(params);
	requset.onreadystatechange = function() {
		if(this.readyState === 4) {
			var i = 0;
			var gistItem = JSON.parse(this.responseText);
			var languageChoices = getLanguageFromUser();
			var webList = [];
			if (languageChoices.length == 0){
				console.log("empty lan");
				webList = getNonFilterList(gistItem);
			} else {
				console.log(languageChoices);
				webList = getFilterList(gistItem, languageChoices);
			}
			for (var i=0; i<webList.length; i++) {
			 console.log(webList[i]);
			}
			
			//console.log(webList[1]);
				
			
			for (i; i < gistItem.length; i++){
				var desc = gistItem[i].description;
				var htmlUrl= gistItem[i].html_url;
				var lang = getLanguage(gistItem[i].files);
			
			/*if (lang == "Python") {
				console.log(desc);
				console.log(htmlUrl);
				console.log(lang);
			}*/
			}
		}
	};
	requset.open("GET", url);
	requset.send();
}
function getLanguage(obj) {
	for (var prop1 in obj){
		for (var prop2 in obj[prop1]) {
			if (prop2 = "language"){
				lang = obj[prop1][prop2];
			}
		}
	}
	return lang;
}
function getLanguageFromUser() {
	languageList = [];
	if (document.getElementById("Python").checked){
		languageList.push("Python");
	}
	if (document.getElementById("JSON").checked){
		languageList.push("JSON");
	}
	if (document.getElementById("JavaScript").checked){
		languageList.push("JavaScript");
	}
	if (document.getElementById("SQL").checked){
		languageList.push("SQL");
	}
	return languageList;
}
function getFilterList(str, language_list){
	var i = 0;
	var arr = [];
	for (i; i< str.length; i++){
		var lang = getLanguage(str[i].files);
		if(inTheList(lang, language_list)) {
			var s = new Entry(str[i].description, str[i].id, str[i].html_url);
			arr.push(s);
		}
	}
	return arr;
}
function inTheList(aLang, aList) {
	var i = 0;
	for (i; i < aList.length; i++){
		if(aLang == aList[i])
			return true;
	}
	return false;
}
function getNonFilterList(str) {
	var i = 0;
	var arr = [];
	for (i; i< str.length; i++){
		var s = new Entry(str[i].description, str[i].id, str[i].html_url);
		arr.push(s);
	}
	return arr;
}
function Entry(oneDesc, oneId, oneUrl){
	this.desc = oneDesc;
	this.id = oneId;
	this.htmlUrl = oneUrl;
}

function urlStringify(obj){
	var str = [];
	for (var prop in obj) {
		var s = encodeURIComponent(prop) + "=" + encodeURIComponent(obj[prop]);
		str.push(s);
	}
	return str.join('&');
}
function favoriteList() {
	list = [];
}

window.onload = function(){
	var favoriteList = localStorage.getItem("list");
	if (favoriteList === null) {
		document.getElementById("emptyList").innerHTML = "The list is empty";
	}
	//getGist();
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
