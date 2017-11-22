
# Template
```javascript
const template = {
  name: 'name',
  notes: 'Hello',
  tags: ['experiment'],
  steps: [
    {
      name: 'Step 1',
      status: 'NOT_DONE',
      notes: 'World',
      completionFn: null,
    },
    {
      name: 'Step 2',
      status: 'NOT_DONE',
      notes: 'World',
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
