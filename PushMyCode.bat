@echo off
set nowHr=%time:~0,2%
if %nowHr% LSS 10 set nowHr=0%nowHr:~1,1%

cd C:\Users\g4ru04\Desktop\CodeOfBen

git config --global user.email "g4ru04@gmail.com"
git config --global user.name "GrandPaBen"
git add .
echo.
git status -s
echo.
git commit -m %date:~0,4%%date:~5,2%%date:~8,2%_%nowHr%%time:~3,2%_BatchPush
echo.
git push https://github.com/g4ru04/CodeOfBen.git master
echo.
echo.
echo ### PUSH O V E R ###
echo PRESS ANY KEY TO CONTINUE...
pause > nul

REM git config --global user.email "g4ru04@gmail.com"
REM git push https://github.com/g4ru04/CodeOfBen.git master
REM ping 127.0.0.1 -n 5 -w 1000 > nul 
REM git commit -F Record.txt
REM git commit -m %date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%
REM git status
REM ping 127.0.0.1 -n 15 -w 1000 > nul