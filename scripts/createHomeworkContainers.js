function createHomeworkContainers(filename) {
    var container = document.getElementById("homeworkContainer");
	var json = loadJSON(
		function(response) {
		  // Parse JSON string into object
			json = JSON.parse(response);
			var newHomework = document.createElement('details');
			newHomework.className = 'homework';
			newHomework.innerHTML = 
						'<summary class="homeworkSummary">'+ json.name +
						'<div style="text-align:right">Fecha: '+json.date+
						'</div></summary><p>Descripcion: <br>'+json.description+'</p>'+
						'<button class="downloadButton" type="submit" onclick="window.open('+"'"+'data/homeworks/'+json.filename+"'"+')">Ver archivo</button>'+
						'<embed src="data/homeworks/'+json.filename+'" class="textFile">'
			container.appendChild(newHomework);
		 }, filename);
}

function createHomeworkContainers2(json) {
    var container = document.getElementById("homeworkContainer");
	var newHomework = document.createElement('details');
	newHomework.className = 'homework';
	newHomework.innerHTML = 
				'<summary class="homeworkSummary">'+ json.name +
						'<div style="text-align:right">Fecha: '+json.date+
						'</div></summary>'+
						'<div class="padding5px">'+
						'<p>Descripcion: <br>'+json.description+'</p>'+
						'<button class="downloadButton" type="submit" onclick="window.open('+"'"+'data/homeworks/'+json.filename+"'"+')">Ver archivo<img src="images/downloadButton.svg" class="smallIcon"></button>'+
						'<embed src="data/homeworks/'+json.filename+'" class="textFile">'+
						'</div>'
	container.appendChild(newHomework);
}

function loadJSON(callback, url) {   
	
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }