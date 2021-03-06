/*!
 * Iconerator v1.4.1 (https://github.com/zakbell/iconerator)
 * Copyright 2015-2018 Zak Bell
 * Licensed under GNU General Public License v3.0 (https://github.com/zakbell/iconerator/blob/master/LICENSE)
 */

#target photoshop

iconerator();

function iconerator() {
	// pre-flight
	var startState = app.activeDocument.activeHistoryState; // save for undo
	var initialPrefs = app.preferences.rulerUnits; // save prefs
	app.preferences.rulerUnits = Units.PIXELS; // use pixels

	// base document width and height (@1x)
	var dw = app.activeDocument.width.toString().replace(/[^\d]/g, ''); // base document width
	var dh = app.activeDocument.height.toString().replace(/[^\d]/g, ''); // base document height

	// select root folder
	var path = Folder.selectDialog("Select folder to save");

	// make Android folders
	var dirxxxhdpi = Folder(path + "/android/drawable-xxxhdpi");
	if(!dirxxxhdpi.exists) dirxxxhdpi.create();
	var dirxxhdpi = Folder(path + "/android/drawable-xxhdpi");
	if(!dirxxhdpi.exists) dirxxhdpi.create();
	var dirxhdpi = Folder(path + "/android/drawable-xhdpi");
	if(!dirxhdpi.exists) dirxhdpi.create();
	var dirhdpi = Folder(path + "/android/drawable-hdpi");
	if(!dirhdpi.exists) dirhdpi.create();
	var dirmdpi = Folder(path + "/android/drawable-mdpi");
	if(!dirmdpi.exists) dirmdpi.create();

	// make iOS folder
	var dirios = Folder(path + "/ios");
	if(!dirios.exists) dirios.create();

	// config Android files
	iconerate(dirxxxhdpi,dw*4,dh*4,dw,dh,'dp','');
	iconerate(dirxxhdpi,dw*3,dh*3,dw,dh,'dp','');
	iconerate(dirxhdpi,dw*2,dh*2,dw,dh,'dp','');
	iconerate(dirhdpi,dw*1.5,dh*1.5,dw,dh,'dp','');
	iconerate(dirmdpi,dw,dh,dw,dh,'dp','');

	// config iOS files
	iconerate(dirios,dw,dh,dw,dh,'pt','');
	iconerate(dirios,dw*2,dh*2,dw,dh,'pt','@2x');
	iconerate(dirios,dw*3,dh*3,dw,dh,'pt','@3x');

	app.preferences.rulerUnits = initialPrefs; // restore prefs

	alert("Iconerated!");
}

function iconerate(dir,pxW,pxH,baseW,baseH,unit,size) {
	// icon name (use selected layer name, force lowercase, replace characters not a-z or 0-9 with grouped underscore [Android resources can only contain characters 'a-z', '0-9', and undersores '_'])
	var iconame = app.activeDocument.activeLayer.name.toLowerCase().replace(/([^a-z|0-9])+/g, '_');

	// export options
	var expops, file;
	expops = new ExportOptionsSaveForWeb();
	expops.format = SaveDocumentType.PNG;
	expops.PNG8 = false; 
	expops.transparency = true;
	expops.interlaced = 0;
	expops.includeProfile = false;
	expops.optimized = true;

	// dimensions output for file name (baseW x baseH if unequal, else baseH-only if square)
	var dimensions = baseW + "x" + baseH;
	if (baseW == baseH) {
		dimensions = baseH;
	}

	// duplicate, resize, name, and export
	var tempfile = app.activeDocument.duplicate(); // duplicate temporary document
	tempfile.resizeImage(pxW + "px",pxH + "px"); // resize document
	pngfile = new File(dir + "/my_" + iconame + "_" + dimensions + unit + size + ".png"); // create, name file
	tempfile.exportDocument(pngfile, ExportType.SAVEFORWEB, expops); // export file

	tempfile.close(SaveOptions.DONOTSAVECHANGES); // close duplicate document (destroy the evidence!)
}
