// Initialize Firebase with the AmiiboDex specs
var config = {

   apiKey: "AIzaSyD3p9hdIYoCSi72wUMbPT-JkIzXPf6Xmrc",
   authDomain: "amiibodex.firebaseapp.com",
   databaseURL: "https://amiibodex.firebaseio.com",
   storageBucket: "amiibodex.appspot.com",
   messagingSenderId: "582801923363"

};

firebase.initializeApp(config);
// Authenticate user if user is signed in
var path = window.location.pathname;
var page = path.split("/").pop();

var authId;
var firebaseCustomRef;
firebase.auth().onAuthStateChanged(function (user) {
	// For add.html
	if(page.localeCompare("add.html") == 0){
		if(user) {
			// User is signed in
			authId = user.uid;
		} else {
			// No user is signed in, then redirect to "index.html"
			// For security reasons
			window.location.href='index.html';
		}
	}
	// For delete.html
	if(page.localeCompare("delete.html") == 0) {
		if(user) {
			// User is signed in
		} else {
			// No user is signed in, then redirect to "index.html"
			// For security reasons
			window.location.href='index.html';
		}
	}
	// For index.html
	if(page.localeCompare("index.html") == 0) {
		if(user) {
			// User is signed in, redirect to proper page
			window.location.href='indexsignedin.html';
		}
	}
	// For indexdelete.html
	if(page.localeCompare("indexdelete.html") == 0) {
		if(user) {
			// User is signed in
			document.getElementById("greeting-line").innerHTML = "Welcome, " + user.email + "!";
			authId = user.uid;
			firebaseCustomRef = firebase.database().ref().child("users").child(authId).child("customList");
			firebaseCustomRef.once("value",function(snapshot){
				printObject(snapshot.val());
			});
		} else {
			// No user is signed in, redirect back to "index.html"
			window.location.href='index.html';
		}
	}
	// For indexedit.html
	if(page.localeCompare("indexedit.html") == 0) {
		if(user) {
			authId = user.uid;
			// User is signed in
			document.getElementById("greeting-line").innerHTML = "Welcome, " + user.email + "!";
			var firebaseCustomRef = firebase.database().ref().child("users").child(authId).child("customList");

			firebaseCustomRef.once("value",function(snapshot){
				displayCustomEdit(snapshot.val());
			});
		} else {
			// No user is signed in, then redirect to "index.html"
			window.location.href='index.html';
		}
	}
	// For indexsignedin.html
	if(page.localeCompare("indexsignedin.html") == 0) {
    		if(user) {
			// User is signed in
			document.getElementById("greeting-line").innerHTML = "Welcome, " + user.email + "!";
			authId = user.uid;
			var firebaseCustomRef = firebase.database().ref().child("users").child(authId).child("customList");
			characters.forEach(function(item, index) {
				markOwnership(item, index, authId);
			});
			firebaseCustomRef.once("value",function(snapshot){
				displayCustomAmiibo(snapshot.val());
			});	
			customAmiiboList.forEach(function(item, index) {
				markOwnershipCustom(item,index, authId);
			});
    		} else {
			// No user is signed in, redirect back to "index.html"
			window.location.href='index.html';
		}
	}
	// For signin.html
	if(page.localeCompare("signin.html") == 0) {
		if(user) {
			var user = firebase.auth().currentUser;
			location.href = "indexsignedin.html";
		}
	}
	// For signout.html
	if(page.localeCompare("signout.html") == 0) {
		if(user) {
			// User is signed in
		} else {
			// No user is signed in, then redirect to "index.html"
			window.location.href='index.html';
		}
	}
});
// Writes a default user profile into the realtime database
function writeNewUserData(password, authId) {

	firebase.database().ref().child('users/' + authId).set({
		customList: {
			"0-Custom": {
				DateRelease : 0,
				Description : false,
				Exclusive: false,
				GameOrigin: false,
				Image: false,
				Name: false,
				Number: false,
				Rarity: false,
				Wave: false,
				Owned: false
			}
		},    
		password: password,
		authenticationId: authId,
		originalList: {
			Mario: false, 
			Peach: false,
			Yoshi: false,
			DonkeyKong: false,
			Link: false,
			Fox: false,
			Samus: false,
			WiiFitTrainer: false,
			Villager: false,
			Pikachu: false,
			Kirby: false,
			Marth: false,
			Zelda: false,
			DiddyKong: false,
			Luigi: false,
			LittleMac: false,
			Pit: false,
			CaptainFalcon: false,
			"Rosalina&Luma": false,
			Bowser: false,
			Lucario: false,
			ToonLink: false,
			Sheik: false,
			Ike: false,
			Shulk: false,
			Sonic: false,
			MegaMan: false,
			KingDedede: false,
			MetaKnight: false,
			Robin: false,
			Lucina: false,
			Wario: false,
			Charizard: false,
			Ness: false
    }
  });

}

