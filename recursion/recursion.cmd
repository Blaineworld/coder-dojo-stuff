::This will actually recur forever, until you Ctrl+C it.
::You know, virtual memory and all.

@echo OFF
set /A iteration=%1+1
echo Iteration #%iteration%
%0 %iteration%