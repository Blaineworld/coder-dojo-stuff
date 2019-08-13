' WARNING: If you run this with WScript, you'll be completely
' to terminate it without using Task Manager until it runs out of memory.

' Due to this, you should use CScript instead.

Function recur(iteration)
	WScript.Echo "Iteration #" + CStr(iteration)
	recur(iteration + 1)
End Function

recur(1)