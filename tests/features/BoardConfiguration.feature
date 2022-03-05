
Feature: Board configuration 

    Scenario: Select project
        Given user "username" is logged in
        When the project "project" is selected
        Then the query selector should be loaded with list items

    Scenario: Select project and query
        Given user "username" is logged in
        When the project "project" is selected
        And the query "query" is selected
        Then the kanban board of the "project" should be loaded with the "query"
        And columns should be visible
        And cards should be visible

