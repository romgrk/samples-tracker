/*
 * get-emails.js
 */

import EmailRegex from 'email-regex'

const emailRegex = EmailRegex()

export default function getEmails(value) {
  const emails = value.match(emailRegex) || []
  return emails.map(x => x.trim().replace(/\W+$/, ''))
}
