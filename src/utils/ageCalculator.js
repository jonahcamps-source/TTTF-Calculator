export function getAgeGroup(
  dob,
  competitionYear
) {
  if (!dob) return "";

  const birthYear =
    new Date(dob).getFullYear();

  const age =
    competitionYear - birthYear;

  if (age >= 13 && age <= 14)
    return "13-14";

  if (age >= 15 && age <= 16)
    return "15-16";

  if (age >= 17 && age <= 21)
    return "16-21";

  return "Ineligible";
}