var firebaseAmiiboListRef = firebase.database().ref().child("original-amiibo-list");

var characters = [ "SkipThis", "Mario", "Peach", "Yoshi", "DonkeyKong",
		   "Link", "Fox", "Samus", "WiiFitTrainer", "Villager", 
		   "Pikachu", "Kirby", "Marth", "Zelda", "DiddyKong",
		   "Luigi", "LittleMac", "Pit", "CaptainFalcon", "Rosalina&Luma",
		   "Bowser", "Lucario", "ToonLink", "Sheik", "Ike",
		   "Shulk", "Sonic", "MegaMan", "KingDedede", "MetaKnight",
		   "Robin", "Lucina", "Wario", "Charizard", "Ness" ];
		   
var fastcharacters1 = ["1-Mario", "2-Peach", "3-Yoshi", "4-DonkeyKong", "5-Link"];
var fastcharacters2 = ["6-Fox", "7-Samus", "8-WiiFitTrainer", "9-Villager", "10-Pikachu"];
var fastcharacters3 = ["11-Kirby", "12-Marth", "13-Zelda", "14-DiddyKong", "15-Luigi"];
var fastcharacters4 = ["16-LittleMac", "17-Pit", "18-CaptainFalcon", "19-Rosalina&Luma","20-Bowser"];
var fastcharacters5 = ["21-Lucario", "22-ToonLink", "23-Sheik", "24-Ike","25-Shulk"];
var fastcharacters6 = ["26-Sonic", "27-MegaMan", "28-KingDedede", "29-MetaKnight","30-Robin"];
var fastcharacters7 = ["31-Lucina", "32-Wario", "33-Charizard", "34-Ness"];
var listoffastcharacters = [fastcharacters2,fastcharacters3,fastcharacters4,
			fastcharacters5,fastcharacters6,fastcharacters7];

// Update the owned amiibo listing
function updateOwnership(character, userId) {
	var userAmiiboRef = firebase.database().ref().child("users").child(userId).child("originalList").child(character);
	var value;

	userAmiiboRef.on('value', function(snapshot){
    	value = snapshot.val();
  	});

	var updates = {};  
	updates["/users/" + userId + "/originalList/" + character] = !value;
	document.getElementById(character + "-Checked").checked = !value;
	firebase.database().ref().update(updates); 
}

var valueCustom = null;
function waitToFinishCustom(character, userId) {
    if(valueCustom==null) { //we want it to match
        setTimeout(function() {waitToFinishCustom(character, userId)}, 50);//wait 50 millisecnds then recheck
        return;
    }
    var updates = {};
		updates["/users/" + userId + "/customList/" + character + "/Have"] = !valueCustom;
  	firebase.database().ref().update(updates); 
  	valueCustom = null;
}

function updateOwnershipCustom(character, userId) {
	var userAmiiboRefCustom = firebase.database().ref().child("users").child(userId).child("customList").child(character).child("Have");
	valueCustom = null;
	userAmiiboRefCustom.on('value', function(snapshot){
    	valueCustom = snapshot.val();
  	});
  	waitToFinishCustom(character, userId);
}

var numberOfAmiibo = 0;
var go = 1;
// Pulls each attribute of the amiibo
function forEachFunction(item, index) {
	var itemArray = item.split("-");
	var itemNumber = itemArray[0];
	var itemName = itemArray[1];

	// Pulls the Number attribute
	var number = document.getElementById(itemName + "-Number");
	var firebaseCharacterRef = firebaseAmiiboListRef.child(item);
	var firebaseCharacterNumberRef = firebaseCharacterRef.child("Number");
	firebaseCharacterNumberRef.on('value', function(snapshot){
		number.innerHTML = snapshot.val();
	});
	// Pulls the Name attribute
	var name = document.getElementById(itemName + "-Name");
	var firebaseCharacterNameRef = firebaseCharacterRef.child("Name");
	firebaseCharacterNameRef.on('value', function(snapshot){
		name.innerHTML = snapshot.val();
	});
	// Pulls the Image attribute
	var image = document.getElementById(itemName + "-Image");
	var firebaseCharacterImageRef = firebaseCharacterRef.child("Image");
	firebaseCharacterImageRef.on('value', function(snapshot){
		image.src = snapshot.val();
		image.onload = function(e) {
			numberOfAmiibo = numberOfAmiibo + 1;
		};
	});
	// Pulls the Game Origin attribute
	var gameOrigin = document.getElementById(itemName + "-GameOrigin");
	var firebaseCharacterGameOriginRef = firebaseCharacterRef.child("Game Origin");
	firebaseCharacterGameOriginRef.on('value', function(snapshot){
		gameOrigin.innerHTML = snapshot.val();
	});
	// Pulls the Date Release attribute
	var dateRelease = document.getElementById(itemName + "-DateRelease");
	var firebaseCharacterDateReleaseRef = firebaseCharacterRef.child("Date Release");
	firebaseCharacterDateReleaseRef.on('value', function(snapshot){
		dateRelease.innerHTML = snapshot.val();
	});
	// Pulls the Wave attribute
	var wave = document.getElementById(itemName + "-Wave");
	var firebaseCharacterWaveRef = firebaseCharacterRef.child("Wave");
	firebaseCharacterWaveRef.on('value', function(snapshot){
		wave.innerHTML = snapshot.val();
	});
	// Pulls the Exclusive attribute
	var exclusive = document.getElementById(itemName + "-Exclusive");
	var firebaseCharacterExclusiveRef = firebaseCharacterRef.child("Exclusive");
	firebaseCharacterExclusiveRef.on('value', function(snapshot){
		exclusive.innerHTML = snapshot.val();
	});
	// Pulls the Description attribute
	var description = document.getElementById(itemName + "-Description");
	var firebaseCharacterDescriptionRef = firebaseCharacterRef.child("Description");
	firebaseCharacterDescriptionRef.on('value', function(snapshot){
		description.innerHTML = snapshot.val();
	});
	// Pulls the Rarity attribute
	var rarity = document.getElementById(itemName + "-Rarity");
	var firebaseCharacterRarityRef = firebaseCharacterRef.child("Rarity");
	firebaseCharacterRarityRef.on('value', function(snapshot){
		rarity.innerHTML = snapshot.val();
	});
	
}

