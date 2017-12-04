function initUI() {
  if (ts.hasSelection())
    document.forms[0].Description.value = ts.getSelection(false, true);
  document.forms[0].Description.focus();
  document.forms[0].Description.select();
}

function objectTag() {
  var desc = document.forms[0].Description.value;
  if (!desc) desc = '|';
  var result = '<meta name="description" content="' + desc + '"';
  if (ts.isXHTML()) result += ' /';
  result += '>';
  return result;
}