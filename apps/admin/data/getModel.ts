"use server";

export async function getModelById<T>(
  model: any,
  id: number
): Promise<T | null> {
  return await model.findUnique({
    where: { id },
  });
}
