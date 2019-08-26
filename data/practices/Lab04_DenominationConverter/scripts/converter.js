var denominations = ["Colon","Dollar","Euro","Yen","Rouble","Can Dollar","Yuan Renminbi","Rupee","Mexican Peso","Krone"];
var abbreviations = ["CRC","USD","EUR","JPY","RUB","CAD","CNY","INR","MXN","DKK"];
var conversionsToUs = [0.0016,0.903,1.00,0.0085,0.0137,0.6784,0.1275,0.0126,0.0454,0.1341];
var icons = ["costarica.png","usflag.png","euro.png","japanflag.png","russiaflag.png","canadianflag.png","chinaflag.png","indianflag.png","mexicanflag.png","danishflag.png"]
var usedCurrencies = [];

function load(){
	createDropdowns();
}

//Create the dropdownlists for currencies
function createDropdowns(){
	denominations.forEach(mainDropdown);
	updateAddableCurrencies();
}

//Fill the main currency list
function mainDropdown(item, index){
	var dlist = document.getElementById("mainDropdown");
	var listItem = document.createElement("div");
	listItem.className = "item";
	listItem.setAttribute("onclick", "javascript: selectCurrency("+index+");");
	listItem.innerHTML = "<img src='images/flags/"+icons[index]+"' class='itemImg'></img>"+"  "+item;
	dlist.appendChild(listItem);
}

//Fill the "add to table" currency list
function tableDropdown(item, index){
	//check if teh currency has been listed on the table
	if(usedCurrencies.includes(""+index)) return;
	var dlist = document.getElementById("tableDropdown");
	var listItem = document.createElement("option");
	listItem.value = index;
	listItem.innerHTML = item;
	dlist.appendChild(listItem);
}

//Update unused currencies list
function updateAddableCurrencies(){
	dlist = document.getElementById("tableDropdown");
	//Clear the contents of the list and add them again
	dlist.innerHTML = "<option value='-1'>select</option>";
	denominations.forEach(tableDropdown);
}


//Update main conversion currency
function selectCurrency(index){
	if(index < 0){return};
	mCurrencyName = document.getElementById("mainCurrency");
	mCurrencyName.innerHTML = denominations[index];
	//mCurrencyName.setAttribute("value", index+"");
	mCurrencyName.value = index;
	mCurrencyAbbr = document.getElementById("acronym");
	mCurrencyAbbr.innerHTML = abbreviations[index];
	mCurrencyValue = document.getElementById("currentInput");
	//mCurrencyValue.value = 1.00;
	updateValues();
}

//Add currency for html{
function addCurrencyFromList(){
	dlist = document.getElementById("tableDropdown");
	addCurrency(dlist.value);
}

//Add currency to table
function addCurrency(cIndex){
	//Check if the selected value is valid
	if(parseInt(cIndex) < 0){return;}
	
	convTable = document.getElementById("conversionTable");
	//Store the dropdown list
	temp = document.getElementById("addCurrency");
	//Remove the dropdown list
	convTable.removeChild(convTable.childNodes[convTable.childElementCount-1]);
	
	//Create the table row
	nItem = document.createElement("tr");
	nItem.id = "trCurrency"+ cIndex;
	nItem.value = cIndex;
	nItem.className = convTable.childElementCount%2==0? "tr1":"tr2";
	
	//Create the first cell, with the buttons
	//The "select" button selects the currency, removes the row that it belongs to and adds the currently selected currency to the table
	td1 = document.createElement("td");
	td1.innerHTML = "<button onclick='removeCurrency("+"`"+nItem.id+"`"+
					")' class='tableButton'><img src='images/delete.png' class='width tableButtonImg'></button>"+
					"<button class='tableButton' onclick='swap(`"+nItem.id+
					"`)'><img src='images/UpArrow.png' class=' width'></button>"+
					//"<img src='images/flags/"+icons[cIndex]+"' class='smallIcon'></img>"+
					denominations[cIndex];
	nItem.appendChild(td1);
	
	td2 = document.createElement("td");
	td2.className = "middle";
	td2.innerHTML = "<img src='images/flags/"+icons[cIndex]+"' class='smallIcon'></img>"+"  "+abbreviations[cIndex];
	nItem.appendChild(td2);
	
	td3 = document.createElement("td");
	currentIndex = parseInt(document.getElementById("mainCurrency").value);
	targetIndex = parseInt(cIndex);
	td3.innerHTML = getConversionRate(currentIndex,targetIndex);
	nItem.appendChild(td3);
	
	td4 = document.createElement("td");
	td4.innerHTML = 1.00;
	nItem.appendChild(td4);
	
	//Add the table row and the dropdown list
	convTable.appendChild(nItem);
	convTable.appendChild(temp);
	
	usedCurrencies.push(cIndex);
	updateAddableCurrencies();
	updateValues();
}

