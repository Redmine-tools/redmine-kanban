client = container "Redmine Kanban" {
	technology "Vue.js"
	description "Advanced SPA frontend for Redmine"
	tags frontend
}

backend = container "Redmine Connector" {
	technology "Node.js"
	description "Simple proxy for Redmine API"
}

client -> backend "API requests"
