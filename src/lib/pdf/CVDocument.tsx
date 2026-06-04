/* eslint-disable jsx-a11y/alt-text */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link as PDFLink,
} from "@react-pdf/renderer";
import type { Profile, Project } from "@/lib/types";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10.5, fontFamily: "Helvetica", color: "#111" },
  h1: { fontSize: 22, fontWeight: 700, marginBottom: 2 },
  h2: { fontSize: 13, fontWeight: 700, marginTop: 18, marginBottom: 6, color: "#6366f1" },
  h3: { fontSize: 11, fontWeight: 700 },
  muted: { color: "#555" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  pill: {
    borderWidth: 1,
    borderColor: "#cfd5e6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
    fontSize: 9,
  },
  pillRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  section: { marginTop: 12 },
  item: { marginBottom: 8 },
  rule: { borderBottomWidth: 0.5, borderBottomColor: "#dde2ee", marginVertical: 6 },
});

export function CVDocument({
  profile,
  projects,
}: {
  profile: Profile;
  projects: Project[];
}) {
  return (
    <Document title={`${profile.name} — CV`} author={profile.name}>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.h1}>{profile.name}</Text>
          <Text style={styles.muted}>{profile.headline}</Text>
          <Text style={[styles.muted, { marginTop: 4 }]}>
            {[profile.email, profile.location, profile.phone].filter(Boolean).join(" · ")}
          </Text>
          <View style={[styles.row, { marginTop: 4 }]}>
            <View style={{ flexDirection: "row" }}>
              {profile.github_url && (
                <PDFLink src={profile.github_url} style={[styles.muted, { marginRight: 10 }]}>
                  GitHub
                </PDFLink>
              )}
              {profile.linkedin_url && (
                <PDFLink src={profile.linkedin_url} style={styles.muted}>LinkedIn</PDFLink>
              )}
            </View>
          </View>
        </View>

        <View style={styles.rule} />

        <View>
          <Text style={styles.h2}>Profile</Text>
          <Text>{profile.bio}</Text>
        </View>

        {profile.skills.length > 0 && (
          <View>
            <Text style={styles.h2}>Skills</Text>
            <View style={styles.pillRow}>
              {profile.skills.map((s) => (
                <Text key={s} style={styles.pill}>{s}</Text>
              ))}
            </View>
          </View>
        )}

        {profile.experience.length > 0 && (
          <View>
            <Text style={styles.h2}>Experience</Text>
            {profile.experience.map((e, i) => (
              <View key={i} style={styles.item}>
                <View style={styles.row}>
                  <Text style={styles.h3}>{e.role} · {e.company}</Text>
                  <Text style={styles.muted}>{e.start} — {e.end ?? "Present"}</Text>
                </View>
                <Text style={styles.muted}>{e.summary}</Text>
              </View>
            ))}
          </View>
        )}

        {profile.education.length > 0 && (
          <View>
            <Text style={styles.h2}>Education</Text>
            {profile.education.map((e, i) => (
              <View key={i} style={styles.item}>
                <View style={styles.row}>
                  <Text style={styles.h3}>{e.degree} · {e.school}</Text>
                  <Text style={styles.muted}>{e.start} — {e.end ?? "Present"}</Text>
                </View>
                {e.summary && <Text style={styles.muted}>{e.summary}</Text>}
              </View>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View>
            <Text style={styles.h2}>Selected Projects</Text>
            {projects.map((p) => (
              <View key={p.id} style={styles.item}>
                <View style={styles.row}>
                  <Text style={styles.h3}>{p.title}</Text>
                  {p.demo_url && (
                    <PDFLink src={p.demo_url} style={styles.muted}>Demo</PDFLink>
                  )}
                </View>
                <Text style={styles.muted}>{p.tagline}</Text>
                <Text style={[styles.muted, { marginTop: 2 }]}>{p.tech.join(" · ")}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
