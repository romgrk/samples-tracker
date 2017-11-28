/*
 * models.js
 */

import unindent from './utils/unindent'
import Status from './constants/status'

export const getNewTemplate = () => ({
  name: 'new-template',
  tags: [],
  steps: []
})

export const getNewTemplateStep = (alertDelay) => ({
  name: 'new-step',
  alertDelay: alertDelay,
  completionFn: null,
})

export const getNewSample = (template) => ({
  name: 'new-sample',
  notes: '',
  tags: [template.name],
  steps: template.steps.map(step => ({
    name: step.name,
    status: Status.NOT_DONE,
    notes: '',
    alertDelay: step.alertDelay,
    completionFn: step.completionFn,
  }))
})

export const getNewCompletionFunction = () => ({
  name: 'new-function',
  code: unindent`
    /**
     * @param {Step} step
     * @param {Sample} sample
     * @param {User} user
     * @param {number} stepIndex
     */
    function canCompleteStep (step, sample, user, stepIndex) {
      // Any return value that is not strictly "true" will be considered as an error.

      if (step.files.length < 1)
        return \`Step \${step.name} requires at least 1 file attached to be closed. Currently has \${step.files.length}.\`

      if (user.email === 'john@gmail.com' || user.name === 'John John')
        return "John can't close this step."

      if (! /#\\d{6)/.test(sample.notes))
        return "Sample notes don't contain the sample ID. Please indicate it before completing this step."

      // If all is good
      return true
    }`,
})

export const DECLARATIONS = `
  declare enum Status = {
    DONE =        'DONE',
    NOT_DONE =    'NOT_DONE',
    IN_PROGRESS = 'IN_PROGRESS',
    ERROR =       'ERROR',
    ON_HOLD =     'ON_HOLD',
  }
  //type Status = 'DONE' || 'NOT_DONE' || 'IN_PROGRESS' || 'ERROR' || 'ON_HOLD' ||

  declare class File {
    name: string
  }

  /**
   * Step information object
   */
  declare class Step {

    /**
     * Step name
     */
    name: string
    /**
     * Status - one of DONE, NOT_DONE, IN_PROGRESS, ERROR, or ON_HOLD
     */
    status: Status
    /**
     * Step notes
     */
    notes: string
    completionFn: number
    /**
     * Files attached to this step
     */
    files: Array<File>
  }

  /**
   * Sample information object
   */
  declare class Sample {

    id: integer
    /**
     * Sample name
     */
    name: string
    /**
     * Sample notes
     */
    notes: string
    /**
     * Sample steps.
     * Note that sample.steps[stepIndex] === step
     */
    steps: Array<Step>
  }

  /**
   * User information object
   */
  declare class User {

    /**
     * Google ID
     */
    id: string
    /**
     * Google OAuth token
     */
    token: string
    /**
     * User name
     */
    name: string
    /**
     * User email
     */
    email: string
  }

  declare function canCompleteStep(step: Step, sample: Sample, user: User, stepIndex: number): any;
`
