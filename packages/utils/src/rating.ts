import { Review } from "@igraph/database";

export function calculateCourseRate(reviews: Review[]) {
  if (reviews.length === 0) {
    return "--";
  }

  const total = reviews.reduce((acc, { rate }) => acc + (rate || 0), 0);
  const average = total / reviews.length;

  return Number.isNaN(average) ? "--" : Number(average.toFixed(1));
}
