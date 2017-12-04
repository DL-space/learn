function getCloseTag() {
  if (ts.isXHTML())
    return ' />';
  else
    return '>';
}

function objectTag() {
	var theMovie = ts.browseForFileURL();

	if (theMovie) {
    theMovie = ts.urlEncode(theMovie);
    return '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" width="32" height="32">\n' + 
           '<param name="movie" value="' + theMovie + '"' + getCloseTag() + '\n' +
           '<param name="quality" value="high"' + getCloseTag() + '\n' +
           '<embed src="' + theMovie + '" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="32" height="32"></embed>\n' +
           '</object>';
	}
}