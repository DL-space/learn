//---------------   GLOBAL CONSTANTS   ---------------

var SCHEMES = new Array("http://","https://", "file://", "ftp://", "gopher://", "mailto://", "news://", "nntp://", "rlogin://", "telnet://", "tn3270://", "wais://");

//---------------   GLOBAL VARIABLES   ---------------

var TEXT_TEXT;
var TEXT_PATH;
var TEXT_TARGET;
var TEXT_TITLE;
var TEXT_AKEY;
var TEXT_TABIX;

var DOC_TARGETS = new Array();

//---------------    LOCAL FUNCTIONS   ---------------

function getNamedAnchors(){
	var result = '';
  var dom = ts.getDocumentDOM();
  if (dom) {
    var arr = dom.getElementsByTagName('a');
    for (var i = 0; i < arr.length; i++) {
      aName = arr[i].getAttribute('name');
      if (aName) {
        if (result != '') result += ',';
        result += '#' + aName;
      }
    }
  }
  return result;
}

function getLinkText(theText){
	var result = "";
	for (var i = 0; i < SCHEMES.length; i++) {
		if (theText.indexOf(SCHEMES[i]) == 0) {
			result = theText;
			break;
		}
	}
	if (result == "") {
		if (theText.toLowerCase().indexOf('www.') == 0) {
			result = "http://" + theText;
		}
	}
	return result;
}

function getTargets() {
  var result = '_blank,_parent,_self,_top';
  var dom = ts.getDocumentDOM();
  if (dom) {
    var target = '';
    var links = dom.getElementsByTagName('a');
    for (var q = 0; q < links.length; q++) {
      target = links[q].getAttribute('target');
      if (target) {
        add = true;
        for (var y = 0; y < DOC_TARGETS.length; y++) {
          if (DOC_TARGETS[y] == target) {
            add = false;
            break;
          }
        }
        if (add)
          DOC_TARGETS.push(target);
      }
    }
    if (DOC_TARGETS.length > 0) {
      result += ',-';
      for (var p = 0; p < DOC_TARGETS.length; p++)
        result += ',' + DOC_TARGETS[p];
    }
  }
  return result;
}

function browseForFileURL(sDefault) {
  var namedAnchors = getNamedAnchors();
  if (namedAnchors) {
    var browse = 'Browse...';
    var anchor = ts.showPopupMenu(sDefault, namedAnchors + ',-,' + browse);
    if (anchor == browse)
      return ts.browseForFileURL(sDefault);
    else
      return anchor;
  }
  else
    return ts.browseForFileURL(sDefault);
}

//---------------     API FUNCTIONS    ---------------

function initUI() {
	TEXT_TEXT   = document.forms[0].linkText;
  TEXT_PATH   = document.forms[0].linkPath;
  TEXT_TARGET = document.forms[0].linkTarget;
	TEXT_TITLE  = document.forms[0].linkTitle;
	TEXT_AKEY   = document.forms[0].accessKey;
	TEXT_TABIX  = document.forms[0].tabIndex;

  if (ts.hasSelection()) {
	  // automatically populate the text field with the selected text, and
    // the link field with the selected text if it appears to be a link.
    var sSel = ts.getSelection(false, true);
    TEXT_TEXT.value = sSel;
    TEXT_PATH.value = getLinkText(sSel);
  }
  TEXT_TEXT.focus();
  TEXT_TEXT.select();
}

function objectTag(){
  var result = '<a href=';

  if (TEXT_PATH && TEXT_PATH.value != "")
	  result += '"' + TEXT_PATH.value + '"';
  else
    result += '"#"';

	if (TEXT_TABIX && TEXT_TABIX.value != "")
		result += ' tabindex="' + TEXT_TABIX.value + '"';

	if (TEXT_TITLE && TEXT_TITLE.value != "")
		result += ' title="' + TEXT_TITLE.value + '"';

	if (TEXT_AKEY && TEXT_AKEY.value != "")
		result += ' accesskey="' + TEXT_AKEY.value + '"';

	if (TEXT_TARGET && TEXT_TARGET.value != "")
		result += ' target="' + TEXT_TARGET.value + '"';

  if (TEXT_TEXT && TEXT_TEXT.value != "")
  	result += '>' + TEXT_TEXT.value + '</a>';
  else
    result += '>|</a>';
	  	
	return result;
}