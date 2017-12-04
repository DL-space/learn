Sub initUI() 
  document.forms(0).rs.focus()
End Sub

Function objectTag() 
  objectTag = "do while not "& document.forms(0).rs.value & ".eof" & vbcrlf
  objectTag = objectTag & ts.getSelection(true) & vbcrlf
  objectTag = objectTag &  document.forms(0).rs.value & ".movenext" & vbcrlf
  objectTag = objectTag & "loop" & vbcrlf

  If document.forms(0).asptags.checked Then
  objectTag = "<% " & "do while not "& document.forms(0).rs.value & ".eof %>" & vbcrlf
  objectTag = objectTag & ts.getSelection(true) & vbcrlf
  objectTag = objectTag & "<% " & document.forms(0).rs.value & ".movenext" & vbcrlf
  objectTag = objectTag & "loop %>" & vbcrlf
  End If
  
End Function