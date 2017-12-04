//---------------   GLOBAL VARIABLES   ---------------

var TEXT_LEGEND;

//---------------     API FUNCTIONS    ---------------

function initUI() {
  TEXT_LEGEND = document.forms[0].legendField;

  if (ts.hasSelection()) {
	  TEXT_LEGEND.value = ts.getSelection(false, true);
		TEXT_LEGEND.select();
  }
  
  TEXT_LEGEND.focus();
}

function objectTag(){
	var result = '<fieldset>' + '<legend>';
	
	if (TEXT_LEGEND.value)
    result += TEXT_LEGEND.value 
  else
    result += ts.getSelection(true); 
	
  result += '</legend>' + '</fieldset>';

	return result;
}