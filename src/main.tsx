import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./colors_and_type.css";
import "./styles.css";
import {
  FindHelpTab,
  HomeScreen,
  KeepFreeTab,
  LearnTab,
  NextStepMap,
  OnboardingMode,
  OnboardingPrivacy,
  OnboardingWelcome,
  SafetyCheck,
  SituationBuilder,
  ToolsTab,
} from "./reference/app-screens";

type Screen =
  | "onboarding1"
  | "onboarding2"
  | "onboarding3"
  | "home"
  | "situation"
  | "safetycheck"
  | "map"
  | "tools"
  | "findhelp"
  | "learn"
  | "keepfree";

type Tab = "start" | "tools" | "findhelp" | "learn" | "keepfree";

function App() {
  const [screen, setScreen] = useState<Screen>("onboarding1");
  const [activeTab, setActiveTab] = useState<Tab>("start");

  const handleExit = useCallback(() => {
    window.location.replace("https://www.google.com/search?q=weather");
  }, []);

  const handleTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setScreen(tab === "start" ? "home" : tab);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case "onboarding1":
        return <OnboardingWelcome onNext={() => setScreen("onboarding2")} onExit={handleExit} />;
      case "onboarding2":
        return <OnboardingPrivacy onNext={() => setScreen("onboarding3")} onExit={handleExit} />;
      case "onboarding3":
        return <OnboardingMode onContinue={() => setScreen("situation")} onExit={handleExit} />;
      case "home":
        return (
          <HomeScreen
            onNavigate={() => setScreen("situation")}
            onTab={handleTab}
            onExit={handleExit}
            activeTab={activeTab}
          />
        );
      case "situation":
        return (
          <SituationBuilder
            onBack={() => setScreen("home")}
            onContinue={(_selections: unknown, hasHighRisk: boolean) => setScreen(hasHighRisk ? "safetycheck" : "map")}
            onExit={handleExit}
          />
        );
      case "safetycheck":
        return <SafetyCheck onBack={() => setScreen("situation")} onContinue={() => setScreen("map")} onExit={handleExit} />;
      case "map":
        return <NextStepMap onBack={() => setScreen("home")} onTab={handleTab} onExit={handleExit} />;
      case "tools":
        return <ToolsTab onExit={handleExit} activeTab={activeTab} onTab={handleTab} />;
      case "findhelp":
        return <FindHelpTab onExit={handleExit} activeTab={activeTab} onTab={handleTab} />;
      case "learn":
        return <LearnTab onExit={handleExit} activeTab={activeTab} onTab={handleTab} />;
      case "keepfree":
        return <KeepFreeTab onExit={handleExit} activeTab={activeTab} onTab={handleTab} />;
      default:
        return null;
    }
  };

  return (
    <main className="preview-stage" data-screen={screen}>
      <div className="prototype-label" aria-hidden="true">
        Rainbow Services / Start Here Prototype
      </div>
      <section className="phone-surface" aria-label="Start Here prototype">
        {renderScreen()}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
