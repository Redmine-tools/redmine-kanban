import Api from '@/services/Api';

export default {
  getRedmineUrl() {
    return Api().get("redmine_url");
  },
  getUser(apiKey) {
    return Api().get("users/current.json", {
      headers: {
        "X-Redmine-API-Key": apiKey
      }
    });
  },
  getUserById(apiKey, userId) {
    return Api().get(`users/${userId}.json`, {
      headers: {
        "X-Redmine-API-Key": apiKey
      }
    });
  },
  getProjects(apiKey, offset) {
    return Api().get("projects.json", {
      headers: {
        "X-Redmine-API-Key": apiKey
      },
      params: {
        limit: 100,
        offset
      }
    });
  },
  getProjectQueries(apiKey, offset) {
    return Api().get("queries.json", {
      headers: {
        "X-Redmine-API-Key": apiKey
      },
      params: {
        limit: 100,
        offset
      }
    });
  },
  getIssuesForProject(apiKey, queryId, projectId, offset) {
    return Api().get("issues.json", {
      headers: {
        "X-Redmine-API-Key": apiKey
      },
      params: {
        project_id: projectId,
        query_id: queryId,
        limit: 100,
        offset
      }
    });
  },
  getKanbanConfigTracker(apiKey) {
    return Api().get("trackers.json", {
      headers: {
        "X-Redmine-API-Key": apiKey
      }
    });
  },
  getKanbanConfig(apiKey, projectId, trackerID) {
    return Api().get("issues.json", {
      headers: {
        "X-Redmine-API-Key": apiKey
      },
      params: {
        project_id: projectId,
        tracker_id: trackerID,
        limit: 100
      }
    });
  },
  getRedmineStatuses(apiKey, offset) {
    return Api().get("issue_statuses.json", {
      headers: {
        "X-Redmine-API-Key": apiKey
      }
    });
  },
  getRedmineTrackers(apiKey) {
    return Api().get("trackers.json", {
      headers: {
        "X-Redmine-API-Key": apiKey
      }
    });
  },
  getRedminePriority(apiKey) {
    return Api().get("enumerations/issue_priorities.json", {
      headers: {
        "X-Redmine-API-Key": apiKey
      }
    });
  },
  getRedmineFixedVersion(apiKey, versionId) {
    return Api().get(`versions/${versionId}.json`, {
      headers: {
        "X-Redmine-API-Key": apiKey
      }
    });
  },
  updateIssueStatus(apiKey, issueId, statusId) {
    return Api().put(
      `issues/${issueId}.json`,
      {
        issue: {
          status_id: statusId
        }
      },
      {
        headers: {
          "X-Redmine-API-Key": apiKey
        }
      }
    );
  },
  getUserByPassword(user) {
    return Api().post("login", user);
  },
  getTimeEntriesByUser(apiKey, projectId, userId, today, from) {
    return Api().get("time_entries.json", {
      headers: {
        "X-Redmine-API-Key": apiKey
      },
      params: {
        user_id: userId,
        project_id: projectId,
        from,
        to: today,
        limit: 100
      }
    });
  },
  // http://localhost:3000/api/issues/295.json?include=journals
  getIssueJournals(apiKey, issueId) {
    return Api().get(`issues/${issueId}.json?include=journals`, {
      headers: {
        "X-Redmine-API-Key": apiKey
      }
    });
  }
};
