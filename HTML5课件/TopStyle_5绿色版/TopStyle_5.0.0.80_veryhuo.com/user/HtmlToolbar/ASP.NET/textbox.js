var TEXT_ID, TEXT_TEXT, TEXT_COLS, TEXT_ROWS, TEXT_TTIP, TEXT_MAXLEN, CBOX_POSTBACK, LIST_MODE;

function initUI() {
  TEXT_ID = document.forms[0].idField;
  TEXT_TEXT = document.forms[0].textField;
  TEXT_TTIP = document.forms[0].toolTip;
  TEXT_COLS = document.forms[0].cols;
  TEXT_ROWS = document.forms[0].rows;
  TEXT_MAXLEN = document.forms[0].maxLen;
  CBOX_POSTBACK = document.forms[0].postBack;
  LIST_MODE = document.forms[0].textMode;
  TEXT_ID.focus();
  TEXT_ID.select();
}

function objectTag() {
  var TAG = '<asp:TextBox';
  
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

  if (TEXT_ROWS.value != "")
    TAG += ' Rows="' + TEXT_ROWS.value + '"';

  if (TEXT_COLS.value != "")
    TAG += ' Columns="' + TEXT_COLS.value + '"';

  if (TEXT_TTIP.value != "")
    TAG += ' ToolTip="' + TEXT_TTIP.value + '"';

  if (TEXT_MAXLEN.value != "")
    TAG += ' MaxLength="' + TEXT_MAXLEN.value + '"';

  if (CBOX_POSTBACK.checked)
    TAG += ' AutoPostBack="true"';

  if (LIST_MODE.options[LIST_MODE.selectedIndex].text != "")
    TAG += ' TextMode="' + LIST_MODE.options[LIST_MODE.selectedIndex].text + '"';

  TAG += ' runat="server" />';
  
  return TAG;
}