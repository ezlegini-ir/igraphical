"use client";

import { fullUserExport } from "@/actions/export";
import Loader from "@igraph/ui/components/Loader";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@igraph/ui/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@igraph/ui/components/ui/tabs";
import { useLoading } from "@igraph/utils";
import ExportUsersForm from "./ExportUsersForm";

export function ExportTabs() {
  const { loading, setLoading } = useLoading();

  const fullExport = async () => {
    setLoading(true);

    const base64 = await fullUserExport();

    const blob = new Blob(
      [Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);

    setLoading(false);
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="full-export">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="full-export">
            Full Export
          </TabsTrigger>
          <TabsTrigger className="w-full" value="custom-export">
            Custom Export
          </TabsTrigger>
        </TabsList>
        <TabsContent value="full-export">
          <Card>
            <CardHeader>
              <CardTitle>Full Export</CardTitle>
              <CardDescription>
                To fully Export Users data incluing Name, Phone and Emails.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button disabled={loading} onClick={fullExport}>
                <Loader loading={loading} />
                Start Export
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="custom-export">
          <Card>
            <CardHeader>
              <CardTitle>Custom Export</CardTitle>
              <CardDescription>
                To export Users data based on what course they have enrolled
                incluing Name, Phone and Emails.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExportUsersForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
