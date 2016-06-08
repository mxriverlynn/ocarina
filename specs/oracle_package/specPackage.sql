/* tables */

CREATE TABLE "XE"."Z$_NINJA_TEST_1" 
   (	"CREATED" DATE DEFAULT sysdate
   );

CREATE TABLE "XE"."Z$_NINJA_TEST_2" 
   (	"CREATED" DATE DEFAULT sysdate
   );

/* package definition */

create or replace Package Ninja_Test AS

	Procedure Test_Win;

	Procedure Test_Fail;
	
	Procedure Insert_1;
	
	Procedure Insert_2;
	
	Procedure Truncate_Test_Tables;
	
End Ninja_Test;

/* package body */
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
	
	Procedure Insert_1
	Is
	Begin
		Insert into 
			Z$_ninja_test_1
		(
			Created
		)
		Values
		(
			Sysdate
		);
	End Insert_1;
			
	
	Procedure Insert_2
	Is
	Begin
		Insert into 
			Z$_ninja_test_2
		(
			Created
		)
		Values
		(
			Sysdate
		);
	End Insert_2;
	
	Procedure Truncate_Test_Tables
	Is
	Begin
		Execute Immediate 'Truncate Table Z$_Ninja_Test_1';
		Execute Immediate 'Truncate Table Z$_Ninja_Test_2';
	End Truncate_Test_Tables;		
	
End Ninja_Test;
