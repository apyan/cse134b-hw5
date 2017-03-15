// Initialize Firebase with the AmiiboDex specs
// AmiiboDex1 configs
/*var config = {

   apiKey: "AIzaSyD3p9hdIYoCSi72wUMbPT-JkIzXPf6Xmrc",
   authDomain: "amiibodex.firebaseapp.com",
   databaseURL: "https://amiibodex.firebaseio.com",
   storageBucket: "amiibodex.appspot.com",
   messagingSenderId: "582801923363"

};
firebase.initializeApp(config);
*/
var config = {
  apiKey: "AIzaSyC4kvaSISiSc-t_3Grn4r4lQ0ibVfefy3Y",
  authDomain: "amiibodex2.firebaseapp.com",
  databaseURL: "https://amiibodex2.firebaseio.com",
  storageBucket: "amiibodex2.appspot.com",
  messagingSenderId: "282900010964"
};
firebase.initializeApp(config);

var path1 = window.location.pathname;
var page1 = path1.split("/").pop();
if((page1.localeCompare("index.html") == 0) || (page1.localeCompare("") == 0)){
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('service-worker.js', { scope: './' })
        .then(function(r) {
          console.log('registered service worker');
        })
        .catch(function(whut) {
          console.error('uh oh... ');
          console.error(whut);
        });
       
      window.addEventListener('beforeinstallprompt', function(e) {
      });
    });
}
// Authenticate user if user is signed in
var path = window.location.pathname;
var page = path.split("/").pop();

var authId;
var firebaseCustomRef;
var customAmiiboListNumber = 0;
var currentCustomAmiiboListNumber = 0;
var customAmiiboList = [];
var firebaseAmiiboListRef = firebase.database().ref().child("original-amiibo-list");
var firebaseFastAmiiboListRef = firebase.database().ref().child("fast-amiibo-list");
var characters = [ "1-Mario", "2-Peach", "3-Yoshi", "4-DonkeyKong", "5-Link",
"6-Fox", "7-Samus", "8-WiiFitTrainer", "9-Villager", "10-Pikachu",
"11-Kirby", "12-Marth", "13-Zelda", "14-DiddyKong", "15-Luigi",
"16-LittleMac", "17-Pit", "18-CaptainFalcon", "19-Rosalina&Luma","20-Bowser",
"21-Lucario", "22-ToonLink", "23-Sheik", "24-Ike","25-Shulk",
"26-Sonic", "27-MegaMan", "28-KingDedede", "29-MetaKnight","30-Robin",
"31-Lucina", "32-Wario", "33-Charizard", "34-Ness"];
		   
