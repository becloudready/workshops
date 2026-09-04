import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Landmark } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { createUser, isEmailAvailable } from '../../api/bankingApi'

type FormValues = { first_name: string; last_name: string; email: string; password: string; birthday: string; phone_number: string; is_admin: boolean }
type FormErrors = Partial<Record<keyof FormValues, string>>

const emptyValues: FormValues = { first_name: '', last_name: '', email: '', password: '', birthday: '', phone_number: '', is_admin: false }
const phonePattern = /^\d{3}-\d{3}-\d{4}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function SignupPage() {
  const navigate = useNavigate()
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)

  const updateValue = (field: keyof FormValues, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setMessage('')
  }

  const validate = () => {
    const nextErrors: FormErrors = {}
    if (!values.first_name.trim()) nextErrors.first_name = 'Enter your first name.'
    if (!values.last_name.trim()) nextErrors.last_name = 'Enter your last name.'
    if (!values.email.trim()) nextErrors.email = 'Enter your email address.'
    else if (!emailPattern.test(values.email)) nextErrors.email = 'Enter a valid email address.'
    if (!values.password) nextErrors.password = 'Enter a password.'
    else if (values.password.length < 8) nextErrors.password = 'Use at least 8 characters.'
    if (!values.birthday) nextErrors.birthday = 'Enter your birthday.'
    if (!values.phone_number) nextErrors.phone_number = 'Enter your phone number.'
    else if (!phonePattern.test(values.phone_number)) nextErrors.phone_number = 'Use the format 555-555-5555.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const checkEmail = async () => {
    if (!values.email || !emailPattern.test(values.email)) return
    setCheckingEmail(true)
    try { const available = await isEmailAvailable(values.email); setErrors((current) => ({ ...current, email: available ? undefined : 'This email is already registered.' })) }
    catch { setErrors((current) => ({ ...current, email: 'Email availability could not be checked.' })) }
    finally { setCheckingEmail(false) }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setMessage('')
    if (!validate()) return
    setSubmitting(true)
    try { if (!(await isEmailAvailable(values.email))) { setErrors({ email: 'This email is already registered.' }); return } await createUser({ email: values.email, password: values.password, isAdmin: values.is_admin, birthday: values.birthday, phoneNumber: values.phone_number, firstName: values.first_name, lastName: values.last_name }); navigate('/', { state: { accountCreated: true } }) }
    catch (error) { setMessage(error instanceof Error ? error.message : 'We could not create your account. Check your information and try again.') }
    finally { setSubmitting(false) }
  }

  const inputClass = (field: keyof FormValues) => errors[field] ? 'input-error' : ''
  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => updateValue('phone_number', formatPhone(event.target.value))

  return <main className="auth-page"><header className="landing-nav"><Link className="landing-brand" to="/"><span className="logo-mark"><Landmark size={21} /></span><span>Northstar Bank</span></Link><Link className="back-link" to="/"><ArrowLeft size={16} /> Back to sign in</Link></header><section className="signup-content"><p className="eyebrow">GET STARTED</p><h1>Open your Northstar account.</h1><p className="landing-lede">A few details now, a simpler view of your money next.</p><section className="signup-panel"><form onSubmit={submit} noValidate><div className="form-columns"><div className={errors.first_name ? 'field-error' : ''}>{errors.first_name && <p className="field-message">{errors.first_name}</p>}<label htmlFor="first_name">First name</label><input className={inputClass('first_name')} id="first_name" name="first_name" value={values.first_name} onChange={(event) => updateValue('first_name', event.target.value)} /></div><div className={errors.last_name ? 'field-error' : ''}>{errors.last_name && <p className="field-message">{errors.last_name}</p>}<label htmlFor="last_name">Last name</label><input className={inputClass('last_name')} id="last_name" name="last_name" value={values.last_name} onChange={(event) => updateValue('last_name', event.target.value)} /></div></div><div className={errors.email ? 'field-error' : ''}>{errors.email && <p className="field-message">{errors.email}</p>}<label htmlFor="email">Email address {checkingEmail && <span className="checking-text">Checking...</span>}</label><input className={inputClass('email')} id="email" name="email" type="email" value={values.email} onChange={(event) => updateValue('email', event.target.value)} onBlur={checkEmail} /></div><div className={errors.password ? 'field-error' : ''}>{errors.password && <p className="field-message">{errors.password}</p>}<label htmlFor="password">Password</label><input className={inputClass('password')} id="password" name="password" type="password" value={values.password} onChange={(event) => updateValue('password', event.target.value)} /></div><div className="form-columns"><div className={errors.birthday ? 'field-error' : ''}>{errors.birthday && <p className="field-message">{errors.birthday}</p>}<label htmlFor="birthday">Birthday</label><input className={inputClass('birthday')} id="birthday" name="birthday" type="date" value={values.birthday} onChange={(event) => updateValue('birthday', event.target.value)} /></div><div className={errors.phone_number ? 'field-error' : ''}>{errors.phone_number && <p className="field-message">{errors.phone_number}</p>}<label htmlFor="phone_number">Phone number</label><input className={inputClass('phone_number')} id="phone_number" name="phone_number" type="tel" inputMode="numeric" placeholder="555-555-5555" value={values.phone_number} onChange={handlePhoneChange} /></div></div><label className="checkbox-label"><input type="checkbox" name="is_admin" checked={values.is_admin} onChange={(event) => updateValue('is_admin', event.target.checked)} /> Create an administrator account</label>{message && <p className="error-message">{message}</p>}<button className="primary-button" type="submit" disabled={submitting || checkingEmail}>{submitting ? 'Creating account...' : 'Create account'} <ArrowRight size={17} /></button></form></section></section></main>
}
