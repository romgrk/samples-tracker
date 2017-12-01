/*
 * get-status.js
 */

import Status from '../constants/status'

export default function getStatus(sample) {
  let i = 0;

  for (; i < sample.steps.length; i++) {
    const status = sample.steps[i].status.nextValue || sample.steps[i].status
    if (status === Status.NOT_DONE)
      break
  }

  const lastStep = sample.steps[i - 1]

  return lastStep.status.nextValue || lastStep.status
}