if((page.localeCompare("index.html") == 0) || (page.localeCompare("indexsignedin.html") == 0) || !page) {
	fastcharacters1.forEach(forEachFunction);
}
function waitToFinish7() {
    if(numberOfAmiibo!=30) {//we want it to match
        setTimeout(waitToFinish7, 50);//wait 50 millisecnds then recheck
        return;
    }
    fastcharacters7.forEach(forEachFunction);
}
function waitToFinish6() {
    if(numberOfAmiibo!=25) {//we want it to match
        setTimeout(waitToFinish6, 50);//wait 50 millisecnds then recheck
        return;
    }
    fastcharacters6.forEach(forEachFunction);
    waitToFinish7();
}
function waitToFinish5() {
    if(numberOfAmiibo!=20) {//we want it to match
        setTimeout(waitToFinish5, 50);//wait 50 millisecnds then recheck
        return;
    }
    fastcharacters5.forEach(forEachFunction);
    waitToFinish6();
}
function waitToFinish4() {
    if(numberOfAmiibo!=15) {//we want it to match
        setTimeout(waitToFinish4, 50);//wait 50 millisecnds then recheck
        return;
    }
    fastcharacters4.forEach(forEachFunction);
    waitToFinish5();
}
function waitToFinish3() {
    if(numberOfAmiibo!=10) {//we want it to match
        setTimeout(waitToFinish3, 50);//wait 50 millisecnds then recheck
        return;
    }
    fastcharacters3.forEach(forEachFunction);
    waitToFinish4();
}
function waitToFinish2() {
    if(numberOfAmiibo!=5) {//we want it to match
        setTimeout(waitToFinish2, 50);//wait 50 millisecnds then recheck
        return;
    }
    fastcharacters2.forEach(forEachFunction);
    waitToFinish3();
}

if((page.localeCompare("index.html") == 0 ) || (page.localeCompare("indexsignedin.html") == 0) || !page)
	waitToFinish2();

// Marks the Ownership
function markOwnership(item, index, userId) {
	// Skip the 0 index
	if(item === "SkipThis" ) {
		return;
	}
	// Validates Ownership
	var ownership = document.getElementById(item + "-Checked");
	var userOwnershipRef = firebase.database().ref().child("users").child(userId).child("originalList").child(item);
	userOwnershipRef.on('value', function(snapshot){
		ownership.checked = snapshot.val();
	});
}

function markOwnershipCustom(item, index, userId) {
	// Skip the 0 index
	if(item === "SkipThis" ) {
		return;
	}
	// Validates Ownership
	var ownership = document.getElementById(item + "-Checked");
	var userOwnershipRef = firebase.database().ref().child("users").child(userId).child("originalList").child(item);
	userOwnershipRef.on('value', function(snapshot){
		ownership.checked = snapshot.val();
	});
}

