import Api from '@/services/Api'

export default {
  getRedmineUrl() {
    return Api().get("redmine_url")
  },
  getUser(apiKey) {
    return Api().get("users/current.json", {
      headers: {
        'X-Redmine-API-Key': apiKey
      }
    })
  },
  getProjects(apiKey, offset) {
    return Api().get('projects.json', {
      headers: {
        'X-Redmine-API-Key': apiKey
      },
      params: {
        'limit': 100,
        'offset': offset
      }
    })
  },
  getProjectQueries(apiKey, offset) {
    return Api().get('queries.json', {
      headers: {
        'X-Redmine-API-Key': apiKey
      },
      params: {
        'limit': 100,
        'offset': offset
      }
    })
  },
  getIssuesForProject(apiKey, queryId, projectId, offset) {
    return Api().get('issues.json', {
      headers: {
        'X-Redmine-API-Key': apiKey
      },
      params: {
        'project_id' : projectId,
        'query_id' : queryId,
        'limit': 100,
        'offset': offset
      }
    })
  },
  getKanbanConfigTracker(apiKey) {
    return Api().get('trackers.json', {
      headers: {
        'X-Redmine-API-Key': apiKey
      }
    })
  },
  getKanbanConfig(apiKey, projectId, trackerID) {
    return Api().get('issues.json', {
      headers: {
        'X-Redmine-API-Key': apiKey
      },
      params: {
        'project_id': projectId,
        'tracker_id': trackerID,
        'limit': 100
      }
    })
  },
  getRedmineStatuses(apiKey, offset) {
    return Api().get('issue_statuses.json', {
      headers: {
        'X-Redmine-API-Key': apiKey
      },
      params: {
        'limit': 100,
        'offset': offset
      }
    })
  },
  updateIssueStatus(apiKey, issueId, statusId) {
    return Api().put(`issues/${issueId}.json`, {
      "issue": {
        "status_id": statusId
      }
    },
    {
      headers: {
        'X-Redmine-API-Key': apiKey
      }
    })
  },
  getUserByPassword(user) {
    return Api().post('login', user)
  }
}
