import { getGAViewsAndSessions, getTopPages } from "@/data/ga";
import { database } from "@igraph/database";
import GraduateVsEnrolled from "@igraph/ui/components/GraduateVsEnrolled";
import RecentComments from "@igraph/ui/components/RecentComments";
import RecentReviews from "@igraph/ui/components/RecentReviews";
import StatCards from "@igraph/ui/components/StatCards";
import TopViewedPages from "@igraph/ui/components/TopViewedPages";
import DashboardViewsChart from "@igraph/ui/components/ViewsChart";
import ViewsTable from "@igraph/ui/components/ViewTable";
import { format, startOfMonth, startOfYear, subDays } from "date-fns";

const page = async () => {
  const dateCriteria = { gte: startOfMonth(new Date()) };

  //! STUDENTS ---------------------------------------

  const students = await database.user.findMany({
    where: { joinedAt: dateCriteria },
    orderBy: { joinedAt: "asc" },
  });

  const groupedByDate: Record<string, number> = {};

  students.forEach((student) => {
    const date = format(student.joinedAt, "yyyy-MM-dd");
    groupedByDate[date] = (groupedByDate[date] || 0) + 1;
  });

  const studentsData = Object.entries(groupedByDate).map(([date, value]) => ({
    date,
    value,
  }));

  const thisPeroidStudents = studentsData.reduce(
    (acc, curr) => acc + curr.value,
    0
  );
  const lastPeroidStudents = students.length - thisPeroidStudents;

  const studentComparison =
    lastPeroidStudents === 0
      ? 100
      : ((thisPeroidStudents - lastPeroidStudents) / lastPeroidStudents) * 100;

  //! REVENUE ---------------------------------------

  const payments = await database.payment.findMany({
    orderBy: { paidAt: "asc" },
    where: {
      paidAt: dateCriteria,
      status: "SUCCESS",
    },
  });

  const groupedPayments: Record<string, number> = {};

  payments.forEach((payment) => {
    const date = format(payment.paidAt!, "yyyy-MM-dd");
    groupedPayments[date] = (groupedPayments[date] || 0) + payment.total;
  });

  const revenue = Object.entries(groupedPayments).map(([date, value]) => ({
    date,
    value,
  }));

  const thisPeroidRevenueSum = revenue.reduce(
    (acc, curr) => acc + curr.value,
    0
  );

  const lastPeroidRevenueSum =
    payments.reduce((acc, curr) => acc + curr.total, 0) - thisPeroidRevenueSum;

  const revenueComparison =
    lastPeroidRevenueSum === 0
      ? 100
      : ((thisPeroidRevenueSum - lastPeroidRevenueSum) / lastPeroidRevenueSum) *
        100;

  //! SOLVED TICKETS ---------------------------------------

  const solvedTickets = await database.ticket.findMany({
    where: {
      status: "CLOSED",
      updatedAt: dateCriteria,
    },
    orderBy: { updatedAt: "asc" },
  });

  const groupedSolvedTickets: Record<string, number> = {};

  solvedTickets.forEach((ticket) => {
    const date = format(ticket.updatedAt, "yyyy-MM-dd");
    groupedSolvedTickets[date] = (groupedSolvedTickets[date] || 0) + 1;
  });

  const solvedTicketsData = Object.entries(groupedSolvedTickets).map(
    ([date, value]) => ({ date, value })
  );

  const thisPeroidSolvedTickets = solvedTicketsData.reduce(
    (acc, curr) => acc + curr.value,
    0
  );

  const lastPeroidSolvedTickets =
    solvedTickets.length - thisPeroidSolvedTickets;

  const solvedTicketsComparison =
    lastPeroidSolvedTickets === 0
      ? 100
      : ((thisPeroidSolvedTickets - lastPeroidSolvedTickets) /
          lastPeroidSolvedTickets) *
        100;

  //! Graduate Vs Enrolled ---------------------------------------

  const completed = await database.enrollment.count({
    where: { completedAt: { gte: startOfYear(new Date()) } },
  });
  const enrolled = await database.enrollment.count({
    where: { enrolledAt: { gte: startOfYear(new Date()) } },
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
