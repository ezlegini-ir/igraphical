import { getGAViewsAndSessions, getTopPages } from "@/data/ga";
import { aggregateByDay } from "@igraph/utils";
import { database } from "@igraph/database";
import { User } from "@igraph/database";
import { addDays, format, startOfMonth, startOfYear, subDays } from "date-fns";
import GraduateVsEnrolled from "@igraph/ui/components/GraduateVsEnrolled";
import RecentComments from "@igraph/ui/components/RecentComments";
import RecentReviews from "@igraph/ui/components/RecentReviews";
import StatCards from "@igraph/ui/components/StatCards";
import TopViewedPages from "@igraph/ui/components/TopViewedPages";
import DashboardViewsChart from "@igraph/ui/components/ViewsChart";
import ViewsTable from "@igraph/ui/components/ViewTable";

const page = async () => {
  const dateCriteria = { gte: subDays(new Date(), 28) };

  //! STUDENTS ---------------------------------------
  const students = await database.user.findMany({
    where: { joinedAt: dateCriteria },
    orderBy: { joinedAt: "asc" },
  });

  function getUserCountByDay(
    students: User[]
  ): { date: string; value: number }[] {
    const endDate = new Date();
    const startDate = subDays(endDate, 13);

    const aggregationMap: Record<string, number> = students.reduce(
      (acc, user) => {
        const day = user.joinedAt.toISOString().split("T")[0];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const result: { date: string; value: number }[] = [];
    for (
      let currentDate = startDate;
      currentDate <= endDate;
      currentDate = addDays(currentDate, 1)
    ) {
      const dayStr = currentDate.toISOString().split("T")[0];
      result.push({
        date: dayStr,
        value: aggregationMap[dayStr] || 0,
      });
    }

    return result;
  }

  const studentsData = getUserCountByDay(students);
  const thisPeroidStudents = studentsData.reduce(
    (acc, curr) => acc + curr.value,
    0
  );
  const lastPeroidStudents = students.length - thisPeroidStudents;

  const studentComparison =
    ((thisPeroidStudents - lastPeroidStudents) / lastPeroidStudents) * 100;

  //! REVENUE ---------------------------------------
  const payments = await database.payment.findMany({
    orderBy: { paidAt: "asc" },
    where: {
      paidAt: dateCriteria,
      status: "SUCCESS",
    },
  });
  const revenue = aggregateByDay(
    payments,
    (payment) => payment.paidAt?.toISOString().split("T")[0] || "",
    (payment) => payment.total
  );

  const thisPeroidRevenueSum = revenue.reduce(
    (acc, curr) => acc + curr.value,
    0
  );
  const lastPeroidRevenueSum =
    payments.reduce((acc, curr) => acc + curr.total, 0) - thisPeroidRevenueSum;

  const revenueComparison =
    ((thisPeroidRevenueSum - lastPeroidRevenueSum) / lastPeroidRevenueSum) *
    100;

  //! SOLVED TICKETS ---------------------------------------

  const solvedTickets = await database.ticket.findMany({
    where: {
      status: "CLOSED",
      updatedAt: dateCriteria,
    },
    orderBy: { updatedAt: "asc" },
  });

  const solvedTicketsData = aggregateByDay(
    solvedTickets,
    (ticket) => ticket.updatedAt.toISOString().split("T")[0],
    () => 1
  );

  const thisPeroidSolvedTickets = solvedTicketsData.reduce(
    (acc, curr) => acc + curr.value,
    0
  );
  const lastPeroidSolvedTickets =
    solvedTickets.length - thisPeroidSolvedTickets;

  const solvedTicketsComparison =
    ((thisPeroidSolvedTickets - lastPeroidSolvedTickets) /
      lastPeroidSolvedTickets) *
    100;

  //! Graduate Vs Enrolled ---------------------------------------

  const completed = await database.enrollment.count({
    where: { completedAt: { gte: subDays(new Date(), 90) } },
  });
  const enrolled = await database.enrollment.count({
    where: { enrolledAt: { gte: subDays(new Date(), 90) } },
  });

  const GraduateVsEnrolledChartData = [{ left: completed, right: enrolled }];

  //! Views And Sessions ---------------------------------------

  const data = (await getGAViewsAndSessions()).data || [];

  //! Views Table ---------------------------------------

  const viewsTable = viewsTableData(data);

  //! Top Pages Table ---------------------------------------

  const topViewedPages = (await getTopPages()).data || [];

  //! RECENT REVIEWS ---------------------------------------

  const reviews = await database.review.findMany({
    include: {
      user: true,
      course: true,
    },
    orderBy: { id: "desc" },
    take: 4,
  });

  //! RECENT REVIEWS ---------------------------------------

  const comments = await database.comment.findMany({
    include: {
      author: true,
      post: true,
    },
    orderBy: { id: "desc" },
    take: 4,
  });

  return (
    <div className="grid grid-cols-12 gap-6">
      <StatCards
        revenue={revenue}
        revenueComparison={revenueComparison}
        students={studentsData}
        studentComparison={studentComparison}
        solvedTickets={solvedTicketsData}
        solvedTicketsComparison={solvedTicketsComparison}
      />

      <GraduateVsEnrolled chartData={GraduateVsEnrolledChartData} />

      <DashboardViewsChart chartData={data} />

      <ViewsTable tableData={viewsTable} />

      <TopViewedPages topViewedPages={topViewedPages} />

      <RecentReviews reviews={reviews} />

      <RecentComments comments={comments} />

      {/* <TopDataCards /> */}
    </div>
  );
};

export default page;

function viewsTableData(
  data: { date: string; sessions: number; views: number }[]
) {
  const today = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const lastDay = format(subDays(new Date(), 2), "yyyy-MM-dd");
  const startOfThisMonth = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const startOfLastMonth = format(
    startOfMonth(subDays(new Date(), 30)),
    "yyyy-MM-dd"
  );
  const startOfYearDate = format(startOfYear(new Date()), "yyyy-MM-dd");
  const last90DaysDate = format(subDays(new Date(), 90), "yyyy-MM-dd");

  // Helper function to sum sessions/views in a date range
  const sumData = (startDate: string, endDate: string) => {
    return data
      .filter((item) => item.date >= startDate && item.date <= endDate)
      .reduce(
        (acc, item) => {
          acc.views += item.views;
          acc.sessions += item.sessions;
          return acc;
        },
        { views: 0, sessions: 0 }
      );
  };

  // Fetch today's data or default to 0
  const todaysData = data.find((item) => item.date === today) || {
    sessions: 0,
    views: 0,
  };
  const lastDayData = data.find((item) => item.date === lastDay) || {
    sessions: 0,
    views: 0,
  };
  const thisMonthData = sumData(startOfThisMonth, today);
  const lastMonthData = sumData(startOfLastMonth, startOfThisMonth);
  const last3MonthsData = sumData(last90DaysDate, today);
  const thisYearData = sumData(startOfYearDate, today);

  return [
    { title: "Today", sessions: todaysData.sessions, views: todaysData.views },
    {
      title: "Last Day",
      sessions: lastDayData.sessions,
      views: lastDayData.views,
    },
    {
      title: "This Month",
      sessions: thisMonthData.sessions,
      views: thisMonthData.views,
    },
    {
      title: "Last Month",
      sessions: lastMonthData.sessions,
      views: lastMonthData.views,
    },
    {
      title: "Last 3 Months",
      sessions: last3MonthsData.sessions,
      views: last3MonthsData.views,
    },
    {
      title: "This Year",
      sessions: thisYearData.sessions,
      views: thisYearData.views,
    },
  ];
}
