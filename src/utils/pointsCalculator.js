export function calculatePoints(
  seconds,
  coefficients
) {
  const degree =
    coefficients.length - 1;

  let total = 0;

  coefficients.forEach(
    (coefficient, index) => {
      total +=
        coefficient *
        Math.pow(
          seconds,
          degree - index
        );
    }
  );

  return Math.max(
    0,
    Math.round(total)
  );
}