/*
 * get-status.js
 */

import Status from '../constants/status'

export default function getStatus(sample) {

  if (sample.completed)
    return Status.DONE

  let i = 0;

  for (; i < sample.steps.length; i++) {
    const status = sample.steps[i].status.nextValue || sample.steps[i].status
    if (status === Status.NOT_DONE)
      break
  }

  const lastStep   = sample.steps[i == 0 ? i : i - 1]
  const lastStatus = lastStep.status.nextValue || lastStep.status

  return lastStatus
}
