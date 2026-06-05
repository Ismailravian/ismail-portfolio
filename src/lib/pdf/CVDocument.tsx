import {
  Document, Page, Text, View, StyleSheet, Link as PDFLink,
} from "@react-pdf/renderer";
import type { Profile, Project } from "@/lib/types";

const C = {
  navy:   "#1a2744",
  blue:   "#2563eb",
  lime:   "#b8e051",
  dark:   "#111827",
  muted:  "#4b5563",
  light:  "#6b7280",
  border: "#e5e7eb",
  bg:     "#f8fafc",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: C.dark,
    flexDirection: "row",
  },
  // LEFT SIDEBAR
  sidebar: {
    width: 190,
    backgroundColor: C.navy,
    padding: "28 16 28 16",
    flexDirection: "column",
    gap: 16,
  },
  avatarBox: {
    width: 90, height: 90,
    borderRadius: 999,
    backgroundColor: "#2d3f6e",
    alignSelf: "center",
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: { fontSize: 28, color: C.lime, fontFamily: "Helvetica-Bold" },
  nameBlock: { alignItems: "center", marginBottom: 4 },
  sidebarName: { fontSize: 15, color: "#fff", fontFamily: "Helvetica-Bold", textAlign: "center" },
  sidebarRole: { fontSize: 8, color: C.lime, textAlign: "center", marginTop: 3, letterSpacing: 0.5 },

  sidebarSection: { marginTop: 12 },
  sidebarLabel: {
    fontSize: 8, color: C.lime, letterSpacing: 1.2, textTransform: "uppercase",
    fontFamily: "Helvetica-Bold", marginBottom: 6,
    borderBottomWidth: 0.5, borderBottomColor: "#2d3f6e", paddingBottom: 3,
  },
  sidebarRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 5, gap: 4 },
  sidebarKey: { fontSize: 8, color: "#94a3b8", width: 16, marginTop: 1 },
  sidebarVal: { fontSize: 8.5, color: "#e2e8f0", flex: 1 },
  sidebarLink: { fontSize: 8.5, color: C.lime, flex: 1 },

  skillRow: { flexDirection: "row", alignItems: "center", marginBottom: 4, gap: 6 },
  skillName: { fontSize: 8.5, color: "#e2e8f0", flex: 1 },
  skillBar: { width: 48, height: 3, backgroundColor: "#2d3f6e", borderRadius: 2 },
  skillFill: { height: 3, backgroundColor: C.lime, borderRadius: 2 },

  langRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 3 },
  langDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.lime },
  langText: { fontSize: 8.5, color: "#e2e8f0" },

  // RIGHT MAIN CONTENT
  main: { flex: 1, padding: "28 24 28 24", flexDirection: "column", gap: 14 },

  // Header
  mainName: { fontSize: 26, fontFamily: "Helvetica-Bold", color: C.navy, letterSpacing: -0.5 },
  mainTagline: { fontSize: 9.5, color: C.blue, marginTop: 2, marginBottom: 6 },
  colorBar: { flexDirection: "row", height: 3, marginBottom: 14 },
  colorSeg: { flex: 1 },

  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 10, fontFamily: "Helvetica-Bold", color: C.navy,
    textTransform: "uppercase", letterSpacing: 0.8,
    borderLeftWidth: 3, borderLeftColor: C.navy,
    paddingLeft: 7, marginBottom: 8,
  },

  // Experience item
  expItem: { marginBottom: 9 },
  expHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  expRole: { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.dark },
  expDate: { fontSize: 8.5, color: C.light },
  expOrg: { fontSize: 9, color: C.blue, marginTop: 1, marginBottom: 3 },
  bullet: { flexDirection: "row", gap: 4, marginBottom: 2 },
  bulletDot: { fontSize: 9, color: C.navy, marginTop: 1 },
  bulletText: { fontSize: 8.5, color: C.muted, flex: 1, lineHeight: 1.45 },

  // Project item
  projItem: { marginBottom: 8 },
  projHeader: { flexDirection: "row", justifyContent: "space-between" },
  projTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.blue },
  projDesc: { fontSize: 8.5, color: C.muted, marginTop: 2, lineHeight: 1.4 },
  techRow: { flexDirection: "row", flexWrap: "wrap", gap: 3, marginTop: 3 },
  techPill: {
    fontSize: 7.5, color: C.navy, backgroundColor: "#eff6ff",
    paddingHorizontal: 5, paddingVertical: 1.5, borderRadius: 3,
  },

  // Achievement
  achieveItem: { flexDirection: "row", gap: 4, marginBottom: 3 },
  achieveText: { fontSize: 8.5, color: C.muted, flex: 1, lineHeight: 1.4 },

  // Footer
  footer: {
    position: "absolute", bottom: 16, left: 24, right: 24,
    flexDirection: "row", justifyContent: "center", gap: 14,
    borderTopWidth: 0.5, borderTopColor: C.border, paddingTop: 6,
  },
  footerText: { fontSize: 7.5, color: C.light },
});

const SKILL_LEVELS: Record<string, number> = {
  "Python": 0.9, "AI/ML": 0.85, "Scikit-learn": 0.85, "NumPy": 0.8, "Pandas": 0.8,
  "C++": 0.75, "Flask": 0.7, "SQL": 0.7, "OpenCV": 0.65, "x86 Assembly": 0.55, "Generative AI": 0.6,
};

