import { useTranslation } from "react-i18next";
import { StaticContentScreen } from "./StaticContentScreen";

export default function PrivacyScreen() {
  const { t } = useTranslation();
  return (
    <StaticContentScreen
      title={t("static.privacy.title")}
      intro={t("static.privacy.intro")}
      sections={[
        {
          heading: t("static.privacy.s1Title"),
          body: t("static.privacy.s1Body"),
        },
        {
          heading: t("static.privacy.s2Title"),
          body: t("static.privacy.s2Body"),
        },
        {
          heading: t("static.privacy.s3Title"),
          body: t("static.privacy.s3Body"),
        },
        {
          heading: t("static.privacy.s4Title"),
          body: t("static.privacy.s4Body"),
        },
        {
          heading: t("static.privacy.s5Title"),
          body: t("static.privacy.s5Body"),
        },
      ]}
    />
  );
}