//Swap the current main currency with a currency on the table
function swap(id){
	oldIndex = document.getElementById("mainCurrency").value;
	newIndex = parseInt(document.getElementById(id).value);
	removeCurrency(id);
	selectCurrency(newIndex);
	if(usedCurrencies.includes(""+oldIndex) || typeof oldIndex === "undefined") return;
	addCurrency(""+oldIndex);
}

//Remove currency from table
function removeCurrency(id){
	row = document.getElementById(id);
	//Remove the index out of the used currencies
	usedCurrencies = removeFromArray(parseInt(row.value),usedCurrencies);
	//Remove the row of the currency
	row.parentNode.removeChild(row);
	//Add the currency back to the dropdown list for adding
	updateAddableCurrencies();
	updateValues();
}

function removeFromArray(id, arr){
	temp = arr.filter(function(value, index, arr){
		return 	value != id;
	});
	return temp;
}

//Convert values
function updateValues(){
	cTable = document.getElementById("conversionTable");
	itemList = cTable.children;

	
	//Main value for conversion
	mainIndex = parseInt(document.getElementById("mainCurrency").value);
	money = parseFloat(document.getElementById("currentInput").value);
	mainValue = conversionsToUs[mainIndex]*money;
	
	for (i = 0; i < itemList.length; i++) {
		item = itemList[i];
		if(item.tagName == "TBODY" || item.id == "addCurrency") {continue;}
		item.className = i%2==0? "tr1":"tr2";
		itemIndex = parseInt(item.value);
		
		updateValue(item,mainValue,itemIndex);
		updateConversionRates(item,mainIndex,itemIndex);
	}
}

//Update money conversion
function updateValue(item, money, index){
	item.children[3].innerHTML = addCommas(""+getConvertedValue(money,index));
}

//Update conversion rates
function updateConversionRates(item,mainIndex,index){
	item.children[2].innerHTML = addCommas(""+getConversionRate(mainIndex,index));
}


//Get the monetary value after conversion
function getConvertedValue(money, targetIndex){
	return (money/conversionsToUs[targetIndex]).toFixed(2);
}
//Get conversion rate between 2 currencies
function getConversionRate(current, target){
	toBirdge = conversionsToUs[current]/conversionsToUs[target];
	return toBirdge.toFixed(4);
}

//Add thousand separator commas to string number
//By yovanny olarte
function addCommas(nStr){
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? ',' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

//Remove all currencies from the table
function clearTable(){
	cTable = document.getElementById("conversionTable");
	itemList = cTable.childNodes;
	if(cTable.childElementCount<=2){return;}
	//Store the header and "add currency" rows
	header = itemList[0];
	footer = itemList[cTable.childElementCount-1];
	
	
	//Clear the table and used currencies
	cTable.innerHTML = "";
	usedCurrencies = [];
	
	//Add the header and "add currency" rows back to the table 
	cTable.appendChild(header);
	cTable.appendChild(footer);
	
	updateAddableCurrencies();
}

//Add all currently avaliable currencies to the table
function addAllCurrencies(){
	for(k = 0; k < denominations.length; k += 1){
		if(usedCurrencies.includes(""+k)){continue;}
		addCurrency(""+k);
	}
}