// Mock data. Replace with API calls later (see store.jsx + ai.js).
export const CURRENT_USER = { name: 'Rahul Sharma', team: 'Financial Aid Support Team', dept: 'Financial Aid' }
export const STAGES = ['Request', 'Triage', 'Assigned', 'In Progress', 'Resolution']
export const CHECKLIST = ['Review submitted request', 'Check required documents', 'Verify eligibility', 'Record decision']

const t = (name, state) => ({ name, state }) // state: done | active | pending
export const cases = [
  { id: 1042, student: 'STU-1024', issue: 'Fee Support', priority: 'Medium', status: 'In Progress', due: 'Today', updated: 'Today', owner: 'Rahul', caseOwner: 'Student Support Team', created: '28 Sep 2026', stage: 3,
    teams: [t('Academic Services', 'done'), t('Financial Aid', 'active'), t('Accommodation', 'pending')],
    activity: [
      { time: '10:20 AM', team: 'Student Support', text: 'Case created' },
      { time: '10:42 AM', team: 'Student Support', text: 'Academic Services assigned' },
      { time: '11:05 AM', team: 'Financial Aid', text: 'Enrollment confirmation requested' },
      { time: '11:30 AM', team: 'Academic Services', text: 'Academic assessment completed.' },
      { time: '12:10 PM', team: 'Financial Aid', text: 'Financial review started.' },
    ] },
  { id: 1051, student: 'STU-1092', issue: 'Scholarship', priority: 'High', status: 'Blocked', due: 'Today', updated: 'Today', owner: 'Priya', caseOwner: 'Student Support Team', created: '26 Sep 2026', stage: 3,
    teams: [t('Financial Aid', 'active'), t('Academic Services', 'pending')],
    activity: [{ time: '9:15 AM', team: 'Student Support', text: 'Case created' }, { time: '2:30 PM', team: 'Financial Aid', text: 'Document requested from student' }] },
  { id: 1064, student: 'STU-1121', issue: 'Fee Review', priority: 'Medium', status: 'On Track', due: '2 Oct', updated: 'Yesterday', owner: 'Rahul', caseOwner: 'Student Support Team', created: '25 Sep 2026', stage: 3,
    teams: [t('Financial Aid', 'active'), t('Careers', 'done')],
    activity: [{ time: '4:00 PM', team: 'Student Support', text: 'Case created' }, { time: '4:20 PM', team: 'Financial Aid', text: 'Review started' }] },
  { id: 1071, student: 'STU-1158', issue: 'Emergency Funding', priority: 'High', status: 'Pending', due: '3 Oct', updated: 'Yesterday', owner: 'Ananya', caseOwner: 'Student Support Team', created: '27 Sep 2026', stage: 2,
    teams: [t('Financial Aid', 'pending'), t('Wellbeing', 'active')],
    activity: [{ time: '3:10 PM', team: 'Student Support', text: 'Case created' }] },
  { id: 1062, student: 'STU-1133', issue: 'Housing Deposit', priority: 'Medium', status: 'In Progress', due: '1 Oct', updated: 'Today', owner: 'Rahul', caseOwner: 'Student Support Team', created: '24 Sep 2026', stage: 3,
    teams: [t('Financial Aid', 'active'), t('Accommodation', 'active')],
    activity: [{ time: '9:40 AM', team: 'Financial Aid', text: 'Residence confirmation requested' }] },
  { id: 1077, student: 'STU-1201', issue: 'Bursary Query', priority: 'Low', status: 'Pending', due: '5 Oct', updated: '2 days ago', owner: 'Priya', caseOwner: 'Student Support Team', created: '26 Sep 2026', stage: 1,
    teams: [t('Financial Aid', 'pending')], activity: [{ time: '1:00 PM', team: 'Student Support', text: 'Case created' }] },
  { id: 1038, student: 'STU-1015', issue: 'Tuition Plan', priority: 'Low', status: 'Completed', due: '27 Sep', updated: '2 days ago', owner: 'Ananya', caseOwner: 'Student Support Team', created: '20 Sep 2026', stage: 4,
    teams: [t('Financial Aid', 'done'), t('Academic Services', 'done')], activity: [{ time: '11:00 AM', team: 'Financial Aid', text: 'Decision recorded' }] },
  { id: 1080, student: 'STU-1214', issue: 'Access Funding', priority: 'Medium', status: 'In Progress', due: '4 Oct', updated: 'Today', owner: 'Rahul', caseOwner: 'Student Support Team', created: '27 Sep 2026', stage: 3,
    teams: [t('Financial Aid', 'active'), t('Accessibility', 'active'), t('Wellbeing', 'pending')], activity: [{ time: '10:00 AM', team: 'Student Support', text: 'Case created' }] },
]

