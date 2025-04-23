import { database } from "@igraph/database";
import { redirect } from "next/navigation";
import BlogSection from "./components/BlogSection";
import LandingPage from "./components/LandingPage";
import LastCourses from "./components/LastCourses";
import StudentReviews from "./components/StudentReviews";
import WelcomeSection from "./components/WelcomeSection";
import WhereToStartSeciton from "./components/WhereToStartSeciton";

interface Props {
  searchParams: Promise<{ p: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { p } = await searchParams;

  if (p) {
    const course = await database.course.findFirst({
      where: { id: +p },
    });

    if (course) {
      redirect(`/courses/${encodeURIComponent(course.url)}`);
    }

    const post = await database.post.findFirst({
      where: { id: +p },
    });

    if (post) {
      redirect(`/${encodeURIComponent(post.url)}`);
    }
  }

  return (
    <div className="space-y-28 md:space-y-52 mb-20">
      <LandingPage />

      <WhereToStartSeciton />

      <LastCourses />

      <StudentReviews />

      <WelcomeSection />

      <BlogSection />
    </div>
  );
};

export default page;
