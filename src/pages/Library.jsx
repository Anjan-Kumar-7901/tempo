import { useState } from 'react'
import PageHeader from '../components/PageHeader'

const articles = [
  {
    title: 'What is ovulation?',
    tag: 'Cycle basics',
    body: ['Ovulation is when an ovary releases an egg. It often happens about 14 days before the next period, but the exact day can shift from cycle to cycle.', 'Changes in cervical fluid, mild one-sided pelvic discomfort, or a small temperature shift can happen around ovulation. App predictions are estimates, not proof that ovulation happened.'],
  },
  {
    title: 'What is PMS?',
    tag: 'Symptoms',
    body: ['Premenstrual syndrome, or PMS, describes physical or emotional symptoms that appear in the days before a period and usually improve once bleeding starts.', 'Common patterns include cramps, breast tenderness, bloating, headaches, acne, mood changes, sleep changes, and food cravings. Strong or disruptive symptoms are worth discussing with a clinician.'],
  },
  {
    title: 'When to consult a doctor',
    tag: 'Care',
    body: ['Consider medical care for very heavy bleeding, bleeding between periods, severe pain, periods that suddenly change, cycles that are often shorter than 21 days or longer than 35 days, or missed periods when pregnancy is possible.', 'Seek urgent care for severe one-sided pelvic pain, fainting, fever with pelvic pain, or bleeding that soaks pads or tampons very quickly.'],
  },
  {
    title: 'Cycle myths',
    tag: 'Myths',
    body: ['A 28-day cycle is common, but it is not the only normal pattern. Many people have cycles that vary by a few days.', 'You can still get pregnant if sex happens outside the predicted fertile window, because ovulation can shift and sperm can survive for several days.'],
  },
  {
    title: 'Contraception disclaimer',
    tag: 'Safety',
    body: ['TEMPO predictions should not be used as contraception guidance. Fertile-window estimates are based on logged history and cannot confirm ovulation or prevent pregnancy.', 'Use a clinically appropriate contraceptive method and talk with a qualified healthcare professional when choosing what fits your body, goals, and medical history.'],
  },
]

export default function Library() {
  const [selected, setSelected] = useState(articles[0].title)
  const article = articles.find((item) => item.title === selected) || articles[0]

  return <section className="page">
    <PageHeader title="Library" subtitle="Offline cycle education" back/>
    <div className="library-layout">
      <aside className="library-tabs" aria-label="Article list">
        {articles.map((item) => <button key={item.title} className={item.title === selected ? 'selected' : ''} onClick={() => setSelected(item.title)}>
          <span>{item.tag}</span>
          <strong>{item.title}</strong>
        </button>)}
      </aside>
      <article className="card library-article">
        <p className="eyebrow">{article.tag}</p>
        <h2>{article.title}</h2>
        {article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </article>
    </div>
    <p className="disclaimer">Educational content is stored in the app for offline reading and is not a substitute for medical advice.</p>
  </section>
}
