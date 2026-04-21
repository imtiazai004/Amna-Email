# Firestore Security Specification

## Data Invariants
1. A user can only access data belonging to their own `schoolId`.
2. A student/guardian can only access their own records (attendance, fees, results).
3. A teacher can access class-related data (schedules, attendance, results) for classes they teach.
4. Admins have full read/write access WITHIN their `schoolId`.
5. Globaldeny: No one can access data without a valid `schoolId` and authentication.

## The Dirty Dozen Payloads (Targeting Exploits)

1. **Identity Spoofing**: Attempt to create a student record with `schoolId: "hacker_school"` while authenticated in "legit_school".
2. **Privilege Escalation**: A teacher attempting to update their own `salary` field in the `Teacher` document.
3. **Cross-Tenant Leak**: Attempting to `list` students without filtering by a specific `schoolId`.
4. **ID Poisoning**: Creating a record with a 2KB junk string as the document ID.
5. **Update Gap**: Updating a `Fee` record to change its `status` to "Paid" without actually being an admin or using the correct action gate.
6. **Orphaned Writes**: Creating an `ExamResult` for a student that doesn't exist in the same school.
7. **Timestamp Fraud**: Providing a `createdAt` date from 2010 to bypass aging logic.
8. **Shadow Field Injection**: Adding an `isAdmin: true` field to a user profile during registration.
9. **Relational Sync Bypass**: Deleting a `School` document while student records still exist.
10. **Query Scrape**: An unverified user attempting to list all emails in the `users` collection.
11. **Type Poisoning**: Sending a `list` [3.14, "text"] into a field that expects a strict string list.
12. **Immutable Violation**: Attempting to change the `originalOwnerId` or `createdAt` of a document.

## The Test Runner (Plan)
I will implement `firestore.rules` and verify them manually against these logic leaks.
