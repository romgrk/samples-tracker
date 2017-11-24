
# Template
```javascript
const template = {
  name: 'name',
  steps: [
    {
      name: 'Step 1',
      completionFn: null,
    },
    {
      name: 'Step 2',
      completionFn: 1,
    }
  ]
}
```

# Sample
```javascript
const sample = {
  name: 'name',
  notes: '',
  tags: ['Template-Name'],
  steps: [
    {
      name: 'Step 1',
      status: 'NOT_DONE',
      notes: '',
      completionFn: null,
    },
    {
      name: 'Step 2',
      status: 'NOT_DONE',
      notes: '',
      completionFn: 1,
    }
  ]
}
```

# History
```javascript
const entry = {
  sampleId: 1,
  stepIndex: null,
  userId: 1,
  description: {
    operation: 'REPLACE',
    previous: 'Yo',
    next: 'Hey',
  },
}
```
