//---------------   GLOBAL VARIABLES   ---------------

var MSG_NEED_EMAIL = "Please enter an e-mail address.";

//---------------     API FUNCTIONS    ---------------

function initUI() {
  if (ts.hasSelection())
    document.forms[0].TextFld.value = ts.getSelection(false, true);
  document.forms[0].TextFld.focus();
  document.forms[0].TextFld.select();
}

function onOK() {
  var value = document.forms[0].EmailFld.value;
  if (!value) {
    alert(MSG_NEED_EMAIL);
    document.forms[0].EmailFld.focus();
    return false;
  }
  else
    return true;
}

function objectTag() {
  var EmailFld = document.forms[0].EmailFld.value;
  var TextFld = document.forms[0].TextFld.value;
  if (!TextFld) TextFld = EmailFld;
  return '<a href="mailto:' + EmailFld + '">' + TextFld + '</a>';
}