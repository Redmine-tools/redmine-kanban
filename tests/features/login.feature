Feature: Login

   Scenario: Succesful login
      Given the login page is loaded
      When user "Ádám Kovács" logs in
      Then the select project page should be loaded

   Scenario: Unsuccesful login
      Given the login page is loaded
      When a user with wrong API key logs in
      Then a login error message appears