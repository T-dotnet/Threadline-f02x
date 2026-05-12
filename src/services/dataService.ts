/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Condition, DecisionUnit } from "../types";

export function getGuidelineContent(row: Condition) {
  const name = row.name;
  return {
    description: `${name} is characterised by a distinct and persistent pattern of psychological, cognitive, and behavioural symptoms that significantly impact daily functioning. The condition involves core features that meet established diagnostic thresholds and cannot be better explained by another medical condition, substance use, or developmental stage.`,
    inclusions: [`Clinical presentations meeting core diagnostic criteria`, `Subclinical variants with significant functional impact`],
    exclusions: [`Symptoms attributable to another primary medical condition`, `Direct physiological effects of substances or medications`],
    mood: `• Relevant standardised measures (e.g., PHQ-9, GAD-7) may support clinical assessment`,
    requirements: `Essential features include the presence of the defining symptom cluster in a pattern that is persistent, causes significant distress or functional impairment, and is not better accounted for by another diagnosis.\n\nSpecifiers may be applied to document severity, course, and insight level where applicable.\n\nSymptoms must not be a manifestation of another medical condition or substance effect.`,
    insightSpecifiers: `Insight level (fair to good / poor to absent) should be assessed and documented as a clinical specifier where relevant to the diagnosis. Severity specifiers should reflect the extent of functional impairment across personal, social, and occupational domains.`,
    clinicalFeatures: `The clinical presentation varies across individuals. Symptom content often clusters into recognisable themes, though individual presentations may span multiple domains.\n\nAffective responses when confronted with triggers can include anxiety, distress, or a subjective sense of incompleteness.\n\nAvoidance behaviours are common and may significantly narrow the individual's daily activities over time.\n\nCommon cognitive patterns include overestimation of threat, intolerance of uncertainty, and perfectionism.`,
    scoring: `Validated rating instruments may be used to supplement clinical assessment and track symptom change over time. Scores should be interpreted in the context of clinical interview findings and functional impairment, not used as sole diagnostic criteria.`,
    boundary: `Subclinical symptoms of this type are common in the general population and do not warrant diagnosis unless they are time-consuming (e.g., more than one hour per day), cause significant distress, or result in measurable functional impairment.\n\nDevelopmentally normative presentations in children and adolescents should be carefully distinguished from pathological symptom profiles.`,
    course: `Typical onset occurs during late adolescence or early adulthood, though childhood onset is reported in a substantial minority. Onset is often gradual; sudden or late onset warrants additional assessment to rule out organic causes.\n\nThe condition generally follows a chronic course with waxing and waning of symptoms. Episodic and progressive courses are less common. Partial remission is achievable with appropriate treatment.`,
    developmental: `Presentation may differ meaningfully across developmental stages. Children may be less able to verbalise the content of distressing cognitions, making behavioural indicators particularly important in younger populations.\n\nAge of onset has prognostic implications, with earlier onset generally associated with greater familial loading and more complex long-term course.`,
    gender: `Prevalence and clinical features show some sex and gender variation. Symptom content, age of onset, and patterns of comorbidity may differ between male and female presentations.\n\nHormonal transitions (e.g., peripartum period, puberty) may be associated with onset or exacerbation of symptoms in some individuals.`,
    differential: [
      { title:"Anxiety and Fear-Related Disorders", text:`Recurrent thoughts and avoidance behaviours occur across anxiety presentations. Key differentiators include the nature and content of intrusive cognitions, the presence or absence of compulsive responses, and the phenomenological quality of worry versus obsession.` },
      { title:"Depressive Disorders", text:`Rumination in depression is typically mood-congruent and does not drive compulsive behaviour. However, comorbidity is common and both diagnoses may be assigned when full criteria for each are independently met.` },
      { title:"Other Primary Presentations in Same Diagnostic Grouping", text:`Adjacent disorders in the same diagnostic grouping share phenomenological features. Careful assessment of the focus, form, and function of repetitive thoughts and behaviours is required to establish the most appropriate primary diagnosis.` },
      { title:"Personality Disorder with Prominent Anankastic Features", text:`Pervasive perfectionism and rigidity characterise anankastic personality features, but the intrusive ego-dystonic cognitions and driven compulsive behaviours that define this condition are absent. Both diagnoses may be assigned when criteria are independently met.` },
    ],
  };
}

export function getDUs(row: Condition): DecisionUnit[] {
  const types = ["Observation", "Assessment", "Questionnaire", "Diagnostic Rule"];
  const groups = ["Criteria A", "Criteria B", "Associated Features", "Differential Diagnosis"];
  return Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    type: types[i % 4],
    status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Staged" : "Draft",
    group: groups[i % 4],
    logic: `Logic definition for unit ${i + 1} for ${row.name}. This involves checking for specific markers and calculating scores based on guidelines.`,
    pop: row.population === "All Ages" ? "Both" : "Adult",
    source: row.guideline,
    ok: i % 5 !== 0,
    explanation: `Detailed clinical explanation for the ${types[i % 4]} logic. Symptoms cause clinically significant impairment in ${["personal", "social", "occupational", "educational"][i % 4]} functioning.`,
    notes: `Symptom count differs by age. Items are illustrative examples from ${row.guideline}.`,
    createdBy: ["John Doe", "Jane Smith", "Alice Johnson"][i % 3],
    lastUpdated: `July ${10 + i}, 2025`,
    version: `V.2${i}`,
    changeNotes: i === 0 ? "Initial versioning set for review." : `Updated ${groups[i % 4]} logic to better match ${row.guideline} latest TR update.`,
    sourceLink: `https://guidelines.example.org/${row.guideline.toLowerCase()}/section/${i + 1}`
  }));
}
