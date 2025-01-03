import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReactNode } from "react";

export const LoadingModal = ({ isOpen, title }: { isOpen: boolean; title?: string | ReactNode }) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="bg-gradient-to-r from-white to-yellow-500 py-10"
        withClose={false}
        overlayProps={{ className: "!bg-black/60" }}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-sm font-semibold uppercase font-sans">Hang tight!</DialogTitle>
          <DialogDescription className="text-center font-bold text-5xl text-black uppercase font-ttBluescreens">
            {title || (
              <>
                {" "}
                We{"'"}re Setting Things <br />
                Up for You
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="text-center flex flex-col gap-10 items-center">
          <svg width="101" height="100" viewBox="0 0 101 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M48.9867 36.2937L50.5 37.8162L52.0133 36.2937C58.045 30.2217 68.3879 32.9562 70.6308 41.2158C71.6717 45.0492 70.5883 49.1467 67.7892 51.9646L50.5 69.3629L33.2108 51.96C27.1792 45.8879 29.9825 35.5633 38.2571 33.3758C42.0971 32.3604 46.1875 33.4712 48.9867 36.2892V36.2937Z"
              fill="#FFFACD"
            />
            <path
              d="M48.9867 36.2937L50.5 37.8162L52.0133 36.2937C58.045 30.2217 68.3879 32.9562 70.6308 41.2158C71.6717 45.0492 70.5883 49.1467 67.7892 51.9646L50.5 69.3629L33.2108 51.96C27.1792 45.8879 29.9825 35.5633 38.2571 33.3758C42.0971 32.3604 46.1875 33.4712 48.9867 36.2892V36.2937Z"
              stroke="#1D1D1B"
              strokeWidth="6.25"
            />
            <path
              id="arrow-top-arc"
              d="M84.686 19.8479C76.0414 10.0258 63.5848 4.40373 50.5002 4.41873C25.3256 4.41873 4.91895 24.8254 4.91895 50C4.91895 54.7633 5.64811 59.3579 7.00644 63.6746"
              stroke="#1D1D1B"
              strokeWidth="6.25"
            />
            <path
              id="arrow-bottom-arc"
              d="M16.3145 80.1521C24.959 89.9742 37.4157 95.5963 50.5003 95.5813C75.6749 95.5813 96.0815 75.1746 96.0815 50C96.087 45.3621 95.3828 40.7509 93.994 36.3254"
              stroke="#1D1D1B"
              strokeWidth="6.25"
            />
            <path id="arrow-top-head" d="M84.6856 2.13959V20.3721H66.4531" stroke="#1D1D1B" strokeWidth="6.25" />
            <path id="arrow-bottom-head" d="M16.3145 97.8604V79.6279H34.547" stroke="#1D1D1B" strokeWidth="6.25" />
          </svg>
          <p className="text-3xl font-bold text-green-500 uppercase">Loading...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
