"use server";

import { CouponFormType } from "@/lib/validationSchema";
import { database, Prisma } from "@igraph/database";

//* CREATE ------------------------------------------------------

export const createCoupon = async (data: CouponFormType) => {
  const {
    amount,
    code,
    limit,
    summery,
    type,
    date,
    courseInclude,
    courseExclude,
  } = data;

  try {
    const existingCoupon = await database.coupon.findUnique({
      where: { code },
    });

    if (existingCoupon) return { error: "Coupon Code Must Be Unique." };

    // Validate course IDs exist
    const validCourseInclude = courseInclude?.length
      ? await database.course.findMany({
          where: { id: { in: courseInclude.map((c) => c.id) } },
          select: { id: true },
        })
      : [];

    const validCourseExclude = courseExclude?.length
      ? await database.course.findMany({
          where: { id: { in: courseExclude.map((c) => c.id) } },
          select: { id: true },
        })
      : [];

    await database.coupon.create({
      data: {
        amount,
        code,
        type,
        from: date ? date.from : undefined,
        to: date ? date.to : undefined,
        limit,
        summery,
        ...(validCourseInclude.length && {
          courseInclude: {
            connect: validCourseInclude.map((c) => ({ id: c.id })),
          },
        }),
        ...(validCourseExclude.length && {
          courseExclude: {
            connect: validCourseExclude.map((c) => ({ id: c.id })),
          },
        }),
      },
    });

    return { success: "Coupon Created Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

//? UPDATE ------------------------------------------------------

export const updateCoupon = async (data: CouponFormType, id: number) => {
  const {
    amount,
    code,
    limit,
    summery,
    type,
    date,
    courseInclude,
    courseExclude,
  } = data;

  try {
    const existingCoupon = await database.coupon.findUnique({
      where: { id },
      include: {
        courseInclude: { select: { id: true } },
        courseExclude: { select: { id: true } },
      },
    });

    if (!existingCoupon) return { error: "Coupon Not Found." };

    const existingCouponByCode = await database.coupon.findUnique({
      where: { code },
    });

    if (existingCouponByCode && existingCouponByCode.id !== id)
      return { error: "Coupon Code Must Be Unique." };

    const currentIncludeIds = existingCoupon.courseInclude.map((c) => c.id);
    const currentExcludeIds = existingCoupon.courseExclude.map((c) => c.id);

    const newIncludeIds = courseInclude?.map((c) => c.id) || [];
    const newExcludeIds = courseExclude?.map((c) => c.id) || [];

    const includeToConnect = newIncludeIds.filter(
      (id) => !currentIncludeIds.includes(id)
    );
    const includeToDisconnect = currentIncludeIds.filter(
      (id) => !newIncludeIds.includes(id)
    );

    const excludeToConnect = newExcludeIds.filter(
      (id) => !currentExcludeIds.includes(id)
    );
    const excludeToDisconnect = currentExcludeIds.filter(
      (id) => !newExcludeIds.includes(id)
    );

    const updateData: Prisma.CouponUpdateInput = {
      amount,
      code,
      type,
      from: date ? date.from : null,
      to: date ? date.to : null,
      limit,
      summery,
    };

    if (courseInclude !== undefined) {
      updateData.courseInclude = {
        ...(includeToConnect.length > 0 && {
          connect: includeToConnect.map((id) => ({ id })),
        }),
        ...(includeToDisconnect.length > 0 && {
          disconnect: includeToDisconnect.map((id) => ({ id })),
        }),
      };
    }

    if (courseExclude !== undefined) {
      updateData.courseExclude = {
        ...(excludeToConnect.length > 0 && {
          connect: excludeToConnect.map((id) => ({ id })),
        }),
        ...(excludeToDisconnect.length > 0 && {
          disconnect: excludeToDisconnect.map((id) => ({ id })),
        }),
      };
    }

    await database.coupon.update({
      where: { id },
      data: updateData,
    });

    return { success: "Coupon Updated Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

//! DELETE ------------------------------------------------------

export const deleteCoupon = async (id: number) => {
  try {
    const existingCoupon = await database.coupon.findUnique({
      where: { id },
    });

    if (!existingCoupon) return { error: "Coupon Not Found" };

    await database.coupon.delete({
      where: { id },
    });

    return { success: "Coupon Deleted Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};
