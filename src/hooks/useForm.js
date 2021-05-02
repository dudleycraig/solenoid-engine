import React, { useState, useEffect } from 'react'

const statusEnum = {
  INERT: 1,
  VALIDATING: 2,
  INVALID: 3,
  VALID: 4,
  SUBMITTING: 5,
  SUBMITTED: 6,
  ERROR: 7,
}

const filterByStatus = (fields, status) => {
  return Object.keys(fields)
    .filter(name=>Object.keys(fields[name].messages).some(uuid=>fields[name].messages[uuid].status===status))
    .reduce((statusFields,name)=>({...statusFields,[name]:fields[name]}),{})
}

export default function(initialFields = {}, formHandler) {
  const [status, setStatus] = useState(statusEnum.INERT)
  const [fields, setFields] = useState(initialFields)

  useEffect(() => {
    if (filterByStatus(fields, 'error').length > 0) setStatus(statusEnum.ERROR)
  }, [fields])

  const validateField = (fields, field, value) => {
    const messages = field.rules.reduce((messages, rule) => {
      const {status,...rest} = rule.validator(fields,field,value)
      if (status !== undefined) return {...messages,[rule.uuid]:{status,...rest}}
      delete field.messages[rule.uuid]
      return messages
    },{})
    return {...field.messages,...messages}
  }

  const getEventValue = event => {
    switch (event.target.type) {
      case ('checkbox'): return event.target.checked 
      case ('text'):
      default: return event.target.value
    }
  }

  const handleChange = event => {
    event.persist()
    setFields({
      ...fields,
      [event.target.name]: {
        ...fields[event.target.name],
        value: getEventValue(event),
        messages: validateField(fields, fields[event.target.name], event.target.value)
      }
    })
  }

  const handleSubmit = event => {
    if (event) event.preventDefault()
    setStatus(statusEnum.SUBMITTING)
  }

  return { fields, handleChange, handleSubmit }
}

export { filterByStatus }
