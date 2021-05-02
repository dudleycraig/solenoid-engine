import React, { useState, useEffect } from 'react'

const filterByStatus = (fields, status) => {
  return Object.keys(fields)
    .filter(name=>Object.keys(fields[name].messages).some(uuid=>fields[name].messages[uuid].status===status))
    .reduce((statusFields,name)=>({...statusFields,[name]:fields[name]}),{})
}

export default function(initialFields, handleSubmit) {
  const [status, setStatus] = useState('inert')
  const [fields, setFields] = useState(initialFields)

  const validateField = (fields, field, value) => {
    const messages = field.rules.reduce((messages, rule) => {
      const {status,...rest} = rule.validator(fields,field,value)
      if (status !== undefined) return {...messages,[rule.uuid]:{status,...rest}}
      delete field.messages[rule.uuid]
      return messages
    },{})
    return {...field.messages, ...messages}
  }

  const handleChange = event => {
    const {name, type, checked} = event.target;
    const value = type === 'checkbox' && checked ? checked : event.target.value;
    const errors = validateField(fields, fields[name], value);
    setStatus(Object.keys(errors).length > 0 ? 'error' : 'inert');
    setFields({
      ...fields,
      [name]: { ...fields[name], value, messages:errors }
    })
    event.persist();
  }

  return { fields, handleChange, status }
}

export { filterByStatus }