// Sorting the table on page
function sortTable(n, tableId) {
	var table, rows, switching, i, x, y, shouldSwitch, dir,var1, switchcount = 0;
	table = document.getElementById(tableId);
	switching = true;
	dir = "asc"; 
	while (switching) {
		switching = false;

		rows = table.getElementsByTagName("TR");

		for(i = 1; i < (rows.length - 1); i++) {
			shouldSwitch = false;
			x = rows[i].getElementsByTagName("P")[n];
			y = rows[i + 1].getElementsByTagName("P")[n];
			if(dir == "asc") {
				if (isNaN(x.innerHTML) && isNaN(y.innerHTML) && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
					shouldSwitch= true;
					break;
				}
				else if(!isNaN(x.innerHTML) && !isNaN(y.innerHTML) && Number(x.innerHTML) > Number(y.innerHTML)){
					shouldSwitch= true;
					break;
				}
			} else if(dir == "desc") {
				if (isNaN(x.innerHTML) && isNaN(y.innerHTML) && x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
				shouldSwitch= true;
				break;
			}
			else if(!isNaN(x.innerHTML) && !isNaN(y.innerHTML) && Number(x.innerHTML) < Number(y.innerHTML)){
				shouldSwitch= true;
				break;
        		}
      		}
    	}

		if(shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			switchcount ++; 
		} else {
			if (switchcount == 0 && dir == "asc") {
				dir = "desc";
				switching = true;
			}
		}
	}
}

function sortCustomTable(n) {
	var table, rows, switching, i, x, y, shouldSwitch, dir,var1, switchcount = 0;
	table = document.getElementById("customAmiiboTable");
	switching = true;
	dir = "asc"; 
	while (switching) {
		switching = false;

		rows = table.getElementsByTagName("TR");

		for(i = 1; i < (rows.length - 1); i++) {
			shouldSwitch = false;
			x = rows[i].getElementsByTagName("TD")[n];
			y = rows[i + 1].getElementsByTagName("TD")[n];
			if(dir == "asc") {
				if (isNaN(x.innerHTML) && isNaN(y.innerHTML) && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
					shouldSwitch= true;
					break;
				}
				else if(!isNaN(x.innerHTML) && !isNaN(y.innerHTML) && Number(x.innerHTML) > Number(y.innerHTML)){
					shouldSwitch= true;
					break;
				}
			} else if(dir == "desc") {
				if (isNaN(x.innerHTML) && isNaN(y.innerHTML) && x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
				shouldSwitch= true;
				break;
			}
			else if(!isNaN(x.innerHTML) && !isNaN(y.innerHTML) && Number(x.innerHTML) < Number(y.innerHTML)){
				shouldSwitch= true;
				break;
        		}
      		}
    	}

		if(shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			switchcount ++; 
		} else {
			if (switchcount == 0 && dir == "asc") {
				dir = "desc";
				switching = true;
			}
		}
	}
}

var uploaded = 0;
var backToIndex = 0;
var pictureCustomRef;
var downloadURL;
var number;
var name;
var origin;
var date;
var wave;
var exclusive;
var description;
var rarity;
var have;

function waitReturnToIndex(){
	if(backToIndex != 1) {//we want it to match
        alert("waiting");
        setTimeout(waitReturnToIndex, 50);//wait 50 millisecnds then recheck
        return;
    }
    window.location.href = "indexsignedin.html";
}
function waitForURL() {
    if(downloadURL===null) {//we want it to match
        setTimeout(waitForURL, 50);//wait 50 millisecnds then recheck
        return;
    }
    firebase.database().ref().child("users/" + authId + "/customList/" + number + "-" + name).set({
        DateRelease: date,
        Description: description,
        Exclusive: exclusive,
        GameOrigin: origin,
        Image: downloadURL,
        Name: name,
        Number: number,
        Rarity: rarity,
        Wave: wave,
        Have: have
    }).then(function(url){
        backToIndex = 1;
        waitReturnToIndex();
    });
}
function waitToUpload() {
    if(uploaded!=1) {//we want it to match
        setTimeout(waitToUpload, 50);//wait 50 millisecnds then recheck
        return;
    }
    pictureCustomRef.getDownloadURL().then(function(url){
    	downloadURL = url;
    });
    waitForURL();
}

