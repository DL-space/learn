var TEXT_ID, TEXT_TEXT, LIST_ALIGN, TEXT_TTIP, CBOX_POSTBACK, TEXT_AKEY;

function initUI() {
  TEXT_ID = document.forms[0].idField;
  TEXT_TEXT = document.forms[0].textField;
  TEXT_TTIP = document.forms[0].toolTip;
  TEXT_AKEY = document.forms[0].aKey;
  CBOX_POSTBACK = document.forms[0].postBack;
  LIST_ALIGN = document.forms[0].textAlign;
  TEXT_ID.focus();
  TEXT_ID.select();
}

function objectTag() {
  var TAG = '<asp:RadioButton';
  
  if (TEXT_ID.value != "")
    TAG += ' id="' + TEXT_ID.value + '"';
  else
    TAG += ' id="|"';
    
  if (TEXT_TEXT.value != "") {
    if (TEXT_TEXT.value.indexOf('<') != -1)
      TAG += " Text='" + TEXT_TEXT.value + "'"
    else
      TAG += ' Text="' + TEXT_TEXT.value + '"';
  }

  if (TEXT_AKEY.value != "")
    TAG += ' AccessKey="' + TEXT_AKEY.value + '"';

  if (TEXT_TTIP.value != "")
    TAG += ' ToolTip="' + TEXT_TTIP.value + '"';

  if (CBOX_POSTBACK.checked)
    TAG += ' AutoPostBack="true"';

  if (LIST_ALIGN.options[LIST_ALIGN.selectedIndex].text != "")
    TAG += ' TextAlign="'+ LIST_ALIGN.options[LIST_ALIGN.selectedIndex].text + '"';

  TAG += ' runat="server" />';
  
  return TAG;
}