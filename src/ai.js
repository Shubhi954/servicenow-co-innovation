// Local mock "AI". Swap the body of generateBrief for a Gemini/OpenAI call later.
// It only summarises and suggests. It never assigns cases or makes decisions.
export async function generateBrief(c, deps = []) {
  const done = c.teams.filter((x) => x.state === 'done').map((x) => x.name)
  const active = c.teams.filter((x) => x.state === 'active').map((x) => x.name)
  const pending = c.teams.filter((x) => x.state === 'pending').map((x) => x.name)
  const open = deps.find((d) => d.caseId === c.id && d.status !== 'Resolved')
  return {
    summary: `This case involves ${c.teams.map((x) => x.name).join(', ')}. ${done.length ? done.join(', ') + ' has finished its work. ' : ''}${active.length ? active.join(', ') + ' is in progress.' : ''}`,
    done, active, pending,
    blocker: open ? `${open.required} is required from ${open.waitingFor}.` : 'No current blocker.',
    next: open ? `Follow up with ${open.waitingFor} for ${open.required.toLowerCase()}.` : 'Continue the current team tasks.',
  }
}
