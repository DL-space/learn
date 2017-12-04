//---------------   GLOBAL VARIABLES   ---------------

var MSG_NEED_PHONE_NO = "Please enter a phone number.";

//---------------     API FUNCTIONS    ---------------

function initUI() {
  if (ts.hasSelection())
    document.forms[0].text.value = ts.getSelection(false, true);
  document.forms[0].text.focus();
  document.forms[0].text.select();
}

function onOK() {
  var value = document.forms[0].no.value;
  if (!value) {
    alert(MSG_NEED_PHONE_NO);
    document.forms[0].no.focus();
    return false;
  }
  else
    return true;
}

function objectTag() {
  var no = document.forms[0].no.value;
  var text = document.forms[0].text.value;
  if (!text) text = no;
  return '<a class="noeffect" href="tel:' + no + '">' + text + '</a>';
}