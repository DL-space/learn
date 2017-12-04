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
    return '<object classid="clsid:166B1BCA-3F9C-11CF-8075-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/director/sw.cab#version=8,5,0,0" width="32" height="32">\n' +
           '<param name="src" value="' + theMovie + '"' + getCloseTag() + '\n' +
           '<embed src="' + theMovie + '" pluginspage="http://www.macromedia.com/shockwave/download/" width="32" height="32"></embed>\n' +
           '</object>';
	}
}