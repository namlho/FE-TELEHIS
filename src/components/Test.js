import React from 'react';
import 'antd/dist/antd.css';
import { Menu, Button } from 'antd';
import { AppstoreOutlined, SettingOutlined, MailOutlined } from '@ant-design/icons';
const { SubMenu } = Menu;
const menuItems = [
    {
        key: "5",
        label: "Option 5",
    },
    {
        key: "6",
        label: "Option 6",
    }
]
function Test() {   
    return (
      //   <Menu
      //   // onClick={this.handleClick}
      //   style={{ width: 256 }}
      //   defaultSelectedKeys={['1']}
      //   defaultOpenKeys={['sub1']}
      //   mode="inline"
      // >
      //     <h1>Day la test page</h1>
      //   <SubMenu
      //     key="sub1"
      //     title={
      //       <span>
      //         <MailOutlined />
      //         <span>Navigation One</span>
      //       </span>
      //     }
      //   >
      //     <Menu.ItemGroup key="g1" title="Item 1">
      //       <Menu.Item key="1">Option 1</Menu.Item>
      //       <Menu.Item key="2">Option 2</Menu.Item>
      //     </Menu.ItemGroup>
      //     <Menu.ItemGroup key="g2" title="Item 2">
      //       <Menu.Item key="3">Option 3</Menu.Item>
      //       <Menu.Item key="4">Option 4</Menu.Item>
      //     </Menu.ItemGroup>
      //   </SubMenu>
      //   <SubMenu
      //     key="sub2"
      //     title={
      //       <span>
      //           <AppstoreOutlined />
      //         <span>Navigation Two</span>
      //       </span>
      //     }
      //   >
            
      //     <Menu items={menuItems}></Menu>
      //     <SubMenu key="sub3" title="Submenu">
      //       <Menu.Item key="7">Option 7</Menu.Item>
      //       <Menu.Item key="8">Option 8</Menu.Item>
      //     </SubMenu>
      //   </SubMenu>
      //   <SubMenu
      //     key="sub4"
      //     title={
      //       <span>
      //         <SettingOutlined />
      //         <span>Navigation Three</span>
      //       </span>
      //     }
      //   >
      //     <Menu.Item key="9">Option 9</Menu.Item>
      //     <Menu.Item key="10">Option 10</Menu.Item>
      //     <Menu.Item key="11">Option 11</Menu.Item>
      //     <Menu.Item key="12">Option 12</Menu.Item>
      //   </SubMenu>
      // </Menu>

      //// button
      <Button type="primary" style={{margin: 16, 'border-radius': 4}} danger>Send</Button>
    )
}

export default Test;