function addAmiibo(authId) {
	var file;
	var image = document.getElementById("image");
    if ("files" in image) {
    	file = image.files[0];
    } 
    if(file == null){
        downloadURL = "file://null";
        number = document.getElementById("number").value;
        name = document.getElementById("name").value;
        origin = document.getElementById("origin").value;
        date = document.getElementById("date").value;
        wave = document.getElementById("wave").value;
        exclusive = document.getElementById("exclusive").value;
        description = document.getElementById("description").value;
        rarity = document.getElementById("rarity").value;
        have = document.getElementById("have").checked;
        waitForURL();
    }
    else{
        var pictureRef = customStorageRef.child(file.name);
        pictureCustomRef = customStorageRef.child("Custom-Amiibo/" + authId + "/" + file.name);

        pictureRef.name === pictureCustomRef.name;
        pictureRef.fullPath === pictureCustomRef.fullPath;
       	uploaded = 0;
        pictureCustomRef.put(file).then(function(snapshot){
        	uploaded = 1;
        });

        downloadURL = null;
        waitToUpload();
        
    	number = document.getElementById("number").value;
    	name = document.getElementById("name").value;
    	origin = document.getElementById("origin").value;
    	date = document.getElementById("date").value;
    	wave = document.getElementById("wave").value;
    	exclusive = document.getElementById("exclusive").value;
    	description = document.getElementById("description").value;
    	rarity = document.getElementById("rarity").value;
    	have = document.getElementById("have").checked;
    }

}
	function displayCustomEdit(object) {
	  for (var p in object) {
	  	if(p === "0-Custom"){
	  		continue;
	  	}
	  	var nodeTR = document.createElement("TR");

	  	var numberTD = document.createElement("TD");
	var numberInput = document.createElement("input");
	numberInput.type = "text";
	numberInput.id = (object[p]["Name"] + "-Number");
	numberInput.value = object[p]["Number"];
  	numberTD.appendChild(numberInput);
	nodeTR.appendChild(numberTD);

	var nameTD = document.createElement("TD");
	var nameInput = document.createElement("input");
	nameInput.type = "text";
	nameInput.id = (object[p]["Name"] + "-Name");
	nameInput.value = object[p]["Name"];
  	nameTD.appendChild(nameInput);
	nodeTR.appendChild(nameTD);
  	
	var imageTD = document.createElement("TD");
	var imageInput = document.createElement("img");
	imageInput.src = object[p]["Image"];
	imageInput.class = "amiiboImg";
	imageInput.id = object[p]["Name"] + "-Image";
	imageInput.style.width = "100%";
  	imageTD.appendChild(imageInput);
  	var newImageInput = document.createElement("input");
  	newImageInput.type = "file";
  	newImageInput.accept = "image/*";
  	newImageInput.id = object[p]["Name"] + "-NewImage";
  	imageTD.appendChild(newImageInput);
	nodeTR.appendChild(imageTD);

	var gameOriginTD = document.createElement("TD");
	var gameOriginInput = document.createElement("input");
	gameOriginInput.type = "text";
	gameOriginInput.id = (object[p]["Name"] + "-GameOrigin");
	gameOriginInput.value = object[p]["GameOrigin"];
  	gameOriginTD.appendChild(gameOriginInput);
	nodeTR.appendChild(gameOriginTD);

	var dateReleaseTD = document.createElement("TD");
	var dateReleaseInput = document.createElement("input");
	dateReleaseInput.type = "text";
	dateReleaseInput.id = (object[p]["Name"] + "-DateRelease");
	dateReleaseInput.value = object[p]["DateRelease"];
  	dateReleaseTD.appendChild(dateReleaseInput);
	nodeTR.appendChild(dateReleaseTD);

  	var waveTD = document.createElement("TD");
	var waveInput = document.createElement("input");
	waveInput.type = "text";
	waveInput.id = (object[p]["Name"] + "-Wave");
	waveInput.value = object[p]["Wave"];
  	waveTD.appendChild(waveInput);
	nodeTR.appendChild(waveTD);

	var exclusiveTD = document.createElement("TD");
	var exclusiveInput = document.createElement("input");
	exclusiveInput.type = "text";
	exclusiveInput.id = (object[p]["Name"] + "-Exclusive");
	exclusiveInput.value = object[p]["Exclusive"];
  	exclusiveTD.appendChild(exclusiveInput);
	nodeTR.appendChild(exclusiveTD);

	var descriptionTD = document.createElement("TD");
	var descriptionInput = document.createElement("input");
	descriptionInput.type = "text";
	descriptionInput.id = (object[p]["Name"] + "-Description");
	descriptionInput.value = object[p]["Description"];
  	descriptionTD.appendChild(descriptionInput);
	nodeTR.appendChild(descriptionTD);

	var rarityTD = document.createElement("TD");
	var rarityInput = document.createElement("input");
	rarityInput.type = "text";
	rarityInput.id = (object[p]["Name"] + "-Rarity");
	rarityInput.value = object[p]["Rarity"];
  	rarityTD.appendChild(rarityInput);
	nodeTR.appendChild(rarityTD);

	var haveTD = document.createElement("TD");
	var haveInput = document.createElement("input");
	haveInput.type = "checkbox";
	haveInput.id = (object[p]["Name"] + "-Have");
	haveInput.checked = object[p]["Have"];
  	haveTD.appendChild(haveInput);
	nodeTR.appendChild(haveTD);

  	document.getElementById("customAmiiboTableEdit").appendChild(nodeTR);
	  }
}

  	var customAmiiboList = [];
		// Displays the amiibo objects onto the table
		function displayCustomAmiibo(object) {
			for(var p in object) {
				// Ignore the first element
				if(p === "0-Custom") {
					continue;
				}
				customAmiiboList.push(object[p]["Number"]);
				
				// Create a format HTML element for each amiibo
				// Create a TD section for Number
				var node = document.createElement("TR");
				var number = document.createElement("TD");
				var objectNumber = document.createTextNode(object[p]["Number"]);
				number.appendChild(objectNumber);
				node.appendChild(number);
				// Create a TD section for Name
				var name = document.createElement("TD");
				var objectName = document.createTextNode(object[p]["Name"]);
				name.appendChild(objectName);
				node.appendChild(name);
				// Create a TD section for the image
				var image = document.createElement("TD");
				var objectImage = document.createElement("img");
				objectImage.src = object[p]["Image"];
				objectImage.class = "amiiboImg";
				objectImage.id = "picture";
				objectImage.style.width = "100%";
				image.appendChild(objectImage);
				node.appendChild(image);
				// Create a TD section for Game Origin
				var gameOrigin = document.createElement("TD");
				var objectGameOrigin = document.createTextNode(object[p]["GameOrigin"]);
				gameOrigin.appendChild(objectGameOrigin);
				node.appendChild(gameOrigin);
				// Create a TD section for Date Release
				var dateRelease = document.createElement("TD");
				var objectDateRelease = document.createTextNode(object[p]["DateRelease"]);
				dateRelease.appendChild(objectDateRelease);
				node.appendChild(dateRelease);
				// Create a TD section for Wave
				var wave = document.createElement("TD");
				var objectWave = document.createTextNode(object[p]["Wave"]);
				wave.appendChild(objectWave);
				node.appendChild(wave);
				// Create a TD section for Exclusive
				var exclusive = document.createElement("TD");
				var objectExclusive = document.createTextNode(object[p]["Exclusive"]);
				exclusive.appendChild(objectExclusive);
				node.appendChild(exclusive);
				// Create a TD section for Description
				var description = document.createElement("TD");
				var objectDescription = document.createTextNode(object[p]["Description"]);
				description.appendChild(objectDescription);
				node.appendChild(description);
				// Create a TD section for Rarity
				var rarity = document.createElement("TD");
				var objectRarity = document.createTextNode(object[p]["Rarity"]);
				rarity.appendChild(objectRarity);
				node.appendChild(rarity);
				// Create a TD section for Ownership
				var have = document.createElement("TD");
				var objectHave = document.createElement("input");
				objectHave.type = "checkbox";
				objectHave.class = (object[p]["Number"] + "-" + object[p]["Name"]);
				objectHave.id = (object[p]["Name"] + "-Checked");
				objectHave.checked = object[p]["Have"];
				objectHave.onclick = function() {
					updateOwnershipCustom(this.class, authId);
				};
				have.appendChild(objectHave);
				node.appendChild(have);
				document.getElementById("customAmiiboTable").appendChild(node);
			}
		}


