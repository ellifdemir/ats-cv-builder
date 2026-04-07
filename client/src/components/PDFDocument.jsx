import { Document, Font, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://raw.githubusercontent.com/googlefonts/roboto-2/main/src/hinted/Roboto-Regular.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://raw.githubusercontent.com/googlefonts/roboto-2/main/src/hinted/Roboto-Bold.ttf',
      fontWeight: 700,
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 36,
    fontSize: 11,
    fontFamily: 'Roboto',
    color: '#111827',
  },
  headerWrap: { alignItems: 'center', textAlign: 'center' },
  headerName: { fontSize: 24, fontWeight: 700, lineHeight: 1.2 },
  headerTitle: { fontSize: 12, marginTop: 6, color: '#1f2937' },
  contactRow: {
    marginTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    color: '#374151',
    justifyContent: 'center',
  },
  contactItem: { fontSize: 10, lineHeight: 1.4 },
  contactSep: { marginHorizontal: 4, color: '#6b7280' },
  section: { marginTop: 14 },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 3,
  },
  sectionTitle: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' },
  bodyText: { marginTop: 6, fontSize: 11, lineHeight: 1.45, color: '#111827' },
  itemBlock: { marginTop: 10 },
  itemTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  itemTitle: { fontSize: 11, fontWeight: 700, lineHeight: 1.3 },
  itemDate: { fontSize: 10, color: '#1f2937' },
  itemMeta: { marginTop: 2, fontSize: 10, color: '#1f2937', lineHeight: 1.35 },
  bullets: { marginTop: 6 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start' },
  bulletRowSpacing: { marginTop: 3 },
  bulletGlyph: { width: 10, fontSize: 11, lineHeight: 1.45, color: '#374151' },
  bulletText: { flex: 1, marginLeft: 6, fontSize: 11, lineHeight: 1.45, color: '#111827' },
})

function asSafeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : []
}

function ContactText({ label, value, href }) {
  if (!value) return null

  if (href) {
    return (
      <Link src={href} style={styles.contactItem}>
        {label ? `${label}: ${value}` : value}
      </Link>
    )
  }

  return <Text style={styles.contactItem}>{label ? `${label}: ${value}` : value}</Text>
}

export default function PDFDocument({ resume }) {
  const basics = resume?.basics ?? {}
  const experience = asSafeArray(resume?.experience).filter(
    (e) => e.title || e.company || (e.highlights && e.highlights.length > 0),
  )
  const projects = asSafeArray(resume?.projects).filter(
    (p) => p.name || (p.highlights && p.highlights.length > 0),
  )
  const education = asSafeArray(resume?.education).filter((e) => e.school || e.degree)
  const skills = asSafeArray(resume?.skills)
  const certifications = asSafeArray(resume?.certifications).filter((c) => c.name || c.issuer)
  const nameUpper = (basics.name || 'Ad Soyad').toLocaleUpperCase('tr')

  const contact = [
    { label: null, value: basics.location },
    { label: null, value: basics.email, href: basics.email ? `mailto:${basics.email}` : undefined },
    { label: null, value: basics.phone, href: basics.phone ? `tel:${basics.phone}` : undefined },
    { label: null, value: basics.linkedin, href: basics.linkedin },
  ].filter((c) => c.value)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerWrap}>
          <Text style={styles.headerName}>{nameUpper}</Text>
          <Text style={styles.headerTitle}>
            {basics.tagline ||
              basics.title ||
              'Digital Marketing | SEO | SEM | Content Marketing'}
          </Text>
          {contact.length > 0 ? (
            <View style={styles.contactRow}>
              {contact.map((item, i) => (
                <View key={`${item.value}-${i}`} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ContactText label={item.label} value={item.value} href={item.href} />
                  {i < contact.length - 1 ? <Text style={styles.contactSep}>|</Text> : null}
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
          </View>
          <Text style={styles.bodyText}>{resume?.summary || ''}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
          </View>
          {experience.map((item, idx) => (
            <View key={idx} style={styles.itemBlock}>
              <View style={styles.itemTitleRow}>
                <Text style={styles.itemTitle}>{item.title || 'Job Title'}</Text>
                <Text style={styles.itemDate}>
                  {[item.start, item.end].filter(Boolean).join(' – ')}
                </Text>
              </View>
              <Text style={styles.itemMeta}>
                {[item.company, item.location].filter(Boolean).join(', ')}
              </Text>
              {asSafeArray(item.highlights).length > 0 ? (
                <View style={styles.bullets}>
                  {asSafeArray(item.highlights).map((line, lineIdx) => (
                    <View
                      key={`${idx}-${lineIdx}`}
                      style={[styles.bulletRow, lineIdx > 0 ? styles.bulletRowSpacing : null]}
                    >
                      <Text style={styles.bulletGlyph}>•</Text>
                      <Text style={styles.bulletText}>{line}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Projects</Text>
          </View>
          {projects.map((item, idx) => (
            <View key={idx} style={styles.itemBlock}>
              <View style={styles.itemTitleRow}>
                <Text style={styles.itemTitle}>{item.name || 'Project'}</Text>
                <Text style={styles.itemDate}>
                  {[item.start, item.end].filter(Boolean).join(' – ')}
                </Text>
              </View>
              <Text style={styles.itemMeta}>
                {[item.stack, item.link].filter(Boolean).join(' | ')}
              </Text>
              {asSafeArray(item.highlights).length > 0 ? (
                <View style={styles.bullets}>
                  {asSafeArray(item.highlights).map((line, lineIdx) => (
                    <View
                      key={`${idx}-${lineIdx}`}
                      style={[styles.bulletRow, lineIdx > 0 ? styles.bulletRowSpacing : null]}
                    >
                      <Text style={styles.bulletGlyph}>•</Text>
                      <Text style={styles.bulletText}>{line}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Education</Text>
          </View>
          {education.map((item, idx) => (
            <View key={idx} style={styles.itemBlock}>
              <View style={styles.itemTitleRow}>
                <Text style={styles.itemTitle}>{item.degree || 'Degree'}</Text>
                <Text style={styles.itemDate}>{item.end ? `Graduated: ${item.end}` : ''}</Text>
              </View>
              <Text style={styles.itemMeta}>
                {[item.school, item.location].filter(Boolean).join(', ')}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Skills</Text>
          </View>
          <View style={{ marginTop: 6 }}>
            {skills.map((s, i) => (
              <View key={i} style={[styles.bulletRow, i > 0 ? styles.bulletRowSpacing : null]}>
                <Text style={styles.bulletGlyph}>•</Text>
                <Text style={styles.bulletText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Certifications</Text>
          </View>
          {certifications.map((item, idx) => (
            <View key={idx} style={styles.itemBlock}>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletGlyph}>•</Text>
                <Text style={styles.bulletText}>
                  {[item.name, item.issuer].filter(Boolean).join(', ')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
