const rotateQuestionsForDay = (questions, limit, date = new Date()) => {
  if (!questions.length || limit <= 0) return [];

  const dayNumber = Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86400000
  );
  const startIndex = dayNumber % questions.length;
  const count = Math.min(limit, questions.length);

  return Array.from(
    { length: count },
    (_, index) => questions[(startIndex + index) % questions.length]
  );
};

module.exports = rotateQuestionsForDay;