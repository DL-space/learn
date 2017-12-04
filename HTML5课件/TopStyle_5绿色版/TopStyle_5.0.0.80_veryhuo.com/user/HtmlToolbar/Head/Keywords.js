function initUI() {
  if (ts.hasSelection())
    document.forms[0].Keywords.value = ts.getSelection(false, true);
  document.forms[0].Keywords.focus();
  document.forms[0].Keywords.select();
}

function objectTag() {
  var keywords = document.forms[0].Keywords.value;
  if (!keywords) keywords = '|';
  var result = '<meta name="keywords" content="' + keywords + '"';
  if (ts.isXHTML()) result += ' /';
  result += '>';
  return result;
}