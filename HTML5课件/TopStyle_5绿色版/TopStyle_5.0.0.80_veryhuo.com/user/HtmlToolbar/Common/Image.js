function objectTag() {
  var result = '';
  result = ts.browseForFileURL(result, true, 'Select Image File');
  if (result) {
    var imgSize = ts.getImageSize(result);
	result = '<img src="' + result + '" alt=""';
    if (imgSize)
      result += ' width="' + imgSize[0] + '" height="' + imgSize[1] + '"';
    if (ts.isXHTML()) result += ' /';
    result += '>';
  }
  return result;
}