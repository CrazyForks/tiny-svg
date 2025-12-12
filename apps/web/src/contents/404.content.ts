import { type Dictionary, t } from "intlayer";

const notFoundContent: Dictionary = {
  key: "not-found",
  content: {
    title: t({
      en: "Page Not Found",
      zh: "未找到页面",
      ko: "페이지를 찾을 수 없습니다",
      de: "Seite nicht gefunden",
      fr: "Page introuvable",
    }),
    subtitle: t({
      en: "Oops! The page you're looking for doesn't exist.",
      zh: "哎呀！您访问的页面不存在。",
      ko: "앗! 찾으시는 페이지가 존재하지 않습니다.",
      de: "Hoppla! Die von dir gesuchte Seite existiert nicht.",
      fr: "Oups ! La page que vous recherchez n'existe pas.",
    }),
    backHome: t({
      en: "Back to Home",
      zh: "返回首页",
      ko: "홈으로 돌아가기",
      de: "Zur Startseite",
      fr: "Retour à l'accueil",
    }),
    lostMessage: t({
      en: "Looks like you've wandered into the void...",
      zh: "看起来您误入了虚空……",
      ko: "공허 속으로 잘못 들어오신 것 같아요…",
      de: "Sie scheinen ins Nichts geraten zu sein …",
      fr: "On dirait que vous vous êtes égaré dans le néant…",
    }),
  },
};

export default notFoundContent;
