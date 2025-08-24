"use server";

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { subDays, format, formatDate } from "date-fns";

const analyticsDataClient = new BetaAnalyticsDataClient();
const propertyId = process.env.GA_PROPERTY_ID;

//* GET VIEWS / SESSIONS --------------------------------------------

export const getGAViewsAndSessions = async () => {
  try {
    const [viewsResponse, sessionsResponse] = await Promise.all([
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "90daysAgo", endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "screenPageViews" }],
      }),
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "90daysAgo", endDate: "today" }],
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

//* GET CAMPAIGN OPENED LINK BY USERS --------------------------------------------

export async function getCampaignOpensLink(
  campaignName: string,
  start: Date,
  end: Date
) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: formatDate(start, "yyyy-MM-dd"),
          endDate: formatDate(end, "yyyy-MM-dd"),
        },
      ],
      dimensions: [{ name: "sessionCampaignName" }],
      metrics: [{ name: "sessions" }],
      dimensionFilter: {
        filter: {
          fieldName: "sessionCampaignName",
          stringFilter: {
            matchType: "EXACT",
            value: campaignName,
          },
        },
      },
    });

    const total = parseInt(
      response.rows?.[0]?.metricValues?.[0]?.value || "0",
      10
    );

    return { data: total };
  } catch (err) {
    console.error("Error fetching GA4 data:", err);
    return { data: 0, error: "Failed to fetch campaign opens" };
  }
}

//* GET PAGE VIEWS --------------------------------------------

export async function getPageViews(path: string, startDate: Date) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      { startDate: format(startDate, "yyyy-MM-dd"), endDate: "today" },
    ],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: { matchType: "EXACT", value: path },
      },
    },
  });

  const rows = response.rows || [];
  if (rows.length > 0) {
    return parseInt(rows[0].metricValues![0].value!);
  }
  return 0;
}
