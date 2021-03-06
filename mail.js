/*
 * mail.js
 */


const nodemailer = require('nodemailer')
const Sample = require('./models/sample')
const Settings = require('./models/settings')
const Step = require('./models/step')
const History = require('./models/history')
const config = require('/usr/etc/config.js')

const transporter = nodemailer.createTransport(config.nodemailer)

module.exports = {
  sendEmail,
  sendAlertEmail,
  processOverdueSteps,
}

function processOverdueSteps() {
  return Step.findOverdue()
  .then(steps =>
    Promise.all(steps.map(step =>
      Sample.findById(step.sampleId)
      .then(sample =>
        sendAlertEmail(sample, step)
      )
      .then(info =>
        (Step.updateAlerted(step.id), info)
      )
    ))
  )
  .then(results => {
    console.log(`Sent alert emails: [${results.length}]`)
    console.log(results)
  })
  .catch(err => {
    console.error('Error while sending alert emails:')
    console.error(err)
  })
}

function sendAlertEmail(sample, step) {

  const stepIndex = sample.steps.findIndex(s => s.id === step.id)

  return Settings.findByKey('alertEmails')
    .then(to => {

      History.create({
        sampleId: sample.id,
        stepIndex: stepIndex,
        userId: null,
        description: `Sent alert email${to.length > 1 ? 's' : ''} to ${to.join(', ')}`
      })

      return sendEmail({
        from: config.alertEmail.from,
        to: to,
        subject: `Alert: Sample ${sample.name} is being forgotten`,
        html: `
        <p>
          Sample: ${sample.name} [id: ${sample.id}] <br/>
          Step: ${step.name}
        </p>
        `
      })
    })
}

function sendEmail(options) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(options, (err, info) => {
      if (err) {
        reject(err)
      } else {
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        resolve(info)
      }
    })
  })
}

