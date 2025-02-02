import type React from "react";
import { Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ConfigProvider, Spin } from "antd";
import enEN from "antd/locale/en_US";
import ErrorBoundary from "@components/ErrorBoundary/ErrorBoundary";
import theme from "@config/theme";
import AppRoutes from "@routes/AppRoutes";
import { QuestionProvider } from "./context/QuestionContext"; 


const App = () => (
  <ConfigProvider locale={enEN} theme={theme}>
    <ErrorBoundary>
      <Router>
        <QuestionProvider> {/* ✅ Englobement de l'application */}
          <Suspense fallback={<Spin size="large" style={{ marginTop: "20%" }} />}>
            <AppRoutes />
          </Suspense>
        </QuestionProvider>
      </Router>
    </ErrorBoundary>
  </ConfigProvider>
);

export default App;
