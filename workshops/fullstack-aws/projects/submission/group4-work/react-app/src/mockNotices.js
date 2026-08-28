// Placeholder data standing in for GET /notices until the FastAPI backend exists.
//
// The shape below is the contract every component expects. When the backend is
// ready, confirm its response matches these field names — if it differs, we
// adapt it in one place (src/api.js, Stage 4) rather than editing components.
const mockNotices = [
  {
    id: '1',
    title: 'Fall semester enrollment closes Friday',
    body: 'Students who have not completed course registration by 5:00 PM Friday will be moved to the waitlist. Advisors should review their caseloads and follow up with any student still showing an incomplete schedule.',
    author: 'Registrar Office',
    priority: 'high',
    created_at: '2026-08-24T14:30:00Z',
  },
  {
    id: '2',
    title: 'New grading rubric templates now available in the shared drive',
    body: 'The curriculum team has published updated rubric templates for all core subjects. These replace the 2025 versions and should be used starting this term. Existing gradebooks do not need to be migrated retroactively, but any new assessment created after September 1 should reference the updated rubric so reporting stays consistent across departments and cohorts.',
    author: 'Curriculum Team',
    priority: 'normal',
    created_at: '2026-08-21T09:15:00Z',
  },
  {
    id: '3',
    title: 'Staff parking lot resurfacing',
    body: 'Lot B will be closed next Tuesday and Wednesday. Overflow parking is available in Lot D.',
    author: 'Facilities',
    priority: 'low',
    created_at: '2026-08-18T16:45:00Z',
  },
]

export default mockNotices