export const tasks = [
  { id: 'T-1', caseId: 1042, title: 'Financial assistance review', student: 'STU-1024', status: 'In Progress', due: 'Today', priority: 'Medium', assignee: 'Rahul Sharma', dependency: 'Waiting for Academic Services — enrollment confirmation required.', checklist: [false, false, false, false], notes: [] },
  { id: 'T-2', caseId: 1051, title: 'Scholarship eligibility verification', student: 'STU-1092', status: 'Blocked', due: 'Today', priority: 'High', assignee: 'Priya Nair', dependency: 'Student document required.', checklist: [true, false, false, false], notes: [] },
  { id: 'T-3', caseId: 1064, title: 'Fee review assessment', student: 'STU-1121', status: 'On Track', due: '2 Oct', priority: 'Medium', assignee: 'Rahul Sharma', dependency: null, checklist: [true, true, false, false], notes: [] },
  { id: 'T-4', caseId: 1062, title: 'Housing deposit support check', student: 'STU-1133', status: 'In Progress', due: 'Overdue', priority: 'Medium', assignee: 'Rahul Sharma', dependency: 'Waiting for Accommodation — residence confirmation.', checklist: [true, false, false, false], notes: [] },
  { id: 'T-5', caseId: 1038, title: 'Tuition plan decision', student: 'STU-1015', status: 'Completed', due: '27 Sep', priority: 'Low', assignee: 'Ananya Rao', dependency: null, checklist: [true, true, true, true], notes: [] },
]

export const dependencies = [
  { id: 'D-1', caseId: 1042, team: 'Financial Aid', waitingFor: 'Academic Services', required: 'Enrollment confirmation', status: 'Waiting', since: '11:05 AM', responsible: 'Academic Services records team', reason: 'Financial Aid needs enrollment confirmation before completing eligibility verification.', reminded: false },
  { id: 'D-2', caseId: 1051, team: 'Financial Aid', waitingFor: 'Student', required: 'Required document', status: 'Blocked', since: 'Yesterday', responsible: 'Student (STU-1092)', reason: 'Scholarship eligibility cannot be verified without the supporting document.', reminded: false },
  { id: 'D-3', caseId: 1062, team: 'Financial Aid', waitingFor: 'Accommodation', required: 'Residence confirmation', status: 'Waiting', since: '09:40 AM', responsible: 'Accommodation office', reason: 'Deposit support depends on confirmed residence allocation.', reminded: false },
]

export const conversations = [
  { id: 'c1', caseId: 1042, with: 'Academic Services', messages: [
    { from: 'Financial Aid', text: "Could you confirm STU-1024's current enrollment status?", time: '11:06 AM' },
    { from: 'Academic Services', text: 'Checking the record now.', time: '11:12 AM' },
    { from: 'Financial Aid', text: 'Thank you. We need it to complete eligibility verification.', time: '11:15 AM' },
  ] },
  { id: 'c2', caseId: 1062, with: 'Accommodation', messages: [{ from: 'Financial Aid', text: 'Can you confirm the residence allocation for STU-1133?', time: '09:41 AM' }] },
  { id: 'c3', caseId: 1080, with: 'Accessibility', messages: [{ from: 'Accessibility', text: 'Assessment report will be shared tomorrow.', time: 'Yesterday' }] },
]

export const requests = [
  { id: 'R-204', student: 'STU-1182', title: 'Emergency financial assistance', suggested: ['Financial Aid', 'Academic Services'], priority: 'Medium' },
  { id: 'R-205', student: 'STU-1190', title: 'Scholarship eligibility question', suggested: ['Financial Aid'], priority: 'Low' },
]

export const analytics = {
  byDept: [['Financial Aid', 12], ['Academic Services', 9], ['Accommodation', 6], ['Wellbeing', 5], ['Careers', 3], ['Accessibility', 4]],
  byStatus: [['In Progress', 5], ['Pending', 7], ['Blocked', 2], ['On Track', 4], ['Completed', 9]],
  resolution: [['Mon', 3.4], ['Tue', 3.1], ['Wed', 2.9], ['Thu', 2.7], ['Fri', 2.8]],
}
