import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CardWrapper = ({ title, description, children, loading }: any) => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description ? (
            <CardDescription>
              {description}
            </CardDescription>
          ) : null}
        </CardHeader>
        {children ? (
          <CardContent>
            {children}
          </CardContent>
        ) : null}
      </Card>
    </div>
  );
};

export default CardWrapper;