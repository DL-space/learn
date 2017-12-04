//---------------   GLOBAL VARIABLES   ---------------

var TBL_HDR;  // instance of iconSelectorClass, used for selecting table header icons

//---------------     API FUNCTIONS    ---------------

function initUI() {
  // initialize Table Header selector, default value "none"
  TBL_HDR = new IconSelectorClass(new Array("none", "row", "col", "both"), "none");
  document.forms[0].Rows.focus();
  document.forms[0].Rows.select();
}

function objectTag() {
  var result = '<table';
  
  var Rows = document.forms[0].Rows.value;
  var Columns = document.forms[0].Cols.value;

  // change any negative or non-numeric row or column value into 1
  Rows = parseInt(Rows);
  Rows = (Rows > 0) ? Rows : 1;
  Columns = parseInt(Columns);
  Columns = (Columns > 0) ? Columns : 1;

  // header choice can be "none", "row", "column" or "both"
  var headerChoice = TBL_HDR.value;

  var tableCells = '<td>&nbsp;</td>\n';
  var tableScopeRowCells = '<th scope="row">&nbsp;</th>\n';
  var tableScopeColCells = '<th scope="col">&nbsp;</th>\n';
  var tableRow = '',tableContent='', tableRowScopeRow='', tableRowScopeCol='';

  // determine contents of 1 table row according to the number of columns
  // accessibility: first column value is added later; begin with the second column
  for ( i= 1; i < Columns; i++) {
	  tableRow += tableCells;
	  tableRowScopeRow += tableScopeRowCells;
	  tableRowScopeCol += tableScopeColCells;
  }

  // set the value for FirstTableRow and RestTableRow depending on header request
  if (headerChoice == 'row') {
    FirstTableRow = "<tr>\n" + tableScopeColCells + tableRowScopeCol + "</tr>\n";
    RestTableRow = "<tr>\n" + tableCells + tableRow + "</tr>\n";
  }
  else {
		if (headerChoice == 'col') {
      FirstTableRow = "<tr>\n"+ tableScopeRowCells + tableRow + "</tr>\n";
      RestTableRow = FirstTableRow;
		}
		else {
      if (headerChoice == 'both') {
        FirstTableRow = "<tr>\n" + tableScopeColCells + tableRowScopeCol + "</tr>\n";
        RestTableRow = "<tr>\n"+ tableScopeRowCells + tableRow + "</tr>\n";
      }
      else {
        FirstTableRow = "<tr>\n"+ tableCells + tableRow + "</tr>\n";
        RestTableRow = FirstTableRow;
      }
		}
  }

  tableContent += FirstTableRow;

  // determine number of table rows & concatenate rows together
  for (i = 1; i < Rows; i++)
    tableContent += RestTableRow;

  var Width = document.forms[0].Width.value;
  var unitChoice = document.forms[0].Units.selectedIndex;
  var Border = document.forms[0].Border.value;
  var cellSpacing = document.forms[0].Cellspace.value;
  var cellPadding = document.forms[0].Cellpad.value;
  var summaryStr = document.forms[0].Summary.value;
  var captionStr = document.forms[0].Caption.value;
  var alignCapChoice = document.forms[0].CaptionAlign.selectedIndex;
  var alignCaption = document.forms[0].CaptionAlign.options[alignCapChoice].value;

  // add percent or pixel values to opening tag, if applicable
  if (Width)
    result += ' width="' + Width + ((unitChoice == 0)? '%"' : '"');
  // add border value, if applicable
  if (Border)
    result += ' border="' + Border + '"';
  // add cellspacing value, if applicable
  if (cellSpacing)
    result += ' cellspacing="' + cellSpacing + '"';
  // add cellpadding value, if applicable
  if (cellPadding)
    result += ' cellpadding="' + cellPadding + '"';

  // add summary to table tag, if applicable 
  if (summaryStr != null && summaryStr != "") 
	  result += ' summary="' + summaryStr + '"';

  // add caption to table tag, if applicable
  var captionTag = '<caption';
  if (captionStr != null && captionStr != "") {
    (alignCaption == "default" || alignCaption == undefined) ? captionTag += '>' : captionTag += ' align="' + alignCaption + '">';
    result += '>\n' + captionTag + captionStr + '</caption>\n' + tableContent;
  }
  else
    result += '>\n' + tableContent;

  // strip extra space from table tag, if it exists
  var spaceIndex = result.length - 1
  if (escape(result.charAt(spaceIndex)) == '%20')
    result = result.substring(0, spaceIndex);

  result += '</table>';

  return result;
}

///--------------------------------------------------------------------
// CLASS:
//   IconSelectorClass
//
// DESCRIPTION:
//   This class is used to provide radio-button functionality to images.
//
// When clicking images in table cells, their cells will highlight. To
// find out which image is selected, get the value property of the object.
//
// To set it up, place images in table cells, name the table cells uniquely,
// and add onMouse handlers to each image that call the update method and
// pass the name of their table cells.
//
// PUBLIC PROPERTIES:
//   value (read-only) - the name of the table cell currently selected.
//
// PUBLIC FUNCTIONS:
//   update(value) - passed by the click handler to select a new cell.
//
// CONSTRUCTOR:
//   tableCellNames - an array of all table cell names to be used
//   initialName (optional) - initial cell to select (otherwise 1st)
//
//--------------------------------------------------------------------

function IconSelectorClass(tableCellNames, initialName) {
  // private properties
  this.selectedColor       = "#316AC5"; // background color for selected table cell
  this.unselectedColor     = "#CCCCCC"; // background color for unselected table cell (#9D9CA7 on table)
  this.selectedTextColor   = "#FFFFFF"; // color for selected text (white)
  this.unselectedTextColor = "#000000"; // color for unselected text (black)

  // find which is selected
  for (var i = 0; i < tableCellNames.length; i++) {
    if (document.getElementById(tableCellNames[i]).bgColor == this.selectedColor) {
      this.value = tableCellNames[i];
      break;
    }
  }

  // if didn't find it, initialize it
  if (!this.value)
    this.value = initialName;
}

IconSelectorClass.prototype.update = IconSelectorClass_update;

// update method. pass in a new value, one of the table cell names.
function IconSelectorClass_update(newValue) {
  if (this.value == newValue)
    return;

  // for the previously selected cell, change bgColor and font color to unselected colors
  document.getElementById(this.value).bgColor = this.unselectedColor;
  document.getElementById(this.value + "font").color = this.unselectedTextColor;

  // change the value to the new value
  this.value = newValue;

  // set the colors for the newly selected cell
  document.getElementById(this.value).bgColor = this.selectedColor;
  document.getElementById(this.value + "font").color = this.selectedTextColor;
}

//----------- END IconSelectorClass --------------