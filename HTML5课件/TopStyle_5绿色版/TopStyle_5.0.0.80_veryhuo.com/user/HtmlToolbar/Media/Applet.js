function objectTag() {
  var result = '';
  
  var classname, newpath;
  
  var path = ts.browseForFileURL();

  if (path) {
    var breakpoint = path.lastIndexOf("/");
    if (breakpoint > 0) {
      var newpath = path.substring(0, breakpoint);
      classname = path.substring(breakpoint + 1, path.length);
      result = '<applet code="' + classname + '" codebase= "' + newpath + '" width="32" height="32">' + ts.getSelection(true) + '</applet>';
    }
    else
      result = '<applet code="' + path + '" width="32" height="32">' + ts.getSelection(true) + '</applet>';
  }

  return result;
}