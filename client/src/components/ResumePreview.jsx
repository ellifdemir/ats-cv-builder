import { useLayoutEffect, useRef, useState } from 'react'

function ContactLine({ basics }) {
  const parts = [basics.location, basics.email, basics.phone, basics.linkedin]
    .filter(Boolean)
    .map((p, i) => (
      <span key={i} className="text-[11px] leading-4 text-zinc-800">
        {p}
      </span>
    ))
  if (parts.length === 0) return null
  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-center">
      {parts.flatMap((el, idx) =>
        idx < parts.length - 1
          ? [el, <span key={`sep-${idx}`} className="text-zinc-600">|</span>]
          : [el],
      )}
    </div>
  )
}

function Section({ title, children }) {
  if (!children) return null

  return (
    <section className="mt-5">
      <h3 className="text-[11px] font-semibold tracking-[0.14em] text-zinc-900 uppercase border-b border-zinc-200 pb-1">
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </section>
  )
}

function BulletList({ items }) {
  const safeItems = (items || []).filter(Boolean)
  if (safeItems.length === 0) return null

  return (
    <div className="mt-2 space-y-1">
      {safeItems.map((item, idx) => (
        <div key={`${idx}-${item.slice(0, 24)}`} className="grid grid-cols-[12px_1fr] gap-2">
          <div className="text-zinc-700 leading-5">•</div>
          <div className="text-[12px] leading-5 text-zinc-800">{item}</div>
        </div>
      ))}
    </div>
  )
}

function ResumeContent({ basics, nameUpper, resume, experience, projects, education, skills, certifications }) {
  return (
    <>
      <header className="text-center">
        <div className="text-[32px] leading-[36px] font-extrabold tracking-wide text-zinc-900">
          {nameUpper}
        </div>
        <div className="mt-2 text-[12px] leading-5 font-medium text-zinc-800">
          {basics.tagline ||
            [basics.title, basics.website].filter(Boolean).join(' | ') ||
            'Digital Marketing | SEO | SEM | Content Marketing'}
        </div>
        <ContactLine basics={basics} />
      </header>

      <main className="mt-8 text-left">
        <Section title="Professional Summary">
          <p className="text-[12px] leading-5 text-zinc-800 whitespace-pre-line">
            {resume?.summary || ''}
          </p>
        </Section>

        <Section title="Work Experience">
          <div className="space-y-4">
            {experience.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-baseline justify-between">
                  <div className="text-[13px] leading-5 text-zinc-950 font-semibold">
                    {item.title || 'Job Title'}
                  </div>
                  <div className="text-[12px] leading-5 text-zinc-800">
                    {[item.start, item.end].filter(Boolean).join(' – ')}
                  </div>
                </div>
                <div className="mt-0.5 text-[12px] leading-5 text-zinc-800">
                  {[item.company, item.location].filter(Boolean).join(', ')}
                </div>
                <BulletList items={item.highlights} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Projects">
          <div className="space-y-4">
            {projects.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-baseline justify-between">
                  <div className="text-[13px] leading-5 text-zinc-950 font-semibold">
                    {item.name || 'Project'}
                  </div>
                  <div className="text-[12px] leading-5 text-zinc-800">
                    {[item.start, item.end].filter(Boolean).join(' – ')}
                  </div>
                </div>
                <div className="mt-0.5 text-[12px] leading-5 text-zinc-800">
                  {[item.stack, item.link].filter(Boolean).join(' | ')}
                </div>
                <BulletList items={item.highlights} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Education">
          <div className="space-y-3">
            {education.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-baseline justify-between">
                  <div className="text-[13px] leading-5 text-zinc-950 font-semibold">
                    {item.degree || 'Degree'}
                  </div>
                  <div className="text-[12px] leading-5 text-zinc-800">
                    {item.end ? `Graduated: ${item.end}` : ''}
                  </div>
                </div>
                <div className="mt-0.5 text-[12px] leading-5 text-zinc-800">
                  {[item.school, item.location].filter(Boolean).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Skills">
          <ul className="list-disc pl-4 space-y-1">
            {skills.map((s, i) => (
              <li key={i} className="text-[12px] leading-5 text-zinc-800">
                {s}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Certifications">
          <ul className="list-disc pl-4 space-y-1">
            {certifications.map((item, idx) => (
              <li key={idx} className="text-[12px] leading-5 text-zinc-800">
                {[item.name, item.issuer].filter(Boolean).join(', ')}
              </li>
            ))}
          </ul>
        </Section>
      </main>
    </>
  )
}

export default function ResumePreview({ resume }) {
  const basics = resume?.basics ?? {}
  const experience = (resume?.experience ?? []).filter(
    (e) => e.title || e.company || (e.highlights && e.highlights.length > 0),
  )
  const projects = (resume?.projects ?? []).filter(
    (p) => p.name || (p.highlights && p.highlights.length > 0),
  )
  const education = (resume?.education ?? []).filter((e) => e.school || e.degree)
  const skills = (resume?.skills ?? []).filter(Boolean)
  const certifications = (resume?.certifications ?? []).filter((c) => c.name || c.issuer)
  const nameUpper = (basics.name || 'Ad Soyad').toLocaleUpperCase('tr')

  const viewportRef = useRef(null)
  const contentRef = useRef(null)
  const [layout, setLayout] = useState({ sliceHeight: 1, pageCount: 2 })

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const content = contentRef.current
    if (!viewport || !content) return

    const cs = window.getComputedStyle(viewport)
    const paddingTop = Number.parseFloat(cs.paddingTop || '0') || 0
    const paddingBottom = Number.parseFloat(cs.paddingBottom || '0') || 0
    const sliceHeight = Math.max(1, viewport.clientHeight - paddingTop - paddingBottom)
    const contentHeight = Math.max(1, content.scrollHeight)
    const pageCount = Math.max(2, Math.ceil(contentHeight / sliceHeight))

    setLayout((prev) =>
      prev.sliceHeight === sliceHeight && prev.pageCount === pageCount
        ? prev
        : { sliceHeight, pageCount },
    )
  }, [resume])

  return (
    <div className="w-full max-w-[820px] mx-auto space-y-6">
      {Array.from({ length: layout.pageCount }).map((_, pageIndex) => (
        <div
          key={pageIndex}
          className="aspect-[1/1.41] bg-white shadow-sm ring-1 ring-zinc-200 overflow-hidden"
        >
          <div
            ref={pageIndex === 0 ? viewportRef : null}
            className="h-full w-full px-10 pt-8 pb-10 overflow-hidden"
          >
            <div
              ref={pageIndex === 0 ? contentRef : null}
              style={{ transform: `translateY(-${pageIndex * layout.sliceHeight}px)` }}
            >
              <ResumeContent
                basics={basics}
                nameUpper={nameUpper}
                resume={resume}
                experience={experience}
                projects={projects}
                education={education}
                skills={skills}
                certifications={certifications}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
