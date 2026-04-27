import { useTranslation } from "react-i18next";
import { StaticContentScreen } from "./StaticContentScreen";

export default function AboutScreen() {
  const { t } = useTranslation();
  return (
    <StaticContentScreen
      title={t("static.about.title")}
      intro={t("static.about.intro")}
      sections={[
        {
          heading: t("static.about.missionTitle"),
          body: t("static.about.missionBody"),
        },
        {
          heading: t("static.about.howTitle"),
          body: t("static.about.howBody"),
        },
        {
          heading: t("static.about.teamTitle"),
          body: t("static.about.teamBody"),
        },
      ]}
    />
  );
}
