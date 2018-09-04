@echo off
if "%cd:CodeOfBen=%"=="%cd%" (
	mkdir CodeOfBen
	cd CodeOfBen
	git init
) else echo Below CodeOfBen

REM mkdir CodeOfBen
REM cd CodeOfBen

git pull https://github.com/g4ru04/CodeOfBen.git master
git log -1 --stat

echo ### PULL O V E R ###
echo PRESS ANY KEY TO CONTINUE...
pause > nul