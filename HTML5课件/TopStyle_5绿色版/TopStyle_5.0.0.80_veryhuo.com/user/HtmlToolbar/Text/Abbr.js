//---------------   GLOBAL VARIABLES   ---------------

var TEXT_FULL;
var TEXT_LANG;
var MSG_NEED_FULL_TEXT = "Please enter the full text for the abbreviation.";

//---------------     API FUNCTIONS    ---------------

function initUI() {
  TEXT_FULL = document.forms[0].fullText;
	TEXT_LANG = document.forms[0].langAtt;
	TEXT_FULL.focus();
}

function onOK() {
	if (TEXT_FULL.value == "") {
		alert(MSG_NEED_FULL_TEXT);
		TEXT_FULL.focus();
    return false;
	}
  else
	  return true;
}

function objectTag() {
	var lang = '';
  
	if (TEXT_LANG.value != '')
		lang = ' lang="' + TEXT_LANG.value + '"';
	
  return '<abbr title="' + TEXT_FULL.value + '"' + lang + '>' + ts.getSelection(true) + '</abbr>';
}