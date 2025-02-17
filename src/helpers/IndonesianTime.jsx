import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/id";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.locale("id");

export const indonesianTime = (isoString) => {
  const date = dayjs(isoString).tz("Asia/Jakarta");

  // Format: Sen, 15 Jan 2025 05:46:02
  return date.format("ddd, DD MMM YYYY — HH.mm");
};