function waitForURLEdit() {
    if(downloadURL===null) {//we want it to match
        setTimeout(waitForURLEdit, 50);//wait 50 millisecnds then recheck
        return;
    }
    firebase.database().ref().child("users/" + authId + "/customList/" + number + "-" + name).set({
        DateRelease: date,
        Description: description,
        Exclusive: exclusive,
        GameOrigin: origin,
        Image: downloadURL,
        Name: name,
        Number: number,
        Rarity: rarity,
        Wave: wave,
        Have: have
    });
}
function waitToUploadEdit() {
	alert("waiting");
		if(uploaded!=1) {//we want it to match
        setTimeout(waitToUploadEdit, 50);//wait 50 millisecnds then recheck
        return;
    }
    alert("in");
    pictureCustomRef.getDownloadURL().then(function(url){
    	downloadURL = url;
    });
    waitForURLEdit();
}
var customCounter = 0;
var customSoFar = 0;
function countCustom(object){
	for(var p in object){
		customCounter++;
	}
}
function editAmiibo(object){
	for (var p in object) {
  			if(p === "0-Custom"){
  				continue;
  			}
  			//add all into database
  			downloadURL = null;
  			var file;
  			var image = document.getElementById(object[p]["Name"] + "-NewImage");
  			var imageOld = document.getElementById(object[p]["Name"] + "-Image");
  			if("files" in image) {
  				file = image.files[0];
  			} 
  			if(file == null){
  				var firebaseDeleteRef = firebase.database().ref().child("users").child(authId).child("customList").child(object[p]["Number"] + "-" +  object[p]["Name"]);
	  			firebaseDeleteRef.remove();

  				downloadURL = imageOld.src;
  				number = document.getElementById(object[p]["Name"] + "-Number").value;
			name = document.getElementById(object[p]["Name"] + "-Name").value;
			origin = document.getElementById(object[p]["Name"] + "-GameOrigin").value;
			date = document.getElementById(object[p]["Name"] + "-DateRelease").value;
			wave = document.getElementById(object[p]["Name"] + "-Wave").value;
			exclusive = document.getElementById(object[p]["Name"] + "-Exclusive").value;
			description = document.getElementById(object[p]["Name"] + "-Description").value;
			rarity = document.getElementById(object[p]["Name"] + "-Rarity").value;
			have = document.getElementById(object[p]["Name"] + "-Have").checked;
			waitForURLEdit();
			
  			}
  			else{
  				alert(file.name);
	  			var customStorageRef = firebase.storage().ref();
	  			var pictureRef = customStorageRef.child(file.name);
	  			pictureCustomRef = customStorageRef.child("Custom-Amiibo/" + authId + "/" + file.name);
  			pictureRef.name === pictureCustomRef.name;
		    pictureRef.fullPath === pictureCustomRef.fullPath;
		   	uploaded = 0;

		    pictureCustomRef.put(file).then(function(snapshot){
		    	uploaded = 1;
		    });

	  			number = document.getElementById(object[p]["Name"] + "-Number").value;
			name = document.getElementById(object[p]["Name"] + "-Name").value;
			origin = document.getElementById(object[p]["Name"] + "-GameOrigin").value;
			date = document.getElementById(object[p]["Name"] + "-DateRelease").value;
			wave = document.getElementById(object[p]["Name"] + "-Wave").value;
			exclusive = document.getElementById(object[p]["Name"] + "-Exclusive").value;
			description = document.getElementById(object[p]["Name"] + "-Description").value;
			rarity = document.getElementById(object[p]["Name"] + "-Rarity").value;
			have = document.getElementById(object[p]["Name"] + "-Have").checked;

		    
		    waitToUploadEdit();

			// remove all from database
	  			var firebaseDeleteRef = firebase.database().ref().child("users").child(authId).child("customList").child(object[p]["Number"] + "-" +  object[p]["Name"]);
	  			firebaseDeleteRef.remove();
	  			customSoFar++;
	  		}
  		}
  		if(customCounter === customSoFar){
  			window.location.href = "indexsignedin.html";
  		}
}

