create or replace Package Body Ninja_Test AS

	Procedure Test_Win
	Is
	Begin
		Null;
	End;

	Procedure Test_Fail
	Is
	Begin
		Raise_Application_Error(-20999, 'Such Fail.  Much Sad..' );
	End;
	
End Ninja_Test;
