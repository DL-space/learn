
//---------------   GLOBAL VARIABLES   ---------------

var TEXT_TARGET;
var DOC_TARGETS = new Array();

//---------------    LOCAL FUNCTIONS   ---------------

function getTargets() {
  var result = '//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js,//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js';
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


//---------------     API FUNCTIONS    ---------------

function initUI() {
  TEXT_TARGET = document.forms[0].linkTarget;
}

function objectTag(){
  var result = '<script';

	if (TEXT_TARGET && TEXT_TARGET.value != "")
		result += ' src="' + TEXT_TARGET.value + '"';
    result += '></script>\r\n';
	  	
	return result;
}