import { useMemo, useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download, Plus } from 'lucide-react'
import PDFDocument from './components/PDFDocument.jsx'
import ResumePreview from './components/ResumePreview.jsx'

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function toDocFileName(name) {
  const base = String(name || 'resume')
    .trim()
    .replaceAll(/\s+/g, '-')
  return `${base}.doc`
}

function buildWordHtml(resume) {
  const basics = resume?.basics ?? {}
  const nameUpper = (basics.name || 'Ad Soyad').toLocaleUpperCase('tr')
  const tagline =
    basics.tagline ||
    [basics.title, basics.website].filter(Boolean).join(' | ') ||
    'Digital Marketing | SEO | SEM | Content Marketing'

  const contactParts = [basics.location, basics.email, basics.phone, basics.linkedin]
    .filter(Boolean)
    .map((p) => escapeHtml(p))
  const contactLine = contactParts.join(' <span class="sep">|</span> ')

  const summary = escapeHtml(resume?.summary || '').replaceAll('\n', '<br/>')
  const experience = Array.isArray(resume?.experience) ? resume.experience : []
  const projects = Array.isArray(resume?.projects) ? resume.projects : []
  const education = Array.isArray(resume?.education) ? resume.education : []
  const skills = Array.isArray(resume?.skills) ? resume.skills.filter(Boolean) : []
  const certifications = Array.isArray(resume?.certifications)
    ? resume.certifications.filter((c) => c?.name || c?.issuer)
    : []

  const experienceHtml = experience
    .filter((e) => e?.title || e?.company || (Array.isArray(e?.highlights) && e.highlights.length > 0))
    .map((e) => {
      const title = escapeHtml(e.title || 'Job Title')
      const dates = escapeHtml([e.start, e.end].filter(Boolean).join(' – '))
      const meta = escapeHtml([e.company, e.location].filter(Boolean).join(', '))
      const highlights = Array.isArray(e.highlights) ? e.highlights.filter(Boolean) : []
      const bullets = highlights.length
        ? `<ul class="bullets">${highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>`
        : ''
      return `
        <div class="item">
          <table class="row">
            <tr>
              <td class="left"><div class="itemTitle">${title}</div></td>
              <td class="right"><div class="dates">${dates}</div></td>
            </tr>
          </table>
          ${meta ? `<div class="meta">${meta}</div>` : ''}
          ${bullets}
        </div>
      `
    })
    .join('')

  const projectsHtml = projects
    .filter((p) => p?.name || (Array.isArray(p?.highlights) && p.highlights.length > 0))
    .map((p) => {
      const title = escapeHtml(p.name || 'Project')
      const dates = escapeHtml([p.start, p.end].filter(Boolean).join(' – '))
      const meta = escapeHtml([p.stack, p.link].filter(Boolean).join(' | '))
      const highlights = Array.isArray(p.highlights) ? p.highlights.filter(Boolean) : []
      const bullets = highlights.length
        ? `<ul class="bullets">${highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>`
        : ''
      return `
        <div class="item">
          <table class="row">
            <tr>
              <td class="left"><div class="itemTitle">${title}</div></td>
              <td class="right"><div class="dates">${dates}</div></td>
            </tr>
          </table>
          ${meta ? `<div class="meta">${meta}</div>` : ''}
          ${bullets}
        </div>
      `
    })
    .join('')

  const educationHtml = education
    .filter((e) => e?.school || e?.degree)
    .map((e) => {
      const degree = escapeHtml(e.degree || 'Degree')
      const grad = e.end ? `Graduated: ${escapeHtml(e.end)}` : ''
      const meta = escapeHtml([e.school, e.location].filter(Boolean).join(', '))
      return `
        <div class="item">
          <table class="row">
            <tr>
              <td class="left"><div class="itemTitle">${degree}</div></td>
              <td class="right"><div class="dates">${grad}</div></td>
            </tr>
          </table>
          ${meta ? `<div class="meta">${meta}</div>` : ''}
        </div>
      `
    })
    .join('')

  const skillsHtml = skills.length ? `<ul class="bullets">${skills.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>` : ''

  const certificationsHtml = certifications.length
    ? `<ul class="bullets">${certifications
        .map((c) => [c.name, c.issuer].filter(Boolean).join(', '))
        .map((s) => `<li>${escapeHtml(s)}</li>`)
        .join('')}</ul>`
    : ''

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        @page { size: A4; margin: 36pt; }
        body { font-family: Arial, sans-serif; font-size: 11pt; color: #111827; }
        .name { text-align: center; font-size: 24pt; font-weight: 800; letter-spacing: 0.04em; }
        .tagline { text-align: center; margin-top: 6pt; font-size: 12pt; font-weight: 600; color: #1f2937; }
        .contact { text-align: center; margin-top: 6pt; font-size: 10pt; color: #374151; }
        .sep { color: #6b7280; padding: 0 6pt; }
        .section { margin-top: 14pt; }
        .sectionTitle { font-size: 11pt; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding-bottom: 3pt; border-bottom: 1px solid #E5E7EB; }
        .body { margin-top: 6pt; line-height: 1.45; }
        .item { margin-top: 10pt; }
        .row { width: 100%; border-collapse: collapse; }
        .left { width: 70%; vertical-align: top; }
        .right { width: 30%; text-align: right; vertical-align: top; }
        .itemTitle { font-weight: 700; }
        .dates { font-size: 10pt; color: #1f2937; }
        .meta { margin-top: 2pt; font-size: 10pt; color: #1f2937; }
        .bullets { margin: 6pt 0 0 18pt; padding: 0; }
        .bullets li { margin: 3pt 0; }
      </style>
    </head>
    <body>
      <div class="name">${escapeHtml(nameUpper)}</div>
      <div class="tagline">${escapeHtml(tagline)}</div>
      ${contactLine ? `<div class="contact">${contactLine}</div>` : ''}

      <div class="section">
        <div class="sectionTitle">Professional Summary</div>
        <div class="body">${summary}</div>
      </div>

      <div class="section">
        <div class="sectionTitle">Work Experience</div>
        ${experienceHtml}
      </div>

      <div class="section">
        <div class="sectionTitle">Projects</div>
        ${projectsHtml}
      </div>

      <div class="section">
        <div class="sectionTitle">Education</div>
        ${educationHtml}
      </div>

      <div class="section">
        <div class="sectionTitle">Skills</div>
        ${skillsHtml}
      </div>

      <div class="section">
        <div class="sectionTitle">Certifications</div>
        ${certificationsHtml}
      </div>
    </body>
  </html>`
}

function downloadWord(resume) {
  const html = buildWordHtml(resume)
  const blob = new Blob([html], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = toDocFileName(resume?.basics?.name)
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-zinc-700">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-0 focus:border-zinc-400"
      />
    </label>
  )
}

function TextArea({ label, value, onChange, placeholder, rows = 5 }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-zinc-700">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-0 focus:border-zinc-400 resize-y"
      />
    </label>
  )
}

function SectionCard({ title, children, right }) {
  return (
    <div className="rounded-xl bg-white ring-1 ring-zinc-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm font-semibold text-zinc-900">{title}</div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function SecondaryButton({ children, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
    >
      {children}
    </button>
  )
}

const emptyExperience = () => ({
  title: '',
  company: '',
  start: '',
  end: '',
  location: '',
  highlights: [''],
})

const emptyProject = () => ({
  name: '',
  start: '',
  end: '',
  stack: '',
  link: '',
  highlights: [''],
})

const emptyEducation = () => ({
  school: '',
  degree: '',
  start: '',
  end: '',
  location: '',
})

const emptyCertification = () => ({
  name: '',
  issuer: '',
  year: '',
})

export default function App() {
  const [activeStep, setActiveStep] = useState(0)
  const [resume, setResume] = useState({
    basics: {
      name: 'Ada Yılmaz',
      title: 'Software Engineer',
      tagline: 'Digital Marketing | SEO | SEM | Content Marketing',
      email: 'ada@example.com',
      phone: '+90 5xx xxx xx xx',
      location: 'İstanbul, TR',
      website: 'https://example.com',
      linkedin: 'https://linkedin.com/in/ada',
      github: 'https://github.com/ada',
    },
    summary:
      'Performans odaklı, ölçeklenebilir web uygulamaları geliştiren bir yazılım mühendisi. React ve Node.js ekosisteminde ürün odaklı ekiplerle çalıştı; ölçülebilir çıktılar ve temiz mimari tercih eder.',
    experience: [
      {
        title: 'Software Engineer',
        company: 'Acme Inc.',
        start: '2023',
        end: 'Present',
        location: 'Remote',
        highlights: [
          'React + Node.js ile ATS uyumlu CV oluşturucu arayüzünü geliştirdim; form → önizleme gecikmesini ~0ms seviyesinde tuttum.',
          'Performans iyileştirmeleriyle ilk içerik boyamasını %25 azalttım ve kullanıcı akışını sadeleştirdim.',
        ],
      },
    ],
    projects: [],
    education: [
      {
        school: 'İTÜ',
        degree: 'BSc, Computer Engineering',
        start: '2018',
        end: '2022',
        location: 'İstanbul',
      },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL', 'Testing'],
    certifications: [
      { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon', year: '2024' },
    ],
  })

  const pdfFileName = useMemo(() => {
    const base = (resume.basics.name || 'resume').trim().replaceAll(/\s+/g, '-')
    return `${base}.pdf`
  }, [resume.basics.name])

  const steps = useMemo(
    () => [
      { id: 'basics', label: 'İletişim' },
      { id: 'summary', label: 'Özet' },
      { id: 'experience', label: 'Deneyim' },
      { id: 'projects', label: 'Projeler' },
      { id: 'education', label: 'Eğitim' },
      { id: 'skills', label: 'Yetenekler' },
      { id: 'certifications', label: 'Sertifikalar' },
    ],
    [],
  )

  const updateBasics = (key, value) => {
    setResume((prev) => ({ ...prev, basics: { ...prev.basics, [key]: value } }))
  }

  const updateSummary = (value) => {
    setResume((prev) => ({ ...prev, summary: value }))
  }

  const updateExperience = (idx, key, value) => {
    setResume((prev) => {
      const next = [...prev.experience]
      next[idx] = { ...next[idx], [key]: value }
      return { ...prev, experience: next }
    })
  }

  const updateExperienceHighlights = (idx, value) => {
    const lines = value
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
    setResume((prev) => {
      const next = [...prev.experience]
      next[idx] = { ...next[idx], highlights: lines.length > 0 ? lines : [''] }
      return { ...prev, experience: next }
    })
  }

  const addExperience = () => {
    setResume((prev) => ({ ...prev, experience: [...prev.experience, emptyExperience()] }))
  }

  const updateProject = (idx, key, value) => {
    setResume((prev) => {
      const next = [...(prev.projects || [])]
      next[idx] = { ...next[idx], [key]: value }
      return { ...prev, projects: next }
    })
  }

  const updateProjectHighlights = (idx, value) => {
    const lines = value
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
    setResume((prev) => {
      const next = [...(prev.projects || [])]
      next[idx] = { ...next[idx], highlights: lines.length > 0 ? lines : [''] }
      return { ...prev, projects: next }
    })
  }

  const addProject = () => {
    setResume((prev) => ({ ...prev, projects: [...(prev.projects || []), emptyProject()] }))
  }

  const updateEducation = (idx, key, value) => {
    setResume((prev) => {
      const next = [...prev.education]
      next[idx] = { ...next[idx], [key]: value }
      return { ...prev, education: next }
    })
  }

  const addEducation = () => {
    setResume((prev) => ({ ...prev, education: [...prev.education, emptyEducation()] }))
  }

  const updateSkills = (value) => {
    const list = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    setResume((prev) => ({ ...prev, skills: list }))
  }

  const updateCertification = (idx, key, value) => {
    setResume((prev) => {
      const next = [...prev.certifications]
      next[idx] = { ...next[idx], [key]: value }
      return { ...prev, certifications: next }
    })
  }

  const addCertification = () => {
    setResume((prev) => ({
      ...prev,
      certifications: [...prev.certifications, emptyCertification()],
    }))
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="mx-auto max-w-7xl px-5 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold text-zinc-950">ATS Uyumlu CV Oluşturucu</div>
            <div className="mt-1 text-sm text-zinc-600">
              Sol formdan düzenle, sağda A4 canlı önizlemesini gör; ardından seçilebilir PDF indir.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PDFDownloadLink
              document={<PDFDocument resume={resume} />}
              fileName={pdfFileName}
              className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
            >
              {({ loading }) => (
                <>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  {loading ? 'PDF hazırlanıyor…' : 'PDF İndir'}
                </>
              )}
            </PDFDownloadLink>
            <SecondaryButton onClick={() => downloadWord(resume)}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Word İndir
            </SecondaryButton>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
          <div className="space-y-4">
            <div className="rounded-xl bg-white ring-1 ring-zinc-200 p-3">
              <div className="flex flex-wrap gap-2">
                {steps.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStep(idx)}
                    className={[
                      'rounded-full px-3 py-1.5 text-xs font-semibold',
                      idx === activeStep
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200',
                    ].join(' ')}
                  >
                    {idx + 1}. {s.label}
                  </button>
                ))}
              </div>
            </div>

            {activeStep === 0 ? (
              <SectionCard title="İsim ve İletişim">
                <div className="grid grid-cols-1 gap-3">
                  <Field label="Ad Soyad" value={resume.basics.name} onChange={(v) => updateBasics('name', v)} />
                  <Field label="Unvan" value={resume.basics.title} onChange={(v) => updateBasics('title', v)} />
                  <Field label="Üst Satır (Tagline)" value={resume.basics.tagline || ''} onChange={(v) => updateBasics('tagline', v)} />
                  <Field label="E-posta" value={resume.basics.email} onChange={(v) => updateBasics('email', v)} />
                  <Field label="Telefon" value={resume.basics.phone} onChange={(v) => updateBasics('phone', v)} />
                  <Field label="Konum" value={resume.basics.location} onChange={(v) => updateBasics('location', v)} />
                  <Field label="Website" value={resume.basics.website} onChange={(v) => updateBasics('website', v)} />
                  <Field label="LinkedIn" value={resume.basics.linkedin} onChange={(v) => updateBasics('linkedin', v)} />
                  <Field label="GitHub" value={resume.basics.github} onChange={(v) => updateBasics('github', v)} />
                </div>
              </SectionCard>
            ) : null}

            {activeStep === 1 ? (
              <SectionCard title="Professional Summary">
                <TextArea
                  label="Özet"
                  value={resume.summary}
                  onChange={updateSummary}
                  placeholder="2-4 cümle: rolün, uzmanlığın, ölçülebilir çıktılar…"
                  rows={7}
                />
              </SectionCard>
            ) : null}

            {activeStep === 2 ? (
              <SectionCard
                title="Work Experience"
                right={
                  <SecondaryButton onClick={addExperience}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add More
                  </SecondaryButton>
                }
              >
                <div className="space-y-5">
                  {resume.experience.map((item, idx) => (
                    <div key={idx} className="rounded-lg bg-zinc-50 ring-1 ring-zinc-200 p-4">
                      <div className="grid grid-cols-1 gap-3">
                        <Field
                          label="Job Title"
                          value={item.title}
                          onChange={(v) => updateExperience(idx, 'title', v)}
                        />
                        <Field
                          label="Company Name"
                          value={item.company}
                          onChange={(v) => updateExperience(idx, 'company', v)}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Field
                            label="Start"
                            value={item.start}
                            onChange={(v) => updateExperience(idx, 'start', v)}
                            placeholder="2023"
                          />
                          <Field
                            label="End"
                            value={item.end}
                            onChange={(v) => updateExperience(idx, 'end', v)}
                            placeholder="Present"
                          />
                        </div>
                        <Field
                          label="Location"
                          value={item.location}
                          onChange={(v) => updateExperience(idx, 'location', v)}
                          placeholder="Remote"
                        />
                        <TextArea
                          label="Bullet Points (her satır bir madde)"
                          value={(item.highlights || []).filter(Boolean).join('\n')}
                          onChange={(v) => updateExperienceHighlights(idx, v)}
                          placeholder={'Örnek:\n• Ölçülebilir çıktı...\n• Performans iyileştirmesi...'}
                          rows={6}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            ) : null}

            {activeStep === 3 ? (
              <SectionCard
                title="Projects"
                right={
                  <SecondaryButton onClick={addProject}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add More
                  </SecondaryButton>
                }
              >
                <div className="space-y-5">
                  {(resume.projects || []).map((item, idx) => (
                    <div key={idx} className="rounded-lg bg-zinc-50 ring-1 ring-zinc-200 p-4">
                      <div className="grid grid-cols-1 gap-3">
                        <Field
                          label="Project Name"
                          value={item.name}
                          onChange={(v) => updateProject(idx, 'name', v)}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Field
                            label="Start"
                            value={item.start}
                            onChange={(v) => updateProject(idx, 'start', v)}
                            placeholder="2024"
                          />
                          <Field
                            label="End"
                            value={item.end}
                            onChange={(v) => updateProject(idx, 'end', v)}
                            placeholder="2025"
                          />
                        </div>
                        <Field
                          label="Tech Stack"
                          value={item.stack}
                          onChange={(v) => updateProject(idx, 'stack', v)}
                          placeholder="React, Node.js, PostgreSQL"
                        />
                        <Field
                          label="Link"
                          value={item.link}
                          onChange={(v) => updateProject(idx, 'link', v)}
                          placeholder="https://github.com/..."
                        />
                        <TextArea
                          label="Bullet Points (her satır bir madde)"
                          value={(item.highlights || []).filter(Boolean).join('\n')}
                          onChange={(v) => updateProjectHighlights(idx, v)}
                          placeholder={'Örnek:\n• Proje etkisi...\n• Kullanılan teknolojiler...'}
                          rows={6}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            ) : null}

            {activeStep === 4 ? (
              <SectionCard
                title="Education"
                right={
                  <SecondaryButton onClick={addEducation}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add More
                  </SecondaryButton>
                }
              >
                <div className="space-y-5">
                  {resume.education.map((item, idx) => (
                    <div key={idx} className="rounded-lg bg-zinc-50 ring-1 ring-zinc-200 p-4">
                      <div className="grid grid-cols-1 gap-3">
                        <Field
                          label="School"
                          value={item.school}
                          onChange={(v) => updateEducation(idx, 'school', v)}
                        />
                        <Field
                          label="Degree"
                          value={item.degree}
                          onChange={(v) => updateEducation(idx, 'degree', v)}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Field
                            label="Start"
                            value={item.start}
                            onChange={(v) => updateEducation(idx, 'start', v)}
                          />
                          <Field
                            label="End"
                            value={item.end}
                            onChange={(v) => updateEducation(idx, 'end', v)}
                          />
                        </div>
                        <Field
                          label="Location"
                          value={item.location}
                          onChange={(v) => updateEducation(idx, 'location', v)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            ) : null}

            {activeStep === 5 ? (
              <SectionCard title="Skills">
                <TextArea
                  label="Yetenekler (virgülle ayır)"
                  value={(resume.skills || []).join(', ')}
                  onChange={updateSkills}
                  placeholder="React, Node.js, TypeScript, SQL, Testing"
                  rows={4}
                />
              </SectionCard>
            ) : null}

            {activeStep === 6 ? (
              <SectionCard
                title="Certifications"
                right={
                  <SecondaryButton onClick={addCertification}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add More
                  </SecondaryButton>
                }
              >
                <div className="space-y-5">
                  {resume.certifications.map((item, idx) => (
                    <div key={idx} className="rounded-lg bg-zinc-50 ring-1 ring-zinc-200 p-4">
                      <div className="grid grid-cols-1 gap-3">
                        <Field
                          label="Certification"
                          value={item.name}
                          onChange={(v) => updateCertification(idx, 'name', v)}
                        />
                        <Field
                          label="Issuer"
                          value={item.issuer}
                          onChange={(v) => updateCertification(idx, 'issuer', v)}
                        />
                        <Field
                          label="Year"
                          value={item.year}
                          onChange={(v) => updateCertification(idx, 'year', v)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            ) : null}
          </div>

          <div className="lg:sticky lg:top-6 self-start">
            <div className="rounded-xl bg-white ring-1 ring-zinc-200 p-4">
              <div className="text-xs font-semibold text-zinc-700">Canlı Önizleme (A4)</div>
              <div className="mt-4">
                <ResumePreview resume={resume} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
