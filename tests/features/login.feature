Feature: Login

   Scenario: Succesful login with API key
      Given the login page is loaded
      When user "Ádám Kovács" logs in with API key
      Then the select project page should be loaded

   Scenario: Succesful login with username and password
      Given the login page is loaded
      When user "Ádám Kovács" logs in with username and password
      Then the select project page should be loaded

   Scenario: Unsuccesful login with API key
      Given the login page is loaded
      When a user with wrong API key logs in
      Then a login error message appears

   Scenario: Unsuccesful login with username and password
      Given the login page is loaded
      When a user with username and password
      Then a login error message appears

   Scenario: Unsuccesful login with empty fields
      Given the login page is loaded
      When the login button pressed
      Then a login error message appears