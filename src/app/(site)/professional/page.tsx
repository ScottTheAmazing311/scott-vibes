import type { Metadata } from "next";
import ActivityCalendar from "@/components/ActivityCalendar";
import HubPage from "@/components/HubPage";
import Lines from "@/components/Lines";
import Reveal from "@/components/Reveal";
import { domains } from "@/lib/content";

const domain = domains.find((d) => d.id === "professional")!;

export const metadata: Metadata = {
  title: domain.name,
  description: domain.line,
};

export default function Page() {
  return (
    <HubPage
      domain={domain}
      extra={
        <Reveal as="section" className="wrap pb-24 md:pb-32" amount={0.2}>
          <h2 className="display display-md">
            <Lines lines={["Always shipping"]} />
          </h2>
          <div className="fade mt-8" style={{ ["--i" as string]: 1 }}>
            <ActivityCalendar />
          </div>
        </Reveal>
      }
    />
  );
}
