import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icons'
import { useAppStore } from '../store/useAppStore'

const surveySteps = [
  {
    key: 'trackingGoal',
    eyebrow: 'Your goal',
    title: 'What would you most like TEMPO to help with?',
    options: ['Predict my periods', 'Understand cycle patterns', 'Track symptoms and pain', 'Build a consistent tracking habit'],
  },
  {
    key: 'cyclePattern',
    eyebrow: 'Your cycle',
    title: 'How would you describe your cycle?',
    options: ['Usually regular', 'Sometimes varies', 'Often unpredictable', 'I am not sure yet'],
  },
  {
    key: 'typicalFlow',
    eyebrow: 'Your period',
    title: 'How would you describe your usual flow?',
    options: ['Mostly light', 'Mostly medium', 'Mostly heavy', 'It varies a lot'],
  },
  {
    key: 'crampLevel',
    eyebrow: 'Your period',
    title: 'How do cramps usually feel?',
    options: ['I rarely have cramps', 'Mild and manageable', 'Moderate and distracting', 'Severe and difficult'],
  },
  {
    key: 'bloatingLevel',
    eyebrow: 'Your period',
    title: 'How often do you experience bloating?',
    options: ['Rarely or never', 'Sometimes', 'Most cycles', 'Throughout much of my cycle'],
  },
  {
    key: 'painImpact',
    eyebrow: 'Your period',
    title: 'How much does period pain affect your day?',
    options: ['Not at all', 'A little', 'It affects some activities', 'It significantly affects my day'],
  },
  {
    key: 'commonSymptoms',
    eyebrow: 'Your period',
    title: 'Which symptom feels most common for you?',
    options: ['Headaches or nausea', 'Back pain or tiredness', 'Acne or cravings', 'My symptoms vary'],
  },
  {
    key: 'insightPriority',
    eyebrow: 'Your insights',
    title: 'Which insight matters most to you?',
    options: ['Cycle length trends', 'Period duration trends', 'Pain and flow patterns', 'Symptoms and mood patterns'],
  },
  {
    key: 'trackingExperience',
    eyebrow: 'Your experience',
    title: 'How familiar are you with cycle tracking?',
    options: ['This is my first time', 'I track occasionally', 'I track most cycles', 'I have tracked for years'],
  },
]

export default function Onboarding() {
  const { settings, updateSettings } = useAppStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [name, setName] = useState(settings?.name || '')
  const [age, setAge] = useState(settings?.age || '')
  const [heightCm, setHeightCm] = useState(settings?.heightCm || '')
  const [weightKg, setWeightKg] = useState(settings?.weightKg || '')
  const [answers, setAnswers] = useState(settings?.surveyAnswers || {})
  const [error, setError] = useState('')
  const totalSteps = surveySteps.length + 3
  const progress = ((step + 1) / totalSteps) * 100

  const next = async () => {
    if (step === 0 && !name.trim()) return setError('Please enter your name.')
    if (step === 1 && (!age || Number(age) < 13 || Number(age) > 100)) return setError('Enter an age between 13 and 100.')
    if (step === 2 && (!heightCm || !weightKg || Number(heightCm) < 80 || Number(heightCm) > 250 || Number(weightKg) < 25 || Number(weightKg) > 300)) return setError('Enter a valid height and weight.')
    if (step >= 3 && !answers[surveySteps[step - 3].key]) return setError('Choose one answer to continue.')
    setError('')
    if (step < totalSteps - 1) return setStep(step + 1)
    await updateSettings({
      name: name.trim(),
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      surveyAnswers: answers,
      isOnboardingComplete: true,
    })
    navigate('/create-pin')
  }

  const back = () => {
    setError('')
    if (step === 0) navigate('/')
    else setStep(step - 1)
  }

  const survey = step >= 3 ? surveySteps[step - 3] : null
  return <section className="onboarding-page">
    <header className="onboarding-head"><button className="icon-btn" onClick={back} aria-label="Back"><Icon name="back"/></button><div className="onboarding-progress"><i style={{ width: `${progress}%` }}/></div><span>{step + 1}/{totalSteps}</span></header>
    <main className="onboarding-main">
      {step === 0 && <><p className="eyebrow">Let’s meet</p><h1>What should we call you?</h1><p className="muted">Your name stays private on this device.</p><label className="onboarding-field">Your name<input autoFocus placeholder="Enter your name" value={name} onChange={(event) => setName(event.target.value)}/></label></>}
      {step === 1 && <><p className="eyebrow">About you</p><h1>How old are you?</h1><p className="muted">Age can help make future local insights more relevant.</p><label className="onboarding-field">Age<input autoFocus type="number" min="13" max="100" placeholder="Enter your age" value={age} onChange={(event) => setAge(event.target.value)}/></label></>}
      {step === 2 && <><p className="eyebrow">About you</p><h1>Your height and weight</h1><p className="muted">These details are stored locally for future personalized insights.</p><div className="metric-grid"><label className="onboarding-field">Height<div className="unit-input"><input autoFocus type="number" min="80" max="250" placeholder="165" value={heightCm} onChange={(event) => setHeightCm(event.target.value)}/><span>cm</span></div></label><label className="onboarding-field">Weight<div className="unit-input"><input type="number" min="25" max="300" placeholder="60" value={weightKg} onChange={(event) => setWeightKg(event.target.value)}/><span>kg</span></div></label></div></>}
      {survey && <><p className="eyebrow">{survey.eyebrow}</p><h1>{survey.title}</h1><p className="muted">Choose the answer that feels closest right now.</p><div className="survey-options">{survey.options.map((option) => <button key={option} className={answers[survey.key] === option ? 'survey-option selected' : 'survey-option'} onClick={() => setAnswers((current) => ({ ...current, [survey.key]: option }))}><span>{option}</span></button>)}</div></>}
    </main>
    <footer className="onboarding-footer">{error && <p className="error">{error}</p>}<button className="button primary wide" onClick={next}>{step === totalSteps - 1 ? 'Finish survey' : 'Continue'}</button><small>Your answers stay on this device.</small></footer>
  </section>
}
