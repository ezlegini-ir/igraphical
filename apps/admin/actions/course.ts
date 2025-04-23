"use server";

import { getCourseByUrl } from "@/data/course";
import { CourseFormType } from "@/lib/validationSchema";
import { Curriculum, database, DiscountType } from "@igraph/database";
import {
  deleteCloudFile,
  deleteManyCloudFiles,
  encodeUrl,
  uploadCloudFile,
  uploadManyCloudFiles,
} from "@igraph/utils";
import { UploadApiResponse } from "cloudinary";

function discountedPrice(
  basePrice: number,
  discountType: DiscountType,
  discountAmount: number
): number {
  let discountedPrice: number;

  if (discountType === "FIXED") {
    discountedPrice = basePrice - discountAmount;
  } else {
    discountedPrice = basePrice - (discountAmount / 100) * basePrice;
  }

  return Math.max(discountedPrice, 0); // Prevent negative prices
}

//* CREATE ------------------------------------------------------------

export const createCourse = async (data: CourseFormType) => {
  const {
    categoryId,
    description,
    duration,
    tutorId,
    learns,
    basePrice,
    status,
    summary,
    title,
    tizerUrl,
    url,
    curriculum,
    discount,
    gallery,
    image,
    prerequisite,
    audience,
    jobMarket,
    needs,
  } = data;

  const price = discount
    ? discountedPrice(basePrice, discount.type, discount.amount)
    : basePrice;

  try {
    const encodedUrl = encodeUrl(url);
    const existingCourse = await getCourseByUrl(encodedUrl);

    if (existingCourse)
      return { error: "There Already is a post with this URL" };

    const newCourse = await database.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          title,
          url: encodedUrl,
          summary,
          description,
          tizerUrl,
          duration,
          basePrice,
          price,
          audience,
          jobMarket,
          needs,
          status: status === "0" ? "DRAFT" : "PUBLISHED",

          category: {
            connect: { id: +categoryId },
          },

          // Instructor
          tutor: {
            connect: { id: +tutorId },
          },

          // Learn Sections
          learn: {
            createMany: {
              data: learns?.map((l) => ({ value: l.value })) || [],
            },
          },

          // Prerequisites
          prerequisite: {
            createMany: {
              data: prerequisite?.map((p) => ({ value: p.value })) || [],
            },
          },

          // Discount
          discount:
            discount && discount.amount !== 0
              ? {
                  create: {
                    amount: discount.amount,
                    type: discount.type,
                    from: discount.date?.from,
                    to: discount.date?.to,
                  },
                }
              : undefined,

          // Curriculum
          curriculum: curriculum?.length
            ? {
                create: curriculum.map((section) => ({
                  sectionTitle: section.sectionTitle,
                  lessons: {
                    create: section.lessons.map((lesson) => ({
                      title: lesson.title,
                      duration: lesson.duration || null,
                      url: lesson.url,
                      isFree: lesson.isFree,
                      type: lesson.type,
                    })),
                  },
                })),
              }
            : undefined,
        },
      });

      // Upload course image
      if (image && image instanceof File) {
        const buffer = Buffer.from(await image.arrayBuffer());

        const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
          buffer,
          {
            folder: "course",
            width: 800,
            resource_type: "image",
          }
        )) as UploadApiResponse;

        await tx.image.create({
          data: {
            url: secure_url,
            public_id,
            format,
            type: "COURSE",
            size: bytes,
            course: {
              connect: {
                id: course.id,
              },
            },
          },
        });
      }

      // Upload gallery images
      if (gallery) {
        const buffers = await Promise.all(
          gallery.map(async (item) => Buffer.from(await item.arrayBuffer()))
        );

        const uploadedGallery = (await uploadManyCloudFiles(buffers, {
          folder: "course",
          width: 800,
          resource_type: "image",
        })) as UploadApiResponse[];

        const newGallery = await tx.galleryItem.create({
          data: {
            course: {
              connect: {
                id: newCourse.id,
              },
            },
          },
        });

        await tx.image.createMany({
          data: uploadedGallery.map(
            ({ secure_url, bytes, format, public_id }) => ({
              url: secure_url,
              public_id,
              format,
              type: "COURSE",
              size: bytes,
              galleryId: newGallery.id,
            })
          ),
        });
      }

      return course;
    });

    return { success: "Course Created Successfully", course: newCourse };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//? UPDATE ------------------------------------------------------------