var fastcharacters1 = ["1-Mario", "2-Peach", "3-Yoshi", "4-DonkeyKong", "5-Link",
"6-Fox", "7-Samus", "8-WiiFitTrainer", "9-Villager", "10-Pikachu"];
firebase.auth().onAuthStateChanged(function (user) {
	
	// For index.html, or default entrance
	if((page.localeCompare("index.html") == 0) || (page.localeCompare("") == 0)) {
		if(user) {
			// User is signed in, redirect to proper page
			window.location.href='indexsignedin.html';
		}
	}
	// For indexdelete.html
	else if(page.localeCompare("indexdelete.html") == 0) {
		if(user) {
			// User is signed in
			document.getElementById("greeting-line").innerHTML = "Welcome, " + user.email + "!";
			authId = user.uid;
			firebaseCustomRef = firebase.database().ref().child("users").child(authId).child("customList");
			firebaseCustomRef.once("value",function(snapshot){
				printObject(snapshot.val());
			});
			customAmiiboTable.style.display = "block";
		} else {
			// No user is signed in, redirect back to "index.html"
			window.location.href='index.html';
		}
	}
	// For indexedit.html
	else if(page.localeCompare("indexedit.html") == 0) {
		if(user) {
			authId = user.uid;
			// User is signed in
			document.getElementById("greeting-line").innerHTML = "Welcome, " + user.email + "!";
			var firebaseCustomRef = firebase.database().ref().child("users").child(authId).child("customList");

			firebaseCustomRef.once("value",function(snapshot){
				displayCustomEdit(snapshot.val());
			});
			customAmiiboTableEdit.style.display = "block";
		} else {
			// No user is signed in, then redirect to "index.html"
			window.location.href='index.html';
		}
	}
	// For indexsignedin.html
	else if(page.localeCompare("indexsignedin.html") == 0) {
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
			
			waitToFinish4();
    	}
    	else {
			// No user is signed in, redirect back to "index.html"
			window.location.href='index.html';
		}
	}
	// For signin.html
	else if(page.localeCompare("signin.html") == 0) {
		if(user) {
			var user = firebase.auth().currentUser;
			location.href = 'indexsignedin.html';
		}
	}
	// For signout.html
	else if(page.localeCompare("signout.html") == 0) {
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
var fastNumberOfAmiibo = 0;
function fastForEachFunction(item, index) {
	var itemArray = item.split("-");
	var itemNumber = itemArray[0];
	var itemName = itemArray[1];

	// Pulls the Number attribute
	var number = document.getElementById(itemName + "-NumberFast");
	var firebaseCharacterRef = firebaseFastAmiiboListRef.child(item);
	firebaseCharacterRef.child("Number").on('value', function(snapshot){
		number.innerHTML = snapshot.val();
	});
	// Pulls the Name attribute
	var name = document.getElementById(itemName + "-NameFast");
	firebaseCharacterRef.child("Name").on('value', function(snapshot){
		name.innerHTML = snapshot.val();
	});
	// Pulls the Image attribute
	var image = document.getElementById(itemName + "-ImageFast");
	firebaseCharacterRef.child("Image").on('value', function(snapshot){
		image.src = snapshot.val();
		image.onload = function(e) {
			fastNumberOfAmiibo = fastNumberOfAmiibo + 1;
		};
	});
	// Pulls the Game Origin attribute
	var gameOrigin = document.getElementById(itemName + "-GameOriginFast");
	firebaseCharacterRef.child("Game Origin").on('value', function(snapshot){
		gameOrigin.innerHTML = snapshot.val();
	});
	// Pulls the Date Release attribute
	var dateRelease = document.getElementById(itemName + "-DateReleaseFast");
	firebaseCharacterRef.child("Date Release").on('value', function(snapshot){
		dateRelease.innerHTML = snapshot.val();
	});
	// Pulls the Wave attribute
	var wave = document.getElementById(itemName + "-WaveFast");
	firebaseCharacterRef.child("Wave").on('value', function(snapshot){
		wave.innerHTML = snapshot.val();
	});
	// Pulls the Exclusive attribute
	var exclusive = document.getElementById(itemName + "-ExclusiveFast");
	firebaseCharacterRef.child("Exclusive").on('value', function(snapshot){
		exclusive.innerHTML = snapshot.val();
	});
	// Pulls the Description attribute
	var description = document.getElementById(itemName + "-DescriptionFast");
	firebaseCharacterRef.child("Description").on('value', function(snapshot){
		description.innerHTML = snapshot.val();
	});
	// Pulls the Rarity attribute
	var rarity = document.getElementById(itemName + "-RarityFast");
	firebaseCharacterRef.child("Rarity").on('value', function(snapshot){
		rarity.innerHTML = snapshot.val();
	});
}

// Pulls each attribute of the amiibo
function forEachFunction(item, index) {
	var itemArray = item.split("-");
	var itemNumber = itemArray[0];
	var itemName = itemArray[1];
	//alert("itemNumber " + itemNumber + "itemName " + itemName);

	// Pulls the Number attribute 
	var number = document.getElementById(itemName + "-Number");
	var firebaseCharacterRef = firebaseAmiiboListRef.child(item);
	firebaseCharacterRef.child("Number").on('value', function(snapshot){
		number.innerHTML = snapshot.val();
	});
	// Pulls the Name attribute
	var name = document.getElementById(itemName + "-Name");
	firebaseCharacterRef.child("Name").on('value', function(snapshot){
		name.innerHTML = snapshot.val();
	});
	// Pulls the Image attribute
	var image = document.getElementById(itemName + "-Image");
	firebaseCharacterRef.child("Image").on('value', function(snapshot){
		image.src = snapshot.val();
		image.onload = function(e) {
			numberOfAmiibo = numberOfAmiibo + 1;
		};
	});
	// Pulls the Game Origin attribute
	var gameOrigin = document.getElementById(itemName + "-GameOrigin");
	firebaseCharacterRef.child("Game Origin").on('value', function(snapshot){
		gameOrigin.innerHTML = snapshot.val();
	});
	// Pulls the Date Release attribute
	var dateRelease = document.getElementById(itemName + "-DateRelease");
	firebaseCharacterRef.child("Date Release").on('value', function(snapshot){
		dateRelease.innerHTML = snapshot.val();
	});
	// Pulls the Wave attribute
	var wave = document.getElementById(itemName + "-Wave");
	firebaseCharacterRef.child("Wave").on('value', function(snapshot){
		wave.innerHTML = snapshot.val();
	});
	// Pulls the Exclusive attribute
	var exclusive = document.getElementById(itemName + "-Exclusive");
	firebaseCharacterRef.child("Exclusive").on('value', function(snapshot){
		exclusive.innerHTML = snapshot.val();
	});
	// Pulls the Description attribute
	var description = document.getElementById(itemName + "-Description");
	firebaseCharacterRef.child("Description").on('value', function(snapshot){
		description.innerHTML = snapshot.val();
	});
	// Pulls the Rarity attribute
	var rarity = document.getElementById(itemName + "-Rarity");
	firebaseCharacterRef.child("Rarity").on('value', function(snapshot){
		rarity.innerHTML = snapshot.val();
	});
}

function waitToFinish4() {
	if(customAmiiboList.length == 0 && customAmiiboList.length == currentCustomAmiiboListNumber){
		setTimeout(waitToFinish4, 50);
		return;
	}
	else if(customAmiiboList.length != 0 && customAmiiboList.length != currentCustomAmiiboListNumber){
		setTimeout(waitToFinish4, 50);
		return;
	}
	customAmiiboTable.style.display = "block";
	$("#customAmiiboTable").DataTable();
}

function waitToFinish3() {
    if(numberOfAmiibo!=34) {//we want it to match
        setTimeout(waitToFinish3, 50);//wait 50 millisecnds then recheck
        return;
    }
    $("#fastTable").hide();
    var elem = document.getElementById("progress");
    elem.style.display="none";
    mainTable.style.display = "block";
    $("#mainTable").DataTable();
}
function waitToFinish2() {
    if(fastNumberOfAmiibo!=10) {//we want it to match
    	var elem = document.getElementById("bar");
    	elem.innerHTML = fastNumberOfAmiibo * 10 + "%";
    	elem.style.width = fastNumberOfAmiibo * 10 + "%";
        setTimeout(waitToFinish2, 50);//wait 50 millisecnds then recheck
        return;
    }
    var elem = document.getElementById("progress");
    elem.style.display="none";
    $("#fastTable").DataTable({
    	"paging": false,
    	"searching": false,
    	"info": false
    });
    $("#fastTable").show();
}
if((page.localeCompare("index.html") == 0) || (page.localeCompare("indexsignedin.html") == 0) || !page) {
	fastcharacters1.forEach(fastForEachFunction);
	waitToFinish2();
	characters.forEach(forEachFunction);
    waitToFinish3();
}


// Marks the Ownership
function markOwnership(item, index, userId) {
	// Skip the 0 index
	if(item === "SkipThis" ) {
		return;
	}
	var splitItem = item.split("-");
	// Validates Ownership
	var ownership = document.getElementById(splitItem[1] + "-Checked");
	var userOwnershipRef = firebase.database().ref().child("users").child(userId).child("originalList").child(splitItem[1]);
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

var uploaded = 0;
var backToIndex = 0;
var pictureCustomRef;
var pictureTime;
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
	showLoadingModal();
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
    	var customStorageRef = firebase.storage().ref();
        var pictureRef = customStorageRef.child(file.name);
        var d = new Date();
        pictureTime = d.getTime();
        pictureCustomRef = customStorageRef.child("Custom-Amiibo/" + authId + "/" + file.name + "-" + pictureTime); // add the date or time?

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

		currentCustomAmiiboListNumber = currentCustomAmiiboListNumber + 1;
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
	if(uploaded!=1) {//we want it to match
        setTimeout(waitToUploadEdit, 50);//wait 50 millisecnds then recheck
        return;
    }
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
			var customStorageRef = firebase.storage().ref();
			var pictureRef = customStorageRef.child(file.name);
			var d = new Date();
			pictureTime = d.getTime();
			pictureCustomRef = customStorageRef.child("Custom-Amiibo/" + authId + "/" + file.name + "-" + pictureTime); // add date or time
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
		window.location.href='indexsignedin.html';
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

// Modal JavaScript code
var loadingModal = document.getElementById("loadingModal");
function showLoadingModal(){
	loadingModal.style.display = "block";
}

var signInButton = document.getElementById("signInButton");
var signInModal = document.getElementById("signInModal");
function showSignInModal() {
	signInModal.style.display = "block";
}
function closeSignInModal() {
	signInModal.style.display = "none";
}

var signUpButton = document.getElementById("signUpButton");
var signUpModal = document.getElementById("signUpModal");
function showSignUpModal() {
	signUpModal.style.display = "block";
}
function closeSignUpModal() {
	signUpModal.style.display = "none";
}

var signOutButton = document.getElementById("signOutButton");
var signOutModal = document.getElementById("signOutModal");
function showSignOutModal() {
	signOutModal.style.display = "block";
}
function closeSignOutModal() {
	signOutModal.style.display = "none";
}

var addButton = document.getElementById("addButton");
var addModal = document.getElementById("addModal");
function showAddModal() {
	addModal.style.display = "block";
}

function closeAddModal() {
	addModal.style.display = "none";
}

window.onclick = function(event) {
	if(event.target == signInModal){
		signInModal.style.display = "none";
	}
	else if(event.target == signUpModal){
		signUpModal.style.display = "none";
	}
	else if(event.target == addModal){
		addModal.style.display = "none";
	}
	else if(event.target == signOutModal){
		signOutModal.style.display = "none";
	}
}
