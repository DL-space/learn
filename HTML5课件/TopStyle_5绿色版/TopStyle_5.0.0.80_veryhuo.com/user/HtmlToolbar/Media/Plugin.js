function objectTag() {
  var src = ts.browseForFileURL();
  if (src) {
    src = ts.urlEncode(src);
    return '<embed src="' + src + '" width="32" height="32">' + ts.getSelection(true) + '</embed>';
  } 
}