export const updateCourse = async (data: CourseFormType, courseId: number) => {
  const {
    categoryId,
    description,
    duration,
    tutorId,
    learns,
    basePrice,
    status,
    summary,
    title,
    tizerUrl,
    url,
    curriculum: curriculums,
    audience,
    jobMarket,
    needs,
    discount,
    gallery,
    image,
    prerequisite,
  } = data;

  const price = discount
    ? discountedPrice(basePrice, discount.type, discount.amount)
    : basePrice;

  try {
    const encodedUrl = encodeUrl(url);
    const existingCourseByUrl = await getCourseByUrl(encodedUrl);
    if (existingCourseByUrl && existingCourseByUrl.id !== courseId) {
      return { error: "There already is a post with this URL" };
    }

    const updatedCourse = await database.$transaction(async (tx) => {
      // Update main course fields.
      const course = await tx.course.update({
        where: { id: courseId },
        data: {
          title,
          url: encodedUrl,
          summary,
          description,
          tizerUrl,
          duration,
          basePrice,
          price,
          audience,
          jobMarket,
          category: { connect: { id: +categoryId } },
          needs,
          status: status === "0" ? "DRAFT" : "PUBLISHED",
          tutor: { connect: { id: +tutorId } },
        },
        include: { image: true },
      });

      // Update Learn Sections.
      await tx.learn.deleteMany({ where: { courseId } });
      if (learns?.length) {
        await tx.learn.createMany({
          data: learns.map((l) => ({ value: l.value, courseId })),
        });
      }

      // Update Prerequisites.
      await tx.prerequisite.deleteMany({ where: { courseId } });
      if (prerequisite?.length) {
        await tx.prerequisite.createMany({
          data: prerequisite.map((p) => ({ value: p.value, courseId })),
        });
      }

      // Update Discount.
      if (discount && discount.amount !== 0) {
        await tx.discount.upsert({
          where: { courseId: courseId },
          update: {
            amount: discount.amount,
            type: discount.type,
            from: discount.date ? discount.date.from : null,
            to: discount.date ? discount.date.to : null,
          },
          create: {
            amount: discount.amount,
            type: discount.type,
            from: discount.date ? discount.date.from : null,
            to: discount.date ? discount.date.to : null,
            course: { connect: { id: courseId } },
          },
        });
      } else {
        const existingDiscount = await database.discount.findUnique({
          where: { courseId: courseId },
        });
        if (existingDiscount) {
          await tx.discount.delete({ where: { courseId: courseId } });
        }
      }

      //! Update Curriculim
      if (curriculums) {
        const existingCurriculums = await tx.curriculum.findMany({
          where: { courseId },
          include: {
            lessons: true,
          },
        });

        // Delete lessons that are not coming from form again.
        const existingSectionIds = existingCurriculums.map((c) => c.id);
        const inputSectionIds = curriculums.map((c) => c.id);
        const toBeDeletedSectionIds = existingSectionIds.filter(
          (id) => !inputSectionIds.includes(id)
        );
        await tx.curriculum.deleteMany({
          where: { id: { in: toBeDeletedSectionIds } },
        });

        // Delete lessons that are not coming from form again.
        const existingLessonIds = existingCurriculums.flatMap((c) =>
          c.lessons.map((l) => l.id)
        );
        const inputLessonIds = curriculums.flatMap((c) =>
          c.lessons.map((l) => l.id)
        );
        const toBeDeletedLessonIds = existingLessonIds.filter(
          (id) => !inputLessonIds.includes(id)
        );
        await tx.lesson.deleteMany({
          where: { id: { in: toBeDeletedLessonIds } },
        });

        // Secrion -----------------------------------------
        for (const curriculum of curriculums) {
          let myCurriculum: Curriculum;
          if (curriculum.id) {
            myCurriculum = await tx.curriculum.update({
              where: { id: curriculum.id },
              data: {
                sectionTitle: curriculum.sectionTitle,
              },
            });
          } else {
            myCurriculum = await tx.curriculum.create({
              data: {
                courseId,
                sectionTitle: curriculum.sectionTitle,
              },
            });
          }

          // Lesson -----------------------------------------
          for (const lesson of curriculum.lessons) {
            if (lesson.id) {
              await tx.lesson.update({
                where: { id: lesson.id },
                data: {
                  duration: lesson.duration,
                  isFree: lesson.isFree,
                  title: lesson.title,
                  url: lesson.url,
                  type: lesson.type,
                },
              });
            } else {
              await tx.lesson.create({
                data: {
                  duration: lesson.duration,
                  isFree: lesson.isFree,
                  title: lesson.title,
                  url: lesson.url,
                  type: lesson.type,
                  sectionId: myCurriculum.id,
                },
              });
            }
          }
        }
      } else {
        await tx.curriculum.deleteMany({
          where: { courseId },
        });
      }

      // Update Main Image.
      if (image && image instanceof File) {
        const buffer = Buffer.from(await image.arrayBuffer());

        const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
          buffer,
          { folder: "course", width: 800, resource_type: "image" }
        )) as UploadApiResponse;

        if (course.image) {
          await deleteCloudFile(course.image.public_id);
        }

        await tx.image.upsert({
          where: { courseId: course.id },
          update: {
            public_id,
            url: secure_url,
            format,
            size: bytes,
          },
          create: {
            type: "COURSE",
            public_id,
            url: secure_url,
            format,
            size: bytes,
            course: { connect: { id: course.id } },
          },
        });
      }

      // Update Gallery.
      if (gallery) {
        const buffers = await Promise.all(
          gallery.map(async (item) => Buffer.from(await item.arrayBuffer()))
        );
        const uploadedGallery = (await uploadManyCloudFiles(buffers, {
          folder: "course",
          resource_type: "image",
          width: 800,
        })) as UploadApiResponse[];

        let courseGallery = await tx.galleryItem.findFirst({
          where: { courseId: courseId },
        });

        if (!courseGallery) {
          courseGallery = await tx.galleryItem.create({
            data: { course: { connect: { id: courseId } } },
          });
        }

        await tx.image.createMany({
          data: uploadedGallery.map(
            ({ secure_url, bytes, format, public_id }) => ({
              url: secure_url,
              public_id,
              format,
              type: "COURSE",
              size: bytes,
              galleryId: courseGallery!.id,
            })
          ),
        });
      }

      return course;
    });

    return { success: "Course Updated Successfully", course: updatedCourse };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//! DELETE ------------------------------------------------------------

export const deleteCourse = async (id: number) => {
  try {
    const deletedCourse = await database.course.delete({
      where: { id },
      include: {
        image: true,
        gallery: {
          include: {
            image: true,
          },
        },
      },
    });

    // DELETE IMAGES
    if (deletedCourse.image) {
      await deleteCloudFile(deletedCourse.image?.public_id);
    }

    const public_ids = deletedCourse.gallery?.image.map((img) => img.public_id);
    if (public_ids) {
      await deleteManyCloudFiles(public_ids);
    }

    return { success: "Course Remvoed Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};
