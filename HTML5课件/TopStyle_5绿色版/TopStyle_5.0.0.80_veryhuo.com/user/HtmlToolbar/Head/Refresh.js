function initUI() {
  document.forms[0].Seconds.focus();
}

function objectTag() {
  var delay = document.forms[0].Seconds.value;
	if (!delay) delay = 0;
  var target = (document.forms[0].Target[0].checked) ? delay + ';URL=' + document.forms[0].URL.value : delay;
  var result = '<meta http-equiv="refresh" content="' + target + '"';
  if (ts.isXHTML()) result += ' /';
  result += '>';
  return result;
}