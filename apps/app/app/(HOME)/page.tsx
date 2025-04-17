import BlogSection from "./components/BlogSection";
import LandingPage from "./components/LandingPage";
import LastCourses from "./components/LastCourses";
import StudentReviews from "./components/StudentReviews";
import WelcomeSection from "./components/WelcomeSection";
import WhereToStartSeciton from "./components/WhereToStartSeciton";

const page = () => {
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
