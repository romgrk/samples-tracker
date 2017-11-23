/*
 * models.js
 */


export const getNewTemplate = () => ({
  name: 'New-Template',
  notes: '',
  tags: [],
  steps: []
})

export const getNewStep = () => ({
  name: 'New-Step',
  status: 'NOT_DONE',
  notes: '',
  completionFn: null,
})
