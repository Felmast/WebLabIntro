function changeViewPort(pos) {
		var view = document.getElementById("mainContainer");
		var goal = 0;
		goal -= pos*100;
		view.style.marginLeft = goal+"vw";
}