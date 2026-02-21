import { getSiteSettings } from "@/lib/sanity.queries";
import { AnnouncementBanner } from "./AnnouncementBanner";

export async function AnnouncementBannerServer() {
  const settings = await getSiteSettings();

  if (!settings?.announcementActive || !settings?.announcementText) {
    return null;
  }

  return <AnnouncementBanner text={settings.announcementText} />;
}
