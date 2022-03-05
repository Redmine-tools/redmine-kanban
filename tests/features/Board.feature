
    Feature: Kanban board functions
    
    Scenario: Check information popup of a card
        Given user "username" is logged in
        And the project "project" with the query "query" is loaded
        When a card is selected
        Then an information popup should be visible