export function CVDocument({ profile, projects }: { profile: Profile; projects: Project[] }) {
  const initials = profile.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const topSkills = profile.skills.slice(0, 8);

  return (
    <Document title={`${profile.name} — CV`} author={profile.name}>
      <Page size="A4" style={styles.page}>

        {/* ── SIDEBAR ── */}
        <View style={styles.sidebar}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>

          <View style={styles.nameBlock}>
            <Text style={styles.sidebarName}>{profile.name}</Text>
            <Text style={styles.sidebarRole}>AI Developer · Python Trainer</Text>
          </View>

          {/* Contact */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarLabel}>Contact</Text>
            {profile.email && (
              <View style={styles.sidebarRow}>
                <Text style={styles.sidebarKey}>✉</Text>
                <Text style={styles.sidebarVal}>{profile.email}</Text>
              </View>
            )}
            {profile.phone && (
              <View style={styles.sidebarRow}>
                <Text style={styles.sidebarKey}>📞</Text>
                <Text style={styles.sidebarVal}>{profile.phone}</Text>
              </View>
            )}
            {profile.location && (
              <View style={styles.sidebarRow}>
                <Text style={styles.sidebarKey}>📍</Text>
                <Text style={styles.sidebarVal}>{profile.location}</Text>
              </View>
            )}
          </View>

          {/* Links */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarLabel}>Links</Text>
            {profile.linkedin_url && (
              <View style={styles.sidebarRow}>
                <Text style={styles.sidebarKey}>in</Text>
                <PDFLink src={profile.linkedin_url} style={styles.sidebarLink}>
                  muhammad-ismail-0541
                </PDFLink>
              </View>
            )}
            {profile.github_url && (
              <View style={styles.sidebarRow}>
                <Text style={styles.sidebarKey}>⌥</Text>
                <PDFLink src={profile.github_url} style={styles.sidebarLink}>
                  Ismailravian
                </PDFLink>
              </View>
            )}
          </View>

          {/* Skills */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarLabel}>Skills</Text>
            {topSkills.map(skill => {
              const lvl = SKILL_LEVELS[skill] ?? 0.65;
              return (
                <View key={skill} style={styles.skillRow}>
                  <Text style={styles.skillName}>{skill}</Text>
                  <View style={styles.skillBar}>
                    <View style={[styles.skillFill, { width: `${lvl * 100}%` }]} />
                  </View>
                </View>
              );
            })}
          </View>

          {/* Languages */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarLabel}>Languages</Text>
            {["English", "Urdu"].map(l => (
              <View key={l} style={styles.langRow}>
                <View style={styles.langDot} />
                <Text style={styles.langText}>{l}</Text>
              </View>
            ))}
          </View>

          {/* Education in sidebar */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarLabel}>Education</Text>
            {profile.education.map((e, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 8.5, color: "#e2e8f0", fontFamily: "Helvetica-Bold" }}>{e.degree}</Text>
                <Text style={{ fontSize: 8, color: C.lime }}>{e.school}</Text>
                <Text style={{ fontSize: 7.5, color: "#94a3b8" }}>{e.start} — {e.end ?? "Present"}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── MAIN CONTENT ── */}
        <View style={styles.main}>
          {/* Header */}
          <View>
            <Text style={styles.mainName}>{profile.name}</Text>
            <Text style={styles.mainTagline}>
              BS AI Student  |  AI/ML Developer  |  Python Trainer  |  Hackathon Winner
            </Text>
            <View style={styles.colorBar}>
              {["#2563eb","#16a34a","#dc2626","#d97706"].map((c,i) => (
                <View key={i} style={[styles.colorSeg, { backgroundColor: c }]} />
              ))}
            </View>
          </View>

          {/* Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={{ fontSize: 9, color: C.muted, lineHeight: 1.55 }}>{profile.bio}</Text>
          </View>

          {/* Experience */}
          {profile.experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {profile.experience.map((e, i) => (
                <View key={i} style={styles.expItem}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expRole}>{e.role}</Text>
                    <Text style={styles.expDate}>{e.start}{e.end ? ` — ${e.end}` : ""}</Text>
                  </View>
                  <Text style={styles.expOrg}>{e.company}</Text>
                  {e.summary.split(/\.\s+/).filter(Boolean).map((pt, j) => (
                    <View key={j} style={styles.bullet}>
                      <Text style={styles.bulletDot}>●</Text>
                      <Text style={styles.bulletText}>{pt.replace(/\.$/, "")}.</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.slice(0, 5).map(p => (
              <View key={p.id} style={styles.projItem}>
                <View style={styles.projHeader}>
                  <Text style={styles.projTitle}>{p.title}</Text>
                  {p.github_url && (
                    <PDFLink src={p.github_url} style={{ fontSize: 7.5, color: "#2563eb" }}>GitHub →</PDFLink>
                  )}
                </View>
                <Text style={styles.projDesc}>{p.tagline}</Text>
                <View style={styles.techRow}>
                  {p.tech.map(t => <Text key={t} style={styles.techPill}>{t}</Text>)}
                </View>
              </View>
            ))}
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activities & Achievements</Text>
            {[
              "🏆 Winner — Build with AI Hackathon, GDGOC FAST Nuces Chiniot-Faisalabad Campus (Team: Think3x)",
              "📜 Certified in Generative AI",
              "🎤 Professional Python Trainer",
              "Recognized for strong performance in systems programming and database coursework",
              "Participated in technical workshops and seminars at FAST-NUCES",
            ].map((a, i) => (
              <View key={i} style={styles.achieveItem}>
                <Text style={styles.bulletDot}>●</Text>
                <Text style={styles.achieveText}>{a}</Text>
              </View>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            {[
              profile.email,
              profile.linkedin_url?.replace("https://",""),
              profile.github_url?.replace("https://",""),
            ].filter(Boolean).map((v, i) => (
              <Text key={i} style={styles.footerText}>{v}</Text>
            ))}
          </View>
        </View>

      </Page>
    </Document>
  );
}
