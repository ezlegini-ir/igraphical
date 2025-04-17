"use server";

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { subDays, format } from "date-fns";

const analyticsDataClient = new BetaAnalyticsDataClient();
const propertyId = process.env.GA_PROPERTY_ID;
const endDate = format(new Date(), "yyyy-MM-dd");

//* GET VIEWS / SESSIONS --------------------------------------------

export const getGAViewsAndSessions = async () => {
  try {
    const [viewsResponse, sessionsResponse] = await Promise.all([
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "90daysAgo", endDate }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "screenPageViews" }],
      }),
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "90daysAgo", endDate }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "sessions" }],
      }),
    ]);

    const [viewsReport] = viewsResponse;
    const [sessionsReport] = sessionsResponse;

    const last90Days = Array.from({ length: 90 }, (_, i) =>
      format(subDays(new Date(), 90 - i), "yyyyMMdd")
    );

    const viewsMap: Record<string, number> = {};
    viewsReport.rows?.forEach((row) => {
      if (!row.dimensionValues || !row.metricValues) return;
      const date = row.dimensionValues[0]?.value;
      const views = row.metricValues[0]?.value;
      if (date && views) {
        viewsMap[date] = Number(views);
      }
    });

    const sessionsMap: Record<string, number> = {};
    sessionsReport.rows?.forEach((row) => {
      if (!row.dimensionValues || !row.metricValues) return;
      const date = row.dimensionValues[0]?.value;
      const sessions = row.metricValues[0]?.value;
      if (date && sessions) {
        sessionsMap[date] = Number(sessions);
      }
    });

    const formattedData = last90Days.map((dateStr) => ({
      date: `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`,
      views: viewsMap[dateStr] ?? 0,
      sessions: sessionsMap[dateStr] ?? 0,
    }));

    return { data: formattedData };
  } catch (error) {
    console.error("GA API Error:", error);
    return { error: "Failed to fetch views and sessions" };
  }
};

//* GET ONLINE USERS --------------------------------------------

export const getOnlineUsers = async () => {
  try {
    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: "activeUsers" }],
    });

    const activeUsersStr = response.rows?.[0]?.metricValues?.[0]?.value;
    const activeUsers = activeUsersStr ? Number(activeUsersStr) : 0;

    return { data: activeUsers };
  } catch (error: any) {
    console.error("GA Realtime API Error:", error);
    return { error: "Failed to fetch online users" };
  }
};

//* GET TOP PAGES --------------------------------------------

export const getTopPages = async () => {
  try {
    const propertyId = process.env.GA_PROPERTY_ID;

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "pageTitle" }, { name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 6,
    });

    const topPages =
      response.rows?.map((row) => ({
        page: row.dimensionValues?.[0]?.value || "Unknown Title",
        href: row.dimensionValues?.[1]?.value || "Unknown Path",
        views: Number(row.metricValues?.[0]?.value) || 0,
      })) || [];

    return { data: topPages };
  } catch (error) {
    console.error("GA API Error:", error);
    return { error: "Failed to fetch top pages" };
  }
};
