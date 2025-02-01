import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "@components/sidebar/Sidebar";
import MapComponent from "@components/MapComponent";
import styles from "./DashboardLayout.module.css";

const { Sider, Content } = Layout;

const DashboardLayout: React.FC = () => {
  return (
    <Layout className={styles.dashboardLayout}>
      <Sider className={styles.sider} width={400}>
        <Sidebar />
      </Sider>

      <Layout className={styles.mainLayout}>
        <Content className={styles.content}>
          <MapComponent />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
