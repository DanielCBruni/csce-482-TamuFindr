# Product Requirements

## Product Overview

TAMUfindr is a centralized lost-and-found platform for the Texas A&M University campus.

## Users

- Students
- Staff
- Faculty

## Functional Requirements

### Item Reporting

- Users can report a lost item.
- Users can report a found item.
- Reports contain:
  - Title
  - Description
  - Category
  - Location
  - Incident date
  - Lost/found type

### Item Management

- Items have a status:
  - Open
  - Matched
  - Resolved
  - Cancelled

- Staff can manage items held at their location.

### Matching

Automated matching may suggest corresponding lost and found items.

## Non-Functional Requirements

- Web-based application
- Responsive interface
- Persistent PostgreSQL storage
- Server-side validation
- Maintainable typed codebase

## Iteration 1 Scope

Included:
- Item reporting
- Item management
- Manual matching

Not included:
- Automated matching
- TAMU authentication
- Image uploads
- Mobile application
