import type React from "react";
import { Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ConfigProvider, Spin } from "antd";
import enEN from "antd/locale/en_US";
import ErrorBoundary from "@components/ErrorBoundary/ErrorBoundary";
import theme from "@config/theme";
import AppRoutes from "@routes/AppRoutes";
import { MapProvider } from "@contexts/MapContext";

const App = () => (
  <ConfigProvider locale={enEN} theme={theme}>
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<Spin size="large" style={{ marginTop: "20%" }} />}>
        <MapProvider>
          <AppRoutes />
          </MapProvider>
        </Suspense>
      </Router>
    </ErrorBoundary>
  </ConfigProvider>
);

export default App;
