/*
 * models.js
 */


export const getNewTemplate = () => ({
  name: 'new-template',
  notes: '',
  tags: [],
  steps: []
})

export const getNewStep = () => ({
  name: 'new-step',
  status: 'NOT_DONE',
  notes: '',
  completionFn: null,
})

export const getNewSample = (template) => ({
  name: 'new-sample',
  notes: '',
  tags: [template.name],
  steps: template.steps.map(step => ({
    name: step.name,
    status: 'NOT_DONE',
    notes: '',
    completionFn: step.completionFn,
  }))
})
