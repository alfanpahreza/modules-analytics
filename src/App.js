import './App.css';
import { Layout, Menu, Breadcrumb, Table} from 'antd';
import { DesktopOutlined, PieChartOutlined} from '@ant-design/icons';
import React, {useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4plugins_sliceGrouper from "@amcharts/amcharts4/plugins/sliceGrouper"; 
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import userModuleLogs from './userModuleLogs.json';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  //Erase chart to clear up memory
  am4core.options.autoDispose = true;
  am4core.useTheme(am4themes_animated);
  const { Header, Content, Footer, Sider } = Layout;
  return (
    <Router>
      <div className="App">
        <Layout>
          <Sider style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1" icon={<DesktopOutlined />}>
                <Link to="/">Table</Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<PieChartOutlined />}>
                <Link to="/chart">Chart</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: '0 0 0 200px', overflow: 'initial'}}>
              {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
              <Switch>
                <Route path="/chart">
                  <Breadcrumb style={{ margin: '16px 16px'}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Chart</Breadcrumb.Item>
                  </Breadcrumb>
                  <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    <Chart />
                  </div>
                </Route>
                <Route path="/">
                  <Breadcrumb style={{ margin: '16px 16px'}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Table</Breadcrumb.Item>
                  </Breadcrumb>
                  <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    <Home />
                  </div>
                </Route>
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout>
        </Layout>
      </div>
    </Router>
  );
}

function countFreq(jsonData) {
  let arr = jsonData.map(getModuleData);
  let n = Object.keys(arr).length;
  let visited = Array.from({length: n}, (_, i) => false);
  let output = [];
  // Traverse through array elements and
  // count frequencies
  for (let i = 0; i < n; i++) {
 
      // Skip this element if already processed
      if (visited[i])
          continue;
 
      // Count frequency
      let count = 1;
      for (let j = i + 1; j < n; j++) {
          if (arr[i].module_id === arr[j].module_id) {
              visited[j] = true;
              count++;
          }
      }
         output.push(
        '{"module_name":"'+ arr[i].module_name + 
         '","module_id":"' + arr[i].module_id +
         '","visits":' + count + '}');
  }
  output = JSON.parse('['+output+']');
  return output.sort((a, b) => b.visits - a.visits);
}

function getModuleData(data) {
  let arrayData = {module_name : data.module_name, module_id : data.module_id};
  return arrayData;
}

function PieChart () {
  let chart = am4core.create("piechart", am4charts.PieChart);
  chart.data = countFreq(userModuleLogs.data.user_module_logs);
  
  let pieSeries = chart.series.push(new am4charts.PieSeries());
  pieSeries.dataFields.value = "visits";
  pieSeries.dataFields.category = "module_name";
  pieSeries.slices.template.stroke = am4core.color("#fff");
  pieSeries.slices.template.tooltipText = 
  `[bold]{category}[/]
    Visits : {value}`;
  
  // Animasi Awal
  pieSeries.hiddenState.properties.opacity = 1;
  pieSeries.hiddenState.properties.endAngle = -90;
  pieSeries.hiddenState.properties.startAngle = -90;

  pieSeries.labels.template.disabled = true;
  chart.legend = new am4charts.Legend();

  let grouper = pieSeries.plugins.push(new am4plugins_sliceGrouper.SliceGrouper());
  grouper.threshold = 2.5;
  grouper.groupName = "Other";
  grouper.clickBehavior = "zoom";

}

function Home() {
  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: 'ID',
      dataIndex: 'module_id',
      key: 'module_id',
    },
    {
      title: 'Module Name',
      dataIndex: 'module_name',
      key: 'module_name',
    },
    {
      title: 'Visits',
      dataIndex: 'visits',
      key: 'visits',
    },
  ];
  let data = countFreq(userModuleLogs.data.user_module_logs).slice(0,10);
  let tableData = data.map((x) => {return({
    rank : data.indexOf(x)+1,
    module_id : x.module_id,
    module_name : x.module_name,
    visits : x.visits
  })});
  return (<div>
    <h2>Table</h2>
    <Table columns={columns} dataSource={tableData} pagination={{ position: ['none','none'] }}/>
  </div>);
}

function Chart() {
  useEffect(() => {
    PieChart();
  });

  return (<div>
    <h2>Pie Chart</h2>
    <div id="piechart" style={{minHeight: 500 ,padding: 24}}></div>
    </div>);
}

export default App;
