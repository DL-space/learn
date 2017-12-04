function initUI() {
  if (ts.hasSelection())
    document.forms[0].anchorname.value = ts.getSelection(false, true);
  document.forms[0].anchorname.focus();
  document.forms[0].anchorname.select();
}

function onOK() {
  var value = document.forms[0].anchorname.value;
  if (value.search(/\W/) != -1) {
    alert(MSG_InvalidName);
    document.forms[0].anchorname.value = value.replace(/\W/g, "");
    document.forms[0].anchorname.focus();
    return false;
  }
  else
    return true;
}

function objectTag() {
  var value = document.forms[0].anchorname.value;

  var id = '';
  if (value != '' && ts.isXHTML())
    id = ' id="' + value + '"';
  
  var pipe = '';
  if (!value)
    value = '|'
  else
    pipe = '|';

  return '<a name="' + value + '"' + id + '>' + pipe + '</a>';
}