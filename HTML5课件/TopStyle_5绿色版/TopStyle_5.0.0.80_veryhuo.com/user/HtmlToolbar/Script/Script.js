function objectTag() {
  var result = '';

  var scriptVal = document.forms[0].script.value;
  var noScriptVal = document.forms[0].noscript.value;
  var selInd = document.forms[0].Language.selectedIndex;
  var scriptLang = document.forms[0].Language.options[selInd].text;
  
  result = '<script type="text/' + scriptLang + '"></script>';

  if (scriptVal.length > 0) {
    if (scriptVal.charAt(scriptVal.length - 1) != '\n') {
		  scriptVal = scriptVal + '\n';
    }
		result = '<script type="text/' + scriptLang + '">\n' + scriptVal + '</script>';
  }

  if (noScriptVal.length > 0) {
    if (noScriptVal.charAt(noScriptVal.length - 1) != '\n') {
      noScriptVal = noScriptVal + '\n';
    }
   	result = result + '\n<noscript>\n' + noScriptVal + '</noscript>';
  }
  
  return result;
}
