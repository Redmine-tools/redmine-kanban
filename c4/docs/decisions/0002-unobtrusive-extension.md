# 2. Unobtrusive extension

Date: 2023-09-01

## Status

Accepted

## Context

Other extensions in Redmine ecosystem (e.g. plugins) are changeing the inner system, and might cause problems during updates.

## Decision

We decided to extend Redmine functionality and visual experience with minimal impact on the Redmine system by using its REST API.

## Consequences

The Kanban Board can work with different versions of Redmine until the used API is stable.
