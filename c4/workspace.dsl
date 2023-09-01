workspace {

	name "Redmine Kanban"
	description "Simple Kanban board for Redmine"

	!docs "docs/landscape"
	!adrs "docs/decisions"
	!identifiers hierarchical

    model {
        user = person "User" {
            description "A user of the Redmine ticketing system"
        }

        kanban = softwareSystem "Redmine Kanban" {
            description "Advanced frontend for Redmine"
            tags "spotlight"

            !include kanban.dsl
        }

        redmine = softwareSystem "Redmine" {
            description "A ticketing system"
        }

        user -> kanban "Uses"
        user -> redmine "Uses"
        kanban -> redmine "Uses"
    }

    views {
        systemContext kanban "Overview" {
            include *
        }

        container kanban "RedmineKanban" {
            include *
        }

   		styles {
			element "Person" {
				shape Person
			}
		}

   		styles {
			element "Software System" {
				shape Hexagon
			}
		}

   		styles {
			element "spotlight" {
				shape Hexagon
				background #ffaaaa
				color #ffffff
			}
		}

    }

}