function editAmiiboClick() {
	firebaseCustomRef = firebase.database().ref().child("users").child(authId).child("customList");
	firebaseCustomRef.once("value",function(snapshot){
		countCustom(snapshot.val());
	});
	firebaseCustomRef.once("value",function(snapshot){
		editAmiibo(snapshot.val());
	});
}

		// Delect the amiibo object
		function checkDelete(){
			firebaseCustomRef = firebase.database().ref().child("users").child(authId).child("customList");
			firebaseCustomRef.once("value",function(snapshot){
				customObject(snapshot.val());
			});
		}

		// Customize the amiibo object
		function customObject(object){
			for(var p in object) {
				// Ignore the first element
				if(p === "0-Custom") {
					continue;
				}
				var checkbox = document.getElementById(object[p]["Name"] + "-Remove");
				if(checkbox.checked) {
  	  				var firebaseDeleteRef = firebase.database().ref().child("users").child(authId).child("customList").child(object[p]["Number"] + "-" +  object[p]["Name"]);
					firebaseDeleteRef.remove();
					location.reload();
				}
			}
		}

		// Displays the amiibo objects onto the table
		function printObject(object) {
			var out = '';
			for(var p in object) {
				// Ignore the first element
				if(p === "0-Custom"){
					continue;
				}
				// Create a format HTML element for each amiibo
				var node = document.createElement("TR");
				var remove = document.createElement("TD");
				var objectRemove = document.createElement("input");
				objectRemove.type = "checkbox";
				objectRemove.id = (object[p]["Name"] + "-Remove");
				objectRemove.checked = false;
				remove.appendChild(objectRemove);
				node.appendChild(remove);
				// Create a TD section for Number
  	  			var number = document.createElement("TD");
				var objectNumber = document.createTextNode(object[p]["Number"]);
  	  			number.appendChild(objectNumber);
  	  			node.appendChild(number);
				// Create a TD section for Name
				var name = document.createElement("TD");
				var objectName = document.createTextNode(object[p]["Name"]);
				name.appendChild(objectName);
				node.appendChild(name);
				// Create a TD section for the image
				var image = document.createElement("TD");
				var objectImage = document.createElement("img");
				objectImage.src = object[p]["Image"];
				objectImage.class = "amiiboImg";
				objectImage.id = "picture";
				objectImage.style.width = "100%";
				image.appendChild(objectImage);
				node.appendChild(image);
				// Create a TD section for Game Origin
				var gameOrigin = document.createElement("TD");
				var objectGameOrigin = document.createTextNode(object[p]["GameOrigin"]);
				gameOrigin.appendChild(objectGameOrigin);
				node.appendChild(gameOrigin);
				// Create a TD section for Date Release
				var dateRelease = document.createElement("TD");
				var objectDateRelease = document.createTextNode(object[p]["DateRelease"]);
				dateRelease.appendChild(objectDateRelease);
				node.appendChild(dateRelease);
				// Create a TD section for Wave
				var wave = document.createElement("TD");
				var objectWave = document.createTextNode(object[p]["Wave"]);
				wave.appendChild(objectWave);
				node.appendChild(wave);
				// Create a TD section for Exclusive
				var exclusive = document.createElement("TD");
				var objectExclusive = document.createTextNode(object[p]["Exclusive"]);
				exclusive.appendChild(objectExclusive);
				node.appendChild(exclusive);
				// Create a TD section for Description
				var description = document.createElement("TD");
				var objectDescription = document.createTextNode(object[p]["Description"]);
				description.appendChild(objectDescription);
				node.appendChild(description);
				// Create a TD section for Rarity
				var rarity = document.createElement("TD");
				var objectRarity = document.createTextNode(object[p]["Rarity"]);
				rarity.appendChild(objectRarity);
				node.appendChild(rarity);
				// Create a TD section for Ownership
				var have = document.createElement("TD");
				var objectHave = document.createElement("input");
				objectHave.type = "checkbox";
				objectHave.id = (object[p]["Name"] + "-Checked");
				objectHave.checked = object[p]["Have"];
				objectHave.disabled = true;
				have.appendChild(objectHave);
				node.appendChild(have);
				document.getElementById("customAmiiboTable").appendChild(node);
			}
		}


