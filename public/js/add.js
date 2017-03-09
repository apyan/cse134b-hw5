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