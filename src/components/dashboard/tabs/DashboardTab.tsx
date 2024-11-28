import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const DashboardTab = () => {
  return (
    <div className="w-full flex flex-col gap-10 pb-10">
      <Card className="bg-primary bg-gradient-to-r to-yellow-500 from-green-500">
        <CardContent className="flex flex-col gap-10 p-6">
          <div>
            <h2 className="font-bold text-5xl uppercase">Start creating</h2>
            <p className="text-sm">Expand your setup—add another app to manage more events and tickets.</p>
          </div>
          <Button className="w-fit" size="lg" variant="outline">Claim ticket</Button>
        </CardContent>
      </Card>
    </div>
  );
};
