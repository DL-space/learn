function initUI() {
  document.forms[0].variable.focus();
}

function objectTag() {
  var result = '';
  var SELECT = document.forms[0].variable;
  if (SELECT && (SELECT.selectedIndex > -1)) {
    result = 'Request.ServerVariables("' + SELECT.options[SELECT.selectedIndex].text + '")';
    if (document.forms[0].wrap.checked) result = '<%= ' + result + ' %>';
  }
	return result;
}