// Initiate and writes a new user data
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
demoP = document.getElementById("demo");
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
	// User's original amiibo list
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
    if(valueCustom==null) {//we want it to match
        setTimeout(function() {waitToFinishCustom(character, userId)}, 50);//wait 50 millisecnds then recheck
        return;
    }
    var updates = {};
	updates["/users/" + userId + "/customList/" + character + "/Have"] = !valueCustom;
  	firebase.database().ref().update(updates); 
  	valueCustom = null;
}
function updateOwnershipCustom(character, userId) {
	// User's original amiibo list
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


fastcharacters1.forEach(forEachFunction);
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