// Sign-Up Button is pressed
function signUpUserData(){
	// Collect values from the page
	//var username = document.querySelector('#username').value;
	var password = document.querySelector('#password').value;
	var repassword = document.querySelector('#repassword').value;
	var email = document.querySelector('#email').value;

	// Checks if password and re-password are properly similar
	if(password.localeCompare(repassword) == 0){
		// Working Email and Password sign-in (Check Authentication -> Users)
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			document.getElementById("sign-up-status").innerHTML = "Error: " + error.message;
		});

		// Authenticate user if user is signed in
		firebase.auth().onAuthStateChanged(function (user) {
			if(user) {
				alert("Successfully signed up!");
				writeNewUserData(password, user.uid);
				window.location.href='indexsignedin.html';
			} 
		});
	} else {
		// Indicates error for non-matching passwords
		document.getElementById("sign-up-status").innerHTML = "Error: The two passwords must match.";
	}
}
		// Sign-In Button is pressed
		function signInUserData(){
			// Collect values from the page
			//var username = document.querySelector('#username').value;
			var email = document.querySelector('#email').value;
			var password = document.querySelector('#password').value;

			// Sign-In User Authentication
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
				console.log(error.code);
				console.log(error.message);
				document.getElementById("sign-in-status").innerHTML = "Error: " + error.message;
			});

			// If there is a user session going on, redirect to "indexsignedin.html"
			firebase.auth().onAuthStateChanged(function (user) {
				if(user) {
					// User is signed in
					window.location.href='indexsignedin.html';
				}
			});
		}

// Google Login Button
function google_login_in(){
	var provider = new firebase.auth.GoogleAuthProvider(); 
	provider.addScope('https://www.googleapis.com/auth/plus.login');
	firebase.auth().signInWithPopup(provider).then(function(result) {
		var token = result.credential.accessToken;
		var user = result.user;
	}).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		var email = error.email;
		var credential = error.credential;
	});
}
// Sign-Out Button is pressed
function signOutUserData(){
	// Working Email and Password sign-out (Check Authentication -> Users)
	firebase.auth().signOut().then(function() {
		}, function(error) {
		alert(error.code);
		alert(error.message);
	});
	window.location.href='index.html';
}

// If the Back button is pressed
function backPressed() {
	firebase.auth().onAuthStateChanged(function (user) {
		// For add.html
		if(page.localeCompare("add.html") == 0){
        		if(user) {
        	    		// User is signed in
				window.location.href='indexsignedin.html';
        		} else {
        	    		// No user is signed in
        		}
		}
		// For delete.html
		if(page.localeCompare("delete.html") == 0){
        		if(user) {
            			// User is signed in
				window.location.href='indexsignedin.html';
        		} else {
            			// No user is signed in
        		}
		}
		// For indexdelete.html
		if(page.localeCompare("indexdelete.html") == 0){
        		if(user) {
            			// User is signed in, redirect to proper page
				window.location.href='indexsignedin.html';
        		} else {
            			// No user is signed in
        		}
		}
		// For indexedit.html
		if(page.localeCompare("indexedit.html") == 0){
        		if(user) {
            			// User is signed in, redirect to proper page
					window.location.href='indexsignedin.html';
        		} else {
            			// No user is signed in
        		}
		}
    	});
}
