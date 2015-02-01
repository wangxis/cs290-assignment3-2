function getGist() {
	var webList = [];
	var requset = new XMLHttpRequest()
	if(!requset) {
		throw "Failed to create XMLHttpReuest";
	}
		var num = document.getElementsByName("pageNumber")[0].value;
		if (num < 1 || num > 5) {
		var text = document.createTextNode("Input out of range");
		document.getElementById("outOfRange").appendChild(text);
		return;
	}
	for (var index = 0; index < num; index++) {
		requset = new XMLHttpRequest();
		var url = "https://api.github.com/gists";
		var pageReq = index + 1;
		var params = {
			page: pageReq,
		};
		url += "?" + urlStringify(params);
		requset.open("GET", url);
		requset.send();
		requset.onreadystatechange = function() {
			if(this.readyState === 4) {
				var gistItem = JSON.parse(this.responseText);
				var languageChoices = getLanguageFromUser();
				
				if (languageChoices.length == 0){
					//console.log("empty lan");
					webList = getNonFilterList(gistItem);
				} else {
					console.log(languageChoices);
					webList = getFilterList(gistItem, languageChoices);
				}
				makeList(webList, "Add to Favorites", "searchList");
				//localStorage.setItem("webList", JSON.stringify(webList));
				addToLocalStorage(webList);
				//displaySearchList();
			}	
		};
	}	
}
function addToLocalStorage(onePage){
	var oldList = JSON.parse(localStorage.getItem("myList")) || [];
	for (var i = 0; i < onePage.length; i++){
		oldList.push(onePage[i]);
	}
	localStorage.setItem("myList", JSON.stringify(oldList));
}
function makeList(obj, buttonName, webId) {
	var listElement = document.createElement("ul");
 	document.getElementById(webId).appendChild(listElement);
    var numberOfListItems = obj.length;
    for( var i =  0 ; i < numberOfListItems ; ++i){
		var listItem = makeLi(obj[i]);
		if (buttonName == "Add to Favorites") {
			listItem.appendChild(makeAddButton(obj[i], buttonName));
		} else if (buttonName == "Remove") {
			listItem.appendChild(makeRemoveButton(obj[i], buttonName));
		}
		listElement.appendChild(listItem);
   }
}
function makeLi(obj) {
	var listItem = document.createElement("li");
	var aTag = document.createElement("a");
	aTag.setAttribute("href", obj.htmlUrl);
	var text = document.createTextNode("ID: " + obj.id + "  DESCRIPTION: " + obj.desc);
	aTag.appendChild(text);
	listItem.appendChild(aTag);
	return listItem;
}
function makeAddButton(obj, buttonValue){
	var oneButton = document.createElement("input");
		oneButton.type = "button";
		oneButton.value = buttonValue;
		oneButton.id = obj.id;
		oneButton.onclick = function() { addToFavorite(this.id);};
		return oneButton;
}
function makeRemoveButton(obj, buttonValue){
	var oneButton = document.createElement("input");
	oneButton.type = "button";
	oneButton.value = buttonValue;
	oneButton.id = obj.id;
	oneButton.onclick = function() { removeItemInFavorite(this.id);};
	return oneButton;
}
function addToFavorite(itemId){
	var oldItems = JSON.parse(localStorage.getItem("favoriteList")) || [];
	var storageItems = JSON.parse(localStorage.getItem("myList"));
	for (var i = 0; i < storageItems.length; i++) {
		if(storageItems[i].id == itemId) {
			oldItems.push(storageItems[i]);
			localStorage.setItem("favoriteList", JSON.stringify(oldItems));
			var deleteNode = document.getElementById(itemId).parentNode;
			if (deleteNode.parentNode) {
				deleteNode.parentNode.removeChild(deleteNode);
			}
			var listItem = makeLi(storageItems[i]);
			listItem.appendChild(makeRemoveButton(storageItems[i], "Remove"));
			if (document.getElementById("myFavoriteList").childNodes[0] == undefined){
				var listElement = document.createElement("ul");
				document.getElementById("myFavoriteList").appendChild(listElement);
			}
			document.getElementById("myFavoriteList").childNodes[0].appendChild(listItem);
			return;
		}	
	}
}
function removeItemInFavorite(itemId) {
	var oldItems = JSON.parse(localStorage.getItem("favoriteList")) || [];
	var deleteNode = document.getElementById(itemId).parentNode;
		if (deleteNode.parentNode) {
			deleteNode.parentNode.removeChild(deleteNode);
		}
	for (var i = 0; i < oldItems.length; i++) {
		if(oldItems[i].id == itemId) {
			oldItems.splice(i,1);
			localStorage.setItem("favoriteList", JSON.stringify(oldItems));
			return;
		}	
	}
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
	var itemsInFavorites = JSON.parse(localStorage.getItem("favoriteList")) || [];
	var i = 0;
	var arr = [];
	for (i; i< str.length; i++){
		var lang = getLanguage(str[i].files);
		if(inTheList(lang, language_list)) {
			var s = new Entry(str[i].description, str[i].id, str[i].html_url);
			if (!inTheFavorite (s.id, itemsInFavorites)) {
				arr.push(s);
			}
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
function inTheFavorite(oneId, aList) {
	for (var i = 0; i < aList.length; i++) {
		if (oneId == aList[i].id) {
			console.log("called inthe fav");
			return true;
		}
	}
	return false;
}
function getNonFilterList(str) {
	var itemsInFavorites = JSON.parse(localStorage.getItem("favoriteList")) || [];
	var i = 0;
	var arr = [];
	for (i; i< str.length; i++){
		var s = new Entry(str[i].description, str[i].id, str[i].html_url);
		if (!inTheFavorite (s.id, itemsInFavorites)) {
			arr.push(s);
		}	
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
function clearFavoriteList(){
	var element = document.getElementById("myFavoriteList");
	while(element.firstChild){
		element.removeChild(element.firstChild);
	}
	localStorage.removeItem("favoriteList");
}
window.onload = function(){
	var theList = JSON.parse(localStorage.getItem("favoriteList")) || [];
	makeList(theList, "Remove", "myFavoriteList");
	localStorage.removeItem("myList");
}
