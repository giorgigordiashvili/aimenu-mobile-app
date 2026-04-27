import { useTranslation } from "react-i18next";
import { StaticContentScreen } from "./StaticContentScreen";

export default function TermsScreen() {
  const { t } = useTranslation();
  return (
    <StaticContentScreen
      title={t("static.terms.title")}
      intro={t("static.terms.intro")}
      sections={[
        { heading: t("static.terms.s1Title"), body: t("static.terms.s1Body") },
        { heading: t("static.terms.s2Title"), body: t("static.terms.s2Body") },
        { heading: t("static.terms.s3Title"), body: t("static.terms.s3Body") },
        { heading: t("static.terms.s4Title"), body: t("static.terms.s4Body") },
        { heading: t("static.terms.s5Title"), body: t("static.terms.s5Body") },
      ]}
    />
  );
}
